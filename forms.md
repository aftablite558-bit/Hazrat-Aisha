# Noor Design System — Official Form Design Specification
## Hazrat Aisha Academy

This design specification outlines the architectural rules, input patterns, layout hierarchies, interactive states, validation models, and accessibility standards for the **Form System** of the Noor Design System (NDS). All forms — including online admissions, result inquiries, staff login, and contact forms — must adhere strictly to these guidelines to ensure exceptional clarity, mobile-first responsiveness, and WCAG 2.2 Level AA accessibility.

---

## 1. Form Philosophy & Design Standards

### A. Core Philosophy
Forms are the bridge between Hazrat Aisha Academy and our community (parents, students, and faculty). NDS treats form completion as a respectful, clear, and quiet conversation:
* **Clarity Over Clutter**: Extraneous questions are removed. Progressive disclosure (step-by-step disclosure) is utilized for complex processes (like multi-step online student admissions).
* **High Contrast and Legibility**: All labels, placeholders, input values, helper texts, and validation markers are styled in high-contrast neutral green-slate palettes to avoid eye strain.
* **Direct, Immediate Feedback**: Avoid unexpected errors during submission. Inputs validate inline on-blur, showing users errors in real time with supportive, non-critical guidance.

### B. HTML5 Semantic Form Rules
* **Explicit Action Wrappers**: All inputs must exist inside a semantic `<form>` element.
* **Explicit Inputs**: Every input field must have an explicitly paired, clickable `<label>` tag using matching `htmlFor` and `id` attributes. This expands tap bounds on touch screens and allows screen readers to declare the field correctly.
* **Autocomplete Assistance**: Input fields must declare appropriate autocomplete keywords (e.g. `autocomplete="email"`, `autocomplete="tel"`, `autocomplete="postal-code"`) to help browsers pre-fill information safely.

---

## 2. Core Form Input Elements & Tokens

To prevent visual drift, Developers must not hardcode styles, margins, or borders. Inputs must compose NDS tokens:

### A. Dimensional Specifications
* **Input Height (Touch Friendly)**: All standard input boxes (text, email, tel, select) must maintain a minimum height of **44px** (`h-11`) to prevent touch-target failures.
* **Border Radii**: Input boundaries are shaped with `--radius-md` (`12px` / `0.75rem`) to create clean, approachable geometry.
* **Inner Spacing**: 
  * Left and Right: `16px` (`pl-4 pr-4`)
  * Top and Bottom: `12px` (`py-3`)

### B. Structural Text Input Fields
* **Label**: Displayed in `--font-display` with strong uppercase tracking: `text-xs font-bold uppercase tracking-wider text-content mb-2 block`.
* **Daylight Theme Input**: `bg-[#FFFFFF] border border-[#DCE7E1] text-[#0B1F18] placeholder-[#67827A] focus:border-[#059669]`
* **Obsidian Theme Input**: `bg-[#12241D] border border-[#1E3A2F] text-[#EAF4EF] placeholder-[#6E9589] focus:border-[#10B981]`
* **Midnight Theme Input**: `bg-[#121212] border border-[#262626] text-[#F2F2F2] placeholder-[#808080] focus:border-[#34F5C5]`

### C. Advanced Input Elements
1. **Dropdown Select Fields (`<select>`)**: Must feature custom SVG indicators styled in `--text-secondary` to guarantee clean visual display. System default arrows are disabled (`appearance-none`).
2. **Textareas**: Fixed heights with a strict vertical resizing rule (`resize-y`) to prevent layout breakage on horizontal expansion.
3. **Checkboxes & Radios**: Rendered with custom SVGs to support high-contrast theme styling. The checkbox target frame must remain at least `20px` by `20px`, with a touch-friendly click buffer extending to `44px`.
4. **Drag-and-Drop File Upload Area**:
   * *Aesthetics*: Surrounded by a dashed border outline (`border-dashed border-2`), styled in `--border-strong`.
   * *Features*: Integrates an active drag-and-drop zone with a custom click-to-upload input, displaying clear file limitations (e.g., `PDF or JPG up to 5 MB`).

---

## 3. Form Interactive States & Animations

Forms must communicate changes in focus, validation, and submission status seamlessly.

### A. Form States
1. **Default State**: Sharp text, clear border lines (`--border-default`), and clean backgrounds.
2. **Hover State**: Border outline shifts to `--border-strong` over `100ms` (`duration-instant`) to indicate interactive potential.
3. **Focus State (Typing)**: The input field's border changes to `--color-primary`, and a soft focus ring is displayed (`box-shadow: 0 0 0 1px var(--color-primary), 0 0 12px var(--color-glow)`).
4. **Valid State**: A subtle green check icon is revealed, accompanied by an emerald border outline.
5. **Invalid State (Error)**: The border outline shifts immediately to crimson (`border-red-500`), and descriptive error messages are displayed underneath the input.
6. **Disabled / Readonly State**: Background shifts to `--bg-surface-raised` with a `cursor-not-allowed` pointer state, reducing text opacity to `50%`.

### B. Framer Motion Feedback Spec (React)
```tsx
import { motion } from 'motion/react';

export const ErrorMessage = ({ message }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className="text-xs font-semibold text-red-500 mt-1.5 block"
    >
      {message}
    </motion.span>
  );
};
```

---

## 4. Real-Time Form Validation Rules

NDS enforces structured validation guidelines to minimize user frustration:

1. **Required Indicator**: Denoted with an elegant gold star `*` styled in `--color-accent` placed immediately after the text label.
2. **On-Blur Validation**: Inputs must only validate *after* a user has focused and navigated away from the field. Validating while a user is typing is forbidden, as it can cause distracting early error warnings.
3. **On-Submit Validation**: If submission is attempted with incomplete inputs, the form focus must automatically cycle and rest on the first invalid field.
4. **Custom Password Strength Meter**: Required for staff portals, evaluating complexity across length, digit integration, and uppercase constraints.
5. **Character Counters**: Displayed in the bottom-right of textareas to track length constraints dynamically: `font-mono text-xs text-content-tertiary mt-1.5 block text-right`.

---

## 5. Form Layout & Structural Rules

NDS promotes asymmetrical single-column and multi-column grids based on layout width and complexity.

### A. Single Column Layout (Simple Contacts / Logins)
Recommended for login windows, search filters, and basic feedback blocks:
* **Aesthetics**: Fields stack vertically with strict, uniform margins (`space-y-6`). Labels sit directly above the input fields.

### B. Responsive Two-Column Layout (Academic Enrollments)
Recommended for student profiles, parent details, and complex registration steps:
* **Mobile (0px to 640px)**: All fields stack in a single column.
* **Tablet & Desktop (641px+)**: Form fields split into balanced grid systems (`grid sm:grid-cols-2 gap-6`), pairing related inputs (e.g., First Name and Last Name) side-by-side.

### C. Multi-Step Wizard Forms
For complex processes (such as online admissions), forms are split into structured, logical sections:
1. **Interactive Stepper Guide**: Displays step indicators (e.g., `1. Personal Info`, `2. Parents Info`, `3. Documents Upload`) with checked icons for completed steps.
2. **Layout Preservation**: Steps must transition using a smooth horizontal translation animation (`motion/react` layout transitions) to create a premium, cohesive journey.

---

## 6. Accessibility & WCAG 2.2 Level AA Compliance

NDS ensures all form interactions remain accessible and comfortable to navigate:

1. **Focus Ring Visibility**: Keyboard-focused form inputs must display our custom focus ring immediately. Outline styling must never be hidden or deactivated.
2. **No Color-Only Information**: Errors, warnings, and alerts must never be conveyed through color changes alone. Always pair red borders with explicit descriptive text labels or visual icons.
3. **Screen Reader Integration (ARIA)**:
   * Invalid input fields must declare `aria-invalid="true"`.
   * Input fields must be connected to their descriptive helper text using `aria-describedby="field-helper-id"`.
4. **Logical Tab Indexing**: Form tab navigation must follow the natural visual layout order, moving smoothly from left-to-right and top-to-bottom.
5. **No Placeholders as Labels**: Placing form labels inside placeholders is strictly forbidden. Placeholders vanish during typing, which can disrupt focus for users with cognitive or memory challenges.

---

## 7. TypeScript / React Input Component Blueprint

The following blueprint outlines the implementation of our primary custom `Input` component:

```tsx
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
  isRequired?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  helperText,
  error,
  isRequired = false,
  id,
  className = '',
  ...props
}, ref) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col w-full">
      <label 
        htmlFor={inputId} 
        className="font-display font-bold text-xs text-content uppercase tracking-wider mb-2 block"
      >
        {label}
        {isRequired && <span className="text-accent ml-1 font-bold">*</span>}
      </label>
      
      <input
        ref={ref}
        id={inputId}
        aria-describedby={error ? errorId : (helperText ? helperId : undefined)}
        aria-invalid={!!error}
        className={`w-full h-11 px-4 py-3 rounded-xl border font-body text-sm transition-all duration-base ease-standard
          bg-surface border-line text-content placeholder-content-tertiary
          focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
          disabled:opacity-50 disabled:bg-surface-raised disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          ${className}`}
        {...props}
      />

      {error ? (
        <span id={errorId} className="text-xs font-semibold text-red-500 mt-1.5 block">
          {error}
        </span>
      ) : helperText ? (
        <span id={helperId} className="text-xs font-semibold text-content-tertiary mt-1.5 block">
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
