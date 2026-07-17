# Noor Design System — Official Responsive & Adaptive Design Specification
## Hazrat Aisha Academy

This design specification outlines the responsive layout strategies, viewport breakpoints, fluid design patterns, device support guides, touch target standards, and adaptive layout blueprints for the **Noor Design System (NDS)**. This specification ensures a seamless, highly readable, and accessible digital experience for parents, students, teachers, and administrators across smartphones, tablets, laptops, desktops, and ultra-wide displays.

---

## 1. Production UI Status Checklist

The table below outlines the implementation and testing status of NDS responsive adaptive systems:

| Responsive Subsystem | Implementation Status | Verification Details |
| :--- | :--- | :--- |
| **Breakpoint Matrix & Media Queries** | **VERIFIED** | Standard Tailwind adaptive screen utility classes are fully integrated and verified. |
| **Fluid Container & Grid Systems** | **VERIFIED** | Responsive content wrapping frames and dynamic bento grids are verified. |
| **Responsive Typography Scales** | **VERIFIED** | Proportional font size changes (`text-sm` on mobile to `text-lg` on desktop) are verified. |
| **Adaptive Touch Targets (Min 44px)** | **VERIFIED** | Large interactive touch boundaries are verified on buttons, forms, and tabs. |
| **Responsive Navigation Shells** | **VERIFIED** | Desktop sidebars, tablet rails, and mobile drawer components compile cleanly. |
| **Fluid Media & Flexible Charts** | **VERIFIED** | Crop-safe responsive images and responsive charts are fully functional. |
| **Adaptive Form Input Columns** | **VERIFIED** | Single-column form mobile stack patterns and multi-column desktop grids are verified. |
| **High-Magnification Reflow (Zoom 400%)**| **NOT VERIFIED** | Dynamic layout adjustment and zoom-in testing at 400% magnification are not verified. |

---

## 2. Responsive Philosophy & Design Standards

### A. Mobile-First Approach
NDS is built with a **mobile-first** methodology. All component classes, layouts, and styles are designed for mobile screens (`xs:`/`sm:`) first, and then progressively enhanced for larger displays using Tailwind CSS screen prefixes (`md:`, `lg:`, `xl:`, `2xl:`):
1. **Reduce Layout Clutter**: Non-essential layout panels, massive sidebars, and dense decorative banners are hidden or nested inside menus on smaller screens to keep views light and fast.
2. **Prioritize Primary Tasks**: Core user journeys—such as viewing report cards, recording attendance, and making fee payments—must remain immediately visible at the top of mobile screens.
3. **Optimize Typography**: Font sizes and line-heights are scaled down on small screens to preserve screen space while maintaining high readability.

### B. Progressive Enhancement
Features are progressively enhanced to take advantage of larger displays:
* On mobile screens, cards stack in a clean, vertical list.
* On desktop screens, cards arrange themselves into dynamic, asymmetrical bento grids.
* Touch gestures (swipe menus) are enhanced on mobile, while smooth hover transitions and custom cursor indicators are added on desktop.

### C. Fluid Layouts & Cumulative Layout Shift (CLS) Prevention
NDS enforces fluid, percentage-based dimensions rather than hardcoded pixel values:
* Content areas utilize fluid widths (`w-full`) paired with safe maximum constraints (`max-w-7xl mx-auto`) to keep text readable on ultra-wide screens.
* Media files (images and charts) must declare explicit aspect ratios (`aspect-video` or `aspect-[4/3]`) to prevent sudden layout shifts as files load over cellular networks.

---

## 3. Breakpoint & Screen Scale Matrix

NDS uses standard, highly optimized Tailwind screen breakpoints. Developers are strictly forbidden from writing custom pixel-based media queries inside component styles:

| Breakpoint Token | Minimum Width | Target Devices | Visual Shell & Layout Strategy |
| :--- | :--- | :--- | :--- |
| **Extra Small (XS)** | `0px` | Portrait Phones (iPhone, SE, Android) | Stacked single columns, compact top bar, bottom navigation rails |
| **Small (SM)** | `640px` | Landscape Phones, Small Phablets | Wide single columns, expanded margins, simple grids |
| **Medium (MD)** | `768px` | Portrait Tablets (iPad, Galaxy Tab) | Dual-column grids, collapsible mobile navigation drawers |
| **Large (LG)** | `1024px` | Landscape Tablets, Small Laptops | Three-column bento grids, collapsed navigation sidebar rail |
| **Extra Large (XL)**| `1280px` | Standard Laptops & Desktops (13" to 15") | Fixed navigation sidebar, full bento grids, side-panel tools |
| **Double Extra (2XL)**| `1536px` | High-Resolution Desktops (21" to 27") | Centered fluid containers, maximum column layouts |
| **Ultra-Wide (UW)**  | `1920px` | Multi-Window displays, Ultra-Wide screens | Grid boundaries capped at `1440px` with empty outer margins |

---

## 4. Adaptive Spacing, Padding, & Typography

To maintain balanced visual rhythm across screens, spacing and typography adapt dynamically based on the active viewport.

### A. Responsive Spacing System (Padding & Gaps)
Internal gaps and component padding scale proportionally as screen sizes expand:

```css
/* Responsive Card Padding Utility Mapping */
.card-padding {
  padding: var(--space-md); /* 16px padding on mobile */
}
@media (min-width: 768px) {
  .card-padding {
    padding: var(--space-lg); /* 24px padding on tablet */
  }
}
@media (min-width: 1280px) {
  .card-padding {
    padding: var(--space-xl); /* 32px padding on desktop */
  }
}
```

### B. Responsive Typography Scale
To prevent display headings from dominating narrow phone screens, font sizes are scaled dynamically:

```css
/* Display Heading 1 Responsive Sizing */
.h1-display {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: var(--font-xl); /* 20px on mobile */
  line-height: 1.25;
}
@media (min-width: 768px) {
  .h1-display {
    font-size: var(--font-3xl); /* 30px on tablet */
  }
}
@media (min-width: 1280px) {
  .h1-display {
    font-size: var(--font-4xl); /* 36px on desktop */
  }
}
```

---

## 5. Touch Targets & Gesture Safety Zones

NDS ensures all touch-screen interactions remain accurate and comfortable for users of all ages:

### A. Touch Target Standards (WCAG 2.2 Criterion 2.5.5)
1. **Minimum Dimensions**: All interactive elements (buttons, form inputs, links, tabs) must maintain a minimum bounding size of **44px by 44px** on touch devices.
2. **Transparent Touch Padding**: If a button must appear visually compact (such as an icon button: `w-8 h-8`), its clickable touch area must be expanded to `44px` using absolute transparent borders:
   ```html
   <button class="relative w-8 h-8 flex items-center justify-center">
     <span class="absolute -inset-2"></span> <!-- Invisible 44px touch target extension -->
     <EditIcon class="w-4 h-4" />
   </button>
   ```
3. **Gaps between Interactive Elements**: Buttons, switches, and table actions placed side-by-side must maintain a minimum gap of `12px` (`gap-3`) to prevent accidental selections.

### B. Gesture Safety Zones
* **Edges of Viewports**: Avoid placing critical interactive buttons near the far bottom or side edges of mobile screens to prevent conflicts with native system swipe gestures (such as the home swipe or back swipe triggers).
* **Scroll Interlock**: Complex interactions—like canvas boards or scrollable charts—must not block default page scrolling on mobile viewports. Require dual-finger dragging on charts to allow easy single-finger page scrolling.

---

## 6. Layout Adaptation Standards

Components must transition smoothly across viewports to preserve their function and clean look:

### A. Navigation Shell Adapters
Our navigation layout adjusts dynamically based on the screen width (refer to `navigation.md`):
* **Desktop (XL+)**: Fixed, fully expanded sidebar (`264px` width) on the left side of the screen.
* **Tablet (MD to LG)**: The sidebar collapses into a slim rail (`76px` width), displaying only clean icons.
* **Mobile (XS to SM)**: The sidebar is hidden entirely. Navigation shifts to a slide-out mobile drawer triggered from the top bar, paired with a persistent bottom navigation bar.

### B. Form Adapters
Form structures scale fluidly based on the size of the device (refer to `forms.md`):
* **Mobile (XS to SM)**: Stacks inputs in a single column (`grid-cols-1`). This keeps fields wide and easy to focus on portrait screens.
* **Desktop (MD+)**: Scales to multi-column grids (`grid-cols-2` or `grid-cols-3`), grouping related inputs (e.g. First Name and Last Name) side-by-side.

### C. Table Adapters
Dense data lists and tables use clean adapters to prevent horizontal scrolling breaks (refer to `tables.md`):
* **Horizontal Scroll**: Tables are wrapped in an overflow container (`overflow-x-auto`) with a fading edge indicator.
* **Column Prioritization**: Secondary columns (e.g. email, status) are hidden on small screens to focus on primary columns (e.g. student name, grade).
* **Card Reflow**: The table structure is hidden on mobile, displaying rows as individual visual cards.

---

## 7. Media Fluidity & Performance Budgets

To keep load times fast on cellular networks, media assets must adapt dynamically:

### A. Responsive Images (`srcset` and `sizes`)
Static campus assets, gallery pictures, and banner images must declare responsive source sets to serve scaled-down images to mobile devices:
```html
<img
  src="/assets/campus_landscape_800.jpg"
  srcset="/assets/campus_landscape_400.jpg 400w,
          /assets/campus_landscape_800.jpg 800w,
          /assets/campus_landscape_1200.jpg 1200w"
  sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         1200px"
  alt="Hazrat Aisha Academy Sitamarhi Campus Main Building"
  loading="lazy"
  referrerpolicy="no-referrer"
  class="rounded-2xl object-cover w-full aspect-video"
/>
```

### B. Responsive Data Charts
* Recharts and D3 chart panels must be wrapped inside responsive containers (`ResponsiveContainer width="100%" height={300}`).
* On mobile screens, disable complex hover tooltips and simplify dense background gridlines to keep performance responsive and light.

---

## 8. Accessibility & Reflow Compliance (WCAG 2.2 AA)

NDS layouts remain fully accessible during zoom, scaling, and orientation changes:

1. **Magnification Support (Reflow Zoom 400%)**:
   * In accordance with WCAG 2.2 Success Criterion 1.4.10, the application must allow users to zoom in up to 400% without horizontal scrolling or losing content.
   * Multi-column desktop grids must collapse back into single columns as magnification levels zoom past 200%.
2. **Device Orientation Support**:
   * Layouts must adjust fluidly to portrait and landscape orientation changes. Avoid lock configurations that force a single orientation.
3. **No Key-Trap Modals**:
   * Keyboard tab navigation must remain logical across all screen scales. Focus rings must remain highly visible, regardless of the screen density.

---

## 9. TypeScript / React Responsive Layout Blueprint

The following blueprint outlines the structure of our primary custom `AdaptiveGrid` component used to handle layouts across different screens:

```tsx
import React from 'react';

interface AdaptiveGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const AdaptiveGrid: React.FC<AdaptiveGridProps> = ({
  children,
  columns = 3,
  className = '',
}) => {
  // Map columns dynamically to Tailwind responsive classes
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
  }[columns];

  return (
    <div className={`grid gap-4 md:gap-6 ${columnClasses} ${className}`}>
      {children}
    </div>
  );
};
```
