# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm start` — Start dev client (`expo start --dev-client`)
- `pnpm start -- --clear` — Start with Metro cache cleared (use after dependency changes)
- `pnpm android` — Build and run native Android debug build
- `pnpm ios` — Build and run native iOS debug build

No test runner or linter is configured yet.

## CI

GitHub Actions (`.github/workflows/build-android.yml`) builds Android APKs. Push to `master` triggers a debug test build, manual dispatch triggers a staging release build, and pushing a `v*` tag triggers a production release build with a GitHub Release.

Release signing is handled by the Expo config plugin `plugins/withReleaseSigning.js` which reads keystore credentials from environment variables (set via GitHub Secrets in CI) and falls back to the debug keystore locally. The native `android/` directory is not committed — it's generated via `npx expo prebuild` in CI.

## Architecture

Expo SDK 54 React Native app (New Architecture enabled) with React 19 and TypeScript in strict mode. Uses expo-router for file-based routing.

**Entry point:** `expo-router/entry` → `app/_layout.tsx` (root layout)

**Source layout** (`src/`):
- `frontend/` — screens, components, navigation, hooks, theme
- `backend/` — services, store, models, API
- `shared/` — types, constants, utils
- `config/` — app configuration

**Path aliases** (defined in `tsconfig.json`):
- `@frontend/*` → `src/frontend/*`
- `@backend/*` → `src/backend/*`
- `@shared/*` → `src/shared/*`
- `@config/*` → `src/config/*`

## Database

Uses expo-sqlite with manual migrations via `PRAGMA user_version`. Schema version is tracked in `src/config/app.ts`. Migrations are in `src/backend/database/migrations.ts`.

Data flow: models (`src/backend/models/`) → services (`src/backend/services/`) → React Query hooks (`src/frontend/hooks/`) → components.

When adding a DB column: add migration, bump `schemaVersion` in `src/config/app.ts`, update model, type, and service.

## Styling Conventions

- **Always use NativeWind (Tailwind) classes** — never use inline `style={{ }}` props for static styles
- Use `className` for component styling, `contentContainerClassName` for ScrollView/FlatList content containers
- Use the `cn()` helper (`@frontend/lib/utils`) for conditional classes: `cn(condition ? 'flex-1' : 'pb-[100px]')`
- Only use inline `style` for truly dynamic values (e.g. computed colors, animated values)
- SafeAreaView is handled once in the root layout (`app/_layout.tsx`) — do not add SafeAreaView in individual screens
- React hooks must always be called before any early returns in components

## Error Handling

- **No toast notifications** — do not use `react-native-toast-message` or any toast library
- **Inline validation errors** — show error messages directly in the UI near the relevant input or action button
- For React Query mutations, use `mutation.error?.message` to display errors inline (e.g. red `<Text>` below a button or input)
- All formatting must go through `src/shared/utils/formatting.ts` — never use inline formatting logic in components
- Database timestamps are UTC (from SQLite `datetime('now')`) — always use `parseUTCTimestamp()` from `formatting.ts` when parsing them in the frontend
