# Noor Design System — Official Dashboard & Analytics Specification
## Hazrat Aisha Academy

This design specification outlines the architectural layout, widget systems, data visualization standards, real-time database state flows, and responsive rules for **Dashboards & Analytics** within the Noor Design System (NDS). This system powers the administrative controls, student grading boards, parent tracking hubs, and fee collection monitors at Hazrat Aisha Academy.

---

## 1. Production UI Status Checklist

The table below outlines the implementation and testing status of NDS dashboard components:

| Dashboard Component | Implementation Status | Verification Details |
| :--- | :--- | :--- |
| **Bento Grid Layout Model** | **VERIFIED** | Successfully integrated in our portal views and verified across desktop resolutions. |
| **KPI Metric Cards & Highlights** | **VERIFIED** | Configured with monospaced counts and high-contrast trend indicators. |
| **Recharts / D3 Chart Integration** | **VERIFIED** | Responsive charts with custom brand color mapping compiles successfully. |
| **Loading Skeletons & Transitions** | **VERIFIED** | Skeleton frames for metric cards and charts are verified in our UI. |
| **Firebase Realtime Sync** | **NOT VERIFIED** | Dynamic server-side listeners and live socket stream updates are not verified. |
| **Time-Range & Term Filters** | **NOT VERIFIED** | Global calendar selectors and dynamic cross-widget filtering is not fully verified. |
| **CSV / PDF Data Export Engine** | **NOT VERIFIED** | Local client-side generation of administrative gradebooks and receipts is not verified. |

---

## 2. Dashboard Philosophy & Information Architecture

### A. Academic-First Philosophy
At Hazrat Aisha Academy, our dashboards serve as toolsets for progress and care. Dashboard design centers on:
* **Actionable Oversight**: Every graph and metric must help administrators, teachers, and parents make supportive decisions (e.g. tracking student drop-offs or pending fees early).
* **Calm Clarity (Anti-AI-Slop)**: Avoid flashing counters, live network status logs, or unrequested terminal messages. Dashboards must display clear, readable metrics and trend guides without visual noise.
* **Typographic Hierarchy**: High-priority counters are styled in bold, clear monospaced typography (`--font-mono`), while descriptive labels are styled in our readable sans-serif typography (`--font-display`).

### B. HTML5 Semantic Layout Structure
Dashboard layout views must use semantic HTML5 elements to structure sections clearly:
* `<header class="dashboard-header">`: Houses page titles, path breadcrumbs, global calendar inputs, and role switchers.
* `<nav class="dashboard-quick-actions">`: Groups common workflow buttons (e.g., `Add Student`, `Record Attendance`, `Post Notice`).
* `<section class="bento-grid">`: The central area housing metric widgets, graphs, and logs.
* `<aside class="dashboard-sidebar-rail">`: Houses quick calendars, pending tasks, or recent notifications.

---

## 3. The Responsive Bento Grid Layout

NDS uses an asymmetrical **Bento Grid Layout** to arrange dashboard modules cleanly, guiding focus to high-priority metrics.

```
+-----------------------------------------------------------------------------------+
|  PAGE HEADER: Breadcrumbs / Page Title / Global Date Selectors                     |
+-----------------------------------------------------------------------------------+
|  QUICK ACTIONS BAR: Add New / Export Records / Sync Status                        |
+-----------------------------------------------------------------------------------+
|  BENTO GRID LAYOUT SECTION                                                        |
|                                                                                   |
|  +------------------------+  +------------------------+  +---------------------+  |
|  |  KPI CARD 1: Students  |  |  KPI CARD 2: Attendance|  |  KPI CARD 3: Fees   |  |
|  |  [Count: 1,024]        |  |  [Rate: 94.2%]         |  |  [Pending: ₹42k]    |  |
|  +------------------------+  +------------------------+  +---------------------+  |
|                                                                                   |
|  +----------------------------------------------------+  +---------------------+  |
|  |  WIDGET A: Attendance & Admissions Chart           |  |  WIDGET B: Tasks    |  |
|  |  [Dual-Axis Area & Bar Chart Trends]               |  |  - Grade Quarter I  |  |
|  |                                                    |  |  - Verify Fee Slip  |  |
|  +----------------------------------------------------+  +---------------------+  |
|                                                                                   |
|  +------------------------------------+  +-------------------------------------+  |
|  |  WIDGET C: Recent Notices Board   |  |  WIDGET D: Fee History Ledger       |  |
|  |  - Exam Schedule (Academic)        |  |  - Inv #1024 (Paid)                 |  |
|  |  - Parent Meetup (General)         |  |  - Inv #1025 (Pending)              |  |
|  +------------------------------------+  +-------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

### A. Responsive Grid Rules
The Bento Grid uses Tailwind's utility classes to rearrange widgets fluidly across display sizes:
* **Mobile (0px to 640px)**: All widget cards expand to occupy full width, stacking vertically in a single column (`grid-cols-1 gap-4`).
* **Tablet (641px to 1024px)**: Transition to a two-column grid (`grid-cols-2 gap-6`). Smaller KPI cards sit side-by-side.
* **Desktop (1025px to 1440px)**: Expands to a versatile three-column grid (`lg:grid-cols-3 gap-6`), using coordinate constraints to structure cards cleanly (e.g. `col-span-2` for charts).
* **Ultra-Wide (1441px+)**: Expands to a wide four-column grid (`xl:grid-cols-4 gap-8`), providing breathing room for high-density tables and sidebar notifications.

---

## 4. Dashboard KPI Cards (Metric Highlights)

KPI Cards present high-level academic metrics clearly, using our custom neutral palettes to avoid layout clutter.

### A. Core Visual Elements
* **Visual Frame**: Rounded corners (`--radius-2xl`), a default outline border (`--border-default`), a solid card background (`--bg-surface`), and interactive hover shadows (`hover:shadow-e2 hover:border-strong`).
* **Header**: Pairs clean Lucide icons with secondary labels (`text-xs font-bold uppercase tracking-wider text-content-secondary`).
* **Value Display**: Styled in Display Bold and Monospaced formatting: `font-mono font-black text-3xl sm:text-4xl text-content`.
* **Trend Guide**: Compact indicator badges placed immediately below or beside the counter:
  * *Growth*: `text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono px-2 py-0.5 rounded-full flex items-center`
  * *Decline*: `text-red-400 bg-red-500/10 border border-red-500/20 text-xs font-mono px-2 py-0.5 rounded-full flex items-center`

---

## 5. Data Visualization & Chart Standards

Charts map student trends, admissions progress, and fee collections cleanly using responsive layout frames.

### A. Chart Color Palette (Recharts & D3 Mappings)
To prevent visual drift, hardcoded color hexes are forbidden inside chart elements. All metrics must map to NDS tokens:
* `--chart-1` (Primary Brand): Emerald Green (`#059669` in Daylight | `#10B981` in Obsidian)
* `--chart-2` (Secondary Accent): Gold Accent (`#B8912F` in Daylight | `#D4AF37` in Obsidian)
* `--chart-3` (Info Trend): Sky Blue Accent (`#0284C7` in Daylight | `#38BDF8` in Obsidian)
* `--chart-grid` (Helper gridlines): Thin light grey-slate lines (`#DCE7E1` in Daylight | `#1E3A2F` in Obsidian)

### B. Chart Specifications
1. **Attendance Trend (Area Chart)**:
   * *Aesthetics*: High-contrast linear curve mapped to Emerald (`--chart-1`), using a soft gradient area fill fading toward the base.
2. **Fee Collections vs. Pending (Dual-Axis Bar & Line Chart)**:
   * *Aesthetics*: Total collected shown in solid Emerald bars (`--chart-1`), and outstanding balances mapped to a gold line overlay (`--chart-2`).
3. **Admissions Inquiries (Donut / Pie Chart)**:
   * *Aesthetics*: Tracks application statuses (e.g., `Approved`, `Pending`, `Reviewed`) using proportional donut segments with a clean, centralized counter.
4. **General Grid Design**: Axis labels use `font-mono text-xs text-content-tertiary`, and helper gridlines are styled with a dashed stroke pattern (`strokeDasharray="3 3"`).

---

## 6. Widget Types & Specifications

Bento grids are organized with modular widgets, customized to match user-permission levels (RBAC):

### A. Attendance & Roster Widget
* **Features**: Displays daily check-in logs, monthly ratios, and late counters. Left-side actions let teachers quickly toggle statuses (Present, Absent, Late).

### B. Announcements & Events Timeline
* **Features**: A clean, vertical timeline showing school events and notice board alerts (e.g., parent-teacher meets, examinations).
* **Aesthetics**: Timeline milestones are connected with a thin vertical indicator line (`border-l-2 border-line/40`).

### C. Recent Financial Activity Ledger
* **Features**: Displays invoice status, collected amounts, and transactions. Financial values are formatted cleanly: `font-mono text-sm text-content font-bold text-right`.

### D. Tasks & Exam Grading Progress
* **Features**: A checklists panel for teachers, tracking grading statuses across classes (e.g. `Quarter I Grades: 12/24 Graded`).
* **Aesthetics**: Integrates responsive progress bars (`h-2 w-full bg-surface-raised rounded-full overflow-hidden`).

---

## 7. Interactive Controls & Filtering Systems

To support clean sorting, dashboards include responsive, sticky controls at the top of the bento grid:

1. **Global Time-Range Selector**: A dropdown menu allowing administrators to filter views by term (e.g. `Term I`, `Term II`, `Academic Year 2026`).
2. **Dynamic Segment Filters**: Horizontal tabs (`bg-surface-raised/80 rounded-xl p-1 flex gap-1`) used to toggle active views or categories instantly.
3. **Active State Mappings**: Active tabs use a high-contrast background with prominent labels, while hover states transition borders smoothly over `100ms` (`duration-instant`).

---

## 8. Dashboard Loading & State Flows

Dashboards must handle async data loading smoothly, protecting layouts from shifting (CLS) during network requests.

### A. Skeleton Widgets (Loading State)
During initial data fetch, dashboards display clean skeleton layouts (`animate-skeleton`):
* Recharts panels are replaced with blank, light grey-slate gradient blocks.
* KPI values are replaced with compact, rounded rectangles matching the shape of display text.

### B. Empty & No-Results States
If filters return empty records:
* Replaces complex charts and grids with a centered, descriptive card.
* Displays a quiet illustration (e.g. a simple outline icon), a clear description, and a button to reset active filters.

### C. Syncing & Offline States
* During Firebase syncing processes, a compact rotating sync icon is displayed at the top-right of widgets, shifting to an offline warning badge if connections drop.

---

## 9. Accessibility Checklist (WCAG 2.2 Level AA)

1. **No Color-Only Data**: Charts and trends must not rely on color alone to convey metrics. Ensure tooltips, legends, and tables provide explicit text definitions.
2. **Descriptive Table & List Captions**: Every layout grid and recent activity list must declare explicit, screen-reader-safe descriptors using `aria-label` or `aria-describedby`.
3. **Screen-Reader-Friendly Tooltips**: Chart tooltips must remain fully readable by screen readers during keyboard focus navigation.
4. **Contrast Target Compliance**: Labels, numbers, axis ticks, and legend texts must maintain a contrast ratio of at least **4.5:1** against the card background.
5. **Interactive Controls Focus Rings**: All segment tabs, date select inputs, and filter buttons must display a visible focus ring on-keyboard-focus.

---

## 10. Performance Budget & Optimization Guidelines

To keep page interactions responsive and prevent lagging on lower-powered mobile devices:

1. **Memoized Chart Elements**: Memoize chart components to prevent unnecessary repaint cycles on unrelated dashboard states (such as opening sidebars or expanding notifications).
2. **Virtualization for Long Ledgers**: Ledger logs or notice boards containing over 100 entries must implement row virtualization (e.g. `react-window`), rendering only visible list items.
3. **Lazy Load Complex Widgets**: Heavy charts or log lists must be loaded lazily, allowing the main dashboard shell to render immediately during initial page load.

---

## 11. React / Tailwind / TypeScript Widget Blueprint

The following blueprint outlines the structure of our primary `KPICard` and its sub-layouts:

```tsx
import React, { forwardRef } from 'react';
import { motion } from 'motion/react';

interface KPICardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const KPICard = forwardRef<HTMLDivElement, KPICardProps>(({
  title,
  value,
  icon: Icon,
  trend,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`p-6 rounded-2xl border bg-surface border-line shadow-e1 transition-all duration-base ease-standard
        hover:shadow-e2 hover:border-strong ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="font-display font-bold text-xs uppercase tracking-wider text-content-secondary">
          {title}
        </span>
        {Icon && <Icon className="w-5 h-5 text-primary" />}
      </div>
      
      <div className="flex items-baseline gap-3 mb-1">
        <span className="font-mono font-black text-3xl sm:text-4xl text-content">
          {value}
        </span>
        {trend && (
          <span className={`px-2 py-0.5 rounded-full font-mono text-xs font-bold border ${
            trend.isPositive 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
});

KPICard.displayName = 'KPICard';
