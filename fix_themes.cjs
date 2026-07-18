const fs = require('fs');
let css = fs.readFileSync('src/tokens/noor-tokens.css', 'utf8');

const replacement = `
/* Theme definitions */
:root, [data-theme="obsidian"] {
  --bg-page: #050D0A;
  --bg-surface: #0A1512;
  --bg-surface-raised: #12241D;
  --bg-surface-overlay: #1A332A;
  --border-default: #1E3A2F;
  --border-strong: #2C5243;
  --text-primary: #EAF4EF;
  --text-secondary: #9DBDB1;
  --text-tertiary: #6E9589;
  --text-disabled: #4E6E63;
  
  --color-primary: #10B981;
  --color-primary-hover: #34D399;
  --color-accent: #D4AF37;
  --color-glow: rgba(52, 245, 197, 0.35);
  
  --glass-bg: rgba(18, 36, 29, .55);
  --glass-border: rgba(52, 245, 197, .14);
  --shadow-color: rgba(0, 0, 0, .5);
}

[data-theme="daylight"] {
  --bg-page: #F7FAF8;
  --bg-surface: #FFFFFF;
  --bg-surface-raised: #FFFFFF;
  --bg-surface-overlay: #F0F5F2;
  --border-default: #DCE7E1;
  --border-strong: #B8CCC2;
  --text-primary: #0B1F18;
  --text-secondary: #3D5C51;
  --text-tertiary: #67827A;
  --text-disabled: #A4B8B0;
  
  --color-primary: #059669;
  --color-primary-hover: #047857;
  --color-accent: #B8912F;
  --color-glow: rgba(14, 84, 64, 0.2);
  
  --glass-bg: rgba(255, 255, 255, .65);
  --glass-border: rgba(5, 150, 105, .12);
  --shadow-color: rgba(11, 61, 46, .12);
}

[data-theme="midnight"] {
  --bg-page: #000000;
  --bg-surface: #0A0A0A;
  --bg-surface-raised: #121212;
  --bg-surface-overlay: #1A1A1A;
  --border-default: #262626;
  --border-strong: #3A3A3A;
  --text-primary: #F2F2F2;
  --text-secondary: #B3B3B3;
  --text-tertiary: #808080;
  --text-disabled: #4D4D4D;
  
  --color-primary: #34F5C5;
  --color-primary-hover: #6EF7D6;
  --color-accent: #D4AF37;
  --color-glow: rgba(52, 245, 197, 0.4);
  
  --glass-bg: rgba(18, 18, 18, .55);
  --glass-border: rgba(52, 245, 197, .18);
  --shadow-color: rgba(0, 0, 0, .8);
}
`;

const themeStart = css.indexOf('/* Theme definitions */');
if (themeStart !== -1) {
  css = css.substring(0, themeStart) + replacement;
  fs.writeFileSync('src/tokens/noor-tokens.css', css);
  console.log("Updated themes successfully!");
}
