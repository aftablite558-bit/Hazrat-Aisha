const fs = require('fs');
let css = fs.readFileSync('src/tokens/noor-tokens.css', 'utf8');

// Replace standard font definitions
css = css.replace(
  /--font-display: "Outfit"[^;]+;/g,
  '--font-display: "Sora", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;'
);
css = css.replace(
  /--font-body: "Inter"[^;]+;/g,
  '--font-body: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;'
);

// Replace the ones at the bottom too
css = css.replace(
  /--font-display: 'Signifier'[^;]+;/g,
  '--font-display: "Sora", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;'
);
css = css.replace(
  /--font-body: 'Inter', 'Sohne'[^;]+;/g,
  '--font-body: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;'
);

fs.writeFileSync('src/tokens/noor-tokens.css', css);
console.log("Updated tokens CSS");
