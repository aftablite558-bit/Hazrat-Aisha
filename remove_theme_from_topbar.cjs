const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Topbar.tsx', 'utf8');

// The theme toggle looks like this:
// <button
//   type="button"
//   className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
//   onClick={() => setTheme(theme === 'daylight' ? 'obsidian' : 'daylight')}
//   title="Theme"
// >
//   <span className="sr-only">Toggle theme</span>
//   {theme === 'daylight' ? (
//     <Moon className="h-5 w-5" aria-hidden="true" />
//   ) : (
//     <Sun className="h-5 w-5" aria-hidden="true" />
//   )}
// </button>

const regex = /<button[^>]+onClick={\(\) => setTheme[^>]+>[\s\S]*?<\/button>/m;
code = code.replace(regex, '');

fs.writeFileSync('src/components/layout/Topbar.tsx', code);
console.log("Removed Theme toggle from Topbar");
