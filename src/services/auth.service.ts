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
import { ref, set } from "firebase/database";
import { UserRole } from "../types";

export const authService = {
  /**
   * Register a new user with email and password
   */
  async register(email: string, password: string, displayName: string, role: UserRole = "teacher") {
    if (!isConfigured || !auth || !database) throw new Error("Firebase Auth is not configured");
    
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName });

    // Store user data in Realtime Database
    const userRef = ref(database, `users/${user.uid}`);
    await set(userRef, {
      email,
      displayName,
      role,
      createdAt: Date.now(),
    });

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
