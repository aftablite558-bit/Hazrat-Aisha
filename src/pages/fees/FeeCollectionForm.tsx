import React, {  useState, useEffect  } from 'react';
import { AppSkeleton } from '../../components/ui/AppSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { feeService } from '../../services/fee.service';
import { studentService } from '../../services/student.service';
import { StudentFeeInvoice, FeeReceipt } from '../../types/fee';
import { Student } from '../../types/student';
import { useToast } from '../../context/ToastContext';
import { Search, Loader2, IndianRupee, Printer } from 'lucide-react';
import { motion } from 'motion/react';

export function FeeCollectionForm() {
  const { addToast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [invoices, setInvoices] = useState<StudentFeeInvoice[]>([]);
  const [receipts, setReceipts] = useState<FeeReceipt[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [amount, setAmount] = useState<number | ''>('');
  const [method, setMethod] = useState<'cash' | 'upi' | 'bank_transfer' | 'cheque'>('cash');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<StudentFeeInvoice | null>(null);
  
  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const allStudents = await studentService.getStudents();
      const filtered = allStudents.filter(s => 
        (s.admissionNumber?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setStudents(filtered);
    } catch (error) {
      addToast('Search failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadStudentData = async (student: Student) => {
    setSelectedStudent(student);
    setLoading(true);
    try {
      const inv = await feeService.getStudentInvoices(student.id);
      setInvoices(inv);
      const rec = await feeService.getReceipts(student.id);
      setReceipts(rec);
    } catch (error) {
      addToast('Failed to load fee data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!selectedInvoice || !amount || amount <= 0) {
      addToast('Please enter valid amount and select an invoice', 'error');
      return;
    }

    setLoading(true);
    try {
      await feeService.recordPayment({
        invoiceId: selectedInvoice.id,
        studentId: selectedStudent!.id,
        amount: Number(amount),
        paymentMethod: method,
        transactionId: transactionId || undefined,
        paymentDate: Date.now(),
        notes: notes || undefined,
        collectedBy: 'Admin'
      });
      
      addToast('Payment recorded successfully', 'success');
      setAmount('');
      setTransactionId('');
      setNotes('');
      setSelectedInvoice(null);
      await loadStudentData(selectedStudent!);
    } catch (error) {
      addToast('Payment failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-body">
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-content-tertiary" />
          <input
            type="text"
            placeholder="Search student by Name or Admission No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
          />
        </div>
        <Button onClick={handleSearch} className="font-display font-bold">Search</Button>
      </div>

      {!selectedStudent && students.length > 0 && (
        <Card className="overflow-hidden overflow-hidden">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[600px]">
              <thead className="text-xs text-content-secondary font-bold uppercase bg-white/5 border-b border-white/20">
                <tr>
                  <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Adm No.</th>
                  <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Name</th>
                  <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Class</th>
                  <th className="px-6 py-4 text-right font-display uppercase tracking-wider text-xs">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-white/10 transition-colors duration-fast">
                    <td className="px-6 py-4 font-mono font-bold text-content">{s.admissionNumber}</td>
                    <td className="px-6 py-4 font-semibold text-content">{s.firstName} {s.lastName}</td>
                    <td className="px-6 py-4 font-semibold text-content-secondary">Class {s.class}-{s.section}</td>
                    <td className="px-6 py-4 text-right">
                      <Button size="sm" variant="secondary" onClick={() => loadStudentData(s)} className="border-white/20 text-content-secondary hover:text-content font-bold font-display">Select</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {selectedStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-white/20 pb-4 font-display">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-content font-extrabold">Pending Invoices</CardTitle>
                  <Button variant="secondary" size="sm" onClick={() => setSelectedStudent(null)} className="border-white/20 text-content-secondary hover:text-content font-bold font-display">Back to Search</Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {invoices.filter(i => i.status !== 'paid').length === 0 ? (
                  <div className="py-8 text-center text-success-500 font-semibold">
                    No pending invoices.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invoices.filter(i => i.status !== 'paid').map(inv => {
                      const balance = inv.netAmount - inv.paidAmount;
                      return (
                        <div 
                          key={inv.id} 
                          className={`p-4 border rounded-xl cursor-pointer transition-all duration-fast ${
                            selectedInvoice?.id === inv.id 
                              ? 'border-primary bg-primary/10 shadow-sm shadow-primary/5' 
                              : 'border-white/20 hover:border-content-tertiary'
                          }`} 
                          onClick={() => setSelectedInvoice(inv)}
                        >
                          <div className="flex justify-between items-start font-display">
                            <div>
                              <h4 className="font-extrabold text-content">{inv.title}</h4>
                              <p className="text-xs text-content-secondary mt-1">Due: {new Date(inv.dueDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-black text-content font-mono">₹{balance}</div>
                              <div className="text-xs text-content-tertiary font-medium mt-0.5">of ₹{inv.netAmount}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="border-b border-white/20 pb-4">
                <CardTitle className="text-lg text-content font-extrabold font-display">Payment History</CardTitle>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                {receipts.length === 0 ? (
                  <div className="py-8 text-center text-content-secondary font-semibold">No payment history found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[800px]">
                      <thead className="text-xs text-content-secondary font-bold uppercase bg-white/5 border-b border-white/20">
                        <tr>
                          <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Receipt No</th>
                          <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Date</th>
                          <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Method</th>
                          <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Amount</th>
                          <th className="px-6 py-4 text-right font-display uppercase tracking-wider text-xs"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {receipts.map(r => (
                          <tr key={r.id} className="hover:bg-white/10 transition-colors duration-fast">
                            <td className="px-6 py-4 font-mono font-bold text-content">{r.receiptNumber}</td>
                            <td className="px-6 py-4 text-content-secondary font-medium">{new Date(r.paymentDate).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-content-secondary font-semibold capitalize">{r.paymentMethod.replace('_', ' ')}</td>
                            <td className="px-6 py-4 text-success-500 font-mono font-black">₹{r.amount}</td>
                            <td className="px-6 py-4 text-right">
                              <Button size="sm" variant="ghost" className="hover:bg-white/5 text-content-secondary hover:text-content">
                                <Printer className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-white/20 pb-4">
                <CardTitle className="text-lg text-content font-extrabold font-display">Receive Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="p-4 border border-white/20 rounded-xl font-display">
                  <p className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Student</p>
                  <p className="font-black text-content text-base mt-0.5">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                  <p className="text-sm text-content-secondary font-semibold mt-0.5">Class {selectedStudent.class}-{selectedStudent.section}</p>
                </div>

                {selectedInvoice ? (
                  <>
                    <div className="p-4 border border-primary/20 bg-primary/10 rounded-xl font-display">
                      <p className="text-xs font-bold text-primary uppercase tracking-wider">Selected: {selectedInvoice.title}</p>
                      <p className="text-lg font-black text-primary font-mono mt-0.5">Balance: ₹{selectedInvoice.netAmount - selectedInvoice.paidAmount}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider font-display">Amount (₹) *</label>
                      <input
                        type="number"
                        min="1"
                        max={selectedInvoice.netAmount - selectedInvoice.paidAmount}
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider font-display">Payment Method *</label>
                      <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value as any)}
                        className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                      >
                        <option value="cash">Cash</option>
                        <option value="upi">UPI</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="cheque">Cheque</option>
                      </select>
                    </div>

                    {method !== 'cash' && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider font-display">Transaction ID / Ref No</label>
                        <input
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider font-display">Notes (Optional)</label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-2 border border-white/20 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-md text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                      />
                    </div>

                    <Button className="w-full mt-4 font-display font-bold" onClick={handlePay} disabled={loading || !amount}>
                      {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <IndianRupee className="h-4 w-4 mr-2" />}
                      Record Payment
                    </Button>
                  </>
                ) : (
                  <div className="py-12 text-center text-content-tertiary font-semibold border-2 border-dashed border-white/20 rounded-xl font-display">
                    Select an invoice to pay
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
