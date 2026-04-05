import type { ThemeStorage } from "./types.js";

/**
 * Creates a ThemeStorage adapter backed by localStorage.
 * SSR-safe: no-ops when window/localStorage is unavailable.
 * Supports cross-tab sync via the `storage` event.
 */
export function createLocalStorageAdapter(key: string): ThemeStorage {
  return {
    get() {
      if (typeof window === "undefined") return null;
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },

    set(theme: string) {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(key, theme);
      } catch {
        // localStorage may be unavailable (private browsing, quota, etc.)
      }
    },

    subscribe(callback: () => void): () => void {
      if (typeof window === "undefined") return () => {};

      const handler = (e: StorageEvent) => {
        if (e.key === key) {
          callback();
        }
      };

      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },
  };
}
