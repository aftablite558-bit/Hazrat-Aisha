const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(/@import url\('https:\/\/fonts.googleapis.com[^)]+'\);\n/g, '');
fs.writeFileSync('src/index.css', css);
console.log("Removed @import from index.css");
