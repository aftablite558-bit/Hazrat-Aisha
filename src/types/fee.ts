export type FeeCategory = 'admission' | 'monthly' | 'exam' | 'transport' | 'library' | 'hostel' | 'custom';
export type PaymentMethod = 'cash' | 'upi' | 'bank_transfer' | 'cheque';
export type PaymentStatus = 'pending' | 'partial' | 'paid';

export interface FeeStructure {
  id: string;
  class: string;
  academicYear: string;
  fees: {
    category: FeeCategory;
    amount: number;
    frequency: 'one_time' | 'monthly' | 'yearly';
  }[];
}

export interface StudentFeeInvoice {
  id: string;
  studentId: string;
  academicYear: string;
  month?: string; // For monthly fees
  title: string;
  dueDate: number;
  items: {
    category: FeeCategory;
    amount: number;
    description?: string;
  }[];
  totalAmount: number;
  discount: number;
  scholarship: number;
  fine: number;
  netAmount: number;
  paidAmount: number;
  status: PaymentStatus;
  createdAt: number;
}

export interface FeeReceipt {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  studentId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string; // Cheque No, UPI Ref, etc.
  paymentDate: number;
  notes?: string;
  collectedBy: string;
}
