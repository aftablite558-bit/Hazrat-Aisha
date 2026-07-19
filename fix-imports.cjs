const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/pages/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(
      /import React, \{\nimport \{ AppSkeleton \} from '@\/components\/ui\/AppSkeleton';\nimport \{ useState \} from 'react';/g,
      "import React, { useState } from 'react';\nimport { AppSkeleton } from '../../components/ui/AppSkeleton';"
  );
  
  // also handle other hooks if they were mangled
  content = content.replace(
      /import React, \{\nimport \{ AppSkeleton \} from '@\/components\/ui\/AppSkeleton';\nimport \{([^}]+)\} from 'react';/g,
      "import React, { $1 } from 'react';\nimport { AppSkeleton } from '../../components/ui/AppSkeleton';"
  );
  
  content = content.replace(
      /import \{ AppSkeleton \} from '@\/components\/ui\/AppSkeleton';/g,
      "import { AppSkeleton } from '../../components/ui/AppSkeleton';"
  );

  fs.writeFileSync(file, content);
});
console.log("Done fixing imports 2.");
