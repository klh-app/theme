# @klh-app/theme

[![npm version](https://img.shields.io/npm/v/@klh-app/theme?color=blue)](https://www.npmjs.com/package/@klh-app/theme)
[![bundle size](https://img.shields.io/bundlejs/size/@klh-app/theme?label=size)](https://bundlejs.com/?q=@klh-app/theme)
[![license](https://img.shields.io/npm/l/@klh-app/theme)](./LICENSE)

React 18+ theme management built on `useSyncExternalStore`. Zero runtime dependencies. Framework-agnostic — works with Next.js, Vite, Remix, or any React setup.

## Features

- **`useSyncExternalStore`-first** — tear-free concurrent reads, no hydration mismatch hacks
- **Framework-agnostic** — Vite, Remix, Astro, Next.js, or plain CRA
- **System preference detection** — reacts to OS-level `prefers-color-scheme` changes in real-time
- **Cross-tab sync** — theme changes propagate across browser tabs automatically
- **FOUC prevention** — inline script sets theme before first paint
- **Pluggable storage** — `ThemeStorage` interface for localStorage, cookies, IndexedDB, or anything
- **Tailwind-ready** — `attribute="class"` just works with `darkMode: "class"`
- **SSR safe** — all DOM/`window` access is guarded, `getServerSnapshot` provided
- **Zero runtime dependencies** — only `react >= 18` as peer dep
- **~2 KB gzipped**

## Install

```bash
pnpm add @klh-app/theme
```

Peer dependencies: `react >= 18`, `react-dom >= 18`

## Quick start

```tsx
import { ThemeProvider, useTheme } from "@klh-app/theme";

function App() {
  return (
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
      {resolvedTheme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
```

## Why this over next-themes?

| | `@klh-app/theme` | `next-themes` |
|---|---|---|
| **State primitive** | `useSyncExternalStore` — tear-free reads, no hydration mismatch | `useState` + `useEffect` — can flash wrong theme during concurrent renders |
| **Framework** | Any React 18+ app (Vite, Remix, Astro, Next.js) | Next.js-first, others require workarounds |
| **Storage** | Pluggable `ThemeStorage` interface — swap localStorage for cookies, IndexedDB, or anything | Hardcoded to localStorage |
| **Dependencies** | Zero runtime deps | Zero runtime deps |
| **Bundle** | ~2.1 KB gzipped | ~2.5 KB gzipped |

If you're on Next.js and `next-themes` works for you, keep using it. This package exists for projects that need framework-agnostic design, pluggable storage, or correct concurrent rendering semantics.

## Preventing FOUC

Without an inline script, server-rendered pages flash the default theme before hydration applies the stored one. Add `<ThemeScript />` to your document `<head>`:

### Next.js App Router

```tsx
// app/layout.tsx
import { ThemeProvider, ThemeScript } from "@klh-app/theme";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

### Vite / SPA

In a client-rendered app, FOUC isn't usually a problem since JavaScript runs before paint. But if you use SSR with Vite:

```tsx
// entry-server.tsx
import { getThemeScript } from "@klh-app/theme";

const html = `
  <html>
    <head><script>${getThemeScript()}</script></head>
    <body><div id="root"><!--app--></div></body>
  </html>
`;
```

### CSP nonce

Pass a `nonce` to both `<ThemeScript>` and `<ThemeProvider>`:

```tsx
<ThemeScript nonce={nonce} />
<ThemeProvider nonce={nonce}>...</ThemeProvider>
```

## API

### `<ThemeProvider>`

Wrap your app. All `useTheme` calls must be descendants.

```tsx
<ThemeProvider
  defaultTheme="system"
  themes={["light", "dark"]}
  storageKey="theme"
  attribute="data-theme"
  enableSystem
>
  {children}
</ThemeProvider>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `defaultTheme` | `string` | `"system"` | Initial theme when nothing is persisted |
| `themes` | `string[]` | `["light", "dark"]` | Available theme values |
| `storageKey` | `string` | `"theme"` | localStorage key |
| `storage` | `ThemeStorage` | localStorage adapter | Custom storage backend |
| `attribute` | `string \| string[]` | `"data-theme"` | HTML attribute(s) set on `<html>` |
| `value` | `Record<string, string>` | — | Maps theme names to attribute values |
| `enableSystem` | `boolean` | `true` | Resolve `"system"` to OS preference |
| `disableTransitionOnChange` | `boolean` | `false` | Suppress CSS transitions during theme switch |
| `nonce` | `string` | — | CSP nonce for injected `<style>` tags |

### `useTheme()`

```ts
const { theme, resolvedTheme, setTheme, systemTheme, themes } = useTheme();
```

| Return | Type | Description |
|---|---|---|
| `theme` | `string` | The user's stored choice (`"light"`, `"dark"`, `"system"`, or custom) |
| `resolvedTheme` | `string` | The actual applied theme after resolving `"system"` |
| `setTheme` | `(theme: string \| (prev: string) => string) => void` | Set a new theme (value or updater function) |
| `systemTheme` | `string \| undefined` | Current OS preference (`"light"` or `"dark"`, `undefined` on server) |
| `themes` | `string[]` | List of available themes (includes `"system"` when `enableSystem` is true) |

### `useSystemTheme()`

Standalone hook for OS color scheme detection, independent of `ThemeProvider`.

```ts
import { useSystemTheme } from "@klh-app/theme";

const systemTheme = useSystemTheme(); // "light" | "dark" | undefined
```

### `getThemeScript(props?)`

Returns a self-executing JS string for FOUC prevention. Reads localStorage, checks `prefers-color-scheme` when theme is `"system"`, and sets the attribute on `<html>` before paint.

```ts
getThemeScript({
  storageKey: "theme",
  defaultTheme: "system",
  attribute: "data-theme",
  enableSystem: true,
  value: { dark: "theme-dark" }, // optional mapping
});
```

### `<ThemeScript />`

React component wrapper around `getThemeScript`. Renders `<script dangerouslySetInnerHTML>`.

```tsx
<ThemeScript storageKey="theme" defaultTheme="system" nonce={nonce} />
```

### `createLocalStorageAdapter(key)`

Factory for the built-in localStorage-backed `ThemeStorage`.

```ts
import { createLocalStorageAdapter } from "@klh-app/theme";

const storage = createLocalStorageAdapter("my-app-theme");
```

## Custom storage

Implement the `ThemeStorage` interface to use any backend:

```ts
import type { ThemeStorage } from "@klh-app/theme";

const cookieStorage: ThemeStorage = {
  get() {
    return document.cookie.match(/theme=(\w+)/)?.[1] ?? null;
  },
  set(theme) {
    document.cookie = `theme=${theme};path=/;max-age=31536000`;
  },
  subscribe(callback) {
    // The subscribe contract: call `callback` whenever the value may have
    // changed. For cookies you could poll, use a BroadcastChannel, etc.
    const id = setInterval(callback, 1000);
    return () => clearInterval(id);
  },
};

<ThemeProvider storage={cookieStorage}>...</ThemeProvider>
```

## Tailwind CSS

Use the `class` attribute with Tailwind's `darkMode: "class"`:

```tsx
<ThemeProvider attribute="class">...</ThemeProvider>
```

This sets `<html class="dark">` which Tailwind's `dark:` variants key off of.

## Custom themes

Beyond `"light"` and `"dark"`:

```tsx
<ThemeProvider themes={["light", "dark", "ocean", "forest"]} defaultTheme="ocean">
  ...
</ThemeProvider>
```

Style with CSS:

```css
[data-theme="ocean"] {
  --bg: #0a1628;
  --fg: #c4dff6;
}

[data-theme="forest"] {
  --bg: #0d1f0d;
  --fg: #b8d4b8;
}
```

## Attribute value mapping

When your CSS classes or attribute values don't match theme names:

```tsx
<ThemeProvider attribute="class" value={{ light: "theme-light", dark: "theme-dark" }}>
  ...
</ThemeProvider>
```

This sets `<html class="theme-dark">` instead of `<html class="dark">`.

## Disable transitions on change

Prevents a jarring flash of animated elements when switching themes:

```tsx
<ThemeProvider disableTransitionOnChange>...</ThemeProvider>
```

Injects a temporary `<style>` with `transition: none !important` on all elements, removes it after the browser paints with the new theme.

## Architecture

```
┌─────────────────────┐
│    ThemeProvider     │
│                     │
│  useSyncExternalStore(storage)  ← single source of truth
│  useSystemTheme()               ← matchMedia subscription
│  useEffect → applyTheme(DOM)    ← post-hydration side effect
│                     │
│  React Context      │
│    ↓                │
│  useTheme()         │ ← consumers
└─────────────────────┘
```

- **Storage adapter** is the single source of truth for the persisted theme
- **System preference** is a separate `useSyncExternalStore` subscription composed with the stored value
- **DOM updates** happen in `useEffect`, after hydration
- **FOUC script** is completely independent — runs before React mounts

## Types

All types are exported for use:

```ts
import type {
  Theme,
  ResolvedTheme,
  ThemeStorage,
  ThemeProviderProps,
  UseThemeReturn,
  ThemeScriptProps,
} from "@klh-app/theme";
```

## License

[MIT](./LICENSE)
