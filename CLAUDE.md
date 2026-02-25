# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm start` — Start dev client (`expo start --dev-client`)
- `pnpm start -- --clear` — Start with Metro cache cleared (use after dependency changes)
- `pnpm android` — Build and run native Android debug build
- `pnpm ios` — Build and run native iOS debug build

No test runner or linter is configured yet.

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
