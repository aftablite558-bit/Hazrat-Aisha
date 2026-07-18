const fs = require('fs');
let content = fs.readFileSync('src/services/student.service.ts', 'utf8');
content = content.replace(/\\\$/g, '$');
fs.writeFileSync('src/services/student.service.ts', content);
