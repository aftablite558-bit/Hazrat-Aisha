import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
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
const auth = getAuth(app);
const database = getDatabase(app);

async function test() {
  try {
    await signInWithEmailAndPassword(auth, 'test@hazrataisha.edu.in', 'password123');
    const q = query(ref(database, 'students'), orderByChild('rollNumber'), equalTo('101'));
    const snap = await get(q);
    console.log("students read success! Data exists:", snap.exists());
    if(snap.exists()){
      snap.forEach(c => console.log(c.val()));
    }
  } catch(e) {
    console.error("students Query failed:", e.message);
  }
  process.exit(0);
}
test();
