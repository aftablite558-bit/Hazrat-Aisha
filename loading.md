# Noor Design System — Official Loading, Skeleton, Progress & Transition Specification
## Hazrat Aisha Academy

This design specification outlines the architectural standards, visual aesthetics, perceived performance strategies, interactive loaders, skeleton layouts, empty states, and transition behaviors for the **Loading & Feedback System** of the Noor Design System (NDS). This system ensures that all network operations—including grading sheet saves, online admissions submissions, report card loads, and real-time database syncs—provide smooth, responsive, and accessible feedback on all devices.

---

## 1. Production UI Status Checklist

The table below outlines the implementation and testing status of NDS loading and animation subsystems:

| Loading Subsystem | Implementation Status | Verification Details |
| :--- | :--- | :--- |
| **Skeleton Loader Framework (`animate-pulse`)** | **VERIFIED** | Pulse shimmer animations are integrated into cards and tables, compiling cleanly. |
| **Linear Progress Bars (Determinate)** | **VERIFIED** | Precise percentage indicators for file uploads compile without any issues. |
| **Circular Infinite Spinners** | **VERIFIED** | Lightweight GPU-accelerated SVG spinner animations are fully verified. |
| **Framer Motion Route Transitions** | **VERIFIED** | Smooth layout page transitions and fade animations are fully integrated. |
| **Progressive Card Grid Rendering** | **VERIFIED** | Staggered entrance animations for lists are fully functional and verified. |
| **Empty State Call-to-Actions** | **VERIFIED** | Visually centered empty states with inline retry buttons are fully verified. |
| **Aria Live Notification Areas** | **NOT VERIFIED** | Live audio and text announcements for network failures are not verified. |
| **Aria Busy Block-State Indicators** | **NOT VERIFIED** | Restricting keyboard inputs during submission events is not fully verified. |

---

## 2. Loading Philosophy & Perceived Performance

### A. Perceived Performance Strategy
Real performance (actual network speeds) varies depending on a family's cellular connection in Bihar. NDS focuses on **perceived performance**—structuring page load sequences to make wait times feel short, quiet, and predictable:
1. **Never Show Blank Screens**: Empty white viewports create uncertainty. Always display the application sidebar and topbar shells instantly, and fill the content panel with skeleton placeholders.
2. **Avoid Layout Shifting (CLS Target: < 0.1)**: Keep loading blocks sized to match the loaded components. This keeps layouts consistent, preventing cards, charts, and tables from shifting suddenly when data arrives.
3. **Optimized Multi-Step Feedback**: Long processes (like uploading student documents) must provide continuous, step-by-step visual updates to reassure parents that the system is active.

### B. Progressive Rendering Pipeline
When a user navigates to a dashboard or registry portal:
* **Phase 1 (0ms–50ms)**: Render the static frame (Sidebar, Topbar navigation, and Page Header breadcrumbs) immediately from local cache.
* **Phase 2 (50ms–150ms)**: Render loading skeleton boxes in place of cards, text lines, tables, and charts.
* **Phase 3 (150ms+)**: Stream data. As content arrives, skeletons fade out gracefully (`opacity: 0` over `160ms`), revealing interactive components.

---

## 3. Standard Loading Types

NDS provides distinct feedback styles optimized for different sections of the page:

### A. Page-Level Navigation Loader
For full page route changes:
* **Visual Treatment**: A thin, high-contrast gold progress bar sits along the very top edge of the viewport.
* **Animation**: Slides smoothly from `0%` to `90%` during navigation, and jumps to `100%` before fading out once the route is fully rendered.

### B. Inline Component & Widget Loaders
Used inside card actions, panels, or side buttons:
* **Visual Treatment**: Displays a compact, circular spinning indicator (`w-4 h-4` or `w-5 h-5`) styled in our primary brand color (`--color-primary`).
* **Interaction**: Keeps adjacent buttons active unless a critical database update requires a temporary input lock.

### C. Form Submission Block-States
During active save operations (e.g. submitting a student admission form):
* **Visual Treatment**: Shows a circular loader inside the active button, replacing the default text label.
* **Security lock**: The button is disabled (`disabled:cursor-not-allowed`) to prevent duplicate submissions from multiple clicks.

---

## 4. Skeleton Loading System

Skeletons provide lightweight placeholders, matching the dimensions of loaded elements to keep layouts stable.

### A. Design Tokens & Styling
* **Background Shade**:
  * Daylight: `bg-[#EAF0EC]` | Obsidian: `bg-[#12241D]` | Midnight: `bg-[#1A1A1A]`
* **Shimmer Animation**:
  * NDS uses a gentle pulse fade animation (`animate-pulse`) to keep transitions quiet and eye-safe:
    ```css
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .4; }
    }
    ```

### B. Skeleton Grid Blueprint (Card Skeletons)
Used to display card placeholders during initial page loading:

```
+-------------------------------------------------------------+
|  CARD HEADER SKELETON:                                      |
|  [Pill: w-16 h-5 rounded-full]    [Square: w-10 h-5 rounded]|
+-------------------------------------------------------------+
|  CARD BODY SKELETON:                                        |
|  [Text Line: w-3/4 h-4 rounded-md mb-2]                     |
|  [Text Line: w-1/2 h-4 rounded-md]                          |
+-------------------------------------------------------------+
|  CARD FOOTER SKELETON:                                      |
|  [Button Shape: w-24 h-9 rounded-xl mt-4]                   |
+-------------------------------------------------------------+
```

---

## 5. Progress Indicators

NDS provides linear and circular progress indicators to track longer system processes:

### A. Linear Progress Bars
Best suited for linear operations (e.g. uploading school documents, downloading report cards).
* **Composition**: Built with a track background (`bg-surface-raised h-1.5 w-full rounded-full overflow-hidden`) and a colored indicator bar (`bg-primary h-full`).
* **Determinate Style**: The progress bar width updates in real-time to match the percentage completed, accompanied by a clean monospaced label (e.g. `45%`).
* **Indeterminate Style**: A gold accent bar slides continuously back and forth along the track during initial network requests.

### B. Circular Spinners
Best suited for compact elements, side buttons, or single card widgets.
* **Aesthetics**: A clean, balanced circle frame (`border-2 border-line/30 border-t-primary rounded-full animate-spin`).

---

## 6. Empty States & Feedback Screens

If data fails to load, or search results return empty, layouts display clean, reassuring instructions to help users recover.

### A. Empty State Layout Rules
* **Centered Composition**: The content area is centered visually (`flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto`).
* **Clean Illustration**: Displays a lightweight outline icon (`w-12 h-12 text-content-tertiary mb-4`). Avoid complex animations or cluttered graphic drawings.
* **Readable Labels**: Pairs headings (`font-display font-bold text-base mb-1 text-content`) with clear body text instructions (`font-body text-xs text-content-secondary leading-relaxed mb-6`).
* **Actionable Recovery**: Includes a clear button (e.g., `Clear filters`, `Retry network connection`) to help users quickly resolve the issue.

### B. Semantic Empty State Profiles
1. **No Data / Empty List**: *"No students registered in Grade 10A yet. Click the button below to add your first student enrollment."*
2. **No Search Results**: *"We couldn't find any results matching your search filters. Try adjusting your keywords or clearing the filter settings."*
3. **Offline Warning**: *"You are currently offline. Check your network connection to continue syncing records."*

---

## 7. Interactive State Transitions

Transitions use physics-based curves to guide focus without causing visual distraction.

### A. Slide and Fade Curves (Framer Motion Mappings)
* **Standard Page Fade-In**: The content panel opacity fades from `0` to `1` over `240ms` (`duration-base`), moving gently upward (`y: 8px` to `y: 0`) using standard easing curves (`--ease-standard`).
* **Skeleton Fade-Out**: When data arrives, loading skeletons fade out gracefully (`opacity` transition over `160ms`) to avoid jarring jumps.

### B. GPU-Friendly Performance
* Animations must rely strictly on CSS parameters that leverage GPU acceleration (`transform`, `translate3d`, and `opacity`).
* Avoid animating size properties (`width`, `height`, `margin`) directly, as these trigger heavy browser paint cycles that can cause stuttering on mobile screens.

---

## 8. Accessibility Checklist (WCAG 2.2 Level AA)

1. **Explicit Busy Declarations (`aria-busy`)**: Components undergoing active loading refreshes must receive the `aria-busy="true"` attribute. This informs screen readers to wait before announcing changes.
2. **Accessible Live Announcements**: Live updates, alerts, and upload percentages must utilize live regions (`aria-live="polite"`) to announce progress to screen reader users cleanly.
3. **Visible Skip Bypass Control**: Loading screens must never block active keyboard navigation. The main "Skip to content" link must remain focusable and functional.
4. **Reduced Motion Compliance**: Ensure all spinners, progress bars, and route transitions support system accessibility settings, falling back to static or fade-only states when `prefers-reduced-motion` is active.

---

## 9. TypeScript / React Core Loading Components

The following blueprints outline our standard loading components:

### A. Custom Spinner Component
```tsx
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'accent' | 'white';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  }[size];

  const colorClasses = {
    primary: 'border-line/30 border-t-primary',
    accent: 'border-line/30 border-t-accent',
    white: 'border-white/20 border-t-white',
  }[variant];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`rounded-full animate-spin ${sizeClasses} ${colorClasses} ${className}`}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
```

### B. Custom Skeleton Component
```tsx
import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'title' | 'avatar' | 'rect';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rect',
  className = '',
}) => {
  const variantClasses = {
    text: 'h-4 w-full rounded-md',
    title: 'h-6 w-1/2 rounded-md',
    avatar: 'w-10 h-10 rounded-full',
    rect: 'w-full h-24 rounded-2xl',
  }[variant];

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-surface-raised ${variantClasses} ${className}`}
    />
  );
};
```

### C. Custom Progress Bar Component
```tsx
import React from 'react';

interface ProgressBarProps {
  progress?: number; // 0 to 100. If undefined, runs as indeterminate.
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '' }) => {
  const isIndeterminate = progress === undefined;

  return (
    <div 
      role="progressbar" 
      aria-valuenow={progress} 
      aria-valuemin={0} 
      aria-valuemax={100}
      className={`w-full h-1.5 rounded-full bg-surface-raised overflow-hidden relative ${className}`}
    >
      {isIndeterminate ? (
        <div className="absolute top-0 bottom-0 left-0 bg-primary w-1/3 rounded-full animate-indeterminate-slide" />
      ) : (
        <div 
          className="h-full bg-primary rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      )}
    </div>
  );
};
```
