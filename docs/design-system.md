# Hazrat Aisha Academy - Design System

This document consolidates all design tokens, components, and guidelines into a single source of truth.

## 1. Branding & Theme
- **Primary Color**: Teal (#34f5c5)
- **Backgrounds**: Slate Gray (#1e293b)
- **Typography**: 'Inter' for UI, 'Space Grotesk' for display/headings.

## 2. Colors
- **Primary**: `bg-primary`, `text-primary`
- **Secondary**: `bg-secondary`, `text-secondary`
- **Danger**: `bg-danger`, `text-danger`
- **Success**: `bg-success`, `text-success`

## 3. Typography
- **H1-H6**: Space Grotesk, bold, tight tracking.
- **Body**: Inter, normal weight, relaxed line height.
- **Mono**: JetBrains Mono for technical data.

## 4. Components
- **Buttons**: Rounded corners (`rounded-md`), distinct hover states (`hover:bg-primary/90`), active scaling (`active:scale-95`).
- **Cards**: Clean borders (`border-border`), subtle shadows (`shadow-sm`), white/dark backgrounds.
- **Forms**: Label above input, consistent padding (`px-3 py-2`), clear focus rings (`focus:ring-2 focus:ring-primary`).
- **Icons**: Lucide React icons, standard size `w-5 h-5`, `w-4 h-4` for dense UI.

## 5. Motion & Micro-interactions
- **Transitions**: Fast and subtle (`transition-all duration-200 ease-in-out`).
- **Hover**: Slight lift or color shift.
- **Loading**: Skeleton screens for content, spinners for buttons.

## 6. Accessibility & Responsive
- **Contrast**: Ensure WCAG AA compliance (4.5:1 for normal text).
- **Focus**: Visible focus rings for keyboard navigation.
- **Breakpoints**: Tailwind defaults (`sm`, `md`, `lg`, `xl`, `2xl`). Mobile-first approach.
