import { database } from '../lib/firebase';
import { ref, get, set, push, update, remove, query, orderByChild, equalTo } from 'firebase/database';
import { Exam, StudentMarks, PublishedResult } from '../types/exam';

class ExamService {
  private getDbRef(path: string) {
    if (!database) throw new Error('Database not initialized');
    return ref(database, path);
  }

  // --- Exams ---
  async getExams(): Promise<Exam[]> {
    const snapshot = await get(this.getDbRef('exams/list'));
    if (!snapshot.exists()) return [];
    
    const exams: Exam[] = [];
    snapshot.forEach((child) => {
      exams.push({ id: child.key, ...child.val() });
    });
    return exams;
  }
  
  async getExam(id: string): Promise<Exam | null> {
    const snapshot = await get(this.getDbRef(`exams/list/${id}`));
    if (!snapshot.exists()) return null;
    return { id: snapshot.key, ...snapshot.val() } as Exam;
  }

  async createExam(exam: Omit<Exam, 'id'>): Promise<string> {
    const newRef = push(this.getDbRef('exams/list'));
    await set(newRef, exam);
    return newRef.key!;
  }

  async updateExam(id: string, exam: Partial<Exam>): Promise<void> {
    await update(this.getDbRef(`exams/list/${id}`), exam);
  }

  async deleteExam(id: string): Promise<void> {
    await remove(this.getDbRef(`exams/list/${id}`));
    await remove(this.getDbRef(`exams/marks/${id}`));
    await remove(this.getDbRef(`exams/published/${id}`));
  }

  // --- Marks ---
  async getMarks(examId: string): Promise<Record<string, StudentMarks>> {
    const snapshot = await get(this.getDbRef(`exams/marks/${examId}`));
    if (!snapshot.exists()) return {};
    return snapshot.val();
  }

  async saveAllMarks(examId: string, allMarks: Record<string, StudentMarks>): Promise<void> {
    await set(this.getDbRef(`exams/marks/${examId}`), allMarks);
  }

  // --- Results Publish ---
  async publishResult(examId: string, publishedBy: string): Promise<void> {
    const pub: PublishedResult = {
      examId,
      publishedAt: Date.now(),
      publishedBy
    };
    await set(this.getDbRef(`exams/published/${examId}`), pub);
    await this.updateExam(examId, { status: 'published' });
  }

  async unpublishResult(examId: string): Promise<void> {
    await remove(this.getDbRef(`exams/published/${examId}`));
    await this.updateExam(examId, { status: 'completed' });
  }

  async getPublishedResult(examId: string): Promise<PublishedResult | null> {
    const snapshot = await get(this.getDbRef(`exams/published/${examId}`));
    if (!snapshot.exists()) return null;
    return snapshot.val();
  }
}

export const examService = new ExamService();
