const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/--font-signifier:[^;]+;/g, "");
css = css.replace(/--font-sohne:[^;]+;/g, "");

fs.writeFileSync('src/index.css', css);
console.log("Cleaned up old font tokens in index.css");
