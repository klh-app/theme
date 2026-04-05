// Components
export { ThemeProvider } from "./provider.js";

// Hooks
export { useTheme } from "./use-theme.js";
export { useSystemTheme } from "./use-system-theme.js";

// FOUC prevention
export { getThemeScript, ThemeScript } from "./script.js";

// Storage
export { createLocalStorageAdapter } from "./storage.js";

// Types
export type {
  Theme,
  ResolvedTheme,
  ThemeStorage,
  ThemeProviderProps,
  UseThemeReturn,
} from "./types.js";
export type { ThemeScriptProps } from "./script.js";
