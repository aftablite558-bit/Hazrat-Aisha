# Noor Design System — Official Micro-interactions & User Feedback Specification
## Hazrat Aisha Academy

This design specification outlines the interactive feedback loops, physics-based transition rules, tactile hover states, and dynamic state changes that form the **Micro-interactions & User Feedback System** of the Noor Design System (NDS). Micro-interactions are subtle visual, tactile, and motion-based cues designed to enrich usability, simplify complex task states, and reassure users across Hazrat Aisha Academy's online parent portals, teacher grading dashboards, and public school sites.

---

## 1. Production UI Status Checklist

The table below outlines the implementation and testing status of NDS micro-interactions and transitions:

| Interaction / Feedback Subsystem | Implementation Status | Verification Details |
| :--- | :--- | :--- |
| **Tactile Button Press States (`active:scale`)** | **VERIFIED** | Elastic button depress states on-click are integrated and verified. |
| **Input Focus High-Contrast Borders** | **VERIFIED** | Soft green-slate input transitions and gold required stars are fully verified. |
| **Card Lift & Elevate Hover States** | **VERIFIED** | Staggered hover lift transformations compile successfully in the dashboard. |
| **Dropdown Expand & Rotate Transitions** | **VERIFIED** | Nav dropdown toggles and chevron-rotation motion curves are verified. |
| **Toast Mount Slide-in Animations** | **VERIFIED** | Dynamic notification slide-and-fade actions are verified across views. |
| **Realtime Sync Activity Indicators**| **VERIFIED** | Spinning syncing feedback spinners compile and display cleanly. |
| **OLED Touch Tap Ripple Effects** | **NOT VERIFIED** | Dynamic material touch ripple animations on-tap are not fully verified. |
| **Touch Gesture Swipe Dismissals** | **NOT VERIFIED** | Mobile gesture swiping to clear toast notifications is not verified. |

---

## 2. Micro-interaction Philosophy & Rules

### A. Purposeful Motion
Every interaction, highlight, or shift inside NDS serves a functional purpose. We avoid purely decorative, excessive, or distracting motion:
* **Communicate State**: Transitions must clearly show state changes (e.g., active, loading, completed, disabled).
* **Direct Attention**: Subtle movements (such as a gentle bell icon shake) guide the user's eye to high-priority notifications without disrupting task focus.
* **Build Trust**: Fast, smooth visual confirmations (such as checkmarks appearing after form submission) reassure parents that actions are recorded securely in the academy's database.

### B. Spatial Consistency & The Physics Model
NDS uses physics-based spring models rather than linear math equations to make movements feel natural and responsive:
1. **The Inertia Rule**: Interactive panels (drawers, dialogs) expand with clean, springy deceleration to prevent visual jarring.
2. **Layered Elevation**: Moving components (cards, menus) cast proportional shadows as they lift above the background grid, showing spatial depth.
3. **Calm Feedback (Anti-AI-Slop)**: Avoid neon color flashes, heavy grid lines, or unrequested logs in the margins. Micro-interactions must remain humble, clean, and eye-friendly.

---

## 3. Button Interactions & State Flows

Buttons are key visual action components. NDS enforces strict interactive rules across all button states:

```
+-------------------------------------------------------------+
|  DEFAULT STATE: w-full px-5 py-3 rounded-xl bg-primary      |
|  [Solid Emerald background, clean white text, shadow-e1]    |
+-------------------------------------------------------------+
                            | (Hover Pointer Entry)
                            v
+-------------------------------------------------------------+
|  HOVER STATE: bg-primary-hover translate-y-[-1px]           |
|  [Deepened emerald, card lifts 1px, shadow-e2, 100ms ease]  |
+-------------------------------------------------------------+
                            | (Mouse Click / Press Tap)
                            v
+-------------------------------------------------------------+
|  ACTIVE PRESS STATE: active:scale-[0.98] shadow-inner       |
|  [Slightly depressed 2% scale, inset shadow, responsive]    |
+-------------------------------------------------------------+
```

### A. Interactive Button State Spec Matrix
* **Hover State**:
  * *Transformation*: Moves upward by `1px` (`translate-y-[-1px]`) and transitions background colors over `100ms` (`transition-all duration-instant ease-out`).
  * *Shadow*: Transition from `--shadow-e1` to `--shadow-e2` to show elevation.
* **Press State (Active)**:
  * *Transformation*: Shrinks slightly by `2%` (`active:scale-[0.98]`) to mimic a mechanical click.
* **Loading State**:
  * *Behavior*: Replaces the text label with a centered circular loader (`w-5 h-5 animate-spin`). Blocks click actions (`pointer-events-none`) and sets cursor to wait.
* **Success State**:
  * *Behavior*: Green background (`bg-emerald-500/10`) with a checkmark icon, scaling up smoothly before returning to normal over `1.5s`.
* **Failure State**:
  * *Behavior*: Red background (`bg-red-500/10`) with a brief horizontal shake animation (`animate-shake` over `300ms`).
* **Disabled State**:
  * *Aesthetics*: Gray-slate background (`bg-surface-raised`), muted text color, and blocked mouse interactions (`cursor-not-allowed opacity-50`).

---

## 4. Form Interactions & Real-time Validation

Input fields use clean, visible highlights to guide users through registration, payment, and scheduling forms.

### A. Input Focus State
* **Transformation**: When an input receives focus, its border color transitions smoothly from neutral gray to primary brand emerald (`border-primary`).
* **Double-Ring Glow**: Adds a soft background shadow ring to make the focused input field stand out clearly (refer to `accessibility.md`).

### B. Real-time Inline Validation Alerts
To assist users as they type, input fields evaluate data formats in real-time:
* **Validation Delay**: Validation begins **400ms** after typing stops to prevent premature error warnings.
* **Success Validation**: The border turns emerald green, accompanied by a small check icon.
* **Error Validation**: The border turns red, accompanied by a small alert icon and clear helper text explaining how to fix the input (refer to `forms.md`).
* **Auto-Save Indicator**: For auto-saving grids (such as teacher grading sheets), a compact indicator displays in the header: `"Auto-saving..."` during syncs, shifting to `"Saved to database"` once complete.

---

## 5. Card Lift & Shadow Transitions

Cards organize dashboard sections, using clean elevation shifts to show interactive potential.

### A. Hover Lift Mechanics
* **Default Card**: Renders with rounded corners (`--radius-2xl`), a simple border outline (`--border-default`), and a flat background.
* **Hover Target**: Moves upward by `2px` (`translate-y-[-2px]`) over `150ms` using standard curves (`transition-all duration-base ease-standard`).
* **Shadow Elevate**: Transitions from flat or light shadow (`--shadow-e1`) to a soft, rich layout shadow (`--shadow-e2`).

### B. Expandable Accordion Panels
* Collapsible cards (such as curriculum details or FAQ panels) slide down smoothly to reveal details:
  * Uses spring-like animations (`type: "spring", stiffness: 300, damping: 25`) to prevent sudden page jumps.

---

## 6. Navigation Transitions

Navigation links adapt cleanly, showing active paths and selections (refer to `navigation.md`):

### A. Active Sidebar Links
* **Aesthetics**: Active page links display an emerald green left border highlight and a subtle background tint (`bg-primary/5`).
* **Hover Interaction**: Hovering over inactive links highlights them with a gentle background fade over `100ms`, encouraging user clicks.

### B. User Dropdown Popups
* Dropdowns (like topbar profile menus) expand outward from the trigger button:
  * Scales up smoothly (`scale: 0.95` to `scale: 1`) and fades in (`opacity: 0` to `opacity: 1`) over `120ms` (`duration-instant`), aligning with user click actions.

---

## 7. System Feedback Alerts & Indicators

Real-time feedback alerts appear as floating notifications, keeping parents and teachers connected to school updates:

### A. Toast Notifications
* **Mount Sequence**: Toasts slide into view from the bottom-right of the screen (`x: 50px` to `x: 0`) and fade in over `200ms`.
* **Dismount Sequence**: Slid and fade out smoothly when cleared, automatically rearranging any remaining stacked toasts.

### B. Real-time Database Sync Status
* During database sync operations:
  * A compact spinning sync icon appears at the top corner of widgets.
  * If the network connection drops, the icon is replaced with a persistent, high-contrast offline warning badge.

---

## 8. Mobile Gestures & Touch Interactions

Touch-screen layouts are optimized for comfortable finger-tap bounds (refer to `responsive.md`):

### A. Clickable Touch Targets
* All buttons, menu links, and tab controls maintain a minimum touch bounding box of **44px by 44px**.
* Interactive items display a responsive background highlight when tapped, confirming touch register instantly.

---

## 9. Accessibility & Animation Safeguards (WCAG 2.2 AA)

1. **Reduced Motion Support (`prefers-reduced-motion`)**:
   * All micro-animations, loading spinners, and slide-in panels must fall back to simple, static, or fade-only states when a user's device settings request reduced motion.
2. **Keyboard Focus Syncing**:
   * Interactive components must trigger matching hover-like focus rings when navigated using a keyboard's `Tab` keys.
3. **Screen Reader Announcements**:
   * Progress updates, toast alerts, and validation states must use clear live region markers (`aria-live="polite"`) to announce changes to screen readers without interrupting focus.

---

## 10. TypeScript / React Micro-interaction Blueprint

The following blueprint outlines the structure of our custom `BounceButton` component, combining tactile scale feedback and loading state transitions:

```tsx
import React, { forwardRef } from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface BounceButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'accent';
  children: React.ReactNode;
}

export const BounceButton = forwardRef<HTMLButtonElement, BounceButtonProps>(({
  isLoading = false,
  variant = 'primary',
  children,
  className = '',
  disabled,
  ...props
}, ref) => {
  const variantClasses = {
    primary: 'bg-primary text-white border-transparent hover:bg-primary/95 focus:ring-primary',
    secondary: 'bg-surface-raised text-content border-line hover:bg-surface-overlay focus:ring-line',
    accent: 'bg-accent text-white border-transparent hover:bg-accent/95 focus:ring-accent',
  }[variant];

  return (
    <motion.button
      ref={ref}
      disabled={disabled || isLoading}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      className={`
        px-5 py-2.5 rounded-xl border font-display font-semibold text-sm shadow-e1 inline-flex items-center justify-center gap-2
        transition-all duration-base focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses} ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" aria-hidden="true" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
});

BounceButton.displayName = 'BounceButton';
