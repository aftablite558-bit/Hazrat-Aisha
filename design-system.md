# Noor Design System (NDS) — Comprehensive Specification
## Hazrat Aisha Academy, Sitamarhi, Bihar

Noor Design System (NDS) is the official visual identity, interactive architecture, and software development framework for Hazrat Aisha Academy. Built upon a synthesis of CBSE-aligned modern academic rigor and authentic Islamic values, NDS guides our public website, portal services, administrative dashboards, and student/parent modules into a unified, high-performance digital ecosystem.

---

## 1. NDS Core Philosophies

### A. Professional Integrity & Care
Hazrat Aisha Academy is dedicated to nurturing future leaders and scholars. NDS translates this dedication into clean, structured digital spaces featuring:
* **High-Contrast Clarity**: High readability across low-cost mobile screens in Bihar.
* **Respectful Aesthetics**: Soft emerald greens, precious gold, and obsidian neutrals to project academic professionalism and spiritual dignity.
* **Zero Cognitive Slop**: Direct, human labeling, avoiding pseudo-futuristic tags, unnecessary logs, or intrusive margins (anti-AI-slop philosophy).

### B. High-Performance Serverless Architecture
To ensure accessibility for all families—even those with standard mobile connections—NDS optimizes asset footprints, implements local client persistence, and leverages real-time serverless sync patterns.

---

## 2. Interactive Documentation Map

The design system is fully modularized. Developers, designers, and content editors must follow these specialized specifications:

| File Path | Documentation Module | Purpose / Core Standard |
| :--- | :--- | :--- |
| **[`/design-tokens.md`](/design-tokens.md)** | Core Design Tokens | The technical specification for color hex codes, font scaling, rounded corners, shadows, and spacing multipliers. |
| **[`/theme.md`](/theme.md)** | Theme Systems | Execution protocols for our Obsidian (Default Dark), Daylight (Light), and Midnight (Pure OLED Black) theme engines. |
| **[`/colors.md`](/colors.md)** | Color Palette Theory | Semantic meaning, spiritual heritage connection, contrast safeguards, and functional state color mappings. |
| **[`/typography.md`](/typography.md)** | Typographic System | Font selection standards (Sora headings, Inter body, JetBrains Mono data, and Arabic/Urdu families). |
| **[`/buttons.md`](/buttons.md)** | Button Architectures | Interactive button states, tactile push compression (`active:scale-[0.98]`), and loading state loaders. |
| **[`/cards.md`](/cards.md)** | Bento-box Cards | Content grid assemblies, elevations, and layout padding systems. |
| **[`/forms.md`](/forms.md)** | Form Control Inputs | Input fields, floating states, error focus borders, and validation helpers. |
| **[`/tables.md`](/tables.md)** | Portal Data Tables | Scrolling layout systems, cell densities, responsive columns, and hover-row treatments. |
| **[`/navigation.md`](/navigation.md)** | Navigation Systems | Collapsible sidebars, active portal states, header topbars, and mobile tap layouts. |
| **[`/dashboard.md`](/dashboard.md)** | Portal Dashboards | Core portal grids, metric widgets, and information hierarchy layouts. |
| **[`/icons.md`](/icons.md)** | Iconography Standards | Exclusive use of `lucide-react`, standard sizing variables, and semantic placement guidelines. |
| **[`/responsive.md`](/responsive.md)** | Responsive Grid Specs | Breakpoints, safe touch areas (min 44px), liquid structures, and adaptive columns. |
| **[`/accessibility.md`](/accessibility.md)** | Accessibility (WCAG 2.2) | Double-ring keyboard focus, skip links, semantic landmarks, and reader compatibility rules. |
| **[`/loading.md`](/loading.md)** | State Transitions | Visual feedback, loaders, and progress-bar indicators. |
| **[`/branding.md`](/branding.md)** | Visual Branding Guidelines | Official institutional logo guidelines and branding guidelines. |
| **[`/pdf-style.md`](/pdf-style.md)** | Document Styles | Stylesheets optimized for printing reports, transcripts, invoices, and certificates. |
| **[`/micro-interactions.md`](/micro-interactions.md)** | Micro-interactions | Custom Framer Motion springs, interactive transitions, page entrances, and modals. |
| **[`/coding-standards.md`](/coding-standards.md)** | Coding Standards | TypeScript code guidelines, naming conventions, file organizations, and performance tips. |

---

## 3. Core Interface Implementation Rules

All physical interfaces developed for Hazrat Aisha Academy must adhere strictly to these three structural rules:
1. **Never Bypass CSS Variables**: Direct hex codes or pixel paddings are strictly forbidden in code files. All styles must map directly to NDS tokens (e.g. `bg-[var(--bg-page)]`, `rounded-[var(--radius-md)]`).
2. **Double-Ring Keyboard Focus**: Hiding focus indicators is forbidden. Use `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]` to ensure WCAG 2.2 Level AA keyboard compatibility.
3. **Pristine Responsive Sizing**: Interfaces must work beautifully on mobile phones (e.g. 360px), tablets, and standard laptops, incorporating fluid grid-layouts and comfortable touch spacing.
