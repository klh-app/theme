import type { ReactNode } from "react";

export type Theme = string;
export type ResolvedTheme = string;

export interface ThemeStorage {
  get(): string | null;
  set(theme: string): void;
  subscribe(callback: () => void): () => void;
}

export interface ThemeProviderProps {
  children: ReactNode;
  /** Default theme value. @default 'system' */
  defaultTheme?: string;
  /** List of available themes. @default ['light', 'dark'] */
  themes?: string[];
  /** localStorage key. @default 'theme' */
  storageKey?: string;
  /** Custom storage adapter. @default localStorageAdapter */
  storage?: ThemeStorage;
  /** HTML attribute(s) to set on documentElement. @default 'data-theme' */
  attribute?: string | string[];
  /** Map theme names to custom attribute values. */
  value?: Record<string, string>;
  /** Enable system theme detection. @default true */
  enableSystem?: boolean;
  /** Disable CSS transitions during theme change. @default false */
  disableTransitionOnChange?: boolean;
  /** Nonce for inline script CSP. */
  nonce?: string;
}

export interface UseThemeReturn {
  /** User's selected theme (e.g. 'light', 'dark', 'system', or custom). */
  theme: string;
  /** The resolved theme actually applied to the DOM. */
  resolvedTheme: string;
  /** Set a new theme. Accepts a value or an updater function. */
  setTheme: (theme: string | ((prev: string) => string)) => void;
  /** Current OS color scheme preference. */
  systemTheme: string | undefined;
  /** List of available themes. */
  themes: string[];
}

export interface ThemeContextValue {
  theme: string;
  resolvedTheme: string;
  setTheme: (theme: string | ((prev: string) => string)) => void;
  systemTheme: string | undefined;
  themes: string[];
  storage: ThemeStorage;
  enableSystem: boolean;
  defaultTheme: string;
  attribute: string | string[];
  value: Record<string, string> | undefined;
  disableTransitionOnChange: boolean;
  nonce: string | undefined;
}
