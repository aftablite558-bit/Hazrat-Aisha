# Noor Design System — Official Icon System Specification
## Hazrat Aisha Academy

This design specification outlines the architectural rules, sizing matrices, visual styles, semantic mappings, and accessibility guidelines for the **Icon System** of the Noor Design System (NDS). Icons are critical interactive and informative visual cues across our public portals, academic dashboards, and administrative workflows, helping users quickly navigate and process information.

---

## 1. Production UI Status Checklist

The table below outlines the implementation and testing status of NDS icon integration:

| Icon Subsystem | Implementation Status | Verification Details |
| :--- | :--- | :--- |
| **Lucide React Package Setup** | **VERIFIED** | Core icons are integrated into pages, compiling cleanly with standard tree-shaking support. |
| **Sizing & Stroke Matrix** | **VERIFIED** | Consistent responsive size mappings and standard stroke weights are fully functional. |
| **Theme-Specific Coloring** | **VERIFIED** | High-contrast coloring variables map perfectly across Daylight, Obsidian, and Midnight. |
| **Interactive Transitions** | **VERIFIED** | Micro-animations (hover transitions, spring shakes) compile successfully in portals. |
| **Screen Reader Fallbacks** | **VERIFIED** | Screen-reader-only labels and `aria-hidden` tags are verified on active interactive elements. |
| **Animated SVG Path Icons** | **NOT VERIFIED** | Dynamic path-drawing animations and fluid shape-shifting SVGs are not verified. |

---

## 2. Icon Philosophy & Design Principles

### A. Design Principles
Icons in the Noor Design System act as intuitive guides, simplifying complex tasks and directing focus:
* **Visual Clarity**: Every icon must convey a single, unambiguous concept. Avoid complex, abstract, or highly stylized shapes that increase cognitive load.
* **Aesthetic Consistency**: Icons must share a cohesive design style—using clean, consistent stroke weights, proportional line joins, and balanced curves.
* **Humble Assistance (Anti-AI-Slop)**: Avoid excessive visual decoration, glowing orbs, or purely decorative indicators around icons. Icons must remain clean, direct, and focused on assisting users.

### B. Standardized Framework Package
To maintain a cohesive look across all pages, NDS uses the **Lucide React** icon package. 
* Developers are strictly forbidden from importing custom SVGs, unapproved external icon packages, or raw SVG files unless explicitly approved for brand assets (e.g., the official academy crest).
* All icons are imported directly as React components using named imports to ensure clean tree-shaking:
  ```typescript
  import { BookOpen, Calendar, GraduationCap } from 'lucide-react';
  ```

---

## 3. Sizing, Strokes, & Alignment Matrix

To ensure visual harmony across layouts, icons are strictly mapped to our standardized size scale. Developers must use these sizing tokens rather than hardcoding custom pixel dimensions:

| Sizing Token | Width & Height | Stroke Weight | Intended UI Location & Context |
| :--- | :--- | :--- | :--- |
| **Icon Extra Small (XS)** | `14px` (`w-3.5 h-3.5`) | `2.25px` | Compact info badges, status labels, inline lists |
| **Icon Small (SM)** | `16px` (`w-4 h-4`) | `2.0px` | Standard buttons (leading/trailing), lists, forms |
| **Icon Medium (MD)** | `20px` (`w-5 h-5`) | `1.75px` | Standard portal cards, dashboard grid headers |
| **Icon Large (LG)** | `24px` (`w-6 h-6`) | `1.5px` | Main topbar actions, card hero summaries |
| **Icon Extra Large (XL)**| `32px` (`w-8 h-8`) | `1.5px` | Large empty state cards, success dialog displays |

---

## 4. Theme-Specific Color Mappings

Icons must adapt cleanly across our Daylight, Obsidian, and Midnight themes, using high-contrast colors to ensure legibility:

### A. Daylight Theme (Light Mode)
* **Primary Actions / Active States**: `text-[#059669]` (Emerald Green brand color)
* **Default Content Icons**: `text-[#3D5C51]` (Highly readable green-slate secondary)
* **Muted / Decorative Icons**: `text-[#67827A]` (Soft grey-green slate tertiary)

### B. Obsidian Theme (Default Dark Mode)
* **Primary Actions / Active States**: `text-[#10B981]` (Vibrant emerald accent)
* **Default Content Icons**: `text-[#9DBDB1]` (Light green-slate secondary)
* **Muted / Decorative Icons**: `text-[#6E9589]` (Deep green-slate tertiary)

### C. Midnight Theme (OLED Black Mode)
* **Primary Actions / Active States**: `text-[#34F5C5]` (High-contrast bright mint)
* **Default Content Icons**: `text-[#B3B3B3]` (Soft light grey-slate)
* **Muted / Decorative Icons**: `text-[#808080]` (Deep grey tertiary)

---

## 5. Semantic Icon Library & Mappings

Icons are grouped into semantic categories to maintain consistency across different pages and layouts:

### A. Academic & Progress Icons
Used to represent academic content, courses, grades, and classrooms:
* `GraduationCap`: Academic programs, courses, and syllabus.
* `BookOpen`: Homework assignments, curriculum, and reading material.
* `Award`: Exam results, merit honors, and student accomplishments.
* `Clock`: Timetables, period structures, and academic calendars.

### B. Administrative & Security Icons
Used for school management, records, and billing:
* `Users`: Student registries, guardian contacts, and teacher lists.
* `CreditCard`: Fee collections, billing histories, and transaction ledgers.
* `FolderOpen`: Document uploads, admissions applications, and student records.
* `ShieldCheck`: Privacy settings, security policies, and administrative audit logs.

### C. Platform & Navigation Icons
Used for general platform interactions and menu layouts:
* `Home`: Dashboard portals and landing homepages.
* `Bell`: System notifications, announcement boards, and unread alerts.
* `Search`: Global database search and filters.
* `Settings`: User profile configuration, portal setups, and preferences.

---

## 6. Icon Animations & Micro-interactions

NDS utilizes subtle, physics-based micro-animations on hover and active click states to make interactions feel responsive and engaging.

### A. Micro-interaction Specifications
1. **Interactive Hover Lift**: Icons translate upward by `1px` or `2px` (`translate-y-[-2px]`) over `100ms` using standard ease transitions.
2. **Spring Rotations**: Navigation toggles or arrows rotate slightly (`rotate-90` or `rotate-180`) using spring dynamics when expanded.
3. **Pulsing Status Indicators**: Inactive alerts or sync indicators pulse gently (`animate-pulse`) to guide focus without disrupting page layout.

### B. Framer Motion Integration Spec (React)
```tsx
import React from 'react';
import { motion } from 'motion/react';
import { Settings } from 'lucide-react';

export const AnimatedSettingsIcon = () => {
  return (
    <motion.div
      whileHover={{ rotate: 45, scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="cursor-pointer p-2 rounded-lg hover:bg-surface-overlay"
    >
      <Settings className="w-5 h-5 text-current" />
    </motion.div>
  );
};
```

---

## 7. Accessibility Checklist (WCAG 2.2 Level AA)

1. **Explicit Role Assignment**: Decorative icons that do not trigger actions must include the `aria-hidden="true"` attribute. This prevents screen readers from announcing them unnecessarily:
   ```html
   <GraduationCap className="w-5 h-5" aria-hidden="true" />
   ```
2. **Accessible Labels for Icon-Only Buttons**: Buttons containing only an icon must include an explicit, clear `aria-label` or be wrapped with a visually hidden text label:
   ```html
   <button type="button" aria-label="Edit student profile">
     <Edit className="w-4 h-4" aria-hidden="true" />
   </button>
   ```
3. **Contrast Compliance**: Icons serving as active interactive elements or important indicators must maintain a contrast ratio of at least **4.5:1** against the background.
4. **Touch Target Boundaries**: When used as buttons, the clickable area around icons must expand to at least **44px by 44px** on touch screens, regardless of the icon's visual size.

---

## 8. TypeScript / React Icon Wrapper Blueprint

The following blueprint outlines the structure of our primary custom `Icon` wrapper component used to standardize styles across the platform:

```tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconWrapperProps {
  icon: LucideIcon;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'muted' | 'accent';
  className?: string;
  ariaLabel?: string;
}

export const Icon: React.FC<IconWrapperProps> = ({
  icon: LucideIconComponent,
  size = 'md',
  variant = 'secondary',
  className = '',
  ariaLabel,
}) => {
  const sizeClasses = {
    xs: 'w-3.5 h-3.5 stroke-[2.25]',
    sm: 'w-4 h-4 stroke-[2.0]',
    md: 'w-5 h-5 stroke-[1.75]',
    lg: 'w-6 h-6 stroke-[1.5]',
    xl: 'w-8 h-8 stroke-[1.5]',
  }[size];

  const variantClasses = {
    primary: 'text-primary',
    secondary: 'text-content-secondary',
    muted: 'text-content-tertiary',
    accent: 'text-accent',
  }[variant];

  return (
    <LucideIconComponent
      className={`${sizeClasses} ${variantClasses} ${className}`}
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
    />
  );
};
```
