import { ref, get, set, update, query, orderByChild } from 'firebase/database';
import { database, isConfigured } from '../lib/firebase';
import { UserRole } from '../types';

export interface SystemUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: 'active' | 'inactive';
  lastLogin?: number;
  createdAt: number;
}

const USERS_REF = 'users';

export const UserService = {
  async getAllUsers(): Promise<SystemUser[]> {
    if (!isConfigured || !database) return [];
    try {
      const dbRef = ref(database, USERS_REF);
      const snapshot = await get(dbRef);
      const users: SystemUser[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          users.push({ uid: childSnapshot.key, ...childSnapshot.val() } as SystemUser);
        });
      }
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
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
  }
};
