import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, database, isConfigured } from "../lib/firebase";
import { ref, get, set } from "firebase/database";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
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
          const dbPath = `users/${currentFirebaseUser.uid}`;
          const userRef = ref(database, dbPath);
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUser({ uid: currentFirebaseUser.uid, isEmailVerified: currentFirebaseUser.emailVerified, ...userData } as User);
          } else {
            // New user: create profile
            const newUser = {
              uid: currentFirebaseUser.uid,
              email: currentFirebaseUser.email,
              displayName: currentFirebaseUser.displayName,
              role: 'admin', // Default role
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
    <AuthContext.Provider value={{ user, firebaseUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
