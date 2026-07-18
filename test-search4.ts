import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, query, orderByChild, equalTo } from 'firebase/database';

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
const database = getDatabase(app);

async function test() {
  try {
    const studentsRef = ref(database, 'students');
    const q = query(studentsRef, orderByChild('rollNumber'), equalTo('101'));
    const snap = await get(q);
    console.log("Query by rollNumber success! Data exists:", snap.exists());
    if (snap.exists()) {
       snap.forEach(c => console.log(c.val().class, c.val().rollNumber))
    }
  } catch(e) {
    console.error("Query failed:", e.message);
  }
  process.exit(0);
}
test();
