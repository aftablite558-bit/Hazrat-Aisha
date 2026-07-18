import { database } from '../lib/firebase';
import { ref, get, set, push, update, query, orderByChild, equalTo } from 'firebase/database';
import { FeeStructure, StudentFeeInvoice, FeeReceipt } from '../types/fee';

class FeeService {
  private getDbRef(path: string) {
    if (!database) throw new Error('Database not initialized');
    return ref(database, path);
  }

  // --- Fee Structure ---
  async getFeeStructures(): Promise<FeeStructure[]> {
    const dbRef = this.getDbRef('fees/structures');
    const snapshot = await get(dbRef);
    if (!snapshot.exists()) {
      await set(dbRef, []);
      return [];
    }
    
    const structures: FeeStructure[] = [];
    snapshot.forEach((child) => {
      structures.push({ id: child.key, ...child.val() });
    });
    return structures;
  }

  async saveFeeStructure(structure: Omit<FeeStructure, 'id'>): Promise<void> {
    const newRef = push(this.getDbRef('fees/structures'));
    await set(newRef, structure);
  }

  // --- Invoices ---
  async generateInvoice(invoiceData: Omit<StudentFeeInvoice, 'id' | 'createdAt' | 'status' | 'paidAmount'>): Promise<string> {
    const newRef = push(this.getDbRef('fees/invoices'));
    
    const invoice: Partial<StudentFeeInvoice> = {
      ...invoiceData,
      status: 'pending',
      paidAmount: 0,
      createdAt: Date.now()
    };
    
    await set(newRef, invoice);
    return newRef.key!;
  }

  async getStudentInvoices(studentId: string): Promise<StudentFeeInvoice[]> {
    const invoicesRef = this.getDbRef('fees/invoices');
    const q = query(invoicesRef, orderByChild('studentId'), equalTo(studentId));
    const snapshot = await get(q);
    
    if (!snapshot.exists()) return [];
    
    const invoices: StudentFeeInvoice[] = [];
    snapshot.forEach((child) => {
      invoices.push({ id: child.key, ...child.val() });
    });
    return invoices.sort((a, b) => b.dueDate - a.dueDate);
  }

  // --- Receipts & Payments ---
  async generateReceiptNumber(): Promise<string> {
    const snapshot = await get(this.getDbRef('fees/receipts'));
    let count = 1;
    if (snapshot.exists()) {
      count = snapshot.size + 1;
    }
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `REC-${dateStr}-${count.toString().padStart(4, '0')}`;
  }

  async recordPayment(receiptData: Omit<FeeReceipt, 'id' | 'receiptNumber'>): Promise<string> {
    const receiptRef = push(this.getDbRef('fees/receipts'));
    const receiptNumber = await this.generateReceiptNumber();
    
    const receipt: Partial<FeeReceipt> = {
      ...receiptData,
      receiptNumber
    };
    
    await set(receiptRef, receipt);

    // Update Invoice Status
    const invoiceRef = this.getDbRef(`fees/invoices/${receiptData.invoiceId}`);
    const invoiceSnap = await get(invoiceRef);
    if (invoiceSnap.exists()) {
      const invoice = invoiceSnap.val() as StudentFeeInvoice;
      const newPaidAmount = (invoice.paidAmount || 0) + receiptData.amount;
      const newStatus = newPaidAmount >= invoice.netAmount ? 'paid' : 'partial';
      
      await update(invoiceRef, {
        paidAmount: newPaidAmount,
        status: newStatus
      });
    }

    return receiptRef.key!;
  }

  async getReceipts(studentId?: string): Promise<FeeReceipt[]> {
    const receiptsRef = this.getDbRef('fees/receipts');
    let q = receiptsRef;
    
    if (studentId) {
      q = query(receiptsRef, orderByChild('studentId'), equalTo(studentId)) as any;
    }
    
    const snapshot = await get(q);
    if (!snapshot.exists()) return [];
    
    const receipts: FeeReceipt[] = [];
    snapshot.forEach((child) => {
      receipts.push({ id: child.key, ...child.val() });
    });
    
    return receipts.sort((a, b) => b.paymentDate - a.paymentDate);
  }
}

export const feeService = new FeeService();
