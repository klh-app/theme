import { useSyncExternalStore } from "react";
import { MEDIA_QUERY } from "./constants.js";

function subscribeToSystemTheme(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const mediaQuery = window.matchMedia(MEDIA_QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSystemThemeSnapshot(): string {
  if (typeof window === "undefined") return "light";
  return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
}

function getServerSnapshot(): undefined {
  return undefined;
}

/**
 * Hook to detect the user's OS color scheme preference.
 * Uses useSyncExternalStore to subscribe to matchMedia changes.
 *
 * @returns 'dark' | 'light' | undefined (undefined on server)
 */
export function useSystemTheme(): string | undefined {
  return useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemThemeSnapshot,
    getServerSnapshot,
  );
}
