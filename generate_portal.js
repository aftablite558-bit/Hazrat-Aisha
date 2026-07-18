const fs = require('fs');

const originalCode = fs.readFileSync('/tmp/old_portal.txt', 'utf8');

// We will extract the logic (state, useEffects, handleVerify, fetchStudentData, handleLogout, handlePrintReceipt)
// and replace the rendering logic.

// Because the original code is available in old_portal.txt, let's just write the new one.
