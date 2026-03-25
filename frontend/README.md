# Frontend

TravelBook frontend is built with React, TypeScript, and Vite.

## Quick Start

```bash
npm install
npm run dev
```

## Project Docs

- Architecture and folder conventions: [ARCHITECTURE.md](./ARCHITECTURE.md)
- Migration tracker: [ARCHIVETECH.md](./ARCHIVETECH.md)
- Public page guidance: [PUBLIC_PAGES_GUIDE.md](./PUBLIC_PAGES_GUIDE.md)
- Generation notes: [GENERATION_TEMPLATES.md](./GENERATION_TEMPLATES.md)

## Team Rule

When adding or moving code, follow the target structure in `ARCHITECTURE.md`:

- `src/app` for bootstrap, providers, router, and app-wide config
- `src/pages` for route-level screens
- `src/sections` for larger page composition blocks
- `src/features` for business logic by domain
- `src/shared` for truly reusable building blocks

If a new file does not clearly belong in one of those places, stop and classify it before adding it.
