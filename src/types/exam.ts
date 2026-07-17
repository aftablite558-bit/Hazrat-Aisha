export type ExamStatus = 'draft' | 'scheduled' | 'completed' | 'published';

export interface Exam {
  id: string;
  title: string;
  academicYear: string;
  type: string;
  class: string;
  section: string;
  status: ExamStatus;
  subjects: ExamSubject[];
}

export interface ExamSubject {
  id: string;
  name: string;
  date: number;
  startTime: string;
  endTime: string;
  roomAllocation: string;
  maxMarks: number;
  passingMarks: number;
}

export interface StudentMarks {
  studentId: string;
  examId: string;
  marks: Record<string, number>;
  graceMarks: Record<string, number>;
  remarks?: string;
  total: number;
  percentage: number;
  grade: string;
  rank: number;
  status: 'pass' | 'fail';
}

export interface PublishedResult {
  examId: string;
  publishedAt: number;
  publishedBy: string;
}
