import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set, get, query, orderByChild, equalTo, push } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://hazrat-aisha-academy-cb36a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

async function test() {
  try {
    let user;
    try {
      const cred = await signInWithEmailAndPassword(auth, 'admin@hazrataisha.edu.in', 'admin123');
      user = cred.user;
    } catch(e) {
      console.log("Login failed, trying to create...", e.message);
      const cred = await createUserWithEmailAndPassword(auth, 'test@hazrataisha.edu.in', 'password123');
      user = cred.user;
    }
    console.log("Logged in:", user.uid);

    // Add a student
    const newStudentRef = push(ref(database, 'students'));
    await set(newStudentRef, {
      firstName: "Test",
      lastName: "Student",
      class: "10",
      rollNumber: "101",
      admissionNumber: "ADM-999"
    });
    console.log("Added student:", newStudentRef.key);

    // Search like the Result Portal
    const q = query(ref(database, 'students'), orderByChild('class'), equalTo('10'));
    const snap = await get(q);
    console.log("Search by class snap exists?", snap.exists());
    let found = null;
    if (snap.exists()) {
       snap.forEach(c => {
         const data = c.val();
         if (String(data.rollNumber) === '101') {
           found = data;
         }
       });
    }
    console.log("Found student matches?", found !== null);
    
  } catch(e) {
    console.error("Test failed:", e.message);
  }
  process.exit(0);
}
test();
