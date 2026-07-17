export interface Staff {
  id: string; // Internal Firebase key
  employeeId: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string; // YYYY-MM-DD
  qualification: string;
  experience: string; // Years or string
  joiningDate: string; // YYYY-MM-DD
  department: string;
  designation: string;
  subjects: string; // comma separated or text
  classes: string; // comma separated or text
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
  salary: string; // Stored, but only viewed by admin/principal
  status: 'active' | 'inactive' | 'on_leave';
  createdAt: number;
  updatedAt: number;
}

export type CreateStaffInput = Omit<Staff, 'id' | 'createdAt' | 'updatedAt' | 'photoUrl'> & {
  photoFile?: File;
};

export type UpdateStaffInput = Partial<CreateStaffInput>;
