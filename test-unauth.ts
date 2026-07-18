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
    const q = query(ref(database, 'students'), orderByChild('rollNumber'), equalTo('101'));
    const snap = await get(q);
    console.log("students read success! Data exists:", snap.exists());
  } catch(e) {
    console.error("students Query failed:", e.message);
  }

  try {
    const examsRef = ref(database, 'exams/list');
    const snap = await get(examsRef);
    console.log("exams/list read success! Data exists:", snap.exists());
  } catch(e) {
    console.error("exams/list Query failed:", e.message);
  }
  process.exit(0);
}
test();
