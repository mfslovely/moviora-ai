export type CurrentUser = {
  id: number;
  name: string;
  email: string;
};

const STORAGE_KEY = "moviora_current_user";

export function getCurrentUser(): CurrentUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as CurrentUser;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: CurrentUser) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearCurrentUser() {
  window.localStorage.removeItem(STORAGE_KEY);
}
