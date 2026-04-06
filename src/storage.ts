import type { ThemeStorage } from "./types.js";

/**
 * Creates a ThemeStorage adapter backed by localStorage.
 * SSR-safe: no-ops when window/localStorage is unavailable.
 *
 * Subscribers are notified on:
 * - Same-tab writes via set() (internal listener set)
 * - Cross-tab writes via the `storage` event
 */
export function createLocalStorageAdapter(key: string): ThemeStorage {
  const listeners = new Set<() => void>();

  function emit() {
    for (const listener of listeners) {
      listener();
    }
  }

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
      // Notify same-tab subscribers regardless of whether setItem succeeded,
      // so the UI stays consistent with what get() returns.
      emit();
    },

    subscribe(callback: () => void): () => void {
      if (typeof window === "undefined") return () => {};

      listeners.add(callback);

      // Cross-tab sync: StorageEvent only fires in OTHER tabs
      const handler = (e: StorageEvent) => {
        if (e.key === key) {
          callback();
        }
      };
      window.addEventListener("storage", handler);

      return () => {
        listeners.delete(callback);
        window.removeEventListener("storage", handler);
      };
    },
  };
}
