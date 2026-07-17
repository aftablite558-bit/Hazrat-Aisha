import { database, storage, auth } from '../lib/firebase';
import { ref, push, set, get, update, remove, query, orderByChild, equalTo } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Student, CreateStudentInput, UpdateStudentInput } from '../types/student';
import { v4 as uuidv4 } from 'uuid';

class StudentService {
  private getDbRef(path: string) {
    if (!database) throw new Error('Database not initialized');
    return ref(database, path);
  }

  private getStorageRef(path: string) {
    if (!storage) throw new Error('Storage not initialized');
    return storageRef(storage, path);
  }

  async createStudent(input: CreateStudentInput): Promise<Student> {
    if (!database) throw new Error('Database not initialized');
    
    let photoUrl = null;
    if (input.photoFile && storage) {
      const fileExt = input.photoFile.name.split('.').pop();
      const fileName = `students/\${uuidv4()}.\${fileExt}`;
      const sRef = this.getStorageRef(fileName);
      await uploadBytes(sRef, input.photoFile);
      photoUrl = await getDownloadURL(sRef);
    }

    const { photoFile, ...studentData } = input;
    const now = Date.now();
    
    const newStudentData = {
      ...studentData,
      photoUrl,
      createdAt: now,
      updatedAt: now,
    };

    const studentsListRef = this.getDbRef('students');
    const newStudentRef = push(studentsListRef);
    await set(newStudentRef, newStudentData);

    return {
      id: newStudentRef.key as string,
      ...newStudentData,
    } as Student;
  }

  async getStudents(): Promise<Student[]> {
    if (!database) return [];
    
    const studentsRef = this.getDbRef('students');
    const snapshot = await get(studentsRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })) as Student[];
    }
    
    return [];
  }

  async getStudent(id: string): Promise<Student | null> {
    if (!database) return null;
    
    const studentRef = this.getDbRef(`students/\${id}`);
    const snapshot = await get(studentRef);
    
    if (snapshot.exists()) {
      return {
        id,
        ...snapshot.val()
      } as Student;
    }
    
    return null;
  }

  async updateStudent(id: string, input: UpdateStudentInput, existingPhotoUrl?: string | null): Promise<Student> {
    if (!database) throw new Error('Database not initialized');

    let photoUrl = existingPhotoUrl;
    if (input.photoFile && storage) {
      const fileExt = input.photoFile.name.split('.').pop();
      const fileName = `students/\${uuidv4()}.\${fileExt}`;
      const sRef = this.getStorageRef(fileName);
      await uploadBytes(sRef, input.photoFile);
      photoUrl = await getDownloadURL(sRef);

      // We could optionally delete the old photo here
    }

    const { photoFile, ...studentData } = input;
    
    const updateData = {
      ...studentData,
      ...(photoUrl !== undefined && { photoUrl }),
      updatedAt: Date.now(),
    };

    const studentRef = this.getDbRef(`students/\${id}`);
    await update(studentRef, updateData);

    return this.getStudent(id) as Promise<Student>;
  }

  async deleteStudent(id: string, photoUrl?: string | null): Promise<void> {
    if (!database) throw new Error('Database not initialized');

    if (photoUrl && storage) {
      try {
        // Simple extraction of path from Firebase storage URL, might need adjustments
        const urlObj = new URL(photoUrl);
        const path = decodeURIComponent(urlObj.pathname.split('/o/')[1].split('?')[0]);
        const sRef = this.getStorageRef(path);
        await deleteObject(sRef);
      } catch (e) {
        console.warn("Failed to delete photo:", e);
      }
    }

    const studentRef = this.getDbRef(`students/\${id}`);
    await remove(studentRef);
  }
}

export const studentService = new StudentService();
