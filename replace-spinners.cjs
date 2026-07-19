const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('src/pages/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('Loader2') && content.includes('animate-spin') && !content.includes('AppSkeleton')) {
    // Add AppSkeleton import if not there
    if (!content.includes('import { AppSkeleton }')) {
      content = content.replace(
        "import React",
        "import React from 'react';\nimport { AppSkeleton } from '@/components/ui/AppSkeleton';" 
      );
      if (!content.includes('import { AppSkeleton }')) {
         content = content.replace(
            "import {",
            "import { AppSkeleton } from '@/components/ui/AppSkeleton';\nimport {" 
         );
      }
    }
    
    // Determine type based on file name or path
    let type = 'card';
    if (file.includes('List')) type = 'table';
    else if (file.includes('Form')) type = 'form';
    else if (file.includes('Details') || file.includes('Profile')) type = 'profile';
    else if (file.includes('Dashboard')) type = 'dashboard';
    
    content = content.replace(
      /<div className="[^"]*flex justify-center items-center py-12[^"]*">[\s\S]*?<Loader2 className="[^"]*animate-spin[^"]*" \/>[\s\S]*?<\/div>/g,
      `<AppSkeleton type="${type}" />`
    );
    
    content = content.replace(
      /<div className="[^"]*flex justify-center items-center h-64[^"]*">[\s\S]*?<Loader2 className="[^"]*animate-spin[^"]*" \/>[\s\S]*?<\/div>/g,
      `<AppSkeleton type="${type}" />`
    );
    
    content = content.replace(
      /<div className="[^"]*flex justify-center items-center min-h-\[400px\][^"]*">[\s\S]*?<Loader2 className="[^"]*animate-spin[^"]*" \/>[\s\S]*?<\/div>/g,
      `<AppSkeleton type="${type}" />`
    );

    content = content.replace(
      /<div className="[^"]*flex h-64 items-center justify-center[^"]*">[\s\S]*?<Loader2 className="[^"]*animate-spin[^"]*" \/>[\s\S]*?<\/div>/g,
      `<AppSkeleton type="${type}" />`
    );

    fs.writeFileSync(file, content);
  }
});
console.log("Done replacing loaders.");
