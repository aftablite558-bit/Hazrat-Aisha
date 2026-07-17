# Noor Design System — Official Motion & Animation Specification
## Hazrat Aisha Academy

This specification outlines the exhaustive motion guidelines, animation tokens, interactive curves, and Framer Motion (`motion`) standards for the **Hazrat Aisha Academy** digital infrastructure. To prevent visual jank, all transition speeds, easings, and physics configurations must comply strictly with these defined tokens, keeping animations smooth, highly responsive, and accessible at a target performance of 60 Frames Per Second (FPS).

---

## 1. Motion Philosophy: "Meaningful Light"

In the **Noor Design System (NDS)**, motion is not decorative noise. Motion represents the behavior of light (Noor) — smooth, fluid, directional, and responsive. 

Motion serves three core purposes:
1. **Focus Guidance (Spatial Integrity)**: Transitions help users understand spatial layouts, showing where elements (like drawers and modals) originate and how they relate.
2. **Intentional Feedback (Direct Manipulation)**: Hover and press states respond immediately, reinforcing user interactions with a tactile, spring-like feel.
3. **Calm Presence (Anti-AI-Slop)**: High-speed bounces, chaotic spins, and unrequested continuous loops are forbidden. Motion should feel smooth, grounded, and dignified, reflecting the academic and spiritual values of the academy.

---

## 2. Motion Accessibility & Reduced Motion Standards

To ensure an inclusive and accessible interface for all users, NDS implements strict accommodations for vestibular disorders and motion sensitivities.

### A. Media Query: `prefers-reduced-motion`
All CSS transitions, custom tailwind keyframes, and Framer Motion behaviors must automatically fall back to static or fade-only states when a user's system requests reduced motion.

```css
/* CSS Transition Level Fallback */
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-delay: -1ms !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    background-attachment: initial !important;
    scroll-behavior: auto !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    transform: none !important;
    backdrop-filter: none !important;
  }
}
```

### B. Framer Motion (`motion/react`) Accessibility Pattern
When utilizing Framer Motion within React components, always pass animation properties conditionally or respect standard motion reduction hooks:

```tsx
import { motion, useReducedMotion } from 'motion/react';

export function AccessibleCard({ children }) {
  const shouldReduceMotion = useReducedMotion();

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.24, ease: [0.4, 0, 0.2, 1] } 
    }
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      {children}
    </motion.div>
  );
}
```

---

## 3. Motion & Animation Tokens

These semantic tokens define duration scale, delay scale, easing curves, and physics-based springs.

### A. Duration Scale
* `duration-instant` (`100ms`): Micro-feedback interactions (e.g., switches, checkbox marks, simple border color shifts).
* `duration-fast` (`160ms`): Small panel transitions (e.g., accordion panels, dropdown menus, button hover states).
* `duration-base` (`240ms`): Standard layout transitions (e.g., sidebar collapse/expand, navigation highlight moves, tab switching).
* `duration-moderate` (`360ms`): Prominent UI switches (e.g., full-page drawer slides, modal window entrances).
* `duration-slow` (`480ms`): Ambient landing layouts (e.g., hero section displays, initial scroll-triggered entries).

### B. Delay Scale (For staggered lists)
* `delay-xs` (`40ms`): Stagger interval for dense tabular rows or list elements.
* `delay-sm` (`80ms`): Stagger interval for standard grid card rows (e.g., news articles, admissions grids).
* `delay-md` (`120ms`): Delay for high-impact content block reveals.

### C. Cubic Bezier Curves (Interpolation Standards)
* **Standard Easing (`--ease-standard`)**: `cubic-bezier(0.4, 0, 0.2, 1)`
  * *Purpose*: Natural transition curve where elements accelerate quickly and decelerate smoothly. Default for almost all properties.
* **Emphasized Easing (`--ease-emphasized`)**: `cubic-bezier(0.16, 1, 0.3, 1)`
  * *Purpose*: Crisp, sudden focus attraction. Ideal for overlay components like dialogs, notifications, and menus.
* **Linear / Accel Easing (`--ease-accel`)**: `cubic-bezier(0.4, 0, 1, 1)`
  * *Purpose*: Accelerating exit. Used for exiting elements that are moving off-screen.

### D. Physics Spring Configurations
Spring metrics replace arbitrary duration values to mimic physical inertia for tactile, spring-loaded interactions:

| Token Name | Stiffness | Damping | Mass | Suggested Usage |
| :--- | :--- | :--- | :--- | :--- |
| `spring-tactile` | `400` | `28` | `1.0` | Button press scales, checkbox activations, toggle notches |
| `spring-modal` | `250` | `25` | `1.0` | Modal entrances, warning popups |
| `spring-drawer` | `180` | `22` | `1.0` | Collapsible sidebar, mobile slide-out menus |
| `spring-stiff` | `600` | `35` | `1.0` | High-frequency cursor guides, tooltips |

---

## 4. Layout & UI Component Motion Specifications

### A. Page & Route Transitions
* **Visual Treatment**: Page shifts use a clean fade-in with a subtle upward movement to indicate fresh content entry.
* **Framer Motion Spec**:
  ```typescript
  const pageTransitionVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.36, ease: [0.16, 1, 0.3, 1] } 
    },
    exit: { 
      opacity: 0, 
      y: -12,
      transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } 
    }
  };
  ```

### B. Sidebar Drawer Animation
* **Visual Treatment**: Left-side drawer slides in smoothly, pushing or overlaying content without screen stutter.
* **Framer Motion Spec**:
  ```typescript
  const sidebarVariants = {
    collapsed: { width: 76, transition: { type: "spring", stiffness: 180, damping: 22 } },
    expanded: { width: 264, transition: { type: "spring", stiffness: 180, damping: 22 } }
  };
  ```

### C. Overlays, Modals, & Dialogs
* **Visual Treatment**: The backdrop dimming overlay fades in seamlessly (`backdrop-blur-md`). The dialog window scales up from 95% with an emphasized curve to attract attention cleanly.
* **Framer Motion Spec**:
  ```typescript
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.24, ease: "linear" } }
  };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 8 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 250, damping: 25 } 
    }
  };
  ```

### D. Dropdown Menus, Popovers, & Tooltips
* **Visual Treatment**: Dropdowns fade in while expanding downward from their anchor point, anchored to `transform-origin: top center`.
* **Framer Motion Spec**:
  ```typescript
  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.96, y: -4, pointerEvents: "none" },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      pointerEvents: "auto",
      transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] } 
    }
  };
  ```

### E. Accordions & Collapsible Lists
* **Visual Treatment**: Smooth height expansion with a masked, non-overflowing content switch.
* **Framer Motion Spec**:
  ```typescript
  const accordionContentVariants = {
    collapsed: { height: 0, opacity: 0, transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } },
    expanded: { height: "auto", opacity: 1, transition: { duration: 0.24, ease: [0.4, 0, 0.2, 1] } }
  };
  ```

---

## 5. Micro-Interactions & Hover States

### A. Buttons
* **Hover Interaction**: Interactive buttons expand slightly (`scale: 1.02`) with a background color shift and a subtle, soft shadow glow.
* **Press Interaction**: Shakes back slightly (`scale: 0.98`) using tactile spring metrics to simulate physical compression.
* **Framer Motion Spec**:
  ```typescript
  const buttonTapHover = {
    whileHover: { scale: 1.02, transition: { type: "spring", stiffness: 500, damping: 15 } },
    whileTap: { scale: 0.98, transition: { type: "spring", stiffness: 500, damping: 15 } }
  };
  ```

### B. Cards & Grid Items
* **Hover Interaction**: Cards translate upward by `4px` (`translate-y-[-4px]`) and smoothly shift their borders from `--border-default` to `--border-strong`. The container shadow upgrades smoothly from `--shadow-e1` to `--shadow-e2`.

### C. Data Table Rows
* **Hover Interaction**: Table rows transition background colors over `100ms` (`transition-colors duration-100`) to highlight active alignment:
  `hover:bg-surface-overlay/50`.

---

## 6. Feedback, Loading, & Special States

### A. Toast Notifications
* **Visual Treatment**: Toast slides in from the top-right corner, pausing briefly before exiting.
* **Framer Motion Spec**:
  ```typescript
  const toastVariants = {
    hidden: { opacity: 0, x: 100, y: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } 
    }
  };
  ```

### B. Skeleton Loading Screens
* **Visual Treatment**: Skeleton blocks use a clean, horizontal shimmer effect rather than sudden flashing transitions.
* **CSS Implementation**:
  ```css
  @keyframes skeleton-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .animate-skeleton {
    background: linear-gradient(90deg, var(--bg-surface-raised) 25%, var(--bg-surface-overlay) 50%, var(--bg-surface-raised) 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.6s infinite ease-in-out;
  }
  ```

### C. Progress & Loading Indicators
* **Visual Treatment**: Spinners rotate smoothly over `1s` (`animate-spin`), with the inner dash utilizing the brand color.
* **CSS Implementation**:
  ```css
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .animate-spin-custom {
    animation: spin 1s linear infinite;
  }
  ```

---

## 7. Layout Dynamics & Scroll Revelations

To keep page entrances comfortable and structured, elements reveal sequentially as users scroll down:

```typescript
// Variant container to orchestrate staggered lists
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // staggered child delay
      delayChildren: 0.04
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.24, ease: [0.4, 0, 0.2, 1] } 
  }
};
```
* **Visual Rule**: Scroll reveals must always declare `viewport={{ once: true }}` to prevent elements from repeatedly animating as the user scrolls up and down.

---

## 8. Mobile Performance & Performance Budget Guidelines

To maintain **60 FPS** performance and prevent lag on lower-powered devices:

1. **GPU Acceleration Rule**: Only animate layout properties that are handled directly by the GPU: `transform` (translations, scales, rotations) and `opacity`.
2. **Avoid Layout Recalculations**: Never animate layout-triggering properties such as `width`, `height`, `margin`, `padding`, `top`, `left`, or `border-width` unless highly controlled or necessary.
3. **Framer Motion Layout Optimization**: Use the `<LayoutGroup>` component to handle layout animation updates. This optimizes layout shifts by translating scales behind the scenes, avoiding heavy repaint cycles.
4. **Mobile Optimization Rules**:
   * On mobile screens (`sm:` and smaller), scale-up animations on hover must be disabled. Touch screens do not support natural mouse hovers, so hover scales can make scrolling feel sticky or unresponsive.
   * Complex radial blur circles (`backdrop-filter`) must be simplified or disabled on low-power devices to keep transitions responsive.
