export function createKidId() {
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `KID-${randomPart.padEnd(6, "0")}`;
}

export function ensureCurrentKidId() {
  const existingId = localStorage.getItem("currentKidId");
  if (existingId) return existingId;

  const kidId = createKidId();
  localStorage.setItem("currentKidId", kidId);
  return kidId;
}
