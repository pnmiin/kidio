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

export async function loginGoogle(idToken: string) {
  return apiRequest<AuthResponse>("/api/Auth/google", {
    method: "POST",
    auth: false,
    body: { idToken },
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
  try {
    await apiRequest<any>("/api/Auth/logout", {
      method: "POST",
      auth: true,
    });
  } catch (error) {
    console.warn("Failed to logout from backend", error);
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("accessTokenExpiry");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("currentParent");
  localStorage.removeItem("currentUserRole");
  
  // Clean up all kid-related states
  localStorage.removeItem('currentKidName');
  localStorage.removeItem('currentKidAge');
  localStorage.removeItem('currentKidId');
  localStorage.removeItem('currentKid');
  localStorage.removeItem('linkedKidId');
  localStorage.removeItem('currentKidExperience');
  localStorage.removeItem('kidioPath');
  localStorage.removeItem('kidioLevel');
  localStorage.removeItem('currentKidLevel');
  localStorage.removeItem('currentKidPath');
  localStorage.removeItem('currentKidPathLabel');
  localStorage.removeItem('currentKidCurrentTopic');
}

// ----------------------------------------------------
// EXTENDED AUTH APIS (VERIFY & PASSWORDS)
// ----------------------------------------------------

export async function verifyEmail(token: string) {
  return apiRequest<any>(`/api/Auth/verify-email?token=${encodeURIComponent(token)}`, {
    method: "GET",
    auth: false,
  });
}

export async function resendVerification(email: string) {
  return apiRequest<any>("/api/Auth/resend-verification", {
    method: "POST",
    auth: false,
    body: { email },
  });
}

export async function forgotPassword(email: string) {
  return apiRequest<any>("/api/Auth/forgot-password", {
    method: "POST",
    auth: false,
    body: { email },
  });
}

export async function resetPassword(token: string, newPassword: string, confirmPassword: string) {
  return apiRequest<any>("/api/Auth/reset-password", {
    method: "POST",
    auth: false,
    body: { token, newPassword, confirmNewPassword: confirmPassword },
  });
}

export async function changePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
  return apiRequest<any>("/api/Auth/change-password", {
    method: "POST",
    auth: true, // Needs authentication
    body: { oldPassword, newPassword, confirmNewPassword: confirmPassword },
  });
}
