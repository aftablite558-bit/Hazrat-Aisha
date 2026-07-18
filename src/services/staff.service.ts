import { database, storage } from '../lib/firebase';
import { ref, push, set, get, update, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Staff, CreateStaffInput, UpdateStaffInput } from '../types/staff';
import { v4 as uuidv4 } from 'uuid';
import { authService } from './auth.service';

class StaffService {
  private getDbRef(path: string) {
    if (!database) throw new Error('Database not initialized');
    return ref(database, path);
  }

  private getStorageRef(path: string) {
    if (!storage) throw new Error('Storage not initialized');
    return storageRef(storage, path);
  }

  async createStaff(input: CreateStaffInput): Promise<Staff> {
    if (!database) {
      throw new Error('Database not initialized');
    }
    
    let photoUrl = null;
    if (input.photoFile && storage) {
      try {
        const fileExt = input.photoFile.name.split('.').pop();
        const fileName = `staff/${uuidv4()}.${fileExt}`;
        const sRef = this.getStorageRef(fileName);
        await uploadBytes(sRef, input.photoFile);
        
        photoUrl = await getDownloadURL(sRef);
      } catch (error: any) {
        console.error('createStaff: photo upload error', error);
        // Continue anyway, skip photo
      }
    }

    // Do NOT create Firebase Auth user here to avoid logging out the admin
    // Mark as pending account creation
    const accountStatus = 'pending';
    let uid = null;

    const { photoFile, password, ...staffData } = input;
    const now = Date.now();
    
    const newStaffData = {
      ...staffData,
      uid,
      accountStatus,
      photoUrl,
      createdAt: now,
      updatedAt: now,
    };

    const staffListRef = this.getDbRef('staff');
    const newStaffRef = push(staffListRef);
    await set(newStaffRef, newStaffData);

    return {
      id: newStaffRef.key as string,
      ...newStaffData,
    } as Staff;
  }

  async getStaffList(): Promise<Staff[]> {
    if (!database) return [];
    
    const staffRef = this.getDbRef('staff');
    const snapshot = await get(staffRef);
    
    if (!snapshot.exists()) {
      await set(staffRef, []);
      return [];
    }

    const data = snapshot.val();
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    })) as Staff[];
  }

  async getStaff(id: string): Promise<Staff | null> {
    if (!database) return null;
    
    const staffRef = this.getDbRef(`staff/${id}`);
    const snapshot = await get(staffRef);
    
    if (snapshot.exists()) {
      return {
        id,
        ...snapshot.val()
      } as Staff;
    }
    
    return null;
  }

  async updateStaff(id: string, input: UpdateStaffInput, existingPhotoUrl?: string | null): Promise<Staff> {
    if (!database) throw new Error('Database not initialized');

    let photoUrl = existingPhotoUrl;
    if (input.photoFile && storage) {
      const fileExt = input.photoFile.name.split('.').pop();
      const fileName = `staff/${uuidv4()}.${fileExt}`;
      const sRef = this.getStorageRef(fileName);
      await uploadBytes(sRef, input.photoFile);
      photoUrl = await getDownloadURL(sRef);
    }

    const { photoFile, ...staffData } = input;
    
    const updateData = {
      ...staffData,
      ...(photoUrl !== undefined && { photoUrl }),
      updatedAt: Date.now(),
    };

    const staffRef = this.getDbRef(`staff/${id}`);
    await update(staffRef, updateData);

    return this.getStaff(id) as Promise<Staff>;
  }

  async deleteStaff(id: string, photoUrl: string | null | undefined): Promise<void> {
    if (!database) {
      throw new Error('Database not initialized');
    }

    if (photoUrl && storage) {
      try {
        const urlObj = new URL(photoUrl);
        const path = decodeURIComponent(urlObj.pathname.split('/o/')[1].split('?')[0]);
        const sRef = this.getStorageRef(path);
        await deleteObject(sRef);
      } catch (e: any) {
        console.warn("Failed to delete photo:", e);
      }
    }

    const staffRef = this.getDbRef(`staff/${id}`);
    await remove(staffRef);
  }
}

export const staffService = new StaffService();
