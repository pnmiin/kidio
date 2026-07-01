import axios, { AxiosRequestConfig } from "axios";

// Determine API_BASE_URL (use environment variable if available, else fallback)
// The backend is hosted here: https://kidio-be.onrender.com
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://kidio-be.onrender.com";

export type ApiResponse<T> = {
  success: boolean;
  message?: string | null;
  data?: T;
  errors?: string[] | null;
};

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
};

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach Bearer token
axiosInstance.interceptors.request.use((config) => {
  // We can skip auth if explicitly disabled via custom config, 
  // but by default we attach it if it exists.
  if (config.headers && config.headers["X-Skip-Auth"] !== "true") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle 401 and refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("accessToken");
      
      if (refreshToken && accessToken) {
        try {
          // Do a raw axios call to avoid interceptor loop
          const res = await axios.post(`${API_BASE_URL}/api/Auth/refresh`, {
            accessToken,
            refreshToken
          });
          
          if (res.data?.success && res.data?.data) {
            const newAuth = res.data.data;
            localStorage.setItem("accessToken", newAuth.accessToken);
            localStorage.setItem("refreshToken", newAuth.refreshToken);
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAuth.accessToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("currentUser");
          window.location.href = "/parent-login"; // Or wherever your login is
        }
      }
    }
    
    // If we can't handle it, format error message properly
    let message = error.response?.data?.message;
    
    // Check if it's a .NET validation error (ProblemDetails format)
    if (!message && error.response?.data?.errors) {
      const errors = error.response.data.errors;
      if (typeof errors === 'object' && !Array.isArray(errors)) {
        // e.g. { "Password": ["The password must contain at least one uppercase letter."] }
        const firstKey = Object.keys(errors)[0];
        if (firstKey && Array.isArray(errors[firstKey])) {
          message = errors[firstKey][0];
        }
      } else if (Array.isArray(errors) && errors.length > 0) {
        // e.g. ApiResponse.errors format
        message = errors[0];
      }
    }
    
    message = message || `API error: ${error.response?.status || error.message}`;
    return Promise.reject(new Error(message));
  }
);

// Helper wrapper for backwards compatibility with existing codebase
export async function apiRequest<T>(
  path: string,
  { method = "GET", body, auth = true }: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  
  const config: AxiosRequestConfig = {
    method,
    url: path,
    data: body,
    headers: {},
  };
  
  if (body instanceof FormData) {
    config.headers!["Content-Type"] = "multipart/form-data";
  }
  
  if (!auth) {
    // Custom header flag to skip auth in the interceptor
    config.headers!["X-Skip-Auth"] = "true"; 
  }

  const response = await axiosInstance.request<ApiResponse<T>>(config);
  
  if (!response.data) {
    throw new Error("Empty API response");
  }
  
  return response.data;
}
