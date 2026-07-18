const fs = require('fs');
let code = fs.readFileSync('src/pages/public/StudentPortal.tsx', 'utf8');

const newRenderActiveView = `
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <motion.div 
                  key={mod.id}
                  whileHover={{ y: -4 }}
                  className="bg-mist-gray rounded-[24px] p-6 cursor-pointer group transition-all"
                  onClick={() => setActiveTab(mod.id as any)}
                >
                  <div className="h-12 w-12 rounded-full bg-paper-white flex items-center justify-center mb-4 transition-colors">
                    <Icon className={\`h-6 w-6 \${mod.color}\`} />
                  </div>
                  <h4 className="font-sohne text-[20px] font-medium text-ink-black">{mod.title}</h4>
                  <p className="text-[15px] text-slate-gray mt-1">{mod.desc}</p>
                </motion.div>
              );
            })}
          </div>
        );

      case 'profile':
        return (
          <div className="bg-mist-gray rounded-[24px] p-8">
            <h3 className="font-signifier text-[26px] text-ink-black mb-8 border-b border-[#e5e5e5] pb-4">Student Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <p className="text-[14px] text-slate-gray">Full Name</p>
                  <p className="text-[17px] text-ink-black font-medium">{student.firstName} {student.lastName}</p>
                </div>
                <div>
                  <p className="text-[14px] text-slate-gray">Date of Birth</p>
                  <p className="text-[17px] text-ink-black font-medium">{student.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-[14px] text-slate-gray">Gender</p>
                  <p className="text-[17px] text-ink-black font-medium capitalize">{student.gender || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-[14px] text-slate-gray">Blood Group</p>
                  <p className="text-[17px] text-ink-black font-medium">{student.bloodGroup || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-[14px] text-slate-gray">Aadhaar (UIDAI)</p>
                  <p className="text-[17px] text-ink-black font-medium font-mono">{maskAadhaar(student.aadhaar || '')}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-[14px] text-slate-gray">Father's Name</p>
                  <p className="text-[17px] text-ink-black font-medium">{student.fatherName}</p>
                </div>
                <div>
                  <p className="text-[14px] text-slate-gray">Mother's Name</p>
                  <p className="text-[17px] text-ink-black font-medium">{student.motherName}</p>
                </div>
                <div>
                  <p className="text-[14px] text-slate-gray">Primary Contact</p>
                  <p className="text-[17px] text-ink-black font-medium">{student.mobile || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[14px] text-slate-gray">Emergency Contact</p>
                  <p className="text-[17px] text-ink-black font-medium">{student.alternateMobile || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[14px] text-slate-gray">Residential Address</p>
                  <p className="text-[17px] text-ink-black font-medium">{student.address || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'results':
        return (
          <div className="space-y-6">
            <h3 className="font-signifier text-[26px] text-ink-black">Exam Results</h3>
            {results.length === 0 ? (
              <div className="bg-mist-gray rounded-[24px] p-12 text-center">
                <FileText className="h-12 w-12 text-smoke-gray mx-auto mb-4" />
                <p className="text-[17px] text-slate-gray">No exam results published yet.</p>
              </div>
            ) : (
              results.map((res, idx) => {
                const totalMarks = res.exam.subjects ? res.exam.subjects.reduce((sum, s) => sum + s.maxMarks, 0) : 0;
                return (
                  <div key={idx} className="bg-mist-gray rounded-[24px] p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="font-sohne text-[20px] font-medium text-ink-black">{res.exam.title}</h4>
                        <p className="text-[15px] text-slate-gray">{res.exam.type} • Total Marks: {totalMarks}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-[26px] font-signifier text-ink-black leading-none">{res.marks.total}</div>
                        <div className="text-[14px] text-slate-gray mt-1">Obtained</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 mb-6 space-y-2">
                      <div className="flex justify-between text-[14px] text-slate-gray border-b border-[#e5e5e5] pb-2 font-medium">
                        <span className="w-1/3">Subject</span>
                        <span className="w-1/3 text-center">Max</span>
                        <span className="w-1/3 text-right">Obtained</span>
                      </div>
                      {res.exam.subjects?.map((sub, sidx) => (
                        <div key={sidx} className="flex justify-between text-[15px] text-ink-black py-1">
                          <span className="w-1/3">{sub.name}</span>
                          <span className="w-1/3 text-center text-slate-gray">{sub.maxMarks}</span>
                          <span className="w-1/3 text-right font-medium">{res.marks.marks[sub.id] || 0}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-paper-white rounded-[16px] p-4 flex justify-between items-center">
                      <div>
                        <p className="text-[14px] text-slate-gray">Percentage</p>
                        <p className="text-[17px] font-medium text-ink-black">{res.marks.percentage.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-[14px] text-slate-gray">Grade</p>
                        <p className="text-[17px] font-medium text-ink-black">{res.marks.grade || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[14px] text-slate-gray">Rank</p>
                        <p className="text-[17px] font-medium text-ink-black">{res.marks.rank || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[14px] text-slate-gray">Status</p>
                        <p className={\`text-[17px] font-medium \${res.marks.status === 'pass' ? 'text-[#059669]' : 'text-[#e11d48]'}\`}>{res.marks.status === 'pass' ? 'Pass' : 'Fail'}</p>
                      </div>
                      <button className="hidden sm:inline-flex items-center justify-center bg-mist-gray text-ink-black rounded-[9999px] px-4 py-2 text-[14px] transition-colors cursor-pointer hover:bg-[#e5e5e5]">
                        <Download className="h-4 w-4 mr-2" /> PDF
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        );

      case 'attendance':
        return (
          <div className="space-y-6">
            <h3 className="font-signifier text-[26px] text-ink-black">Attendance Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-mist-gray rounded-[20px] p-6 text-center">
                <p className="text-[14px] text-slate-gray mb-1">Total Days</p>
                <p className="text-[26px] font-signifier text-ink-black">{attendanceStats.total}</p>
              </div>
              <div className="bg-mist-gray rounded-[20px] p-6 text-center">
                <p className="text-[14px] text-slate-gray mb-1">Present</p>
                <p className="text-[26px] font-signifier text-[#059669]">{attendanceStats.present}</p>
              </div>
              <div className="bg-mist-gray rounded-[20px] p-6 text-center">
                <p className="text-[14px] text-slate-gray mb-1">Absent</p>
                <p className="text-[26px] font-signifier text-[#e11d48]">{attendanceStats.absent}</p>
              </div>
              <div className="bg-mist-gray rounded-[20px] p-6 text-center">
                <p className="text-[14px] text-slate-gray mb-1">Percentage</p>
                <p className="text-[26px] font-signifier text-ink-black">{attendanceStats.percentage}%</p>
              </div>
            </div>
            
            <div className="bg-mist-gray rounded-[24px] p-8 mt-8">
              <h4 className="font-sohne text-[20px] font-medium text-ink-black mb-6">Recent History (Last 30 Days)</h4>
              <div className="space-y-3">
                {Object.entries(attendanceRecords).slice(0, 10).map(([date, record]) => (
                  <div key={date} className="flex justify-between items-center py-3 border-b border-[#e5e5e5] last:border-0">
                    <div className="flex items-center gap-4">
                      <div className={\`w-2 h-2 rounded-[9999px] \${record.status === 'present' ? 'bg-[#059669]' : record.status === 'late' ? 'bg-[#d97706]' : 'bg-[#e11d48]'}\`} />
                      <span className="text-[17px] text-ink-black">{new Date(date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <span className="text-[15px] text-slate-gray capitalize">{record.status} - {record.remarks}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'homework':
        const mockHomeworks = [
          { subject: 'Mathematics', teacher: 'Mr. Sharma', due: 'Tomorrow', title: 'Algebra Practice Set 4', file: 'algebra_set4.pdf' },
          { subject: 'Science', teacher: 'Mrs. Gupta', due: 'In 2 days', title: 'Physics Lab Report', file: 'lab_format.docx' },
          { subject: 'English', teacher: 'Miss Davis', due: 'Next Week', title: 'Essay on Climate Change', file: null },
        ];
        return (
          <div className="space-y-6">
            <h3 className="font-signifier text-[26px] text-ink-black">Homework & Assignments</h3>
            <div className="grid gap-4">
              {mockHomeworks.map((hw, i) => (
                <div key={i} className="bg-mist-gray rounded-[20px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-paper-white border border-[#e5e5e5] text-ink-black px-2.5 py-0.5 rounded-[9999px] text-[13px] font-medium">{hw.subject}</span>
                      <span className="text-[14px] text-slate-gray">Due: {hw.due}</span>
                    </div>
                    <h4 className="font-sohne text-[17px] font-medium text-ink-black mt-2">{hw.title}</h4>
                    <p className="text-[14px] text-slate-gray mt-1">Assigned by {hw.teacher}</p>
                  </div>
                  {hw.file && (
                    <button className="inline-flex items-center justify-center bg-paper-white border border-[#e5e5e5] text-ink-black rounded-[9999px] px-4 py-2 text-[14px] transition-colors cursor-pointer hover:bg-mist-gray shrink-0">
                      <Download className="h-4 w-4 mr-2" /> Download File
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'notices':
        return (
          <div className="space-y-6">
            <h3 className="font-signifier text-[26px] text-ink-black">Notice Board</h3>
            <div className="grid gap-4">
              {NOTICES.map((notice) => (
                <div key={notice.id} className="bg-mist-gray rounded-[20px] p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[14px] font-medium text-slate-gray">{notice.date}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e5e5e5]" />
                    <span className="text-[14px] text-smoke-gray">{notice.category}</span>
                    {notice.pinned && (
                      <span className="bg-blush-peach text-sienna-brown px-2 py-0.5 rounded-[9999px] text-[12px] font-medium ml-auto">Pinned</span>
                    )}
                  </div>
                  <h4 className="font-sohne text-[20px] font-medium text-ink-black mb-2">{notice.title}</h4>
                  <p className="text-[15px] text-slate-gray mb-4">{notice.desc}</p>
                  <button className="inline-flex items-center text-ink-black font-medium text-[15px] hover:underline underline-offset-4 cursor-pointer">
                    <FileDown className="h-4 w-4 mr-2" /> View Attachment ({notice.fileSize})
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'downloads':
        const mockDownloads = [
          { title: 'Mid-Term Syllabus 2026', type: 'PDF', size: '2.4 MB' },
          { title: 'Academic Calendar 2026-27', type: 'PDF', size: '1.1 MB' },
          { title: 'Fee Structure Circular', type: 'PDF', size: '500 KB' },
          { title: 'Previous Year Question Paper (Maths)', type: 'ZIP', size: '5.6 MB' },
        ];
        return (
          <div className="space-y-6">
            <h3 className="font-signifier text-[26px] text-ink-black">Downloads Center</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockDownloads.map((dl, i) => (
                <div key={i} className="bg-mist-gray rounded-[20px] p-6 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-paper-white rounded-[12px] flex items-center justify-center text-ink-black border border-[#e5e5e5]">
                      <FileDown className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-sohne text-[17px] font-medium text-ink-black">{dl.title}</h4>
                      <p className="text-[14px] text-slate-gray">{dl.type} • {dl.size}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'fees':
        return (
          <div className="space-y-6">
            <h3 className="font-signifier text-[26px] text-ink-black">Fee Status</h3>
            <div className="grid gap-6">
              <div className="bg-mist-gray rounded-[24px] p-8">
                <h4 className="font-sohne text-[20px] font-medium text-ink-black mb-6 border-b border-[#e5e5e5] pb-4">Recent Invoices</h4>
                {invoices.length === 0 ? (
                  <p className="text-[15px] text-slate-gray">No invoices found.</p>
                ) : (
                  <div className="space-y-4">
                    {invoices.map((inv, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-paper-white p-4 rounded-[16px] border border-[#e5e5e5]">
                        <div>
                          <p className="text-[17px] font-medium text-ink-black">{inv.title || \`Invoice #\${inv.id.substring(0, 8)}\`}</p>
                          <p className="text-[14px] text-slate-gray">Due: {new Date(inv.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[17px] font-medium text-ink-black">₹{inv.totalAmount}</p>
                          <p className={\`text-[14px] font-medium \${inv.status === 'paid' ? 'text-[#059669]' : 'text-[#e11d48]'}\`}>{inv.status.toUpperCase()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="bg-mist-gray rounded-[24px] p-8">
                <h4 className="font-sohne text-[20px] font-medium text-ink-black mb-6 border-b border-[#e5e5e5] pb-4">Payment Receipts</h4>
                {receipts.length === 0 ? (
                  <p className="text-[15px] text-slate-gray">No payment receipts found.</p>
                ) : (
                  <div className="space-y-4">
                    {receipts.map((rec, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-paper-white p-4 rounded-[16px] border border-[#e5e5e5]">
                        <div>
                          <p className="text-[17px] font-medium text-ink-black">Receipt #{rec.receiptNumber}</p>
                          <p className="text-[14px] text-slate-gray">{new Date(rec.paymentDate).toLocaleDateString()} • {rec.paymentMode}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <p className="text-[17px] font-medium text-ink-black">₹{rec.amount}</p>
                          <button className="text-[14px] text-ink-black font-medium hover:underline underline-offset-4 cursor-pointer">View PDF</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-6">
            <h3 className="font-signifier text-[26px] text-ink-black">Academic Calendar</h3>
            <div className="bg-mist-gray rounded-[24px] p-8">
              <div className="space-y-4">
                {CALENDAR_EVENTS.map((ev, i) => (
                  <div key={i} className="flex items-center gap-6 p-4 bg-paper-white rounded-[16px] border border-[#e5e5e5]">
                    <div className="text-center min-w-[60px]">
                      <div className="text-[14px] text-slate-gray uppercase font-medium">{new Date(ev.date).toLocaleString('en-US', { month: 'short' })}</div>
                      <div className="text-[26px] font-signifier text-ink-black leading-none">{new Date(ev.date).getDate()}</div>
                    </div>
                    <div className="w-px h-10 bg-[#e5e5e5]"></div>
                    <div>
                      <h4 className="text-[17px] font-medium text-ink-black">{ev.title}</h4>
                      <p className="text-[14px] text-slate-gray mt-1">{ev.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // Placeholder for unimplemented sections matching aesthetic
      default:
        return (
          <div className="bg-mist-gray rounded-[24px] p-12 text-center">
            <h3 className="font-signifier text-[26px] text-ink-black mb-2 capitalize">{activeTab.replace('-', ' ')}</h3>
            <p className="text-[17px] text-slate-gray mb-8">This module is currently being updated for the new academic session.</p>
            <button onClick={() => setActiveTab('dashboard')} className="inline-flex items-center justify-center bg-transparent border border-ink-black text-ink-black rounded-[9999px] px-5 py-2.5 text-[15px] hover:bg-[#e5e5e5] transition-colors cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </button>
          </div>
        );
    }
  };
`;

let startIndex = code.indexOf('const renderActiveView = () => {');
let endIndex = code.lastIndexOf('return (');
if (startIndex !== -1 && endIndex !== -1) {
  // Extract up to the 'return (' of the main component
  const before = code.substring(0, startIndex);
  const after = code.substring(code.lastIndexOf('return (', code.length - 200)); // The last return statement of the component
  
  fs.writeFileSync('src/pages/public/StudentPortal.tsx', before + newRenderActiveView + '\n  ' + after);
}

