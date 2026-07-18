const fs = require('fs');
let code = fs.readFileSync('src/pages/public/PublicLayout.tsx', 'utf8');

code = code.replace(
  '<span className="text-xl font-black text-content font-display uppercase tracking-tight leading-none block ">Hazrat Aisha</span>',
  '<span className="text-xl font-bold text-content font-display leading-none block ">Hazrat Aisha</span>'
).replace(
  '<span className="text-xl font-black text-primary font-display uppercase tracking-tight leading-none block ">Academy</span>',
  '<span className="text-xl font-bold text-primary font-display leading-none block ">Academy</span>'
);

code = code.replace(
  /className={`text-xs font-extrabold font-display uppercase tracking-wider transition-colors hover:text-primary \${location.pathname === link.path \? 'text-primary' : 'text-content-secondary'}`}/g,
  "className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.path ? 'text-primary' : 'text-content-secondary'}`}"
);

code = code.replace(
  /className="font-display font-extrabold uppercase tracking-wide"/g,
  'className="font-medium"'
);

fs.writeFileSync('src/pages/public/PublicLayout.tsx', code);
