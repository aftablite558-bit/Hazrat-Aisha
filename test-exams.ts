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
    
    // 2. Fetch all published exams
    const examsRef = ref(database, 'exams/list');
    const examsSnap = await get(examsRef);
    const exams = [];
    if(examsSnap.exists()){
      examsSnap.forEach(child => {
        exams.push({ id: child.key, ...child.val() });
      });
    }
    console.log("Exams fetched:", exams.length);

    const publishedExams = exams.filter(e => e.status === 'published' && String(e.class).trim() === '5');
    console.log("Published exams for class 5:", publishedExams.length);

    for(const exam of publishedExams){
      const marksSnap = await get(ref(database, `exams/marks/${exam.id}`));
      console.log(`Marks for exam ${exam.id} exists?`, marksSnap.exists());
    }
    
  } catch(e) {
    console.error("Query failed:", e.message);
  }
  process.exit(0);
}
test();
