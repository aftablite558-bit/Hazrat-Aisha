import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, query, orderByChild, equalTo } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL || "https://hazrat-aisha-academy-cb36a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};
console.log(firebaseConfig.databaseURL)

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function test() {
  try {
    const examsRef = ref(database, 'exams/list');
    const snap = await get(examsRef);
    console.log("Exams list read success! Data exists:", snap.exists());
  } catch(e) {
    console.error("Exams read failed:", e.message);
  }
  process.exit(0);
}
test();
