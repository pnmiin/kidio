export const ADMIN_EMAIL = "admin@gmail.com";

export function isAdminEmail(email: string) {
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}

export function isAdminSession() {
  const role = localStorage.getItem("currentUserRole");
  return role === "admin" || role === "Admin";
}

export function clearAdminSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("accessTokenExpiry");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("currentParent");
  localStorage.removeItem("currentUserRole");
}
