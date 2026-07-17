# Noor Design System — Official Branding & Visual Identity Specification
## Hazrat Aisha Academy

This design specification outlines the foundational branding philosophies, visual identity guidelines, logo usages, color standards, typography pairings, imagery styles, and platform application rules for **Hazrat Aisha Academy** in Sitamarhi, Bihar. This guide ensures a highly polished, unified, and professional presentation across our public websites, admissions forms, student-parent portals, administrative dashboards, and physical academic prints.

---

## 1. Production UI Status Checklist

The table below outlines the brand integration status of the academy's digital ecosystem:

| Visual Asset / Subsystem | Implementation Status | Verification Details |
| :--- | :--- | :--- |
| **Primary Color Scheme (Emerald & Gold)** | **VERIFIED** | Theme configurations are fully active across Daylight, Obsidian, and Midnight. |
| **Font Sizing & Families** | **VERIFIED** | Inter, Sora, and JetBrains Mono typographic scales compile cleanly. |
| **Lucide Icon Integration** | **VERIFIED** | Icons are standardized at consistent strokes and responsive dimensions. |
| **Responsive Portal Branding** | **VERIFIED** | Platform headers, sidebars, and layouts align with NDS specifications. |
| **Urdu / Arabic Type Rendering** | **NOT VERIFIED** | Right-to-Left (RTL) custom web-font integration is not verified. |
| **Official Vector Logo & Crest** | **NOT VERIFIED** | High-resolution scalable vector asset paths are not fully verified. |
| **PDF Print & Report Styling** | **NOT VERIFIED** | Print-safe high-contrast brand layouts for receipts and grade sheets are not verified. |

---

## 2. Brand Philosophy & Identity

Hazrat Aisha Academy is an institutional beacon of modern academic rigor combined with authentic Islamic values. Our visual identity balances academic excellence, modern technology, and historical Islamic heritage with quiet, professional dignity.

```
                  +-----------------------------------+
                  |      HAZRAT AISHA ACADEMY         |
                  |     - Educational Excellence -    |
                  +-----------------------------------+
                                    |
          +-------------------------+-------------------------+
          |                                                   |
+-------------------+                               +-------------------+
| ISLAMIC HERITAGE  |                               | MODERN ACADEMICS  |
| - Emerald Green   |                               | - Sora Display    |
| - Classic Gold    |                               | - Inter Sans      |
| - Balanced Geometry|                              | - Clean Grids     |
+-------------------+                               +-------------------+
```

### A. Mission & Vision
* **Mission**: To cultivate outstanding academic achievement, critical thinking, and exemplary character in a safe, inspiring environment that integrates CBSE modern learning with the timeless moral teachings of Islam.
* **Vision**: To prepare the next generation of leadership—grounded in faith, rich in knowledge, and skilled in modern technology—to positively impact their families, community, and the world.

### B. Core Values
1. **Academic Excellence (Ilm)**: Designing modern, rigorous curricula utilizing active technology and collaborative environments.
2. **Moral Character (Akhlaq)**: Instilling a deep love for truth, compassion, respect, and self-discipline inspired by the teachings of the Prophet Muhammad (PBUH).
3. **Inclusive Community (Ukhuwwah)**: Creating an open, welcoming school family where every parent, student, and teacher is supported.
4. **Stewardship & Service (Khidmah)**: Inspiring students to serve their local community in Sitamarhi and the wider society with humility and purpose.

### C. Brand Personality & Tone of Voice
* **Aesthetic Tone**: Clean, calm, structured, and intellectual. We strictly avoid flashy neon colors, chaotic marketing banners, or noisy status logs (Anti-AI-Slop). We favor spacious layouts, elegant typography, and rich emerald green tones.
* **Tone of Voice**:
  * *Authoritative yet Warm*: Communicating academic guidance and administrative standards with professional clarity and gentle respect.
  * *Humble and Sincere*: Avoiding boastful marketing jargon or sales-pitch phrases. We speak objectively, celebrating our community's effort and scholastic focus.
  * *Multilingual Awareness*: Presenting English alongside respectful integrations of Urdu and Arabic scripts to support our diverse families.

---

## 3. Logo Guidelines & Visual Assets

Our logo is the primary seal of our academy, representing knowledge, guidance, and faith.

### A. Primary Logo (Visual Seal)
* **Structure**: A beautiful, circular geometric crest.
  * *Central Elements*: An open book representing the Quran and academic study, set below a glowing crescent moon and star of guidance.
  * *Surrounding Text*: "Hazrat Aisha Academy" in elegant serif display lettering, with "Sitamarhi, Bihar" wrapped along the bottom arch.
  * *Establishment Date*: Est. 2026 / 1447H, commemorating our modern founding.
* **Colors**: Styled in deep Emerald Green and rich Classic Gold against a clean white or dark surface.

### B. Secondary Horizontal Logo (The Banner Seal)
* Used in navigation bars, letterheads, and portal headers:
  * Pairs the visual circular seal on the left with our official display typography on the right: "Hazrat Aisha Academy" in bold Sora font, with a compact secondary tagline: "Scholastic Excellence & Moral Integrity."

### C. Logo Safe Area & Sizing
* **Safe Area (Clear Margin)**: To prevent visual crowding, the logo must maintain a minimum clear space surrounding it equal to **50%** of the logo's height (`0.5h` border buffer). No text, borders, or images may enter this safe boundary.
* **Minimum Sizing**:
  * *Digital Viewports*: The logo must never be rendered smaller than `32px` in height to ensure text readability.
  * *Print Media*: The logo must be at least `1.0 inch` (`25.4mm`) in diameter on paper reports or receipts.

### D. Incorrect Usage Rules
To protect brand integrity, developers are strictly forbidden from modifying or distorting the logo:
* **No Color Shifting**: Never render the logo in unapproved bright colors, gradients, or default system purples.
* **No Distortion**: Never stretch, warp, compress, or rotate the logo file.
* **No Border Clutter**: Never enclose the logo in heavy square outlines or dark block shapes that crowd the visual seal.

---

## 4. Color Identity & Palette Specifications

Colors are the primary emotional voice of Hazrat Aisha Academy, establishing a calm, eye-safe environment across all portals.

### A. Core Color Swatches
To prevent visual drift, developers must map styles to our official NDS tokens (refer to `colors.md` and `theme.md`):

| Color Name | Color Hex | CSS Variable | Intended Semantic Usage |
| :--- | :--- | :--- | :--- |
| **Deep Al-Masjid Emerald** | `#056B4D` | `--color-emerald-deep` | Classic branding accents, primary logo color, buttons |
| **Noor Classic Gold** | `#B8912F` | `--color-gold-noor` | Accent borders, gold checkboxes, status awards |
| **Daylight Pure White** | `#FFFFFF` | `--bg-daylight` | Main background for light theme portal pages |
| **Obsidian Deep Slate** | `#0A1512` | `--bg-obsidian` | Default dark theme background for portals |
| **Midnight OLED Black** | `#000000` | `--bg-midnight` | True black background for energy-saving viewports |

### B. Usage Ratio Rule (The 60-30-10 Principle)
To maintain visual balance across templates, colors are applied using structured ratios:
* **60% Primary Canvas**: Soft neutral backdrops (`#FFFFFF` in light, `#0A1512` in dark) to provide abundant negative space.
* **30% Secondary Elements**: Elegant deep green-slate text and borders (`#056B4D` or `#1E3A2F`) to build structure.
* **10% Bright Accent**: Gold highlight marks (`#B8912F`) used strictly on key elements (e.g., gold stars for required inputs, active tab borders, or award badges).

---

## 5. Typography Standards

Typography forms the intellectual core of our design system, pairing modern structural clarity with traditional display elegance.

### A. Font Families & Roles
* **Display Fonts (Headings & Titles)**: **Sora** (sans-serif) or **Playfair Display** (serif).
  * *Vibe*: Tech-forward yet academic, utilizing elegant geometric proportions and tight tracking.
* **Body Fonts (General Text & Forms)**: **Inter** (sans-serif).
  * *Vibe*: High-legibility neutral font designed to ensure clean reading on mobile screens.
* **Monospaced Fonts (Metrics & Grades)**: **JetBrains Mono** or **Fira Code**.
  * *Vibe*: Precise and structured. Used strictly for grades, test marks, invoice counts, and timestamps.

### B. Dynamic Font Scale
Typography scales fluidly across desktop and mobile screens to prevent layout breakage (refer to `typography.md` and `responsive.md`). Heading scales use proportional rem values.

---

## 6. Iconography & Imagery Styles

Our visual assets support clear learning, avoiding visual distractions.

### A. Photography Style Guidelines
1. **Authenticity**: Use high-quality, professional photographs of actual Hazrat Aisha Academy students, teachers, and campus life in Sitamarhi. Avoid overly staged stock photos.
2. **Lighting**: Soft, warm, natural lighting that feels clean and approachable. Avoid high-contrast dramatic studio lighting.
3. **Respect and Dignity**: Students and staff must be photographed in neat, professional academy uniforms, representing dignity, pride, and scholastic focus.

### B. Illustration Guidelines
* **Minimal Vector Styling**: Diagrams and visual helpers must use clean, thin-line vector layouts.
* **Color Coordination**: All inline graphics must map strictly to our emerald, gold, and slate color palettes. Multi-color cartoon clip-art is forbidden.

---

## 7. Branding Applications in Digital Portals

Our visual identity adapts seamlessly across our digital portals, providing a clean and professional experience:

```
+---------------------------------------------------------------------------------+
|                                                                                 |
|  [Logo Seal]  HAZRAT AISHA ACADEMY                               [User Profile] |
|  -----------------------------------------------------------------------------  |
|                                                                                 |
|   Academic Dashboard                                      Quick Status:         |
|   +--------------------------+  +--------------------------+  +--------------+  |
|   | Grade Score Average:     |  | Monthly Attendance:      |  | Active Term: |  |
|   |   94.5% (A+)             |  |   98.2% (Excellent)      |  | Term I       |  |
|   +--------------------------+  +--------------------------+  +--------------+  |
|                                                                                 |
|   [Primary Action: Record Grade]  [Secondary Action: Print Report]              |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### A. Public Website
* High-magnification hero sections pairing large display titles with warm photographs of campus classrooms. Includes fluid enrollment call-to-actions styled in Emerald Green.

### B. Parent-Student Portals & Gradebooks
* Clear, easy-to-use lists displaying examination timetables and results tables. Student grades and percentages are styled in bold monospaced typography to highlight achievements cleanly.

### C. Portal Authentication (Login Screen)
* A simple, centered card layout on a clean dark or light background. The visual circular seal sits directly above the secure input fields, providing instant brand trust.

---

## 8. Physical & Print Branding Standards

Digital branding styles translate cleanly to physical prints to ensure institutional consistency:

### A. Official Student Result Sheets
* **Header**: Houses our horizontal banner seal alongside the academy's official contact information, physical address, and CBSE affiliation numbers.
* **Layout Grid**: Uses standard tabular frames with alternated light grey-slate stripes to ensure easy scanning.
* **Footer**: Features explicit, formal signatures from the class teacher and the academy principal.

### B. Fee Collection Receipts
* **Branding**: Displays our primary logo seal in the top-left corner, paired with a monospaced transaction invoice ID in the top-right.
* **Colors**: Styled in high-contrast greyscale to ensure crisp printing on thermal or laser office printers.

---

## 9. Accessibility Safeguards (WCAG 2.2 AA)

NDS ensures all brand assets are inclusive and accessible for our entire community:

1. **Color Contrast Compliance**: Brand color pairings (such as gold text on a green button) must be verified to ensure they achieve at least a **4.5:1** contrast ratio.
2. **Meaningful Image Alt-Texts**: Photos of school classrooms, activities, and faculty must include clear alt-text descriptions to help screen readers navigate pages naturally.
3. **Typography Magnification Support**: All display headings and body text scales must allow up to **400% zoom** reflow without clipping or overlapping content.

---

## 10. TypeScript / React Brand Logo Component

The following blueprint outlines the structure of our official brand `Logo` component:

```tsx
import React from 'react';

interface LogoProps {
  variant?: 'seal' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
}) => {
  const dimensions = {
    sm: { img: 'h-8', text: 'text-sm' },
    md: { img: 'h-11', text: 'text-lg' },
    lg: { img: 'h-16', text: 'text-2xl' },
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Academy Crest Circular Seal */}
      <img
        src="/assets/academy_crest.svg"
        alt="Hazrat Aisha Academy Crest circular seal"
        loading="lazy"
        referrerPolicy="no-referrer"
        className={`${dimensions.img} w-auto object-contain`}
      />
      
      {variant === 'horizontal' && (
        <div className="flex flex-col justify-center">
          <span className={`font-display font-extrabold tracking-tight text-content leading-none ${dimensions.text}`}>
            Hazrat Aisha Academy
          </span>
          <span className="font-sans text-[10px] font-bold text-content-secondary uppercase tracking-widest mt-1">
            Sitamarhi, Bihar
          </span>
        </div>
      )}
    </div>
  );
};
```
