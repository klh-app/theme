# @klh-app/theme

React 18+ theme management hook built on `useSyncExternalStore`.

## Features

- 🎨 **Multiple themes** — Light, dark, system, or any custom theme
- 🔄 **System preference detection** — Automatically follows OS color scheme
- 💾 **Persistent storage** — localStorage with cross-tab sync
- ⚡ **No FOUC** — Inline script prevents flash of unstyled content
- 🔌 **Custom storage adapters** — Bring your own storage backend
- 📦 **Zero runtime dependencies** — Only React 18+ as peer dep
- 🏗️ **SSR safe** — All DOM access guarded for server rendering
- 📝 **TypeScript** — Full type safety with strict mode

## Installation

```bash
pnpm add @klh-app/theme
```

## Quick Start

```tsx
import { ThemeProvider, useTheme } from '@klh-app/theme'

function App() {
  return (
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  )
}

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
      Current: {resolvedTheme}
    </button>
  )
}
```

## Preventing FOUC

Add the theme script to your HTML `<head>` to prevent flash of unstyled content:

```tsx
import { ThemeScript } from '@klh-app/theme'

// In your HTML head (e.g., Next.js layout)
<head>
  <ThemeScript />
</head>
```

Or use the raw script string:

```ts
import { getThemeScript } from '@klh-app/theme'

const script = getThemeScript({ storageKey: 'theme', defaultTheme: 'system' })
```

## API

### `<ThemeProvider>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultTheme` | `string` | `'system'` | Default theme |
| `themes` | `string[]` | `['light', 'dark']` | Available themes |
| `storageKey` | `string` | `'theme'` | localStorage key |
| `storage` | `ThemeStorage` | localStorage adapter | Custom storage |
| `attribute` | `string \| string[]` | `'data-theme'` | HTML attribute(s) to set |
| `value` | `Record<string, string>` | — | Theme name → attribute value map |
| `enableSystem` | `boolean` | `true` | Enable system theme detection |
| `disableTransitionOnChange` | `boolean` | `false` | Disable CSS transitions during change |
| `nonce` | `string` | — | CSP nonce for inline styles |

### `useTheme()`

```ts
const { theme, resolvedTheme, setTheme, systemTheme, themes } = useTheme()
```

### `createLocalStorageAdapter(key)`

Create a custom localStorage adapter with a specific key.

## License

MIT
