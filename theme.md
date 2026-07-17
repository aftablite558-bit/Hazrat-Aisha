# Noor Design System (NDS) — Theme & Design Specification
## Hazrat Aisha Academy Official Design Document

This design specification outlines the architectural guidelines, design tokens, visual identity, and component layouts for the **Hazrat Aisha Academy** digital ecosystem. It is designed to cultivate character, knowledge, and faith through a premium visual language that blends modern CBSE-aligned educational standards with authentic Islamic heritage.

---

## 1. Theme Philosophy: "Noor" (The Divine Light)

The design system is named **Noor** (Arabic: نُور‎, meaning "Light"), reflecting the Quranic aspiration of guidance and enlightenment (*"Light upon Light"*). 

The visual strategy balances two core pillars:
1. **Academic Excellence (Modern & Digital)**: Characterized by clean geometry, sharp sans-serif display typography, structured tables, interactive charts, and subtle futuristic glows that showcase modern science and technology curricula.
2. **Spiritual Sanctity (Organic & Traditional)**: Characterized by rich emerald greens, premium burnished golds, soft lighting effects, elegant serif-based Arabic calligraphic details, and generous negative space reminiscent of classical Islamic architecture.

---

## 2. Theme Architecture & Color Mappings

The Noor Design System implements a **three-tier theme model** managed via CSS variables bound to `[data-theme]` attributes. The three distinct configurations are:
* **Obsidian (Default Dark Mode)**: A high-contrast, eye-safe deep green-slate canvas reflecting sanctuary and introspection.
* **Daylight (Light Mode)**: A clean, pristine off-white theme honoring academic clarity, perfect for day-to-day administrative work.
* **Midnight (Pure Black Mode)**: An ultra-deep OLED black canvas optimized for low-power and high-contrast technical focus.

### A. Semantic Color Mappings

The table below describes how core variables map to functional UI surfaces across the three themes:

| Semantic Token | Obsidian (Default Dark) | Daylight (Light Mode) | Midnight (OLED Black) | Architectural Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `--bg-page` | `#050D0A` | `#F7FAF8` | `#000000` | Deepest canvas base layer |
| `--bg-surface` | `#0A1512` | `#FFFFFF` | `#0A0A0A` | Default level card & panel backgrounds |
| `--bg-surface-raised` | `#12241D` | `#FFFFFF` | `#121212` | Raised layout components (sidebar, header) |
| `--bg-surface-overlay` | `#1A332A` | `#F0F5F2` | `#1A1A1A` | Menu items, tooltips, select popups |
| `--border-default` | `#1E3A2F` | `#DCE7E1` | `#262626` | Low-impact structural dividers |
| `--border-strong` | `#2C5243` | `#B8CCC2` | `#3A3A3A` | High-impact boundaries & input borders |
| `--text-primary` | `#EAF4EF` | `#0B1F18` | `#F2F2F2` | Primary body, labels, and table cells |
| `--text-secondary` | `#9DBDB1` | `#3D5C51` | `#B3B3B3` | Secondary descriptions and metadata |
| `--text-tertiary` | `#6E9589` | `#67827A` | `#808080` | Placeholders, inactive labels, captions |
| `--text-disabled` | `#4E6E63` | `#A4B8B0` | `#4D4D4D` | Fully inactive interactive elements |
| `--color-primary` | `#10B981` | `#059669` | `#34F5C5` | Emerald green brand accent |
| `--color-primary-hover` | `#34D399` | `#047857` | `#6EF7D6` | Hover states for primary brand interactive elements |
| `--color-accent` | `#D4AF37` | `#B8912F` | `#D4AF37` | Burnished Gold secondary accent |
| `--color-glow` | `#34F5C5` | `#0E5440` | `#34F5C5` | Dynamic light-glow rendering token |

---

## 3. Core Brand Palettes

### A. The Emerald Palette (Primary Accent)
The foundation of the academy's brand is emerald, representing life, growth, and traditional Islamic heritage.
* `emerald-50`: `#ECFDF5` | Subtle canvas overlays
* `emerald-100`: `#D1FAE5` | Highlighted text backgrounds
* `emerald-500`: `#10B981` | Obsidian core interactive token
* `emerald-600`: `#059669` | Daylight core interactive token
* `emerald-900`: `#064E3B` | High-contrast dark backgrounds
* `emerald-950`: `#022C22` | Deepest brand-specific dark layers

### B. The Gold Palette (Secondary Accent)
The secondary brand color is gold, referencing authentic scholarly value, classic calligraphic illumination, and outstanding merit.
* `gold-100`: `#F6ECCB` | Warning and spotlight surfaces
* `gold-500`: `#D4AF37` | Standard brand gold (burnished aura)
* `gold-800`: `#7A5C22` | Deep gold borders for dark mode
* `gold-900`: `#5C451B` | High-contrast gold typography on dark backdrops

### C. The Obsidian Palette (Green-Slate Neutrals)
Traditional grays are completely replaced by custom green-slate grays to maintain the "Noor" signature identity even in basic layout sections.
* `obsidian-50`: `#F4F8F6`
* `obsidian-300`: `#8FAEA3`
* `obsidian-500`: `#3A5F52`
* `obsidian-800`: `#12241D`
* `obsidian-950`: `#050D0A`

---

## 4. Typography Usage Guidelines

NDS employs typography to create rhythmic, clean information layouts. It pairing crisp technical modernism with editorial grace.

### A. Font Families
1. **Display Typography (`--font-display`)**: `"Sora", system-ui, sans-serif`
   * **Attributes**: Geometrical, open-counter, tech-forward.
   * **Usage**: Main page hero headings, metric titles, large UI counters, section headers, and call-out statistics.
2. **Body Typography (`--font-body`)**: `"Inter", system-ui, sans-serif`
   * **Attributes**: Extreme legibility at all scale points, generous default kerning, high readability on small screens.
   * **Usage**: Data tables, form labels, paragraph copies, reports, and notice board lists.
3. **Monospaced Typography (`--font-mono`)**: `"JetBrains Mono", monospace`
   * **Attributes**: Compact character alignment.
   * **Usage**: Roll numbers, financial figures, transaction IDs, status coordinates, and system timestamps.
4. **Academic/Urdu Typography (`--font-urdu`)**: `"Noto Nastaliq Urdu", serif`
   * **Attributes**: Flowing cursive elegance.
   * **Usage**: Islamic studies subtitles, authentic notices, translation overlays.
5. **Scripture Typography (`--font-arabic`)**: `"Amiri", serif`
   * **Attributes**: Classical Quranic readability.
   * **Usage**: Selected authentic text excerpts, moral mottos, Arabic literary quotes.

### B. Typography Hierarchy Rules
* **Hero Display Titles**: `font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight uppercase`
* **Section Heading (H1)**: `font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-content`
* **Card Title (H2)**: `font-display font-bold text-lg text-content`
* **Main UI Labels**: `font-body font-semibold text-sm text-content-secondary`
* **Captions & Metadata**: `font-mono text-xs text-content-tertiary tracking-wide`

---

## 5. Spacing, Borders, & Elevation Systems

NDS maintains spatial visual harmony through strict grid constraints.

### A. Spacing System
```css
--space-3xs: 2px;
--space-2xs: 4px;
--space-xs: 8px;
--space-sm: 12px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
```
* **Inner Card Padding**: Must align to `--space-lg` (24px) or `--space-xl` (32px) on desktop, scaling down to `--space-md` (16px) on small screens.
* **Layout Gap Spacing**: Grid structures use `--space-lg` (24px) for data tables and dashboard boxes to maintain comfortable, professional breathing room.

### B. Rounded Corners (Border Radii)
```css
--radius-xs: 4px;     /* Small elements (badges, indicator dots) */
--radius-sm: 8px;     /* Medium items (interactive buttons, input fields) */
--radius-md: 12px;    /* Internal components (dropdown popups, toast notifications) */
--radius-lg: 16px;    /* Floating windows (modals, dialog components) */
--radius-xl: 20px;    /* Secondary layout layers (inner dashboard boxes) */
--radius-2xl: 24px;   /* Standard card container outline */
--radius-3xl: 32px;   /* Main page layout panels & banners */
```

### C. Elevation & Shadows System
```css
--shadow-e1: 0 1px 2px var(--shadow-color);
--shadow-e2: 0 2px 8px var(--shadow-color), 0 1px 2px var(--shadow-color);
--shadow-e3: 0 8px 24px var(--shadow-color);
--shadow-e4: 0 16px 48px var(--shadow-color);
--shadow-e5: 0 24px 64px var(--shadow-color);
```
* **Card Elevation**:
  * Level 0: Default background with a thin `--border-default` stroke (No shadow).
  * Level 1: Active interactive cards. Uses `--shadow-e1` and `--border-default`.
  * Level 2: Active card during hover interactions. Uses `--shadow-e2`.
  * Level 3: Large dashboard overlay components, notices, or portal lists. Uses `--shadow-e3`.
  * Level 4/5: Critical overlay blocks (Modals and Dialog Boxes). Uses `--shadow-e4` or `--shadow-e5` to maximize physical visual focus.

---

## 6. Glassmorphism, Gradients, and Special Effects

Special effects are applied sparingly to enhance high-priority interfaces without inducing visual fatigue.

### A. Glassmorphism Rules
Glass surfaces are authorized for sticky top-navigation headers, sidebars, active dialogue overlays, and floating command palettes.
* **Glass Composition**:
  * Background: `var(--glass-bg)` (e.g. `rgba(18, 36, 29, .55)` for Obsidian)
  * Border: `1px solid var(--glass-border)` (e.g. `rgba(52, 245, 197, .14)`)
  * Backdrop Filter Blur: `var(--blur-glass)` (16px)
* **Accessibility Caveat**: If the browser does not support `backdrop-filter`, NDS automatically falls back to solid background layers (`var(--bg-surface-raised)`).

### B. Gradient Configurations
Gradients represent structural transition points rather than decorative clutter.
* **Brand Aura Gradient**: Radial gradient centered at the top-right of hero sections:
  `radial-gradient(circle at top right, rgba(16, 185, 129, 0.08) 0%, transparent 60%)`
* **Islamic Crest Accent Line**: A premium three-stop linear gradient used at the very top boundary of cards and panels:
  `linear-gradient(90deg, transparent 0%, var(--color-accent) 50%, transparent 100%)`

### C. Glow & Focus Indicators
* **Primary Glow Aura**: High-contrast outline glow for featured cards or success alerts:
  `box-shadow: 0 0 0 1px rgba(52, 245, 197, .22), 0 0 24px rgba(16, 185, 129, .35)`
* **Aura Focus Indicator**: Keyboard navigation rings use dual-ring outline rules to fulfill strict accessibility contrast demands:
  `box-shadow: 0 0 0 2px var(--bg-page), 0 0 0 4px var(--color-glow)`

---

## 7. Component Specific Design Language

### A. Hero Sections
* **Visual Composition**: Deep obsidian or pure white background with subtle radial color fields. Display typography styled in high-impact title casing. Solid block secondary elements to ground the screen layout.
* **Islamic Accents**: Elegant decorative geometric borders (`border-double` or intricate linear lines) frame the section boundaries.

### B. Admin & Faculty Dashboard Style
* **Grid Structure**: Clean bento-box layouts using asymmetrical column grids (`md:grid-cols-3` or `lg:grid-cols-4`).
* **KPI Metric Cards**: Generous size fonts for count totals styled in `--font-mono`. Include high-contrast growth indicators and clean vector icons.
* **Layout Density**: Compact spacing with clear row boundaries for tables to display large amounts of academic data cleanly.

### C. Portal & Notice Board Style
* **Readability Priority**: Large headers with straightforward category badges (`Academic`, `General`, `Admissions`, `Result`).
* **Download Access**: Clear, explicit touchpoints with interactive PDF buttons featuring size metrics (e.g. `PDF (240 KB)`).

### D. Card Style
* **Container Specifications**: Rounded edges (`--radius-2xl`), a thin default border (`--border-default`), solid background colors (`--bg-surface`), and interactive hover states (`hover:border-strong hover:-translate-y-0.5`).

### E. Sidebar & Navigation Drawer Style
* **Layout Sizing**: Strict sidebar width of `264px` for full layouts, collapsing to a minimized icon rail of `76px` on smaller screens.
* **Interactive Lists**: Navigation links are padded with high-contrast active highlights (`bg-primary/10 text-primary border-l-4 border-l-primary`) and custom micro-motion translations.

### F. Modals & Dialogs
* **Overlays**: Semi-transparent, blur-backed scrim overlays (`bg-black/40 backdrop-blur-md`).
* **Modal Windows**: Rounded edges (`--radius-lg`), structured headers with a close button (`X`), and primary actions placed at the bottom-right.

### G. Form Inputs
* **Design Pattern**: Outlined input borders with a background matching `--bg-surface-raised` or `--bg-surface`. Active input fields feature customized borders (`focus:border-primary focus:ring-1 focus:ring-primary`).

---

## 8. State Semantics (Feedback Layouts)

NDS implements distinct visual treatments for state alerts, ensuring instant identification by staff and parent communities:

* **Success State**: Uses green accents. Used to show admission approvals, fee receipts, and successful record updates.
  * *Tokens*: `--color-success-500`
  * *Tailwind classes*: `bg-emerald-500/10 border-emerald-500/20 text-emerald-400`
* **Warning State**: Uses warm amber accents. Used to indicate pending fees, draft notices, or incomplete student documents.
  * *Tokens*: `--color-warning-500`
  * *Tailwind classes*: `bg-amber-500/10 border-amber-500/20 text-amber-400`
* **Error & Danger State**: Uses red accents. Used to indicate failed authentication attempts, rejected student records, or missed fees.
  * *Tokens*: `--color-danger-500`
  * *Tailwind classes*: `bg-red-500/10 border-red-500/20 text-red-400`
* **Information State**: Uses sky blue accents. Used to highlight system updates, administrative notes, or registration guidelines.
  * *Tokens*: `--color-info-500`
  * *Tailwind classes*: `bg-sky-500/10 border-sky-500/20 text-sky-400`

---

## 9. Animations, Transitions, & Micro-Interactions

Every interface transition must operate at 60 frames-per-second, utilizing standard easings to guide the user's focus naturally.

### A. Core Transition Parameters
* **Default Hover Transition**: All buttons, links, and cards must declare the standard transition class to prevent rigid visual jumps:
  `transition-all duration-base ease-standard` (240ms duration with standard easing).
* **Speed Scale**:
  * Instant: `100ms` (tooltips, toggle switches, hover borders).
  * Fast: `160ms` (accordion expansions, menu dropdowns).
  * Base: `240ms` (component route switches, drawer movements).
  * Moderate: `360ms` (large dialog animations, layout reorganizations).
  * Slow: `480ms` (hero entrances, structural page switches).

### B. Motion Curves
* **Standard Curve (`--ease-standard`)**: `cubic-bezier(.4, 0, .2, 1)` (smooth, natural interaction).
* **Emphasized Curve (`--ease-emphasized`)**: `cubic-bezier(.16, 1, .3, 1)` (crisp, sudden focus attraction).
* **Spring Curve (`--ease-spring`)**: `cubic-bezier(.34, 1.56, .64, 1)` (slight elastic bounce for buttons).

---

## 10. PDF & Print Media Styles

To support physical distribution of certificates and report cards, NDS enforces a clean, dedicated print theme:

```css
@media print {
  /* Enforced light theme */
  body {
    background: #FFFFFF !important;
    color: #000000 !important;
  }
  /* Remove unneeded digital chrome */
  nav, header, footer, aside, button, .no-print {
    display: none !important;
  }
  /* High-contrast borders */
  .print-card {
    border: 1px solid #000000 !important;
    page-break-inside: avoid;
  }
}
```
* **Typography Rule**: Serif typography (`--font-arabic` or `--font-urdu`) and clean tabular numbers are prioritized on physical papers to ensure official documents look premium and authentic.

---

## 11. Responsive Breakpoint Rules

Theme rules adapt dynamically based on display sizes:

* **Mobile (0px to 640px)**:
  * Grids collapse into a single column.
  * Sticky elements (headers, bottom bars) are minimized to save space.
  * Tap target heights are strictly preserved at a minimum of `44px` (`--size-touch-min`) to prevent accidental clicks.
* **Tablet (641px to 1024px)**:
  * Sidebar transitions into a slim navigation drawer or icon rail (`--size-sidebar-rail`).
  * Dashboards shift to dual-column grids (`grid-cols-2`).
* **Desktop (1025px to 1440px)**:
  * Regular sidebars (`264px`) are expanded by default.
  * Layout limits are restricted to `max-w-7xl mx-auto` to prevent layout stretching on wider monitors.
* **Large Desktop / Ultra-Wide (1441px+)**:
  * Grid cells split into quad-columns (`lg:grid-cols-4`).
  * Gaps and spacing increase to `var(--space-xl)` (32px) to make use of the generous screen space.

---

## 12. Modern HTML5 Semantic Rules

NDS strictly enforces clean, meaningful HTML layouts:
* **Headers & Footers**: Core layouts must wrap inside `<header>` and `<footer>` components with appropriate labels.
* **Navigation Menus**: Root lists must be structured as `<nav>` layers.
* **Article & Card Grids**: Repeater items, such as notices or testimonials, must use `<article>` tags to help with screen-reader accessibility.
* **Role Clarifications**: Action indicators, buttons, and custom inputs must feature accurate `aria-` labels (`aria-expanded`, `aria-label`, `aria-hidden`) to provide an inclusive digital environment for all users.
