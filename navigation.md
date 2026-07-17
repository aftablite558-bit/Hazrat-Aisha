# Noor Design System — Official Navigation & Application Shell Specification
## Hazrat Aisha Academy

This design specification outlines the architectural blueprints, layout configurations, interactive behaviors, and responsive rules for the **Application Shell and Navigation System** of the Noor Design System (NDS). The app shell provides a unified frame for all workflows—including the public website, parent-student portals, and administrative dashboards—ensuring seamless navigation, professional clarity, and full accessibility across all screen sizes.

---

## 1. Production UI Status Checklist

The table below outlines the implementation and testing status of NDS navigation components:

| Shell Component | Implementation Status | Verification Details |
| :--- | :--- | :--- |
| **Semantic App Layout (`<nav>`, `<header>`)** | **VERIFIED** | Successfully integrated in main layouts and verified on responsive viewports. |
| **Responsive Collapsible Sidebar** | **VERIFIED** | Smooth collapsible desktop-to-tablet rail transition compiles successfully. |
| **Responsive Topbar (Navbar)** | **VERIFIED** | Sticky header layouts with user menu dropdowns are fully verified. |
| **Mobile Drawer Navigation** | **VERIFIED** | Off-canvas drawer and bottom navigation components compile without errors. |
| **Breadcrumbs & Active State Syncing** | **VERIFIED** | Page title updates and path breadcrumbs verified across core views. |
| **Notification Center Drawer** | **NOT VERIFIED** | Real-time notification updates and unread count badges are not verified. |
| **Command Palette & Global Search** | **NOT VERIFIED** | Keyboard-shortcut driven (`Cmd+K`) spotlight menus are not fully verified. |
| **Language Switcher** | **NOT VERIFIED** | Multi-lingual routing structures (English/Urdu/Arabic) are not verified. |

---

## 2. Navigation Philosophy & Information Architecture

### A. Navigation Principles
Navigation in the Noor Design System is structured around clarity, safety, and physical spatial consistency:
* **Instant Orientation**: Users must always know where they are, how they arrived, and how to return. Breadcrumbs and active states are dynamically updated to guide the user's path.
* **Low Cognitive Friction**: Administrative and academic portals are strictly separated into logical sections. Related actions are grouped naturally to minimize click fatigue.
* **Respectful Motion**: All drawer transitions, menu dropdowns, and route switches are animated using smooth, GPU-accelerated easings to guide attention without causing visual distraction.

### B. HTML5 Semantic Navigation Tree
To protect screen reader accessibility, NDS strictly enforces semantic layout wrappers. Developers must utilize dedicated HTML5 landmarks rather than generic container divs:

```
+-----------------------------------------------------------------------------------+
|  HEADER: Topbar Navigation (<header role="banner">)                                |
+-----------------------------------------------------------------------------------+
|  ASIDE: Collapsible Sidebar Menu (<aside role="navigation" aria-label="Main">)    |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |  MAIN: Primary Content Core (<main id="main-content">)                       |  |
|  |                                                                             |  |
|  |  [Page Header with Breadcrumbs]                                             |  |
|  |                                                                             |  |
|  |  [Active Dashboard View Content]                                            |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
|  FOOTER: Institutional Footer (<footer>)                                          |
+-----------------------------------------------------------------------------------+
```

* `<header>`: Encloses top-level navigation, search boxes, and user actions.
* `<nav>`: Wraps primary collections of page links (sidebar menus, header rails, and bottom mobile navigation).
* `<aside>`: Structures secondary layout elements (sidebar panels, drawers, or floating command palettes).
* `<main>`: Dedicated strictly to the central body content. Only one `<main>` block is permitted per view.
* `<footer>`: Encloses copyright statements, utility links, and contact details.

---

## 3. The Responsive Application Shell

NDS implements a dynamic application shell that adapts fluidly to the display viewport:

```typescript
// Core structural layout class mappings (Desktop-first approach)
const APP_SHELL_LAYOUT = "min-h-screen flex flex-col md:flex-row bg-page text-primary";
const SIDEBAR_LAYOUT = "hidden md:flex flex-col w-66 border-r border-default bg-surface-raised transition-all duration-base";
const TOPBAR_LAYOUT = "h-16 px-6 border-b border-default flex items-center justify-between bg-surface-raised/80 backdrop-blur-md sticky top-0 z-40";
const MAIN_CONTENT_LAYOUT = "flex-1 flex flex-col min-w-0 overflow-y-auto";
```

### A. Desktop Grid Model (Widths >= 1025px)
* **Sidebar**: Fixed at `264px` (`w-66`) on the left, pushing the content panel dynamically. Supports collapsing down to a slim `76px` (`w-19`) icon rail.
* **Topbar**: Fixed at `64px` (`h-16`) at the top of the main panel, using a sticky CSS configuration (`sticky top-0 z-40`).
* **Content Panel**: Flexes to occupy the remaining horizontal space, centering content within a spacious container (`max-w-7xl mx-auto w-full`).

### B. Tablet Grid Model (Widths 641px to 1024px)
* **Sidebar**: Enters "Rail Mode," collapsing automatically into the slim `76px` icon bar to maximize work space on smaller screens.
* **Topbar**: Stays sticky at the top, housing global search, notifications, and user dropdown triggers.

### C. Mobile Layout (Widths <= 640px)
* **Sidebar**: Completely hidden (`hidden`). Navigation triggers are relocated to an off-canvas mobile drawer and a quick bottom navigation bar.
* **Topbar**: Retains basic branding elements and a navigation trigger icon, keeping the interface clean and light.
* **Bottom Navigation**: Displays a compact bar at the bottom of the screen to give parents and students fast access to primary portal pages.

---

## 4. Sidebar Specification (The Portal Guide)

The Sidebar provides a structured map of portal sections, styled in high-contrast emerald and gold slate neutrals.

### A. Section Hierarchy & Grouping
Sidebar links must be organized into logical, clean sections:
* **Academic Section**: Grouping Attendance, Gradebook, Homework, and Examination portals.
* **Administrative Section**: Grouping Fees Management, Admissions, Staff Rosters, and Audits.
* **User Settings Section**: Grouping Profile, Notifications Settings, and Security.

### B. Nested & Collapsible Menus
To avoid cluttering the sidebar, secondary links are housed inside collapsible parent categories:
* Expanding a menu slides the sub-links down smoothly using our standard height transitions (`--ease-standard` over `240ms`).
* Nested links are indented by `--space-md` (`16px`) and use a slightly smaller font size (`text-xs`) to maintain visual order.

### C. Permission-Based Visibility (RBAC)
Sidebar sections are rendered dynamically based on the active user role (Admin, Teacher, Parent, Student):
* **Admin Role**: Enforces full access, revealing financial sheets, staff audit boards, and admissions management.
* **Teacher Role**: Filters navigation to show class attendance inputs, grading sheets, and communication panels.
* **Parent/Student Role**: Limits views strictly to class results, attendance records, homework, and fee payments.

---

## 5. Topbar Specification (The Command Hub)

The Topbar houses search tools, notifications, quick actions, and profile details, keeping portals connected and functional.

### A. Path Breadcrumbs
Breadcrumbs sit at the top-left of the main panel, mapping the user's path (e.g. `Portal / Academic / Gradebook`).
* **Typography**: Styled in display headings with an elegant slash separator: `font-display font-semibold text-xs tracking-wider text-content-secondary`.
* **Current Page**: The last path item is styled in bold brand colors to clearly show the current page location.

### B. Notification Center Drawer
An overlay drawer that slides in from the right edge of the screen, displaying real-time updates (like homework assignments, grades, and fee approvals).
* **Badges**: A compact, glowing badge (`w-2.5 h-2.5 bg-accent animate-pulse`) is displayed over the bell icon when unread alerts exist.

### C. User Profile Dropdown Menu
A dropdown menu positioned at the top-right of the topbar, containing profile shortcuts, settings, and logout triggers.
* **Design Pattern**: Opens on-click, styled with a clear border outline (`--border-strong`) and custom glassmorphic panels.

---

## 6. Mobile & Touch Navigation

Mobile layouts must be optimized for touch controls, keeping touch targets accessible and navigation simple.

### A. Bottom Navigation Bar
Recommended for parent and student portals on mobile viewports:
* **Height**: Strictly configured at `56px` (`h-14`) to fit comfortable tap boundaries.
* **Composition**: Houses up to 4 core navigation icons with compact descriptive text labels underneath.
* **Touch Targets**: Each navigation button expands to fill a `44px` by `44px` touch bounding box to prevent accidental selections.

### B. Mobile Off-Canvas Navigation Drawer
An slide-out panel triggered by clicking the menu icon in the topbar:
* **Animation**: Slides in from the left boundary (`x: 0` to `x: -100%`), using our fast slide spring parameters (`spring-drawer`).
* **Overlay**: Paired with a semi-transparent blur backdrop (`bg-black/50 backdrop-blur-sm`) to isolate focus.

---

## 7. Interactive Navigation States & Styling

To prevent visual drift, developers are strictly forbidden from hardcoding interactive navigation colors. All links must utilize NDS tokens:

```css
/* Active Navigation Highlights (Obsidian Theme Mapping) */
.nav-link {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--font-sm);
  color: var(--text-secondary);
  border-left: 4px solid transparent;
  padding: var(--space-sm) var(--space-md);
  transition: all var(--duration-fast) var(--ease-standard);
}

.nav-link:hover {
  color: var(--text-primary);
  background: rgba(16, 185, 129, 0.05); /* 5% emerald tint */
}

.nav-link:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--bg-page), 0 0 0 4px var(--color-glow);
}

.nav-link-active {
  color: var(--color-primary);
  background: rgba(16, 185, 129, 0.08); /* 8% emerald tint */
  border-left-color: var(--color-primary);
}
```

---

## 8. Page & Route Transition Specifications

NDS uses smooth transitions to prevent jarring screen changes during page navigation:

### A. Smooth Page Transitions
* **Visual Treatment**: New pages fade in smoothly with a gentle upward movement (`y: 8px` to `y: 0`), using our standard transition curves (`--ease-standard` over `240ms`).
* **Scroll Restoration**: Navigating to a new route must reset the window scroll coordinates immediately to `(0, 0)`, preventing page cuts or layout breakages.

### B. Skeleton Loading Screens
During network requests, page layouts are replaced with skeleton outlines (`animate-skeleton`). This maintains layout consistency and keeps loading indicators smooth.

---

## 9. Navigation Accessibility Checklist (WCAG 2.2 AA)

1. **Semantic Landmark Wrappers**: Sidebar, header, and mobile menus must utilize correct semantic tags (`<header>`, `<nav>`, `<aside>`, `<footer>`).
2. **Keyboard Trapping in Modals**: Slide-out mobile drawers and notification menus must implement keyboard trapping. When a drawer is open, keyboard `Tab` focus must remain within the active drawer list.
3. **Skip-to-Content Link**: To help keyboard users navigate efficiently, tables and forms must be preceded by a visually hidden "Skip to main content" link that reveals itself on-focus:
   ```html
   <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:p-4 focus:bg-primary focus:text-black">
     Skip to main content
   </a>
   ```
4. **Descriptive Labels (ARIA)**:
   * Main menu bars must declare `aria-label="Primary Navigation"`.
   * Menu toggle buttons must declare `aria-expanded="true"` or `"false"`.
5. **No Visual-Only Focus Indicators**: Focused navigation links must display a visible outline. Hiding focus rings is strictly forbidden.

---

## 10. TypeScript / React Navigation Component Blueprint

The following blueprint outlines the structure of the primary `NavLink` component used across our navigation systems:

```tsx
import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children: React.ReactNode;
}

export const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, badge, children }) => {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) => `
        flex items-center justify-between px-4 py-3 rounded-xl border-l-4 font-display font-semibold text-sm transition-all duration-base ease-standard
        ${isActive 
          ? 'bg-primary/8 text-primary border-primary' 
          : 'bg-transparent text-content-secondary border-transparent hover:text-content hover:bg-surface-overlay/50'
        }
      `}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-current" />}
        <span>{children}</span>
      </div>
      
      {badge !== undefined && (
        <span className="px-2 py-0.5 rounded-full font-mono text-xs font-bold bg-accent/15 text-accent border border-accent/20">
          {badge}
        </span>
      )}
    </RouterNavLink>
  );
};
```
