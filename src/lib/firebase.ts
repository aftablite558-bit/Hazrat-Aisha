import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getDatabase, Database } from "firebase/database";
import { getStorage, FirebaseStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: typeof import.meta !== 'undefined' ? import.meta.env.VITE_FIREBASE_API_KEY : process.env.VITE_FIREBASE_API_KEY,
  authDomain: typeof import.meta !== 'undefined' ? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN : process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: "https://hazrat-aisha-academy-cb36a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: typeof import.meta !== 'undefined' ? import.meta.env.VITE_FIREBASE_PROJECT_ID : process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: typeof import.meta !== 'undefined' ? import.meta.env.VITE_FIREBASE_STORAGE_BUCKET : process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: typeof import.meta !== 'undefined' ? import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID : process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: typeof import.meta !== 'undefined' ? import.meta.env.VITE_FIREBASE_APP_ID : process.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase config is actually provided
const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_api_key');

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let database: Database | undefined;
let storage: FirebaseStorage | undefined;

if (isConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    database = getDatabase(app, "https://hazrat-aisha-academy-cb36a-default-rtdb.asia-southeast1.firebasedatabase.app");
    storage = getStorage(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

export { app, auth, database, storage, isConfigured };
