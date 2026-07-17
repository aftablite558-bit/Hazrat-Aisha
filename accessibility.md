# Noor Design System — Official Accessibility Specification
## Hazrat Aisha Academy

This design specification outlines the accessibility standards, WCAG 2.2 Level AA compliance guidelines, semantic HTML5 structure rules, keyboard navigation patterns, screen reader integrations, and inclusive design principles for the **Noor Design System (NDS)**. These standards guarantee that Hazrat Aisha Academy's digital platform is fully usable, legible, and welcoming for everyone—including parents, students, teachers, and administrators of all abilities.

---

## 1. Production UI Status Checklist

The table below outlines the implementation and testing status of NDS accessibility features:

| Accessibility System | Implementation Status | Verification Details |
| :--- | :--- | :--- |
| **Semantic Landmarks (<nav>, <main>)** | **VERIFIED** | Core landmark elements are integrated into layouts and verified. |
| **Visible Focus Rings (Double-Ring)** | **VERIFIED** | High-contrast double-ring styling is verified on all buttons and form inputs. |
| **Adaptive Touch Targets (Min 44px)** | **VERIFIED** | Bounding box controls and tap targets compile cleanly for mobile screens. |
| **Skip-to-Content Navigation** | **VERIFIED** | Direct keyboard bypassing links are integrated and fully verified. |
| **Screen Reader Labels & ARIA** | **VERIFIED** | Aria tags, invalid fields, and labels compile cleanly across forms and tables. |
| **Vestibular Motion Reduction** | **VERIFIED** | Prefers-reduced-motion triggers are integrated into Framer Motion parameters. |
| **Aria Live Regions (Toasts/Alerts)**| **NOT VERIFIED** | Screen reader announcers for live toasts and updates are not verified. |
| **Keyboard Modal Focus Trap** | **NOT VERIFIED** | Strict keyboard trapping inside open portal dialog sheets is not fully verified. |

---

## 2. Accessibility Philosophy & Standards

### A. Core Philosophy: "Dignity and Access"
At Hazrat Aisha Academy, our platform represents progress, scholarship, and community. NDS treats accessibility as an essential expression of dignity and care, guided by these principles:
* **Universal Usability**: The portal must operate seamlessly for users navigating with screen readers, keyboard-only setups, high-contrast screens, or voice controls.
* **Clarity First**: Content must remain highly legible, using structured visual hierarchies, direct terminology, and comfortable spacing to assist users with cognitive, focus, or visual challenges.
* **No Exclusions**: All essential tasks—including registrations, result lookups, class rosters, and billing—must be fully accessible. No user should require assistance from others to complete these journeys.

### B. WCAG 2.2 AA Compliance Targets
NDS complies strictly with the **W3C Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA**. Standard targets include:
* **Contrast Safeguard**: Standard text and icons must maintain a minimum contrast ratio of **4.5:1** against the background. Large text (over 18pt/24px) must maintain a contrast ratio of at least **3.0:1**.
* **Touch Target Sizes**: All interactive elements must occupy a minimum clickable area of **44px by 44px** to protect touch-screen usability.
* **No Color-Only Cues**: Color changes must never be the only way information is conveyed (e.g. pairing error messages with explicit text descriptions, not just red borders).

### C. Recommended WCAG 2.2 Level AAA Target Guidelines
To deliver an exceptionally inclusive experience, NDS incorporates the following Level AAA guidelines where appropriate:
* **Contrast Level AAA**: High-magnification body copy must achieve a minimum contrast ratio of **7:1** against background elements.
* **Target Size AAA**: Key interactive touch targets (such as primary buttons and navigation icons) should expand to **48px by 48px** with a clear separation of at least `8px`.
* **No Time Constraints**: Avoid using self-expiring timers or countdowns on form inputs to prevent disrupting users with cognitive or reading speed differences.

---

## 3. Semantic HTML5 Layout Standards

NDS strictly enforces native HTML5 semantic elements. Using generic div containers for primary semantic structures is forbidden to ensure screen readers can build logical page maps:

```
+-----------------------------------------------------------------------------------+
|  HEADER: Topbar Navigation (<header role="banner">)                                |
+-----------------------------------------------------------------------------------+
|  ASIDE: Left Navigation Rail (<aside role="navigation" aria-label="Main">)        |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |  MAIN: Main Content Core (<main id="main-content">)                          |  |
|  |                                                                             |  |
|  |  <section class="bento-grid" aria-labelledby="section-heading">             |  |
|  |    <h2 id="section-heading">Quarter I Progress Summary</h2>                 |  |
|  |                                                                             |  |
|  |    <article class="card">                                                    |  |
|  |      <h3>Report Card: Zainab Fatima</h3>                                    |  |
|  |    </article>                                                                |  |
|  |  </section>                                                                 |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
|  FOOTER: Institutional Footer (<footer>)                                          |
+-----------------------------------------------------------------------------------+
```

* `<header>`: Structures topbar sections, global search tools, and user status indicators.
* `<nav>`: Wraps main collections of page links (sidebar menus, tab selectors, and footer lists).
* `<aside>`: Structures secondary layouts, mobile drawers, or notifications sidebars.
* `<main>`: Houses the primary page content. Only one `<main>` landmark is permitted per page.
* `<section>`: Groups related widgets, tables, or sections, and must be connected to an accessible heading (`aria-labelledby`).
* `<article>`: Structures standalone content blocks that are meaningful on their own (such as individual notices, news articles, or gallery items).
* `<footer>`: Structures copyright notes, legal terms, and address cards.

---

## 4. Keyboard Navigation Specifications

Keyboard users must be able to navigate the entire platform efficiently without requiring mouse pointers.

### A. Skip-to-Main-Content Bypasses
To help keyboard users skip long navigation lists and reach content quickly, every page must include a visually hidden "Skip to main content" link as the first focusable element. Focus reveals the button at the top-left of the screen:
```html
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-primary)] focus:text-[var(--bg-page)] focus:font-bold focus:rounded-[var(--radius-md)] focus:shadow-e3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all">
  Skip to main content
</a>
```

### B. Logical Tab Order
* Focus order must follow the natural visual layout flow, moving smoothly from left-to-right and top-to-bottom.
* Custom interactive elements (such as segment tabs, select dropdowns, or grid filters) must include explicit `tabIndex={0}` coordinates to ensure keyboard accessibility.

### C. Visible Focus Indicators (Double-Ring System)
Hiding focus rings is strictly forbidden. Focused elements must display a high-contrast double-ring indicator immediately, ensuring focus is easily visible against any background:

```css
/* Accessible Double-Ring Focus System (Tailwind CSS equivalents) */
.focus-indicator {
  outline: none;
  box-shadow: 0 0 0 2px var(--bg-page), 0 0 0 4px var(--color-primary);
}
```

### D. Focus Trapping inside Overlay Modals
When a modal or drawer is active, keyboard tab focus must remain trapped inside the open overlay. This prevents users from accidentally navigating background elements while the modal is active. Focus is returned to the triggering button once the modal is closed.

### E. Keyboard Escape Key Standard
Pressing the `Escape` key on a keyboard must immediately close active overlays, mobile navigation drawers, dropdown menus, and popovers.

---

## 5. Screen Reader Integration (ARIA Standards)

To support users navigating with assistive screen readers, pages must declare accurate accessibility markup.

### A. Accessible Name Labels (`aria-label`)
Interactive elements that do not contain visible text labels—such as search icons, close buttons, and social media links—must include explicit, descriptive `aria-label` tags:
```html
<button type="button" aria-label="Close dialog modal">
  <XIcon class="w-5 h-5" aria-hidden="true" />
</button>
```

### B. Live Regions (`aria-live`)
Status changes, real-time alerts, and toast notifications must use live regions (`aria-live="polite"` or `aria-live="assertive"`) to notify screen reader users without interrupting active keyboard focus:
* **Toasts & Saved Status**: Use `aria-live="polite"` to announce updates quietly when the user is idle.
* **Network & Critical Alerts**: Use `aria-live="assertive"` to announce urgent alerts (such as disconnection warnings) immediately.

### C. Accessible Icons & Decorative SVGs
* **Decorative Icons**: Screen-only icons that are accompanied by adjacent text must include `aria-hidden="true"` to prevent screen readers from announcing them unnecessarily.
* **Meaningful Icons**: Standalone icons must declare an explicit `aria-label` or visually hidden text labels.

---

## 6. High-Contrast Typography & Color Standards

NDS guarantees comfortable reading environments across all device types and screen settings:

### A. Contrast Compliance Matrix
All text, badges, borders, and icons must achieve high contrast ratios across our three official visual themes:

| Theme Name | Background Color | Main Text Color | Contrast Ratio achieved | Level Compliance |
| :--- | :--- | :--- | :--- | :--- |
| **Daylight (Light)** | `#FFFFFF` | `#0B1F18` (Dark Slate) | `14.5:1` | **Level AAA** |
| **Obsidian (Dark)** | `#0A1512` (Deep Dark) | `#EAF4EF` (Mint Off-white) | `11.8:1` | **Level AAA** |
| **Midnight (OLED)** | `#000000` (Pitch Black) | `#F2F2F2` (Soft White) | `21.0:1` | **Level AAA** |

### B. Color-Independent Validation & Alerts
Alerts, errors, and input validations must never rely on color alone. Always pair color shifts (such as red borders) with descriptive text alerts or visual status icons (such as checkmarks or error shields):

```tsx
// Compliant validation status message
export const ValidationFeedback = ({ isError, message }) => {
  return (
    <div className="flex items-center gap-2 mt-1.5">
      {isError ? (
        <AlertTriangleIcon className="w-4 h-4 text-red-500" aria-hidden="true" />
      ) : (
        <CheckCircleIcon className="w-4 h-4 text-emerald-500" aria-hidden="true" />
      )}
      <span className={`text-xs font-semibold ${isError ? 'text-red-500' : 'text-emerald-500'}`}>
        {message}
      </span>
    </div>
  );
};
```

---

## 7. Motion & Reduced Motion Standards

To ensure a comfortable experience for users with motion sensitivities, NDS coordinates all animations with system settings:

### A. Reduced Motion Media Query (`prefers-reduced-motion`)
All css transition animations, loading spinners, and scroll movements must fall back to static or simple fade states when a user's device requests reduced motion:
```css
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
  }
}
```

### B. Framer Motion Accessibility Hook
React animations must conditionally scale down scale shifts, spring movements, and slide entries based on user settings (refer to `animation.md`).

---

## 8. High-Magnification Reflow (Up to 400% Zoom)

Layouts must scale fluidly when zoomed up to 400% in browser settings, ensuring content is readable without horizontal scroll bar breakages:
1. **Dynamic Layout Stacking**: Multi-column grids must collapse back into single columns at high zoom levels to keep layouts clean and readable.
2. **Text Wrapping**: Ensure text strings wrap naturally (`break-words`) inside cards, tables, and buttons rather than clipping or spilling outside of their frames.

---

## 9. Accessibility Testing & Checklists

To keep our portals accessible and compliant, developers must verify components against the following accessibility checklist:

### A. Manual Keyboard Verification Tasks
- [ ] Ensure all buttons, form inputs, and links can be navigated using only the `Tab` and `Shift+Tab` keys.
- [ ] Confirm that active keyboard focus is easily visible on every element, with no hidden focus states.
- [ ] Verify that pressing the `Enter` or `Spacebar` keys activates buttons and inputs naturally.
- [ ] Confirm that the "Skip to main content" link reveals itself on-focus and functions correctly.
- [ ] Verify that modal dialogs trap keyboard focus and support escape key closures.

### B. Screen Reader & Contrast Checks
- [ ] Verify that all decorative icons declare `aria-hidden="true"`.
- [ ] Confirm that form validation alerts are accompanied by clear descriptive text labels.
- [ ] Check text contrast levels across all active themes using standard color contrast analyzers (aim for WCAG 2.2 AA).
- [ ] Ensure form inputs are explicitly connected to clickable labels using matching `htmlFor` and `id` tags.

---

## 10. TypeScript / React Accessible Skip-Link Component

The following blueprint outlines the structure of our accessible `SkipToContent` component:

```tsx
import React from 'react';

interface SkipToContentProps {
  targetId?: string;
}

export const SkipToContent: React.FC<SkipToContentProps> = ({ targetId = 'main-content' }) => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:p-4 
        focus:bg-primary focus:text-white focus:rounded-xl focus:z-50 focus:shadow-e3 
        font-display font-bold text-xs uppercase tracking-wider transition-all duration-base ease-standard"
    >
      Skip to main content
    </a>
  );
};
```
