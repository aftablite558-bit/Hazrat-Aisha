# Noor Design System — Official PDF, Print & Document Design Specification
## Hazrat Aisha Academy

This design specification outlines the structural layouts, page setups, typographic hierarchies, color rules, and export behaviors for all **PDF, Print, and Generated Documents** within the Noor Design System (NDS). This standard governs academic printouts, student report cards, fee invoices, certificates, and school records at Hazrat Aisha Academy, Sitamarhi, Bihar.

---

## 1. Production UI Status Checklist

The table below outlines the implementation and testing status of NDS print and PDF layout systems:

| Print / PDF System | Implementation Status | Verification Details |
| :--- | :--- | :--- |
| **CSS Print Media Queries (`@media print`)** | **VERIFIED** | Margins and page break breaks are verified across primary report layouts. |
| **A4 Page Grid Model (Portrait / Landscape)** | **VERIFIED** | Clean grid margins and dynamic footer placements are verified. |
| **High-Contrast Typography Scale** | **VERIFIED** | Inter and Sora print-friendly size configurations are verified. |
| **Academic Results Report Tables** | **VERIFIED** | Standard subject and marks table grids compile without errors. |
| **Grayscale Compliance System** | **VERIFIED** | High-contrast filters and pure-grayscale classes are fully integrated. |
| **Official Crest & Seal Placeholders** | **VERIFIED** | Standard bottom-right alignment seals and signature layouts are verified. |
| **RTL Script Print Rendering (Urdu / Arabic)** | **NOT VERIFIED** | Fine-tuned print alignment for Urdu Nastaliq and Arabic is not verified. |
| **Client-Side PDF Compiler (jsPDF / html2pdf)**| **NOT VERIFIED** | Live multi-page rendering and direct download controllers are not verified. |

---

## 2. Document Design Philosophy

All physical and digital documents exported by Hazrat Aisha Academy represent our academic standards and administrative clarity. NDS enforces these three design pillars for prints:
1. **Academic Authority & Professional Integrity**: Documents must feel official, clean, and beautifully structured. We avoid casual, cluttered decorative frames and complex borders. We favor generous negative space, crisp lines, and centered typography.
2. **Grayscale & Eco-Friendly Design**: Academic environments regularly use monochrome office printers. All documents must remain perfectly legible, high-contrast, and visually balanced when printed on single-color laser or thermal devices.
3. **Inclusive Accessibility (Readability-First)**: Printed body fonts are mapped to highly readable sans-serif formats, keeping numbers and grades aligned with monospaced grids. No information may be conveyed through colors alone.

---

## 3. Supported Document Configurations

NDS structures and standardizes several document types, grouped by their layout and page sizes:

### A. Academic Records & Folders (A4 Portrait)
* **Student Report Cards & Term Results**: Includes subject lists, marks, grades, percentage trends, attendance counts, and teacher remarks.
* **Student Roster & Profiles**: Structured admin printouts displaying biographical data, emergency contacts, and medical approvals.
* **Attendance Analysis Reports**: Charts and tabular rosters tracking classroom attendance trends.

### B. Certificates of Honor & Credentials (A4 Landscape)
* **Transfer Certificates (TC)**: Official school-leaving certificates detailing academic credentials and character records.
* **Bonafide, Character, & Honor Certificates**: Elegant award certificates featuring classic margins, serif heading fonts, and dedicated spaces for signatures.

### C. Billing & Administrative Slips (Compact Sized Prints)
* **Monthly Fee Receipts & Invoices**: Crisp, detailed billing receipts containing invoice IDs, itemized breakdowns, total balances, and payment stamps. Styled in high-contrast layouts for standard laser or local thermal slip printers.

---

## 4. Page Settings, Margins, & Safe Areas

NDS enforces strict layout grids for standard A4 paper dimensions to prevent content from clipping during physical printing:

```
+-----------------------------------------------------------------------------------+
|  HEADER AREA: Academy horizontal crest logo and metadata                          |
|  [Top Margin: 20mm]                                                               |
+-----------------------------------------------------------------------------------+
|  SAFE CONTENT BODY: (Width: 170mm, Height: 237mm)                                 |
|  [Left Margin: 20mm]                                        [Right Margin: 20mm]  |
|                                                                                   |
|  - Student biodata grids                                                          |
|  - Academic score tables                                                          |
|  - Performance chart summaries                                                    |
|                                                                                   |
+-----------------------------------------------------------------------------------+
|  FOOTER AREA: Page count, verification QR codes, and signatures                   |
|  [Bottom Margin: 20mm]                                                            |
+-----------------------------------------------------------------------------------+
```

### A. Page Boundary Parameters
* **Standard Paper Size**: A4 (`210mm x 297mm`)
* **Default Margins**: **20mm** (`0.78 inch`) on all four boundaries. This provides a clean, balanced border while preventing office printer clips.
* **Compact Slip Margins**: **10mm** on all boundaries (specifically for billing slips, student identity cards, and library tags).
* **Print Bleed Safeguard**: All background details or color bars must extend by **3mm** beyond the trim margin to prevent thin white edges during physical paper trims.

### B. Headers & Footers Grid
* **Header Area**: Placed exactly **10mm** from the top edge. Houses the horizontal school logo, administrative contact lines, and CBSE affiliation data.
* **Footer Area**: Placed exactly **10mm** from the bottom edge. Houses dynamic page numbers (e.g., `Page X of Y`), student portal verification URLs, and official signature panels.

---

## 5. Typography Standards for Print Media

Printed text requires higher baseline contrast and specialized font styles compared to digital displays to maintain legibility.

### A. Typography Families
* **Display Titles (Sovereign Headings)**: **Sora** (sans-serif) or **Playfair Display** (serif) with heavy weights (`font-bold` or `font-extrabold`).
* **Informative Content (Main Body)**: **Inter** (sans-serif) to ensure high readability on textured paper.
* **Grades & Financial Balances**: **JetBrains Mono** or **Fira Code** (`font-mono`) to ensure tabular scores and numbers align perfectly in columns.

### B. Urdu & Arabic RTL Alignment
* Right-to-Left scripts must be rendered using standard, print-safe Nastaliq or Naskh web-fonts (`Noto Nastaliq Urdu`).
* RTL text blocks must include explicit layout direction tags (`dir="rtl" text-right font-semibold`) and use slightly larger font sizes (+2pt) to maintain clarity on paper.

---

## 6. Table & Ledger Design for Academic Records

Tables form the primary data layout of our report sheets, fee invoices, and attendance logs:

```css
/* NDS High-Contrast Print-Safe Table Styles */
@media print {
  table {
    width: 100%;
    border-collapse: collapse;
    page-break-inside: avoid; /* Prevents rows from splitting across pages */
  }
  th {
    background-color: #F0F5F2 !important; /* Soft, light emerald-tinted background */
    color: #0B1F18 !important;
    font-weight: bold;
    border: 1px solid #99AFA7 !important;
  }
  td {
    border: 1px solid #C4D3CC !important;
    padding: 8px 12px;
    font-size: 11pt;
  }
}
```

### A. Results & Academic Records Tables
* **Column Sizing**: Subject names are left-aligned and fluid. Score metrics, percentages, and grade letters are right-aligned and styled in monospaced fonts (`font-mono text-right`).
* **Highlights**: Outstanding accomplishments (such as score averages > 90%) are highlighted with clean borders or subtle gray-slate backgrounds, avoiding heavy, ink-heavy fills.

### B. Fee & Ledger Tables
* **Summary Rows**: The total outstanding, paid amounts, and due balances are housed in `<tfoot>` blocks, styled with prominent double bottom borders to signify total sums.

---

## 7. School Branding & Trust Seals

To protect documents from forgery and guarantee authenticity, exports must include verified branding assets:

1. **Official Logo Crest**: High-resolution vector paths (`.svg` or 300 DPI high-quality `.png` files) placed in the top header.
2. **School Identification Lines**:
   * **Line 1**: *HAZRAT AISHA ACADEMY* (Sora bold display, text size 16pt)
   * **Line 2**: *Chak Rajopatti, Sitamarhi, Bihar - 843302* (text size 10pt)
   * **Line 3**: *Affiliated with CBSE New Delhi | Est. 2026* (text size 9pt)
3. **Official Seal Placeholder**: Placed at the bottom-right corner of report sheets and certificates. Consists of a quiet circular border with a bold label: `"OFFICIAL SEAL OF THE PRINCIPAL"`.
4. **School Watermark**: A faint, semi-transparent watermark of our visual crest (`opacity: 0.03` or `3%`) is centered behind the content page body.
5. **Dynamic QR Code Verification**: Placed in the footer. Parents can scan the code to verify report sheet grades or fee invoices against Hazrat Aisha Academy's secure database.

---

## 8. Print-Safe Colors & Grayscale Compatibility

To prevent ink smears and illegible text on black-and-white printers, NDS structures a clean print palette:

### A. Print-Safe Palette Mapping
* **Main Text Copy**: Pure crisp black (`#000000`). Never use light gray typography on printed reports.
* **Lines and Borders**: Dark gray-slate (`#4D665E`) with thin line borders (`0.5pt` or `1px`). Avoid using heavy, dark borders.
* **Alerts and Indicators**: High-contrast icons paired with text descriptors. Avoid relying on green, yellow, or red colors alone.

### B. High-Contrast Contrast Ratios
Text on generated documents must achieve a minimum contrast ratio of **7:1** against the background, complying with WCAG 2.2 Level AAA standards.

---

## 9. Web Page Print Setup (`@media print` Spec)

Our style systems use native CSS variables to automatically clean layout pages for printers:

```css
/* Global NDS Print Layout Cleanup Styles */
@media print {
  /* 1. Hide non-essential layout panels */
  aside, 
  nav, 
  header, 
  button, 
  .theme-switcher, 
  .no-print {
    display: none !important;
  }

  /* 2. Reset layout borders and bounds */
  body {
    background: #FFFFFF !important;
    color: #000000 !important;
    font-size: 11pt;
    line-height: 1.5;
    margin: 0;
    padding: 0;
  }

  /* 3. Force accurate background color prints */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* 4. Page Break Controls */
  .page-break-before {
    page-break-before: always;
  }
}
```

---

## 10. TypeScript / React Print Document Component

The following blueprint outlines our standard React layout wrapper used to generate print-safe academic reports:

```tsx
import React from 'react';

interface PrintDocumentProps {
  title: string;
  documentId: string;
  children: React.ReactNode;
}

export const PrintDocument: React.FC<PrintDocumentProps> = ({
  title,
  documentId,
  children
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-white text-black p-8 max-w-[210mm] min-h-[297mm] mx-auto print:p-0 print:m-0">
      {/* Document Print Header */}
      <header className="flex items-center justify-between border-b-2 border-line pb-4 mb-6">
        <div className="flex items-center gap-4">
          <img
            src="/assets/academy_crest.svg"
            alt="Hazrat Aisha Academy Crest"
            className="w-16 h-16 object-contain"
          />
          <div>
            <h1 className="font-display font-extrabold text-xl text-black leading-tight uppercase">
              Hazrat Aisha Academy
            </h1>
            <p className="font-sans text-xs text-gray-700">
              Chak Rajopatti, Sitamarhi, Bihar - 843302
            </p>
            <p className="font-sans text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
              CBSE Affiliation | Academic Print Portal
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="font-mono text-[10px] font-bold text-gray-500 block">
            DOC-ID: {documentId}
          </span>
          <span className="font-mono text-xs text-black font-semibold block mt-1">
            Print Date: {new Date().toLocaleDateString()}
          </span>
        </div>
      </header>

      {/* Main Print Body */}
      <main id="print-main-content" className="flex-1">
        <h2 className="font-display font-bold text-lg text-center text-black uppercase tracking-wider mb-6">
          {title}
        </h2>
        {children}
      </main>

      {/* Document Print Footer */}
      <footer className="mt-12 pt-4 border-t border-line flex items-end justify-between text-gray-600">
        <div>
          <p className="font-sans text-[10px] leading-relaxed">
            Verify this document securely via: <span className="font-mono">https://hazrataishaacademy.org/verify</span>
          </p>
          <p className="font-sans text-[9px] text-gray-400 mt-1">
            © {currentYear} Hazrat Aisha Academy Sitamarhi. All rights reserved.
          </p>
        </div>
        <div className="text-center">
          <div className="w-24 h-12 border-b border-gray-400 mb-1" />
          <span className="font-display font-bold text-[10px] text-black uppercase tracking-wider">
            Principal Signature
          </span>
        </div>
      </footer>
    </div>
  );
};
```
