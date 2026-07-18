import { database, storage } from '../lib/firebase';
import { ref, get, set, push, update, query, orderByChild, equalTo } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AdmissionApplication, AdmissionStatus } from '../types/admission';

class AdmissionService {
  private getDbRef(path: string) {
    if (!database) throw new Error('Database not initialized');
    return ref(database, path);
  }

  async getApplications(): Promise<AdmissionApplication[]> {
    const appsRef = this.getDbRef('admissions');
    const snapshot = await get(appsRef);
    if (!snapshot.exists()) {
      await set(appsRef, []);
      return [];
    }
    
    const apps: AdmissionApplication[] = [];
    snapshot.forEach((child) => {
      apps.push({ id: child.key, ...child.val() });
    });
    return apps.sort((a, b) => b.applicationDate - a.applicationDate);
  }

  async getApplication(id: string): Promise<AdmissionApplication | null> {
    const appRef = this.getDbRef(`admissions/${id}`);
    const snapshot = await get(appRef);
    if (!snapshot.exists()) return null;
    return { id, ...snapshot.val() };
  }

  async generateApplicationNumber(): Promise<string> {
    const appsRef = this.getDbRef('admissions');
    const snapshot = await get(appsRef);
    let count = 1;
    if (snapshot.exists()) {
      count = snapshot.size + 1;
    }
    const year = new Date().getFullYear();
    return `APP-${year}-${count.toString().padStart(4, '0')}`;
  }

  async createApplication(data: Omit<AdmissionApplication, 'id' | 'applicationNumber' | 'timeline' | 'status'>): Promise<string> {
    const appsRef = this.getDbRef('admissions');
    const newAppRef = push(appsRef);
    
    const applicationNumber = await this.generateApplicationNumber();
    
    const application: Partial<AdmissionApplication> = {
      ...data,
      applicationNumber,
      status: 'pending',
      timeline: [{
        status: 'pending',
        timestamp: Date.now(),
        notes: 'Application submitted'
      }]
    };

    await set(newAppRef, application);
    return newAppRef.key!;
  }

  async updateApplicationStatus(id: string, status: AdmissionStatus, notes?: string, byUser?: string): Promise<void> {
    const app = await this.getApplication(id);
    if (!app) throw new Error('Application not found');

    const timeline = app.timeline || [];
    timeline.push({
      status,
      timestamp: Date.now(),
      notes,
      byUser
    });

    const updates: any = {
      status,
      timeline
    };

    if (status === 'approved' && !app.admissionNumber) {
      // Generate Admission Number
      const year = new Date().getFullYear();
      const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      updates.admissionNumber = `ADM-${year}-${rand}`;
    }

    const appRef = this.getDbRef(`admissions/${id}`);
    await update(appRef, updates);
  }

  async uploadDocument(id: string, file: File, docType: string): Promise<string> {
    if (!storage) throw new Error('Storage not initialized');
    const ext = file.name.split('.').pop();
    const fileRef = storageRef(storage, `admissions/${id}/${docType}_${Date.now()}.${ext}`);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  }
}

export const admissionService = new AdmissionService();
