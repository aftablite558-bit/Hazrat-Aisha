# Noor Design System — Official Button System Specification
## Hazrat Aisha Academy

This specification outlines the architecture, layout rules, interactive states, design tokens, and accessibility standards for the **Button System** of the Noor Design System (NDS). All interactive click states across public pages, parent-student portals, and admin screens must adhere strictly to these patterns to guarantee consistent, touch-friendly, and highly accessible user journeys.

---

## 1. Button Philosophy & Standards

### A. Design Principles
Buttons in the Noor Design System represent pathways to learning and administration. They must remain:
* **Obvious and Intentional**: Clear spatial boundaries and elevation clues make click triggers instantly recognizable. Decorative items must never mimic button shapes.
* **Predictable and Grounded**: Hover transitions, spring responses, and color shifts must provide cohesive mechanical feedback.
* **Spaced Elegantly**: Generous horizontal padding is paired with tracked uppercase display typography (`--font-display`), ensuring buttons feel solid and dignified.

### B. HTML5 Semantic Standards
* **Action vs. Navigation**: 
  * If the action triggers server-side states, form submissions, modal popups, toggle states, or client-side processes, use a semantic `<button>` tag with a clear `type="button"`, `type="submit"`, or `type="reset"`.
  * If the action shifts the user to a different route, external page, or local anchor link, use a semantic anchor `<a>` or React Router's `<Link>` component.
* **No Div Triggers**: Attaching `onClick` listeners to non-semantic HTML blocks (such as `<div>` or `<span>`) is strictly forbidden. This protects screen reader workflows and native keyboard navigation.

### C. Accessibility & WCAG 2.2 Level AA Targets
* **Touch Targets**: In accordance with WCAG 2.2 Success Criterion 2.5.5, all interactive targets must maintain a minimum bounding size of **44px by 44px** on touch-enabled devices.
* **Contrast Safeguard**: Button background-to-text configurations must achieve a minimum contrast ratio of **4.5:1** for standard button texts and **3.0:1** for larger action items.
* **Focus Visibility**: Focus rings must remain highly visible, using a dual-ring layout that isolates focus colors from nearby backgrounds.

---

## 2. Button Design Tokens

To prevent visual drift, developers are strictly forbidden from hardcoding inline styles or utility classes. All buttons must compose these semantic design tokens:

### A. Size Scale & Spacing Matrix

| Size Token | Height Bounds | Horizontal Pad | Typography Token | Icon Size Token | Minimum Touch Bound |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Extra Small (XS)** | `32px` | `12px` (`0.75rem`) | `text-xs font-bold` | `14px` (`w-3.5 h-3.5`) | `44px` (via transparent ring) |
| **Small (SM)** | `38px` | `16px` (`1rem`) | `text-xs font-extrabold tracking-wider` | `16px` (`w-4 h-4`) | `44px` (via transparent ring) |
| **Medium (MD)** | `44px` | `20px` (`1.25rem`) | `text-xs font-black tracking-widest` | `18px` (`w-4.5 h-4.5`) | `44px` (Direct boundary size) |
| **Large (LG)** | `52px` | `24px` (`1.5rem`) | `text-sm font-black tracking-widest` | `20px` (`w-5 h-5`) | `52px` (Direct boundary size) |
| **Extra Large (XL)**| `60px` | `32px` (`2rem`) | `text-sm font-black tracking-widest` | `22px` (`w-5.5 h-5.5`) | `60px` (Direct boundary size) |

### B. Geometry & Elevation System
* **Border Radii**: All standard buttons use `--radius-sm` (`8px`) or `--radius-md` (`12px`) to maintain clean, professional corners. Full-pill buttons use `rounded-full`.
* **Focus Ring Tokens**:
  * Outer ring: `0 0 0 4px var(--color-glow)`
  * Inner ring space: `0 0 0 2px var(--bg-page)` (creates a clean gap)
* **Default Shadow**: `--shadow-e1` is default on floating state, transitioning to `--shadow-e2` during hover interactions.

---

## 3. Button Types & Styling Specs

Every button style must respond correctly to the active brand theme (Obsidian, Daylight, Midnight).

```typescript
// Conceptual structural layout using Tailwind CSS variables
const BASE_BUTTON_CLASSES = "inline-flex items-center justify-center font-display uppercase transition-all duration-base ease-standard rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:pointer-events-none";
```

### A. Primary Button (The Scholar Emerald)
The primary action button, representing progress, affirmation, and academic submission.
* **Daylight Theme**:
  * Default: `bg-[#059669] text-white` | Hover: `bg-[#047857]`
* **Obsidian Theme**:
  * Default: `bg-[#10B981] text-[#050D0A]` | Hover: `bg-[#34D399]`
* **Midnight Theme**:
  * Default: `bg-[#34F5C5] text-black` | Hover: `bg-[#6EF7D6]`

### B. Secondary Button (Noor Slate)
For secondary actions, alternative pathways, or secondary forms.
* **Daylight Theme**:
  * Default: `bg-[#F0F5F2] text-[#0B1F18]` | Hover: `bg-[#DCE7E1]`
* **Obsidian Theme**:
  * Default: `bg-[#12241D] text-[#EAF4EF]` | Hover: `bg-[#1A332A]`
* **Midnight Theme**:
  * Default: `bg-[#121212] text-[#F2F2F2]` | Hover: `bg-[#1A1A1A]`

### C. Gold Button (The Crest Award)
For call-outs, admissions inquiries, fee payments, and premium actions.
* **Daylight Theme**:
  * Default: `bg-[#B8912F] text-white` | Hover: `bg-[#9E7A25]`
* **Obsidian / Midnight Theme**:
  * Default: `bg-[#D4AF37] text-black` | Hover: `bg-[#F1C43F]`

### D. Outline Button
For secondary dashboard widgets, downloads, or alternative filter options.
* **Daylight Theme**:
  * Default: `border border-[#DCE7E1] bg-transparent text-[#3D5C51]` | Hover: `bg-[#F0F5F2]`
* **Obsidian Theme**:
  * Default: `border border-[#1E3A2F] bg-transparent text-[#9DBDB1]` | Hover: `bg-[#12241D]`
* **Midnight Theme**:
  * Default: `border border-[#262626] bg-transparent text-[#B3B3B3]` | Hover: `bg-[#121212]`

### E. Ghost Button
For tertiary actions, list item edits, or navigation bar links.
* **All Themes**: No background or border. Fits in with nearby text colors. On hover, background shifts slightly to `--bg-surface-overlay` with a transition duration of `100ms`.

### F. Glass Button
For header navs or hero sections overlaying rich graphical fields.
* **Obsidian / Midnight Theme**: `bg-[rgba(10,21,18,0.55)] border border-[rgba(52,245,197,0.14)] backdrop-blur-md text-[#EAF4EF]`

### G. Status Buttons (Success / Warning / Danger)
* **Danger (Delete/Decline Action)**:
  * Default: `bg-red-500/10 border border-red-500/20 text-red-400`
  * Hover: `bg-red-500 text-white`
* **Success (Approved Action)**:
  * Default: `bg-emerald-500/10 border border-emerald-500/20 text-emerald-400`
  * Hover: `bg-emerald-500 text-black`
* **Warning (Pending State Action)**:
  * Default: `bg-amber-500/10 border border-amber-500/20 text-amber-400`
  * Hover: `bg-amber-500 text-black`

### H. Link Button
For secondary info references. Represents a simple text link with an underline on hover. Never uses a background outline. Minimum tap targets must be maintained via padded layout wrappers.

### I. Icon Only & FAB (Floating Action Button)
* **Icon-Only Buttons**: Must declare an explicit, unique, and accessible `aria-label` describing the action (e.g. `aria-label="Edit student details"`). Bounding frame must remain square (`aspect-square`) with centered icons.
* **FAB (Floating Action Button)**: Standard rounded circles (`rounded-full`) anchored to bottom-right coordinates. Employs elevation `--shadow-e3` to float above page layers.

---

## 4. Interactive States & Animation Specifications

Every button must implement smooth transitions across all lifecycle states.

### A. Lifecycle State Matrix
1. **Default State**: Thin default border, sharp text representation, solid background colors.
2. **Hover State**: Employs `--ease-standard` over `160ms` (`duration-fast`). Background brightness shifts by 5–10%, and the outline transitions to `--border-strong`.
3. **Pressed State**: Employs `--ease-spring` or `spring-tactile`. Shrinks back slightly to `scale: 0.98` to mimic real-world tactile push compression.
4. **Focused State (Keyboard)**: Triggers the dual-ring focus layout immediately. Focus indicator rings must never be hidden or disabled.
5. **Loading State**: Disables background triggers, replaces the text with an active spinner, and sets cursor state to `cursor-wait`.
6. **Disabled State**: Opacity falls to `50%`. Sets mouse coordinates to `cursor-not-allowed` and disables mouse/click triggers entirely.

### B. Framer Motion Integration Spec (React)
```tsx
import { motion } from 'motion/react';

export const MotionButton = ({ children, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 500, damping: 15 } }}
      whileTap={{ scale: 0.98, transition: { type: "spring", stiffness: 500, damping: 15 } }}
      className="px-6 py-3.5 bg-primary text-white font-display font-bold uppercase rounded-xl"
      {...props}
    >
      {children}
    </motion.button>
  );
};
```

---

## 5. Icon Layout Rules

Icons add helpful visual cues and context, but they must not clutter the text.

* **Leading Icon (Start)**: Placed before the label to guide user action (e.g., `[Search Icon] Inquiry`).
* **Trailing Icon (End)**: Placed after the label to show layout movement or action navigation (e.g., `Apply Now [Arrow Right]`).
* **Icon-to-Text Margin**: The gap between the icon and text must be strictly bound to `--space-xs` (8px).
* **Self-Contained Sizing**: Icons within buttons must scale relative to the parent button size (refer to section 2.A).

---

## 6. Loading States & Spinners

When performing server-side saves, authentication checks, or API calls, buttons must switch to their loading state immediately to prevent duplicate actions.

### A. Visual Treatment
* The button text remains visible but fades to 30% opacity.
* A centered, rotating spinner is revealed in place of leading icons.
* Background borders remain static; any hover transitions are disabled.

### B. Loading Spinner Code Spec
```html
<!-- Fully custom, accessible svg spinner -->
<svg class="animate-spin-custom h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" aria-hidden="true">
  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
</svg>
```

---

## 7. Performance & Optimization

To maintain consistent **60 FPS** performance on mobile and lower-powered devices:
1. **GPU Rendering**: Animate layout changes using GPU-supported properties (`scale` and `opacity`), avoiding animations on height, width, margin, or padding.
2. **Minimize Reflow**: Color states must transition smoothly over `100ms` to `160ms` using CSS transitions, preventing structural repaints.
3. **No Scale Animations on Mobile**: Touch-screens do not support natural hover interactions. Scale-up animations must be disabled on screens under `640px` to keep layouts responsive.

---

## 8. React/Tailwind/TypeScript Component Blueprint

The following TypeScript block outlines the architecture of the primary `Button` component used across our pages:

```tsx
import React, { forwardRef } from 'react';
import { motion } from 'motion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'glass';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`btn-token btn-${variant} btn-${size} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin-custom h-4 w-4 mr-2 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      <span>{children}</span>
    </button>
  );
});
```
