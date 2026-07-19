import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, database, isConfigured } from "../lib/firebase";
import { ref, get, set } from "firebase/database";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  refreshToken: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const refreshToken = async () => {
    if (auth.currentUser) {
      await auth.currentUser.getIdToken(true); // Force refresh token to get latest claims
      const idTokenResult = await auth.currentUser.getIdTokenResult();
      if (user) {
        setUser({ ...user, role: (idTokenResult.claims.role as any) || 'student' });
      }
    }
  };

  useEffect(() => {
    if (!isConfigured || !auth || !database) {
      console.warn("Firebase is not configured. Please check your .env file.");
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (currentFirebaseUser) => {
        setFirebaseUser(currentFirebaseUser);
        
        if (!currentFirebaseUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        try {
          const idTokenResult = await currentFirebaseUser.getIdTokenResult();
          const tokenRole = idTokenResult.claims.role as any;

          const dbPath = `users/${currentFirebaseUser.uid}`;
          const userRef = ref(database, dbPath);
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            const userData = snapshot.val();
            // Use token role if available, otherwise fallback to DB role (which will trigger cloud function to sync soon)
            setUser({ 
              uid: currentFirebaseUser.uid, 
              isEmailVerified: currentFirebaseUser.emailVerified, 
              ...userData,
              role: tokenRole || userData.role 
            } as User);
          } else {
            // New user: create profile
            const newUser = {
              uid: currentFirebaseUser.uid,
              email: currentFirebaseUser.email,
              displayName: currentFirebaseUser.displayName,
              role: tokenRole || 'student', // Default role
              createdAt: Date.now(),
              isEmailVerified: currentFirebaseUser.emailVerified,
            };
            await set(userRef, newUser);
            setUser(newUser as User);
          }
        } catch (error) {
          console.error("Error fetching/creating user data:", error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("AuthContext: Error setting up onAuthStateChanged:", error);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
