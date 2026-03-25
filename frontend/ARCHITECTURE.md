# Frontend Architecture

This frontend follows a feature-first structure with four main layers:

- `app`: bootstrap, router, layouts, providers, app-wide store
- `pages`: route-level pages
- `features`: business logic by domain
- `shared`: reusable cross-feature code

`sections` sits between pages and features for larger page-composition blocks.

## Target Structure

```text
src/
├─ app/
├─ pages/
├─ features/
├─ sections/
├─ shared/
├─ assets/
├─ styles/
└─ tests/
```

## Folder Responsibilities

### `app/`
- Entry point, app shell, providers, router, layouts, store wiring
- No feature-specific business logic

### `pages/`
- One file per route screen
- Compose `sections`, `features`, and `shared`
- Should stay thin

### `features/`
- Own API access, domain hooks, domain components, domain model files
- Business logic belongs here first

### `sections/`
- Larger page blocks such as hero areas, dashboards, and account overviews
- Good for composition
- Should not become a second feature layer

### `shared/`
- Reusable UI, shared hooks, shared helpers, storage, and app-wide contracts
- Only move code here when at least two domains need it

## Import Direction

Keep imports flowing in one direction:

```text
app -> pages -> sections -> features -> shared
app -> features -> shared
pages -> features -> shared
```

Rules:
- `shared` must not import from `features`, `pages`, or `app`
- `features` should not reach into another feature's internals
- Prefer feature public entrypoints and `@/` imports

## Naming Rules

- `*Page.tsx` for route screens
- `*Layout.tsx` for app shells
- `use*.ts` for hooks
- `*.api.ts` for API modules
- `*.queryKeys.ts` for query key factories
- `*.schema.ts` and `*.types.ts` for model contracts

## Team Guidance

1. Put code in the closest domain first.
2. Promote to `shared` only after real reuse appears.
3. Pages should not call HTTP clients directly.
4. Feature APIs and hooks are the boundary to backend modules.
5. If a file name sounds vague, rename it before merging.

## Current Note

The repo now contains the target folders above, plus some compatibility wrappers and legacy files kept temporarily to reduce migration risk. See `ARCHIVETECH.md` for tracking.
