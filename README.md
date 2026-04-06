# @klh-app/theme

React 18+ theme management built on `useSyncExternalStore`. Zero runtime dependencies.

## Features

- **`useSyncExternalStore`-first** — no `useState` + `useEffect` hacks for external state
- **System preference detection** — reacts to OS-level `prefers-color-scheme` changes
- **Cross-tab sync** — theme changes propagate across browser tabs via `StorageEvent`
- **FOUC prevention** — inline script sets theme before first paint
- **Custom storage** — pluggable `ThemeStorage` interface (localStorage adapter included)
- **SSR safe** — all DOM/`window` access is guarded
- **Zero runtime dependencies** — only `react >= 18` as peer dep
- **TypeScript strict** — fully typed with declaration files

## Install

```bash
pnpm add @klh-app/theme
# or
npm install @klh-app/theme
```

Peer dependencies: `react >= 18`, `react-dom >= 18`

## Quick start

```tsx
import { ThemeProvider, useTheme } from "@klh-app/theme";

function App() {
  return (
    <ThemeProvider>
      <Page />
    </ThemeProvider>
  );
}

function Page() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
      {resolvedTheme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
```

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

### Raw script string

If you need the raw JS (e.g. for a non-React SSR pipeline):

```ts
import { getThemeScript } from "@klh-app/theme";

const html = `
  <html>
    <head><script>${getThemeScript()}</script></head>
    <body>...</body>
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
    // read from cookie
    return document.cookie.match(/theme=(\w+)/)?.[1] ?? null;
  },
  set(theme) {
    document.cookie = `theme=${theme};path=/;max-age=31536000`;
  },
  subscribe(callback) {
    // poll, listen to custom events, etc.
    const id = setInterval(callback, 1000);
    return () => clearInterval(id);
  },
};

<ThemeProvider storage={cookieStorage}>...</ThemeProvider>
```

## Custom themes

Beyond `"light"` and `"dark"`:

```tsx
<ThemeProvider
  themes={["light", "dark", "ocean", "forest"]}
  defaultTheme="ocean"
>
  ...
</ThemeProvider>
```

Style with the attribute:

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
<ThemeProvider
  attribute="class"
  value={{ light: "theme-light", dark: "theme-dark" }}
>
  ...
</ThemeProvider>
```

This sets `<html class="theme-dark">` instead of `<html class="dark">`.

## Multiple attributes

```tsx
<ThemeProvider attribute={["data-theme", "data-mode"]}>
  ...
</ThemeProvider>
```

Sets both `data-theme="dark"` and `data-mode="dark"` on `<html>`.

## Disable transitions on change

Prevents a jarring flash of animated elements when switching themes:

```tsx
<ThemeProvider disableTransitionOnChange>...</ThemeProvider>
```

This injects a temporary `<style>` tag that sets `transition: none !important` on all elements, then removes it after a double `requestAnimationFrame`.

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

MIT
