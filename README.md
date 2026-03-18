# Aluf HaMachshevim — Frontend Shell

Modern React UI shell for aluf.co.il, injected via Konimbo's user_files system.

## Quick Start

```bash
npm install
npm run dev     # Local dev server at http://localhost:5173
npm run build   # Outputs dist/aluf-app.js + dist/aluf-app.css
```

## Architecture

This app is built as a single IIFE bundle that mounts inside `#aluf-root` on Konimbo-served pages. It replaces all visual elements while preserving Konimbo's cart, checkout, and auth backend.

See `docs/` for full documentation.

## Project Structure

- `src/components/ui/` — Reusable atomic UI components
- `src/components/layout/` — Shell layout (Header, Footer, AppShell)
- `src/components/commerce/` — E-commerce domain components
- `src/pages/` — Page-level components
- `src/i18n/` — Translation system (HE/EN/RU)
- `src/theme/` — Dark/light mode theming
- `src/lib/` — Utilities and Konimbo bridge
- `src/data/` — Static POC data
- `konimbo/` — Code to paste into Konimbo admin user_files
- `docs/` — Full project documentation
