# CLAUDE.md — Admin App: Rock 'N Burger

## Fuente de verdad de diseño
Antes de escribir CUALQUIER código de UI o estilos, consultá `docs/DESIGN.md`.
Ese archivo es el único source of truth del sistema de diseño (paleta, tipografía, spacing, radios, sombras).

## Sistema de tokens Tailwind
Todos los tokens están definidos en `src/index.css` bajo el bloque `@theme`.
Usá SIEMPRE tokens. NUNCA valores hardcodeados de color, spacing o tipografía.

### Tokens disponibles — referencia rápida

**Colores**
- Brand: `bg-primary`, `bg-rb-red`, `bg-rb-red-hover`, `bg-rb-red-soft`
- Superficies: `bg-surface`, `bg-surface-container`, `bg-surface-container-high`, `bg-rb-ink`, `bg-rb-bone`, `bg-rb-paper`
- Texto: `text-on-surface`, `text-on-surface-variant`, `text-on-primary`
- Bordes: `border-outline`, `border-outline-variant`
- Estados: `bg-success`, `bg-warning`, `bg-danger`, `bg-error`

**Tipografía** (clases compuestas — incluyen font-family + size + weight + transform)
- `text-display-lg` → Anton 48px uppercase
- `text-headline-md` → Anton 24px uppercase
- `text-kpi-value` → Anton 36px uppercase
- `text-data-mono` → JetBrains Mono 13px
- `text-label-caps` → Inter 12px bold uppercase

**Font families** (para uso suelto)
- `font-display` → Anton
- `font-sans` → Inter
- `font-mono` → JetBrains Mono

**Radios**
- `rounded-sm` (10px), `rounded-md` (14px), `rounded-lg` (20px), `rounded-full`

**Sombras**
- `shadow-red` → glow rojo para CTAs
- `shadow-ink` → sombra profunda oscura

**Spacing semántico** (usar como `w-sidebar`, `p-gutter`, `gap-stack-md`, etc.)
- `sidebar` = 240px, `gutter` = 24px
- `stack-sm` = 8px, `stack-md` = 16px, `stack-lg` = 32px

## Reglas de diseño (de docs/DESIGN.md)
- Sidebar: fondo `rb-ink`, texto `rb-bone`, item activo `rb-red`
- KPI cards: 4 por fila, valores con `text-kpi-value`
- IDs y timestamps: siempre `text-data-mono`
- Evitar radios > `rounded-lg` (20px) para mantener el "edge" punk
- CTAs principales: `bg-primary` o `bg-rb-red`, `shadow-red` en hover

## Arquitectura del proyecto
- **Feature-based / Screaming Architecture**
- Features NO se importan entre sí directamente — solo vía barrel exports
- `shared/` es accesible desde cualquier feature
- Features no importan desde `app/`

## Stack técnico
- Vite + React 19 + TypeScript strict
- Tailwind CSS v4 con `@tailwindcss/vite` (sin tailwind.config.js)
- React Router v7 (`createBrowserRouter`)
- Zustand v5 — `authStore` (persist localStorage), `uiStore` (sidebarOpen)
- TanStack Query v5 — staleTime 60s, refetchOnWindowFocus false, retry 1
- Axios — interceptor de auth token + auto-logout en 401
- Path alias: `@/` → `src/`
