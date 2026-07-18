const fs = require('fs');
const content = fs.readFileSync('src/pages/public/StudentPortal.tsx', 'utf8');

const updated = content
  .replace(/student\.mobileNumber/g, 'student.mobile')
  .replace(/student\.emergencyContact/g, 'student.alternateMobile')
  .replace(/student\.academicSession/g, 'student.session')
  .replace(/res\.exam\.maxMarks/g, '(res.exam.subjects ? res.exam.subjects.reduce((sum, s) => sum + s.maxMarks, 0) : 0)')
  .replace(/res\.marks\.obtainedMarks/g, 'res.marks.total')
  .replace(/res\.marks\.status === 'Pass'/g, "res.marks.status === 'pass'")
  .replace(/res\.marks\.status === 'Fail'/g, "res.marks.status === 'fail'");

fs.writeFileSync('src/pages/public/StudentPortal.tsx', updated);
