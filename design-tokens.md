# Noor Design System — Official Design Tokens Specification
## Hazrat Aisha Academy

This document provides the exhaustive, technical specification of all design tokens in the **Noor Design System (NDS)** as implemented in the Hazrat Aisha Academy web application. These tokens ensure visual consistency across the public pages, parent/student portals, and administrative dashboards.

---

## 1. Production UI Status Checklist

Before diving into the token definitions, the following is the verified status of the production implementation of these tokens in our application:

| Token Category | Implementation Status | Verification Details |
| :--- | :--- | :--- |
| **Color Palettes** | **VERIFIED** | Successfully integrated in `noor-tokens.css` and compiled with Tailwind CSS. |
| **Typography Scaling** | **VERIFIED** | Responsive headers and text bodies verified on home and information pages. |
| **Spacing & Gaps** | **VERIFIED** | Aligned with standard Tailwind CSS margins and layout grids. |
| **Border Radii** | **VERIFIED** | Tested with cards, buttons, input blocks, and modals. |
| **Shadows & Elevation** | **VERIFIED** | Hover states and layer separation styles are verified. |
| **Theme Switching (Obsidian/Daylight/Midnight)** | **NOT VERIFIED** | Dynamic client-side storage state sync has not been fully verified across all user agents. |
| **Print & PDF Layouts** | **NOT VERIFIED** | Report card and fee invoice print-sheet layouts are not physically verified. |

---

## 2. Core Color Tokens (Primitive Scale)

These are the primitive, non-semantic hex values from which semantic variables are derived.

### A. Emerald (Primary)
* `emerald-50`: `#ecfdf5`
* `emerald-100`: `#d1fae5`
* `emerald-200`: `#a7f3d0`
* `emerald-300`: `#6ee7b7`
* `emerald-400`: `#34d399`
* `emerald-500`: `#10b981` (Obsidian core accent)
* `emerald-600`: `#059669` (Daylight core accent)
* `emerald-700`: `#047857`
* `emerald-800`: `#065f46`
* `emerald-900`: `#064e3b`
* `emerald-950`: `#022c22`

### B. Gold (Accent)
* `gold-100`: `#fef9c3`
* `gold-200`: `#fef08a`
* `gold-300`: `#fde047`
* `gold-400`: `#facc15`
* `gold-500`: `#eab308` (Standard gold accent)
* `gold-600`: `#ca8a04`
* `gold-700`: `#a16207`
* `gold-800`: `#854d0e`
* `gold-900`: `#713f12`

### C. Slate Neutrals
* `slate-50`: `#f8fafc`
* `slate-100`: `#f1f5f9`
* `slate-200`: `#e2e8f0`
* `slate-300`: `#cbd5e1`
* `slate-400`: `#94a3b8`
* `slate-500`: `#64748b`
* `slate-600`: `#475569`
* `slate-700`: `#334155`
* `slate-800`: `#1e293b`
* `slate-900`: `#0f172a`
* `slate-950`: `#020617`

---

## 3. Semantic Theme Variables

NDS maps primitive colors to functional roles based on the active theme.

### A. Theme: Obsidian (Default Dark Mode)
```css
:root {
  --bg-page: #050D0A;
  --bg-surface: #0A1512;
  --bg-surface-raised: #12241D;
  --bg-surface-overlay: #1A332A;
  
  --border-default: #1E3A2F;
  --border-strong: #2C5243;
  
  --text-primary: #EAF4EF;
  --text-secondary: #9DBDB1;
  --text-tertiary: #6E9589;
  --text-disabled: #4E6E63;
  
  --color-primary: #10B981;
  --color-primary-hover: #34D399;
  --color-accent: #D4AF37;
  --color-glow: #34F5C5;
  
  --shadow-color: rgba(0, 0, 0, 0.5);
  --glass-bg: rgba(10, 21, 18, 0.75);
  --glass-border: rgba(52, 245, 197, 0.1);
}
```

### B. Theme: Daylight (Light Mode)
```css
[data-theme="daylight"] {
  --bg-page: #F7FAF8;
  --bg-surface: #FFFFFF;
  --bg-surface-raised: #FFFFFF;
  --bg-surface-overlay: #F0F5F2;
  
  --border-default: #DCE7E1;
  --border-strong: #B8CCC2;
  
  --text-primary: #0B1F18;
  --text-secondary: #3D5C51;
  --text-tertiary: #67827A;
  --text-disabled: #A4B8B0;
  
  --color-primary: #059669;
  --color-primary-hover: #047857;
  --color-accent: #B8912F;
  --color-glow: rgba(5, 150, 105, 0.15);
  
  --shadow-color: rgba(11, 31, 24, 0.05);
  --glass-bg: rgba(255, 255, 255, 0.85);
  --glass-border: rgba(11, 31, 24, 0.08);
}
```

### C. Theme: Midnight (Pure OLED Black)
```css
[data-theme="midnight"] {
  --bg-page: #000000;
  --bg-surface: #0A0A0A;
  --bg-surface-raised: #121212;
  --bg-surface-overlay: #1A1A1A;
  
  --border-default: #262626;
  --border-strong: #3A3A3A;
  
  --text-primary: #F2F2F2;
  --text-secondary: #B3B3B3;
  --text-tertiary: #808080;
  --text-disabled: #4D4D4D;
  
  --color-primary: #34F5C5;
  --color-primary-hover: #6EF7D6;
  --color-accent: #D4AF37;
  --color-glow: #34F5C5;
  
  --shadow-color: rgba(0, 0, 0, 0.95);
  --glass-bg: rgba(0, 0, 0, 0.8);
  --glass-border: rgba(255, 255, 255, 0.1);
}
```

---

## 4. Typography & Font Tokens

### A. Font Families
* Display Heading Font: `"Sora", "Inter", system-ui, sans-serif`
* Text Body Font: `"Inter", system-ui, sans-serif`
* Monospaced Font: `"JetBrains Mono", monospace`

### B. Font Sizes & Line Heights
| Token Name | Rem Value | Pixel Value (Equiv.) | Line Height | Suggested Usage |
| :--- | :--- | :--- | :--- | :--- |
| `font-size-xs` | `0.75rem` | `12px` | `1rem` | Captions, labels, table meta |
| `font-size-sm` | `0.875rem` | `14px` | `1.25rem` | Default body, input inputs, buttons |
| `font-size-base` | `1rem` | `16px` | `1.5rem` | Readability text block, layout descriptions |
| `font-size-lg` | `1.125rem` | `18px` | `1.75rem` | List header titles, subheaders |
| `font-size-xl` | `1.25rem` | `20px` | `1.875rem` | Small cards, portal categories |
| `font-size-2xl` | `1.5rem` | `24px` | `2rem` | Modals, prominent card headings |
| `font-size-3xl` | `1.875rem` | `30px` | `2.25rem` | Section headers |
| `font-size-4xl` | `2.25rem` | `36px` | `2.5rem` | Page headers, welcome display cards |
| `font-size-5xl` | `3rem` | `48px` | `1` | High-impact hero sections |

---

## 5. Spacing System

NDS uses a standard multiplier spacing system to ensure accurate grid layouts:

| Token Name | Size Value | Pixel Value (Equiv.) | Purpose |
| :--- | :--- | :--- | :--- |
| `--space-3xs` | `0.125rem` | `2px` | Line adjustments, compact indicator dots |
| `--space-2xs` | `0.25rem` | `4px` | Border ring spacing, checkbox paddings |
| `--space-xs` | `0.5rem` | `8px` | Badges padding, small gaps, lists |
| `--space-sm` | `0.75rem` | `12px` | Tight item grids, button inner pad |
| `--space-md` | `1rem` | `16px` | Default card padding, layout gaps |
| `--space-lg` | `1.5rem` | `24px` | Standard page sections, table cell gaps |
| `--space-xl` | `2rem` | `32px` | Large hero grids, landing section margins |
| `--space-2xl` | `3rem` | `48px` | Large spacing blocks on landing layouts |

---

## 6. Border Radii (Corners)

* `--radius-xs`: `0.25rem` (4px) | Badges, small pills
* `--radius-sm`: `0.5rem` (8px) | Buttons, form input fields, checkboxes
* `--radius-md`: `0.75rem` (12px) | Action dropdowns, popover elements
* `--radius-lg`: `1rem` (16px) | Normal user dialog modules, settings cards
* `--radius-xl`: `1.25rem` (20px) | Bento-box dashboard components
* `--radius-2xl`: `1.5rem` (24px) | Default visual layout cards, notice blocks
* `--radius-3xl`: `2rem` (32px) | Banners, hero backgrounds, main parent panels

---

## 7. Shadows & Elevations

* `--shadow-e1`: `0 1px 2px var(--shadow-color)`
* `--shadow-e2`: `0 4px 12px var(--shadow-color), 0 1px 2px var(--shadow-color)`
* `--shadow-e3`: `0 12px 32px var(--shadow-color)`
* `--shadow-e4`: `0 24px 64px var(--shadow-color)`

---

## 8. Transitions & Animation Curves

* `--duration-instant`: `100ms` (e.g. quick tooltips)
* `--duration-fast`: `160ms` (e.g. dropdown expand actions)
* `--duration-base`: `240ms` (e.g. navigation state highlights)
* `--duration-moderate`: `360ms` (e.g. dialog animation entrances)
* `--duration-slow`: `480ms` (e.g. hero section slides)

* `--ease-standard`: `cubic-bezier(0.4, 0, 0.2, 1)` (fluid natural acceleration)
* `--ease-emphasized`: `cubic-bezier(0.16, 1, 0.3, 1)` (sudden eye-catching movement)
* `--ease-spring`: `cubic-bezier(0.34, 1.56, 0.64, 1)` (slight elastic drop bounce effect)

---

## 9. Touch & Display Targets

* Minimum interactive tap target: `44px` (for mobile compliance)
* Standard structural content width: `1280px` (`max-w-7xl`)
* Dashboard sidebar width: `264px` (collapsed: `76px`)
