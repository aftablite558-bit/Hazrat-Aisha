# Noor Design System — Official Typography Specification
## Hazrat Aisha Academy

This design specification outlines the exhaustive typographic architecture, hierarchy rules, and responsive scaling models for the **Hazrat Aisha Academy** digital infrastructure. Typographic styling across all portals must adhere strictly to these semantic definitions to ensure professional legibility, aesthetic intent, and WCAG AA accessibility compliance.

---

## 1. Typography Philosophy: "The Written Word"

Typographic pairing is a critical element of the **Noor Design System (NDS)**. It is structured around the harmonious integration of two distinct intellectual worlds:
1. **The Academic Intellect (Rational & Modern)**: Represented by **Sora** and **Inter**. These fonts provide geometrical precision, exceptional readability on high-density displays, and a clean technological feel that conveys modern academic standards.
2. **The Spiritual Heritage (Authentic & Traditional)**: Represented by **Amiri** and **Noto Nastaliq Urdu**. These classical serif and cursive script fonts introduce classical editorial gravity, spiritual reverence, and accurate rendering of scriptural extracts, moral mottos, and Arabic literary quotes.

---

## 2. Global Font Stacks & Google Fonts Configuration

### A. Google Fonts CDN Link Strategy
To optimize font delivery and prevent layout shifts during page loads, the following preconnect links must be injected into the `<head>` of the `index.html` file before any stylesheets:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;700&family=Sora:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

### B. Font Stack Definitions

The NDS declares five dedicated font family variables mapped to robust system fallbacks:

```css
:root {
  /* 1. Display & Headings: Sora (Geometrical Sans) */
  --font-display: "Sora", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  /* 2. Body Copy & General UI: Inter (Clean Neo-Grotesque) */
  --font-body: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  /* 3. Metrics, Codes & Financials: JetBrains Mono (High-density tabular monospaced) */
  --font-mono: "JetBrains Mono", "Fira Code", "Courier New", Courier, monospace;

  /* 4. Scripture & Classical Literature: Amiri (Traditional Naskh script) */
  --font-arabic: "Amiri", "Georgia", "Times New Roman", Times, serif;

  /* 5. Islamic Studies & Notices: Noto Nastaliq Urdu (Classic Persian-Arabic cursive calligraphy) */
  --font-urdu: "Noto Nastaliq Urdu", "Amiri", "Georgia", Times, serif;
}
```

---

## 3. Font Size Scale & Responsive Scaling System

To maintain proportional breathing room and scale elegantly from mobile screens to ultra-wide displays, NDS adopts a strict semantic scale. 

### A. Core Font Size Matrix

| Token Name | Rem Value | Pixel Value (16px base) | Default Line-Height | Default Letter-Spacing (Tracking) | Suggested Core Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `font-xs` | `0.75rem` | `12px` | `1rem` (1.33) | `0.025em` (wide) | Captions, labels, table metadata, form helpers |
| `font-sm` | `0.875rem` | `14px` | `1.25rem` (1.42) | `0.015em` | Default UI body copy, input forms, button labels |
| `font-base` | `1rem` | `16px` | `1.5rem` (1.50) | `0` (normal) | Rich informational articles, main descriptions |
| `font-lg` | `1.125rem` | `18px` | `1.75rem` (1.55) | `-0.01em` | Accordion headers, notices descriptions, small subtitles |
| `font-xl` | `1.25rem` | `20px` | `1.875rem` (1.50) | `-0.015em` | Metric card counters, card headers, popup titles |
| `font-2xl` | `1.5rem` | `24px` | `2rem` (1.33) | `-0.02em` | Section block titles, modal action headers |
| `font-3xl` | `1.875rem` | `30px` | `2.25rem` (1.20) | `-0.025em` (tight) | General page H2 section headings |
| `font-4xl` | `2.25rem` | `36px` | `2.5rem` (1.11) | `-0.03em` | Feature welcome headings, portal login title blocks |
| `font-5xl` | `3rem` | `48px` | `1` (solid) | `-0.035em` | Main dashboard welcome hero banners |
| `font-6xl` | `3.75rem` | `60px` | `1` (solid) | `-0.04em` | Core landing page hero titles (Mobile/Tablet) |
| `font-7xl` | `4.5rem` | `72px` | `1` (solid) | `-0.045em` (ultra-tight) | Landing page main display titles (Large Desktop) |

### B. Fluid Typography Scaling Rules
For display headers, NDS recommends utilizing native CSS `clamp()` bounds to prevent visual breakages or overlapping sentences on responsive container width resizes:

```css
/* Fluid Title Scale: Clamps font size smoothly based on display viewport width */
.fluid-hero-title {
  font-size: clamp(2.25rem, 5vw + 1rem, 4.5rem);
  line-height: 1.05;
}
.fluid-section-heading {
  font-size: clamp(1.5rem, 3vw + 0.5rem, 2.5rem);
  line-height: 1.15;
}
```

---

## 4. Font Weight & Styling Tokens

NDS uses distinct weight layers to structure layout importance without cluttering the screen with unnecessary lines or dividers.

* `font-light` (`300`): Used for large display labels to create an elegant, light-weight look.
* `font-normal` (`400`): Used for all body copies, descriptions, lists, and table data.
* `font-medium` (`500`): Used for input placeholder labels, system status indicators, and secondary navigation tabs.
* `font-semibold` (`600`): Used for default button texts, metadata labels, and regular cards.
* `font-bold` (`700`): Used for section headers, dashboard KPI metrics, and table column titles.
* `font-extrabold` (`800`): Used for page titles, modal titles, and card headers.
* `font-black` (`900`): Used for hero banners, brand marks, and large call-out numbers.

---

## 5. HTML5 Semantic Heading Rules & Hierarchy (H1–H6)

NDS enforces a semantic heading tree to protect screen reader accessibility. Headings must never be selected based on visual size alone; visual styling must be controlled through CSS classes.

```css
/* H1: Primary Page Header (Only one permitted per view) */
h1, .text-h1 {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: var(--font-4xl);
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  text-transform: uppercase;
}

/* H2: Layout Section Boundary */
h2, .text-h2 {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: var(--font-3xl);
  line-height: 1.2;
  letter-spacing: -0.025em;
  color: var(--text-primary);
}

/* H3: Standard Card & Module Header */
h3, .text-h3 {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--font-xl);
  line-height: 1.3;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

/* H4: Sub-Card Blocks & Detail Items */
h4, .text-h4 {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--font-lg);
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}

/* H5: Metric Labels & Table Group Headers */
h5, .text-h5 {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--font-sm);
  line-height: 1.4;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

/* H6: Small Captions & Overlines */
h6, .text-h6 {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: var(--font-xs);
  line-height: 1.5;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-tertiary);
}
```

---

## 6. Context-Specific Typography Specifications

### A. Data Tables (Report Cards, Fee Records, Attendance Lists)
* **Table Headers (`<th>`)**: Must be styled in `font-display font-bold text-xs uppercase tracking-wider text-content-tertiary`. Left-aligned for labels, right-aligned for financial amounts.
* **Text Fields (`<td>` for names/categories)**: `font-body font-semibold text-sm text-content-secondary`.
* **Numeric Fields (`<td>` for scores, fees, totals)**: Must use `font-mono text-sm text-content font-medium`. This guarantees accurate vertical digit alignment for easy reading.

### B. Input Forms
* **Input Labels**: `font-body font-bold text-xs text-content uppercase tracking-wider mb-2 block`.
* **Input Text Input**: `font-body font-medium text-sm text-content`.
* **Placeholder Text**: `font-body font-medium text-sm text-content-tertiary`.
* **Error Text**: `font-body font-semibold text-xs text-red-500 mt-1.5 flex items-center`.
* **Helper Text**: `font-body font-medium text-xs text-content-tertiary mt-1.5`.

### C. Buttons
* **Standard Button**: `font-display font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl`. High letter-spacing creates a premium, professional action button.

### D. Navigation, Sidebars & Footers
* **Sticky Header Navbar Links**: `font-display font-extrabold text-xs uppercase tracking-wider text-content-secondary hover:text-primary transition-colors`.
* **Active Sidebar Elements**: `font-display font-black text-sm text-primary`.
* **Footer Navigation Lists**: `font-body font-semibold text-sm text-content-secondary hover:text-primary`.

### E. Blockquotes & Quranic Translations
* **Authentic Arabic text**: `font-arabic text-2xl leading-loose text-primary text-center my-6`.
* **Translation**: `font-body italic text-sm text-content-secondary max-w-prose mx-auto text-center leading-relaxed`.

---

## 7. PDF & Print Media Typographic Styles

For official printed report cards, certificates, and invoices, NDS enforces a high-density, professional print layout:

```css
@media print {
  body {
    font-family: "Georgia", "Times New Roman", Times, serif !important;
    font-size: 11pt !important;
    line-height: 1.4 !important;
    color: #000000 !important;
  }
  h1, h2, h3, h4 {
    font-family: "Georgia", serif !important;
    font-weight: bold !important;
    color: #000000 !important;
    page-break-after: avoid;
  }
  .print-mono {
    font-family: "Courier New", Courier, monospace !important;
    font-size: 10pt !important;
  }
}
```

---

## 8. Typography Accessibility & WCAG 2.2 AA Compliance

NDS ensures everyone can comfortably read our platforms by enforcing these strict accessibility rules:

1. **Contrast Ratio**: Main body copies must maintain a contrast ratio of at least **4.5:1** against the background. Bold headers (18pt/24px+) must sustain at least **3.0:1**.
2. **Text Alignment**: Standard content paragraphs must **never be justified**. Justified text is highly discouraged for readers with cognitive processing challenges; instead, use left-aligned layouts.
3. **Line Length Limits**: To maintain a comfortable reading rhythm, text blocks should be clamped to a maximum width of 80 characters per line (e.g. using Tailwind's `max-w-prose` or `max-w-3xl`).
4. **Cursive Font Safety**: Cursive styled fonts (like `Noto Nastaliq Urdu` or custom scripts) are permitted *only* for quotes, translations, or subtitles. They must never be used for primary menus, forms, or data tables.
5. **No Visual All-Caps for Screen Readers**: Important visual capitalize formatting should use CSS `uppercase` rather than hardcoding capital text. This ensures screen readers read words naturally rather than reading them letter-by-letter as acronyms.
