const fs = require('fs');

let css = fs.readFileSync('src/tokens/noor-tokens.css', 'utf8');

const replacement = `
:root, [data-theme="obsidian"], [data-theme="daylight"], [data-theme="midnight"] {
  --bg-page: #ffffff; 
  --bg-surface: #f2f2f3; 
  --bg-surface-raised: #fafafb; 
  --bg-surface-overlay: #ffffff;
  --border-default: #ececec;
  --border-strong: #e5e5e5;
  --text-primary: #17191c;
  --text-secondary: #777b86;
  --text-tertiary: #979799;
  --text-disabled: #a3a6af;
  
  --color-primary: #17191c;
  --color-primary-hover: #000000;
  --color-accent: #5d2a1a;
  --color-glow: rgba(0,0,0,0.1);
  
  --glass-bg: rgba(255, 255, 255, 0.85);
  --glass-border: rgba(0, 0, 0, 0.08);
  --shadow-color: rgba(0, 0, 0, 0.05);

  --font-display: 'Signifier', ui-serif, Georgia, serif;
  --font-body: 'Inter', 'Sohne', ui-sans-serif, system-ui, -apple-system, sans-serif;
  
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;
  --radius-3xl: 32px;
}
`;

// replace from :root, [data-theme="obsidian"] { to the end of [data-theme="midnight"] block
const themeStart = css.indexOf(':root, [data-theme="obsidian"] {');
if (themeStart !== -1) {
  css = css.substring(0, themeStart) + replacement;
  fs.writeFileSync('src/tokens/noor-tokens.css', css);
  console.log("Updated tokens successfully!");
} else {
  console.log("Could not find theme definitions.");
}
