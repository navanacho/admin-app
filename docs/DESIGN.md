---
name: Punk Professional
colors:
  surface: '#fff8f7'
  surface-dim: '#f2d3cf'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0ee'
  surface-container: '#ffe9e6'
  surface-container-high: '#ffe2de'
  surface-container-highest: '#fbdbd7'
  on-surface: '#281715'
  on-surface-variant: '#5c403c'
  inverse-surface: '#3f2c29'
  inverse-on-surface: '#ffedea'
  outline: '#916f6b'
  outline-variant: '#e5bdb8'
  surface-tint: '#be0e15'
  primary: '#880008'
  on-primary: '#ffffff'
  primary-container: '#b4000f'
  on-primary-container: '#ffbfb8'
  inverse-primary: '#ffb4ab'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#003d8d'
  on-tertiary: '#ffffff'
  tertiary-container: '#0053bc'
  on-tertiary-container: '#bcceff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000a'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c9c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#d9e2ff'
  tertiary-fixed-dim: '#afc6ff'
  on-tertiary-fixed: '#001944'
  on-tertiary-fixed-variant: '#004299'
  background: '#fff8f7'
  on-background: '#281715'
  surface-variant: '#fbdbd7'
  rb-bone: '#F0E1D2'
  rb-bone-alt: '#F7EEDF'
  rb-paper: '#FAF4EA'
  rb-charcoal: '#1E1E1E'
  success: '#4A7A2E'
  warning: '#E89B1C'
typography:
  display-lg:
    fontFamily: anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: 0.02em
  headline-md:
    fontFamily: anton
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  kpi-value:
    fontFamily: anton
    fontSize: 36px
    fontWeight: '400'
    lineHeight: '1.1'
  body-md:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  data-mono:
    fontFamily: jetbrainsMono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.4'
  label-caps:
    fontFamily: inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar-width: 240px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

# ROCK 'N BURGER — Admin Dashboard Design Spec
> Documento técnico para generar el dashboard administrativo de Rock 'N Burger.
> Construido a partir del moodboard de marca: identidad punk-rock, paleta roja
> sangre sobre negro/crema, tipografía display dripping/flaming.

## 1. Esencia de la marca
**Rock 'N Burger** es una hamburguesería de estética **punk-rock**: agresiva, callejera, con personalidad.
**Reto del dashboard:** traducir esta energía punk a una interfaz **profesional, limpia y eficiente**.

## 2. Paleta de color
### Brand primary
- `--rb-red`: #B4000F (Rojo sangre)
- `--rb-red-hover`: #C90A1F
- `--rb-red-soft`: #FCE4E6

### Neutrales
- `--rb-bone`: #F0E1D2 (Fondo principal warm)
- `--rb-bone-2`: #F7EEDF
- `--rb-paper`: #FAF4EA (Surfaces)
- `--rb-ink`: #0A0A0A (Negro sidebar)
- `--rb-charcoal`: #1E1E1E

### Estados
- `--success`: #4A7A2E
- `--warning`: #E89B1C
- `--danger`: #B4000F

## 3. Tipografía
### Display
- **Bowlby One** (o Anton/Arial Black): Títulos, KPIs, Logo.
- `text-transform: uppercase;`

### UI
- **Inter**: Legibilidad profesional para tablas y formularios.

### Mono
- **JetBrains Mono**: Números, IDs, Timestamps.

## 4. Sistema de Radio
- `--r-sm`: 10px
- `--r-md`: 14px
- `--r-lg`: 20px
(Evitar radios >32px para mantener el "edge" punk).

## 5. Sombras
- `--shadow-red`: 0 12px 32px rgba(180,0,15,0.32) (Glow para CTAs)
- `--shadow-ink`: 0 18px 50px rgba(0,0,0,0.35)

## 6. Componentes Base
- **Sidebar**: 240px, fondo `--rb-ink`, texto bone, item activo `--rb-red`.
- **KPI Cards**: 4 por fila, tipografía display para valores.
- **Tablas**: Estilo limpio, avatares cuadrados, badges con dot semántico.
