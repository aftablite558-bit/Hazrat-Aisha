export type AdmissionStatus = 'pending' | 'approved' | 'rejected' | 'enrolled';

export interface AdmissionApplication {
  id: string;
  applicationNumber: string;
  admissionNumber?: string;
  appliedClass: string;
  status: AdmissionStatus;
  applicationDate: number;
  
  // Student Info
  studentName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  previousSchool?: string;
  
  // Parent Info
  fatherName: string;
  motherName: string;
  guardianName?: string;
  contactNumber: string;
  email?: string;
  address: string;
  
  // Documents & Photos
  photoUrl?: string;
  documentUrls?: Record<string, string>; // e.g. { 'birth_certificate': 'url', 'transfer_certificate': 'url' }
  
  timeline: {
    status: AdmissionStatus;
    timestamp: number;
    notes?: string;
    byUser?: string;
  }[];
}
