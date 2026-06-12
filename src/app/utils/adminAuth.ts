export const ADMIN_EMAIL = "admin@gmail.com";

export function isAdminEmail(email: string) {
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}

export function isAdminSession() {
  const email = localStorage.getItem("currentParent") || "";
  const role = localStorage.getItem("currentUserRole");
  return isAdminEmail(email) && role === "admin";
}
