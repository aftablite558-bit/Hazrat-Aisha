const fs = require('fs');
let code = fs.readFileSync('src/pages/public/PublicLayout.tsx', 'utf8');

// Add Sun, Moon to lucide-react imports
code = code.replace(
  "import { Menu, X, BookOpen, MapPin, Phone, Mail, ChevronRight, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';",
  "import { Menu, X, BookOpen, MapPin, Phone, Mail, ChevronRight, Facebook, Twitter, Instagram, Linkedin, Sun, Moon } from 'lucide-react';"
);

// Add useTheme import
if (!code.includes("useTheme")) {
  code = code.replace(
    "import { useAuth } from '../../context/AuthContext';",
    "import { useAuth } from '../../context/AuthContext';\nimport { useTheme } from '../../context/ThemeContext';"
  );
}

// Add theme toggle button in the header nav
const hookInsert = "const { theme, setTheme } = useTheme();";
if (!code.includes("const { theme, setTheme }")) {
  code = code.replace(
    "const { user } = useAuth();",
    "const { user } = useAuth();\n  " + hookInsert
  );
}

const themeToggleBtn = `
              <button
                type="button"
                className="p-2 text-content-secondary hover:text-primary transition-colors rounded-full hover:bg-surface-raised"
                onClick={() => setTheme(theme === 'daylight' ? 'obsidian' : 'daylight')}
                title="Toggle Theme"
                aria-label="Toggle Theme"
              >
                {theme === 'daylight' ? (
                  <Moon className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Sun className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
`;

code = code.replace(
  '<Button onClick={() => navigate(\'/contact\')} size="md" className="font-medium">Apply Now</Button>',
  '<Button onClick={() => navigate(\'/contact\')} size="md" className="font-medium">Apply Now</Button>\n' + themeToggleBtn
);

// We should also add it to the mobile menu
const mobileMenuInsertPoint = `<div className="mt-8">`;
const mobileThemeToggle = `
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-content-secondary font-medium">Theme</span>
                  <button
                    type="button"
                    className="p-2 text-content-secondary hover:text-primary transition-colors rounded-full bg-surface-raised"
                    onClick={() => {
                      setTheme(theme === 'daylight' ? 'obsidian' : 'daylight');
                    }}
                    title="Toggle Theme"
                    aria-label="Toggle Theme"
                  >
                    {theme === 'daylight' ? (
                      <Moon className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Sun className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
`;
if(code.includes(mobileMenuInsertPoint) && !code.includes('span className="text-content-secondary font-medium">Theme</span>')) {
   code = code.replace(mobileMenuInsertPoint, mobileMenuInsertPoint + '\\n' + mobileThemeToggle);
}

fs.writeFileSync('src/pages/public/PublicLayout.tsx', code);
console.log("Updated PublicLayout.tsx with Theme toggle");
