const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(
  /@import url\('https:\/\/fonts.googleapis.com\/css2\?family=Outfit[^)]+'\);/g,
  ""
);
css = css.replace(
  /@import url\('https:\/\/fonts.googleapis.com\/css2\?family=Signifier[^)]+'\);/g,
  ""
);

const newImport = `@import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;700&family=Sora:wght@300;400;500;600;700;800;900&display=swap');\n`;

css = newImport + css.replace(/^\s+/, '');

fs.writeFileSync('src/index.css', css);
console.log("Updated index.css");
