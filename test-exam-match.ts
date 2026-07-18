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
    
    // find student
    const q = query(ref(database, 'students'), orderByChild('rollNumber'), equalTo('101'));
    const snap = await get(q);
    let foundStudent = null;
    snap.forEach(c => {
      if(String(c.val().class) === '5') foundStudent = {id: c.key, ...c.val()};
    });

    console.log("Found student ID:", foundStudent.id);

    // fetch exams
    const examsSnap = await get(ref(database, 'exams/list'));
    const publishedExams = [];
    examsSnap.forEach(c => {
      const e = c.val();
      if(e.status === 'published' && String(e.class).trim() === '5') {
        publishedExams.push({id: c.key, ...e});
      }
    });

    // fetch marks
    for(const exam of publishedExams) {
      const marksSnap = await get(ref(database, `exams/marks/${exam.id}`));
      const examMarks = marksSnap.val();
      console.log(`Marks for student ${foundStudent.id} in exam ${exam.title}:`, examMarks && examMarks[foundStudent.id]);
    }

  } catch(e) {
    console.error("Test failed:", e.message);
  }
  process.exit(0);
}
test();
