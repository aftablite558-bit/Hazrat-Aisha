# Noor Design System — Official Data Table & Grid Specification
## Hazrat Aisha Academy

This design specification outlines the architectural guidelines, layout structures, cell formats, interactive states, responsive behaviors, and accessibility rules for **Data Tables & Grids** in the Noor Design System (NDS). Tables are critical components of the Hazrat Aisha Academy platform, serving as the primary way teachers, administrators, and parents monitor student grades, fee records, attendance logs, and notice board histories.

---

## 1. Table Philosophy & Design Standards

### A. Core Philosophy
Tables represent academic precision and structural order. In NDS, table design is guided by these principles:
* **Academic Integrity**: Large datasets must be structured to ensure instantly readable, scannable hierarchies. Information density is carefully balanced; rows should never feel crowded.
* **Typographic Consistency**: Standard labels and names are styled in our highly legible body font (`--font-body`), while numbers, grades, dates, and financial amounts are styled in our monospaced font (`--font-mono`) to ensure accurate vertical column alignment.
* **Architectural Honesty (Anti-AI-Slop)**: Avoid unnecessary telemetry lines, status grids, or borders in margins. Focus purely on clean cell dividers and high-contrast typography.

### B. HTML5 Semantic Standards
NDS strictly enforces standard HTML5 table structures. Div-based table representations are forbidden unless virtualization requires it. All tables must use:
* `<table>`: The wrapper block enclosing all related cells.
* `<caption>`: An explicit header describing the table's purpose for screen readers.
* `<thead>` and `<tbody>`: Separate structural sections for header titles and body cell data.
* `<tfoot>`: Used for sums, financial totals, or summary columns.
* `<th>` with a `scope="col"` or `scope="row"` attribute: Establishes natural semantic relationships for screen reader workflows.

```html
<!-- Semantic NDS layout blueprint -->
<table class="table-token" aria-describedby="attendance-caption">
  <caption id="attendance-caption" class="sr-only">Grade 10A Monthly Attendance Records</caption>
  <thead>
    <tr>
      <th scope="col">Student Name</th>
      <th scope="col">Roll Number</th>
      <th scope="col">Attendance Rate</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Zainab Fatima</th>
      <td><span class="font-mono">1024</span></td>
      <td><span class="font-mono">98%</span></td>
      <td><span class="badge badge-success">Present</span></td>
    </tr>
  </tbody>
</table>
```

---

## 2. Table Types & Functional Specifications

### A. Student & Teacher Roster Tables
Used by administrators to manage rosters, view personal information, track profiles, and access contacts.
* **Cell Types Included**: Avatar pictures, text names, monospaced ID tokens, phone links, and actions buttons.
* **Functional Requirements**: Sort by Name, filter by Section/Grade, and support bulk selection for announcements.

### B. Fee Collection Tables
Displays payment history, monthly dues, discount brackets, and payment receipts.
* **Cell Types Included**: Transation IDs (`--font-mono`), date tokens, currency symbols, and success/warning status badges.
* **Summary Row**: `<tfoot>` displaying total amount due, total collected, and outstanding balances.

### C. Exam Results Portal Table
Displays subject names, maximum grades, grades scored, percentages, and grade classifications.
* **Cell Types Included**: Subject tags, scores, percentage meters (`--font-mono`), letter grades (A+, B), and final remarks.
* **Interactive Element**: Supports direct editing input fields for teachers within the portal cells.

### D. Activity & Security Logs
Administrative audit logs showing logins, file downloads, system edits, and portal events.
* **Cell Types Included**: Precise timestamps (`--font-mono`), security event tags, IP addresses, and user roles.

---

## 3. Table Structure & Sizing Tokens

To prevent design inconsistencies, tables must utilize the following design tokens:

### A. Spacing & Density Scale
NDS supports three density configurations based on the size and complexity of the dataset:

| Density Mode | Row Height | Cell Padding (Y) | Cell Padding (X) | Best Suited For |
| :--- | :--- | :--- | :--- | :--- |
| **Comfortable** | `64px` | `16px` (`1rem`) | `24px` (`1.5rem`) | Public pages, list views, notice board entries |
| **Standard** | `52px` | `12px` (`0.75rem`) | `16px` (`1rem`) | Default portal lists, grade summaries, roster tables |
| **Compact** | `44px` | `8px` (`0.5rem`) | `12px` (`0.75rem`) | Dense financial reports, system audit logs |

### B. Color Mapping Tokens
* **Table Header Background (`thead`)**:
  * Daylight: `bg-[#F0F5F2]` | Obsidian: `bg-[#12241D]` | Midnight: `bg-[#121212]`
* **Alternate Row Striping (`tbody tr:nth-child(even)`)**:
  * Daylight: `bg-[#F7FAF8]/60` | Obsidian: `bg-[#0A1512]/40` | Midnight: `bg-[#0A0A0A]/40`
* **Border Line Divider**:
  * Daylight: `border-[#DCE7E1]` | Obsidian: `border-[#1E3A2F]` | Midnight: `border-[#262626]`

---

## 4. Column Sizing, Alignment, & Layout Controls

To maintain clean and readable columns, tables must adhere to these alignment rules:

1. **Text Content**: Left-aligned (`text-left`) for names, descriptions, categories, and categories.
2. **Numeric Content**: Right-aligned (`text-right`) for scores, financial balances, percentages, and currencies. This aligns decimal places vertically for fast scanning.
3. **Status Tags**: Centered (`text-center`) for badges, switches, and action buttons.
4. **Column Width Constraints**:
   * Fixed widths should be declared on non-fluid cells (e.g. checkbox column: `w-12`, date column: `w-32`, action column: `w-24`).
   * Main text columns (like Student Name or Notice Title) must remain fluid, flexing to occupy remaining space.

---

## 5. Table Cell Types

Cells present content using structured semantic elements:

### A. Standard Text Cell
* **Typography**: Styled in `--font-body` with medium weight: `text-sm font-semibold text-content`.

### B. Numeric & Financial Cell
* **Typography**: Styled in `--font-mono` to ensure tabular digit alignment: `text-sm font-medium text-content-secondary`.
* **Currency Formatting**: Always includes the Rupee symbol (₹) or standard ISO codes (INR).

### C. Status Badge Cell
* **Aesthetics**: Compact, pill-shaped tags with clear category backgrounds:
  * *Present / Paid*: `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`
  * *Absent / Unpaid*: `bg-red-500/10 text-red-400 border border-red-500/20`
  * *Late / Pending*: `bg-amber-500/10 text-amber-400 border border-amber-500/20`

### D. Action Buttons Cell
* **Aesthetics**: A horizontal row of compact icon buttons (`p-1.5 hover:bg-surface-overlay rounded-lg`). Must declare explicit, screen-reader-safe `aria-labels`.

---

## 6. Table Interactive States

Tables must provide smooth, real-time feedback across all interaction states:

1. **Default Row State**: Displays the default text, clean dividers, and background colors.
2. **Hover Row State**: Over `100ms` (`duration-instant`), the row background shifts slightly to `bg-surface-raised/40` to highlight the selected entry.
3. **Selected Row State**: Highlights the selected row with a quiet brand background overlay (`bg-primary/5`) and a solid left boundary accent.
4. **Focus Highlight State**: Keyboard tab navigation highlights active actions and cells immediately using our double focus ring indicator.
5. **Disabled State**: Reduces cell opacity to `40%`, disabling all pointers and click transitions.

---

## 7. Interactive Table Features

* **Interactive Sorting**: Columns featuring sort rules must include interactive arrow icon indicator tags (`arrow-up` or `arrow-down`), showing active sorting direction.
* **Bulk Action Selection**: Includes an interactive checkbox in the header column. Selecting it highlights all list items, revealing a floating, raised bottom menu for bulk updates (e.g. `Delete selected students`, `Print invoices`).
* **Interactive Pagination Rails**: Placed directly below the table container, housing direct links, items-per-page selectors, and navigation arrows (`Previous` and `Next`).

---

## 8. Responsive Fallbacks for Mobile Views

Tables can easily break on narrow screens. NDS enforces three responsive fallback options:

### A. Native Horizontal Scrolling (Standard Portal Tables)
For standard portal tables with 5–8 columns:
* **Implementation**: Wraps the table block inside an overflow container (`overflow-x-auto scrollbar-thin`).
* **Visual Hint**: Adds a subtle fade overlay at the right boundary to signal that content scroll is available.

### B. Column Prioritization (Roster Summary Tables)
For directories and rosters:
* **Implementation**: Hide secondary details on mobile while keeping primary cells visible:
  * Student Name (Always visible: `table-cell`)
  * Roll Number (Visible on mobile: `table-cell`)
  * Guardian Contact (Hidden on mobile, visible on desktop: `hidden md:table-cell`)
  * Email / Address (Hidden on mobile/tablet: `hidden lg:table-cell`)

### C. Stacked Cards Layout (Complex Mobile Lists)
For dense, complex portals (such as detailed fee payments or results cards) on mobile screens (`sm:` and smaller):
* **Implementation**: Hide the tabular frame entirely (`hidden md:table`), displaying each row as a standalone visual card (`block md:hidden`).
* **Aesthetics**: Cell labels convert to bold left tags, and cell data aligns to the right side of the card.

---

## 9. Accessibility Checklist (WCAG 2.2 Level AA)

1. **Explicit Caption Fields**: Tables must declare a native `<caption>` element. This caption can be visually hidden (`sr-only`), but must remain readable by screen readers.
2. **Header Connections**: Header cells must declare the `scope="col"` attribute, and row headers must declare the `scope="row"` attribute.
3. **Interactive Label Verification**: Columns with sorting or selecting rules must include descriptive labels explaining their interactive states (e.g., `aria-label="Sort by Student Name, ascending"`).
4. **Contrast Target Compliance**: Text and badges in cells must maintain a contrast ratio of at least **4.5:1** against the row's background.
5. **No Color-Only Information**: Do not convey status updates or alerts through colors alone. Pair status badges with explicit text labels.

---

## 10. Performance Budget Guidelines for Large Datasets

To ensure fast rendering speeds and prevent input delay, developers must apply these performance guidelines when handling large student datasets (over 200 rows):

1. **Client-Side Virtualization**: For continuous list viewing (like audit logs or active registries), use standard row virtualization libraries (e.g. `react-window` or `tanstack-virtual`) to render only the visible viewport rows.
2. **Memoized Rows**: Wrap row render templates in React's `memo` wrapper, preventing heavy repaint cycles on unrelated search inputs or form edits.
3. **Debounced Filters**: Global table search bars must include a debounce delay of **250ms** before triggering server-side filtering, preventing performance bottlenecks.
