# Source Code

## Organization
- `main.tsx` — Entry point, mounts React into #aluf-root
- `App.tsx` — Root component with providers and page router
- `components/` — Reusable UI component library (ui, layout, commerce)
- `pages/` — Full page components (one per Konimbo page type)
- `i18n/` — Translation system with JSON string files
- `theme/` — CSS custom properties and ThemeProvider
- `lib/` — Utilities (cn, konimbo bridge, cart context)
- `data/` — Hardcoded POC data (will be replaced by API calls)
- `assets/` — Static images and SVGs
