import { ref, get, set, update, query, orderByChild, push } from 'firebase/database';
import { database, isConfigured } from '../lib/firebase';
import { UserRole } from '../types';
import { authService } from './auth.service';

export interface SystemUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: 'active' | 'inactive';
  lastLogin?: number;
  createdAt: number;
}

export interface RegistrationRequest {
  id?: string;
  email: string;
  password?: string;
  displayName: string;
  role: UserRole;
  createdAt: number;
  status: 'pending' | 'approved' | 'rejected';
}

const USERS_REF = 'users';

export const UserService = {
  async getAllUsers(): Promise<SystemUser[]> {
    if (!isConfigured || !database) {
      const saved = localStorage.getItem('school_users_list');
      return saved ? JSON.parse(saved) : [];
    }
    try {
      const dbRef = ref(database, USERS_REF);
      const snapshot = await get(dbRef);
      
      const users: SystemUser[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          users.push({ uid: childSnapshot.key, ...childSnapshot.val() } as SystemUser);
        });
      }
      localStorage.setItem('school_users_list', JSON.stringify(users));
      return users;
    } catch (error) {
      console.error('Error fetching users, falling back to localStorage:', error);
      const saved = localStorage.getItem('school_users_list');
      return saved ? JSON.parse(saved) : [];
    }
  },

  async getUserById(uid: string): Promise<SystemUser | null> {
    if (!isConfigured || !database) return null;
    try {
      const dbRef = ref(database, `${USERS_REF}/${uid}`);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        return { uid: snapshot.key, ...snapshot.val() } as SystemUser;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async updateUserRole(uid: string, role: UserRole): Promise<void> {
    if (!isConfigured || !database) return;
    try {
      const dbRef = ref(database, `${USERS_REF}/${uid}`);
      await update(dbRef, { role });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  async updateUserStatus(uid: string, status: 'active' | 'inactive'): Promise<void> {
    if (!isConfigured || !database) return;
    try {
      const dbRef = ref(database, `${USERS_REF}/${uid}`);
      await update(dbRef, { status });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  async submitRegistrationRequest(email: string, password: string, displayName: string, role: UserRole = 'student'): Promise<void> {
    const newReq = {
      email,
      password,
      displayName,
      role,
      createdAt: Date.now(),
      status: 'pending' as const
    };
    
    // Save to localStorage as quick fallback/backup
    try {
      const saved = localStorage.getItem('school_registration_requests');
      const requests = saved ? JSON.parse(saved) : [];
      requests.push({ id: `local_${Date.now()}`, ...newReq });
      localStorage.setItem('school_registration_requests', JSON.stringify(requests));
    } catch (e) {
      console.error('Error writing request to localStorage:', e);
    }

    if (!isConfigured || !database) return;
    try {
      const newReqRef = push(ref(database, 'registration_requests'));
      await set(newReqRef, newReq);
    } catch (error) {
      console.error('Error submitting registration request to DB:', error);
      throw error;
    }
  },

  async getRegistrationRequests(): Promise<RegistrationRequest[]> {
    if (!isConfigured || !database) {
      const saved = localStorage.getItem('school_registration_requests');
      return saved ? JSON.parse(saved) : [];
    }
    try {
      const dbRef = ref(database, 'registration_requests');
      const snapshot = await get(dbRef);
      
      const requests: RegistrationRequest[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          requests.push({ id: childSnapshot.key, ...childSnapshot.val() } as RegistrationRequest);
        });
      }
      localStorage.setItem('school_registration_requests', JSON.stringify(requests));
      return requests.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error('Error fetching registration requests, falling back to localStorage:', error);
      const saved = localStorage.getItem('school_registration_requests');
      return saved ? JSON.parse(saved) : [];
    }
  },

  async approveRegistrationRequest(requestId: string): Promise<void> {
    let requestData: RegistrationRequest | null = null;
    let isDbBacked = false;

    // 1. Get current data
    if (isConfigured && database) {
      try {
        const reqRef = ref(database, `registration_requests/${requestId}`);
        const snap = await get(reqRef);
        if (snap.exists()) {
          requestData = snap.val() as RegistrationRequest;
          isDbBacked = true;
        }
      } catch (err) {
        console.error('Database read failed, trying localStorage fallback:', err);
      }
    }

    if (!requestData) {
      const saved = localStorage.getItem('school_registration_requests');
      if (saved) {
        const requests = JSON.parse(saved);
        requestData = requests.find((r: any) => r.id === requestId) || null;
      }
    }

    if (!requestData) throw new Error('Request not found');
    if (requestData.status !== 'pending') throw new Error('Request is already processed');

    // 2. Create user in Firebase Auth / Database
    try {
      await authService.adminCreateUser(
        requestData.email,
        requestData.password || 'tempPass123',
        requestData.displayName,
        requestData.role
      );
    } catch (authError: any) {
      console.error('Auth account creation error:', authError);
      // If user already exists, we can proceed to update status
      if (!authError?.message?.includes('already-in-use')) {
        throw authError;
      }
    }

    // 3. Update status in Database
    if (isDbBacked && isConfigured && database) {
      try {
        const reqRef = ref(database, `registration_requests/${requestId}`);
        await update(reqRef, { status: 'approved' });
      } catch (dbUpdateError) {
        console.error('Failed to update request status in database:', dbUpdateError);
      }
    }

    // 4. Update status in localStorage
    try {
      const saved = localStorage.getItem('school_registration_requests');
      if (saved) {
        const requests = JSON.parse(saved);
        const updated = requests.map((r: any) => r.id === requestId ? { ...r, status: 'approved' } : r);
        localStorage.setItem('school_registration_requests', JSON.stringify(updated));
      }
    } catch (e) {
      console.error('Error updating status in localStorage:', e);
    }
  },

  async rejectRegistrationRequest(requestId: string): Promise<void> {
    // 1. Update in Database
    if (isConfigured && database) {
      try {
        const reqRef = ref(database, `registration_requests/${requestId}`);
        await update(reqRef, { status: 'rejected' });
      } catch (dbError) {
        console.error('Failed to update rejection in DB:', dbError);
      }
    }

    // 2. Update in localStorage
    try {
      const saved = localStorage.getItem('school_registration_requests');
      if (saved) {
        const requests = JSON.parse(saved);
        const updated = requests.map((r: any) => r.id === requestId ? { ...r, status: 'rejected' } : r);
        localStorage.setItem('school_registration_requests', JSON.stringify(updated));
      }
    } catch (e) {
      console.error('Error updating rejection in localStorage:', e);
    }
  }
};
