const fs = require('fs');
let css = fs.readFileSync('src/tokens/noor-tokens.css', 'utf8');
css = css.replace(/\[data-theme="obsidian"\] \{[^}]+\}/g, `[data-theme="obsidian"] {
  --bg-page: #040A18;
  --bg-surface: #07132B;
  --bg-surface-raised: #0A1C40;
  --bg-surface-overlay: #07132B;
  --border-default: rgba(59, 130, 246, 0.3);
  --border-strong: rgba(59, 130, 246, 0.5);
  --text-primary: #F0F9FF;
  --text-secondary: #BAE6FD;
  --text-tertiary: #38BDF8;
  --text-disabled: #0EA5E9;
  
  --color-primary: #38BDF8;
  --color-primary-hover: #7DD3FC;
  --color-accent: #0EA5E9;
  --color-glow: rgba(56, 189, 248, 0.15);
  
  --glass-bg: rgba(4, 10, 24, 0.4);
  --glass-border: rgba(59, 130, 246, 0.4);
  --shadow-color: rgba(59, 130, 246, 0.2);
}`);
fs.writeFileSync('src/tokens/noor-tokens.css', css);
