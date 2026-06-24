const AUTH_TOKEN_KEY = "big2AuthToken";
const GUEST_SESSION_ID_KEY = "big2GuestSessionId";

function createGuestSessionId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 18)}`;
}

export function getGuestSessionId() {
  let guestSessionId = localStorage.getItem(GUEST_SESSION_ID_KEY);
  if (!guestSessionId) {
    guestSessionId = createGuestSessionId();
    localStorage.setItem(GUEST_SESSION_ID_KEY, guestSessionId);
  }
  return guestSessionId;
}

export function setGuestSessionId(guestSessionId) {
  if (typeof guestSessionId === "string" && guestSessionId.trim()) {
    localStorage.setItem(GUEST_SESSION_ID_KEY, guestSessionId.trim());
  }
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || "";
}

export function setAuthToken(token) {
  if (typeof token === "string" && token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getSocketAuth() {
  return {
    token: getAuthToken() || undefined,
    guestSessionId: getGuestSessionId(),
  };
}
