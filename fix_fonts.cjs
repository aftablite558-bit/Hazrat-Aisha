const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = [
  ...glob.sync('src/pages/public/**/*.tsx'),
  ...glob.sync('src/pages/admin/**/*.tsx')
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/font-display uppercase/g, 'font-display');
  content = content.replace(/font-black/g, 'font-bold');
  content = content.replace(/font-extrabold/g, 'font-bold');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
console.log("Updated fonts!");
