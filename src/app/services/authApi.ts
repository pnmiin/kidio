import { apiRequest } from "./apiClient";

export type UserInfoDto = {
  id: string;
  email?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  role?: string | null;
};

export type AuthResponse = {
  accessToken?: string | null;
  refreshToken?: string | null;
  accessTokenExpiry?: string;
  user?: UserInfoDto;
};

export type RegisterResponse = {
  id: string;
  email?: string | null;
  message?: string | null;
};

export async function loginParent(email: string, password: string) {
  return apiRequest<AuthResponse>("/api/Auth/login", {
    method: "POST",
    auth: false,
    body: { email, password },
  });
}

export async function registerParent(displayName: string, email: string, password: string, confirmPassword: string) {
  return apiRequest<RegisterResponse>("/api/Auth/register", {
    method: "POST",
    auth: false,
    body: {
      displayName,
      email,
      password,
      confirmPassword,
    },
  });
}

export function saveAuthSession(auth: AuthResponse) {
  if (auth.accessToken) {
    localStorage.setItem("accessToken", auth.accessToken);
  }
  if (auth.refreshToken) {
    localStorage.setItem("refreshToken", auth.refreshToken);
  }
  if (auth.accessTokenExpiry) {
    localStorage.setItem("accessTokenExpiry", auth.accessTokenExpiry);
  }
  if (auth.user) {
    localStorage.setItem("currentUser", JSON.stringify(auth.user));
    localStorage.setItem("currentParent", auth.user.email || "");
    localStorage.setItem("currentUserRole", auth.user.role || "parent");
  }
}

export async function getCurrentUser() {
  return apiRequest<UserInfoDto>("/api/Auth/me", {
    method: "GET",
  });
}

export async function logoutParent() {
  const result = await apiRequest<{}>("/api/Auth/logout", {
    method: "POST",
  }).catch(() => null); // Ignore errors on logout
  
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("currentParent");
  localStorage.removeItem("currentUserRole");
  
  return result;
}
