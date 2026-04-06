# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-04-06

### Fixed

- Disable sourcemaps to keep the published package size minimal (~2 KB)

## [0.1.0] - 2026-04-06

### Added

- `ThemeProvider` component with configurable themes, storage, and attributes
- `useTheme()` hook — `useSyncExternalStore`-based theme access
- `useSystemTheme()` hook — standalone OS color scheme detection
- `getThemeScript()` / `<ThemeScript />` for FOUC prevention
- `createLocalStorageAdapter()` with cross-tab sync via `StorageEvent`
- Pluggable `ThemeStorage` interface for custom storage backends
- `disableTransitionOnChange` prop to suppress CSS transitions during theme switch
- Support for `class`, `data-*`, and multiple HTML attributes
- Theme name → attribute value mapping via `value` prop
- SSR-safe — all DOM access guarded
- TypeScript strict mode with full declaration files
- ESM + CJS dual publishing via tsup
