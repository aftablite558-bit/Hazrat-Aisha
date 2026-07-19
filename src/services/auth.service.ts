import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  sendEmailVerification,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "firebase/auth";
import { auth, database, isConfigured } from "../lib/firebase";
import { ref, set, update } from "firebase/database";
import { UserRole } from "../types";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "../lib/firebase";

export const authService = {
  /**
   * Create a new user without logging out the current user (admin use case)
   */
  async adminCreateUser(email: string, password: string, displayName: string, role: UserRole = "teacher") {
    if (!isConfigured || !database) throw new Error("Firebase Auth is not configured");
    
    // Initialize a secondary app to avoid logging out the admin
    const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
    const secondaryAuth = getAuth(secondaryApp);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName });
      
      const userRef = ref(database, `users/${user.uid}`);
      await update(userRef, {
        email,
        displayName,
        role,
        createdAt: Date.now(),
      });
      
      await signOut(secondaryAuth);
      return user;
    } catch (error) {
      await signOut(secondaryAuth);
      throw error;
    }
  },

  /**
   * Create a new user in Firebase Auth and database
   */
  async createUser(email: string, password: string, displayName: string, role: UserRole = "student") {
    if (!isConfigured || !auth || !database) throw new Error("Firebase Auth is not configured");
    
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName });

    // Store user data in Realtime Database
    const userRef = ref(database, `users/${user.uid}`);
    await update(userRef, {
      email,
      displayName,
      role,
      createdAt: Date.now(),
    });

    return user;
  },

  /**
   * Register a new user with email and password
   */
  async register(email: string, password: string, displayName: string) {
    const user = await this.createUser(email, password, displayName, "student");
    
    // Send verification email
    await sendEmailVerification(user);

    return user;
  },

  /**
   * Login with email and password
   */
  async login(email: string, password: string, rememberMe: boolean = true) {
    if (!isConfigured || !auth) throw new Error("Firebase Auth is not configured");
    
    // Set persistence based on rememberMe
    await setPersistence(
      auth, 
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  /**
   * Logout current user
   */
  async logout() {
    if (!isConfigured || !auth) throw new Error("Firebase Auth is not configured");
    await signOut(auth);
  },

  /**
   * Send password reset email
   */
  async resetPassword(email: string) {
    if (!isConfigured || !auth) throw new Error("Firebase Auth is not configured");
    await sendPasswordResetEmail(auth, email);
  },

  /**
   * Resend verification email to current user
   */
  async resendVerificationEmail() {
    if (!isConfigured || !auth) throw new Error("Firebase Auth is not configured");
    const user = auth.currentUser;
    if (!user) throw new Error("No user is currently logged in");
    
    await sendEmailVerification(user);
  }
};
