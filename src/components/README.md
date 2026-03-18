# Component Library

Reusable UI components for the Aluf frontend.

## Structure
- **`ui/`** — Atomic/base components (Button, Badge, Icon, form elements)
- **`layout/`** — Shell components (Header, Footer, AppShell, Container)
- **`commerce/`** — E-commerce domain components (ProductCard, TierCard, etc.)

## Conventions
- Every component is a named export from its file
- Props interface named `{ComponentName}Props`
- Use `cn()` from `@/lib/cn` for conditional classes
- Use `useLang()` for any user-facing text
- Use `useTheme()` only when the component needs to react to theme (rare — most theming is via CSS vars)
