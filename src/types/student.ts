export interface Student {
  id: string; // Internal Firebase key
  admissionNumber: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  fatherName: string;
  motherName: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string; // YYYY-MM-DD
  bloodGroup: string;
  mobile: string;
  alternateMobile: string;
  address: string;
  religion: string;
  category: string;
  aadhaar: string;
  previousSchool: string;
  admissionDate: string; // YYYY-MM-DD
  status: 'active' | 'inactive' | 'alumni' | 'suspended';
  class: string;
  section: string;
  session: string;
  createdAt: number;
  updatedAt: number;
}

export type CreateStudentInput = Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'photoUrl'> & {
  photoFile?: File;
};

export type UpdateStudentInput = Partial<CreateStudentInput>;
