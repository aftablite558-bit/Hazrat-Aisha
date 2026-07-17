# Noor Design System — Official Card Component Specification
## Hazrat Aisha Academy

This design specification outlines the structural, visual, interactive, and semantic requirements for the **Card Component System** of the Noor Design System (NDS). Cards are the primary layout block of our digital platform. They are used to present news items, dashboard KPIs, student/teacher details, test results, and notices in a clean, professional bento-style hierarchy.

---

## 1. Card Philosophy & Semantic Structure

### A. Design Philosophy
In NDS, a card is more than a bordered block. It represents a physical slate of information that holds structured content. Cards must remain:
* **Grounded and Ordered**: Structured padding, standard gutters, and proportional text elements create an immediate sense of order.
* **Architecturally Humble (Anti-AI-Slop)**: Avoid excessive border designs, unrequested status indicators, or decorative data logs. Card presentation must remain clean, direct, and focused on user-facing content.
* **Spatially Harmonious**: Utilize balanced ratios of border-radii, spacing, and elevations to align cards naturally with the overall page structure.

### B. HTML5 Semantic Structure
Cards must be wrapped inside appropriate semantic HTML5 elements based on their context:
* **Repeater Items (News, Notices, Gallery)**: Wrapped in `<article>` tags to help screen-readers identify standalone items.
* **Interactive Dashboard Items**: Wrapped in `<div>` layers with appropriate ARIA roles or `<button>` triggers if the entire card acts as a single action.
* **General Informative Blocks**: Wrapped in `<section>` blocks with clear headings (`h2`–`h4`).

```html
<!-- Example of a semantic notice card layout -->
<article class="card card-default" aria-labelledby="notice-title-101">
  <header class="card-header">
    <span class="badge badge-academic">Academic</span>
    <time class="card-date" datetime="2026-07-16">July 16, 2026</time>
  </header>
  <h3 id="notice-title-101" class="card-title">Quarter I Examination Schedule</h3>
  <p class="card-body">The official timetable for the upcoming examinations is now available for download...</p>
  <footer class="card-footer">
    <button type="button" class="btn btn-sm btn-outline">Download PDF</button>
  </footer>
</article>
```

---

## 2. Card Design Tokens

To prevent visual drift and style inconsistencies, developers are strictly forbidden from hardcoding padding, shadows, borders, or background colors. All cards must utilize the following semantic design tokens:

### A. Dimensional & Layout Tokens
* **Card Border Radius (`--radius-2xl`)**: `24px` (`1.5rem`) | Standard outer frame corner radius.
* **Internal Padding (Desktop)**: `--space-lg` (`24px`) | For default cards. Large display cards utilize `--space-xl` (`32px`).
* **Internal Padding (Mobile)**: `--space-md` (`16px`) | Scaled down automatically to preserve narrow screens.
* **Internal Item Gap (`--space-sm`)**: `12px` | Horizontal and vertical gaps between headers, body copy, and footers.

### B. Elevation & Shadow Levels
* **Level 0 (Flat Card)**: No shadow. Utilizes `--border-default` with `--bg-surface`. Designed for low-priority structures or high-density forms.
* **Level 1 (Default Card)**: `--shadow-e1` (`0 1px 2px var(--shadow-color)`). Designed for news grids, gallery grids, and dashboard KPIs.
* **Level 2 (Active/Hover Card)**: `--shadow-e2` (`0 4px 12px var(--shadow-color)`). Designed for card interactive hover feedback.
* **Level 3 (Overlay Card)**: `--shadow-e3` (`0 12px 32px var(--shadow-color)`). Designed for dialog overlays or temporary popups.

---

## 3. Card Types & Functional Specifications

### A. Default Structural Card
The standard content container across our portals, balancing clean readability with quiet brand aesthetics.
* **Daylight Theme**: `bg-[#FFFFFF] border border-[#DCE7E1] text-[#0B1F18]`
* **Obsidian Theme**: `bg-[#0A1512] border border-[#1E3A2F] text-[#EAF4EF]`
* **Midnight Theme**: `bg-[#0A0A0A] border border-[#262626] text-[#F2F2F2]`

### B. Glass Card
Used for hero call-outs, floating navigation headers, or overlay dialog panels.
* **Obsidian / Midnight Theme Only**: `bg-[rgba(10,21,18,0.55)] border border-[rgba(52,245,197,0.14)] backdrop-blur-md text-[#EAF4EF]`

### C. Dashboard Statistic Card (KPI Block)
Designed for teachers and admins to monitor class metrics, fee updates, and attendance.
* **Structure**: Display title, large monospaced metric count, a compact sparkline or status trend indicator, and a descriptive subtitle.
* **Layout**: Uses a compact grid structure with bold, easy-to-read numbers.
* **Typography**: Metrics are styled in `--font-mono` at `text-3xl` or `text-4xl`.

### D. Result Card
For parent-student portals, displaying term marks, grade details, and percentages.
* **Structure**: Subject name, marks earned / total marks, grade letters (A+, B, etc.), and teacher remarks.
* **Styling**: Highly readable layout with custom status colors (Success green for pass, Error red for critical alerts).

### E. News & Notice Card
Designed for public announcements, events, and downloadable PDF lists.
* **Structure**: Category badge, publish date, heading, summary, and action triggers.
* **Features**: Hover transitions, card lift effects, and accessible keyboard focus borders.

### F. Student / Teacher Profile Card
Displays student roll numbers, guardian contacts, active attendance percentages, or staff designations.
* **Structure**: Horizontal layout on desktop, centering an avatar (`--radius-sm` or `rounded-full`) alongside high-contrast name labels, active IDs, and a primary contact action button.

### G. Gallery Card
Presents classroom activities, campus events, and academic highlights.
* **Structure**: Large, high-ratio cover image, a short description block, and a full-screen view action trigger.
* **Sizing Rules**: Enforces responsive, crop-safe image boundaries (`aspect-[4/3]` or `aspect-[16/9]`) with custom `referrerPolicy="no-referrer"` protection.

### H. Loading Skeleton Card
Provides a quiet, horizontal shimmer animation as elements load to avoid sudden layout shifts (CLS).
* **Styling**: Replaces text blocks with light grey-slate gradient blocks (`animate-skeleton`). No borders or heavy shadows are displayed during loading.

---

## 4. Card Structure & Layout Guidelines

Every card must be organized into these distinct layout zones to ensure consistent presentation across pages:

```
+-------------------------------------------------------------+
|  HEADER: Category Badge / Icon / Date / Status Toggle       |
+-------------------------------------------------------------+
|  BODY: Card Title (Sora) & Short Description (Inter)        |
|                                                             |
|  [Optional Metric or Profile Avatar here]                    |
+-------------------------------------------------------------+
|  FOOTER: Meta Details / Quick Actions / Read More Buttons  |
+-------------------------------------------------------------+
```

1. **Card Header**: Displays high-level context (e.g., categories, dates, metadata). Includes a flexible grid with items pushed to opposite ends using `justify-between`.
2. **Card Title**: Styled in Display Typography (`--font-display`) with strong weight settings (`font-bold` or `font-extrabold`) and tracking constraints (`tracking-tight`).
3. **Card Body**: Styled in Body Typography (`--font-body`), with comfortable line heights (`leading-relaxed`) and secondary colors (`text-content-secondary`).
4. **Card Footer**: Houses secondary details, quick actions, or download buttons. Always aligns neatly with the lower padding limits.

---

## 5. Interactive States & Motion Curves

Interactive cards must implement smooth transitions across all hover, focus, and click states:

### A. Lifecycle State Transitions
1. **Default State**: Thin default border, clean background, solid colors.
2. **Hover State**: The card translates upward by `4px` (`translate-y-[-4px]`) over `160ms` (`duration-fast`), shifting its border to `--border-strong` and updating its shadow to `--shadow-e2` or `--shadow-e3`.
3. **Pressed State**: Compresses slightly to `scale: 0.98` using spring physics (`spring-tactile`) to provide tactile button-like feedback.
4. **Focused State (Keyboard Navigation)**: Replaces standard click-hover outlines with our double focus ring immediately. The focus indicator must frame the entire card.
5. **Selected State**: Outlines the card with an explicit, high-contrast border in our brand color (`--color-primary`) and adds a subtle glow effect (`--color-glow`).
6. **Disabled State**: Opacity falls to `50%`, disabling all pointer triggers and animations.

### B. Framer Motion Integration Spec (React)
```tsx
import { motion } from 'motion/react';

export const InteractiveCard = ({ children, onClick }) => {
  return (
    <motion.article
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.16, ease: [0.4, 0, 0.2, 1] } }}
      whileTap={{ scale: 0.98, transition: { type: "spring", stiffness: 400, damping: 15 } }}
      className="p-6 bg-surface border border-line rounded-2xl shadow-e1 cursor-pointer focus:ring-2"
    >
      {children}
    </motion.article>
  );
};
```

---

## 6. Responsive Adaptive Grid Layouts

To adapt seamlessly across devices, cards must adhere to these responsive grid rules:

* **Mobile (0px to 640px)**:
  * Grids collapse into a single column (`grid-cols-1`).
  * Horizontal margins are minimized.
  * Interactive scale-up animations are disabled to keep scrolling smooth and responsive on touch screens.
* **Tablet (641px to 1024px)**:
  * Dashboards scale to dual-column grids (`grid-cols-2`).
  * Gallery items scale dynamically with responsive image containers.
* **Desktop & Large Desktop (1025px+)**:
  * Bento grids expand to asymmetrical multi-column layouts (`lg:grid-cols-3` or `lg:grid-cols-4`).
  * Inside card elements expand to wider configurations with larger image previews and side-by-side action buttons.

---

## 7. Accessibility Checklist (WCAG 2.2 AA)

1. **Semantic Elements**: Card components must use proper HTML tags (`<article>`, `<section>`, `<button>`) to help assistive technologies navigate naturally.
2. **Accessible Headers**: Headings inside cards must follow a logical heading hierarchy (`h3` or `h4` tags), and must never skip heading levels.
3. **Screen Reader Action Labels**: If a card has a generic "Read More" or "View" button, it must include an explicit `aria-label` providing full context:
   `aria-label="Read more about our Quarter I Examination Notice"`
4. **Contrast Compliance**: Icons, body text, and badges on cards must achieve a contrast ratio of at least **4.5:1** against the card's background.
5. **Visible Focus**: Keyboard-focused cards must display a highly visible focus indicator. Outlines must never be hidden or disabled.
6. **Keyboard Navigation**: Interactive cards that behave as single action buttons must support standard activation keys (`Enter` and `Spacebar`).

---

## 8. TypeScript / React Core Card Blueprint

The following component blueprint outlines the primary `Card` component and its sub-layouts:

```tsx
import React, { forwardRef } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'article' | 'section';
  variant?: 'default' | 'glass' | 'flat';
  isHoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  as: Component = 'div',
  variant = 'default',
  isHoverable = false,
  className = '',
  children,
  ...props
}, ref) => {
  const baseClasses = "rounded-2xl border transition-all duration-base ease-standard";
  
  const variantClasses = {
    default: "bg-surface border-line shadow-e1",
    glass: "glass-panel shadow-e1",
    flat: "bg-surface border-line"
  }[variant];

  const hoverClasses = isHoverable 
    ? "hover:border-strong hover:shadow-e2 hover:-translate-y-1 cursor-pointer" 
    : "";

  return (
    <Component
      ref={ref}
      className={`${baseClasses} ${variantClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});

// Structural helper elements
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '' }) => (
  <div className={`p-6 pb-3 flex justify-between items-center ${className}`}>{children}</div>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '' }) => (
  <div className={`p-6 pt-3 pb-3 text-sm text-content-secondary leading-relaxed ${className}`}>{children}</div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '' }) => (
  <div className={`p-6 pt-3 border-t border-line/40 flex items-center justify-between ${className}`}>{children}</div>
);
```
