const fs = require('fs');
let code = fs.readFileSync('src/pages/public/StudentPortal.tsx', 'utf8');

const updated = code.replace(
  "{ id: 'calendar', title: 'Academic Calendar', desc: 'Holidays & events', icon: Calendar, color: 'text-ink-black' },",
  "{ id: 'timetable', title: 'Timetable', desc: 'Class schedule', icon: Calendar, color: 'text-ink-black' },\n    { id: 'calendar', title: 'Academic Calendar', desc: 'Holidays & events', icon: Calendar, color: 'text-ink-black' },"
);

fs.writeFileSync('src/pages/public/StudentPortal.tsx', updated);
