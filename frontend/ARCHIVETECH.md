# ArchiVetech

This file tracks the frontend migration toward the agreed target structure.

## Target Source Of Truth

- `src/app`
- `src/pages`
- `src/features`
- `src/sections`
- `src/shared`
- `src/tests`

## Completed

- moved app entry to `src/app/main.tsx`
- centralized app shell in `src/app/App.tsx`
- added `app/router/routeConfig` and `app/router/guards`
- moved reusable code under `src/shared/*`
- renamed `features/users` to `features/profile`
- added the detailed feature, section, shared, and test files from the agreed tree
- added public asset folders and placeholders under `public/images` and `public/icons`

## Temporary Legacy Layer

These paths still exist as compatibility wrappers or legacy leftovers:

- `src/components`
- `src/hooks`
- `src/services`
- `src/utils`
- `src/types`
- `src/constants`
- `src/config`
- `src/layouts`
- `src/router`
- `src/stores`
- `src/features/flights`
- `src/features/hotels`
- old root-level pages such as `src/pages/HomePage.tsx`

New code should not be added there.

## Remaining Cleanup

1. replace imports that still point to legacy wrapper folders
2. remove unused legacy pages and features after verification
3. replace placeholder files with real domain implementations
4. add lint rules for module boundaries
5. run full build/test verification in an environment with Node installed

## Verification Status

- structure migration: in place
- file scaffolding for agreed tree: in place
- runtime/build verification: blocked in this environment because `node` and `npm` are not installed
