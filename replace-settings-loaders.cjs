const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/pages/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('Loader2 className="w-8 h-8 animate-spin text-indigo-600"')) {
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
    
    content = content.replace(
      /return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" \/><\/div>;/g,
      `return <div className="p-8"><AppSkeleton type="dashboard" /></div>;`
    );
    
    fs.writeFileSync(file, content);
  }
});
console.log("Done replacing settings loaders.");
