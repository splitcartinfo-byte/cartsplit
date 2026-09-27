import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Retrieve Vite client credentials
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || '';
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '';
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || '';
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '';
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '';
const appId = import.meta.env.VITE_FIREBASE_APP_ID || '';
const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '';

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId: measurementId || undefined,
};

// Check if valid Firebase credentials exist
export const isFirebaseConfigured = Boolean(
  apiKey &&
  apiKey !== '' &&
  apiKey !== 'YOUR_FIREBASE_API_KEY_HERE' &&
  apiKey !== 'YOUR_FIREBASE_API_KEY'
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.warn('Firebase initialization warning:', error);
  }
} else if (import.meta.env.DEV) {
  console.info(
    '[SplitCart Config Notice] Firebase environment variables not fully configured. Using fallback local authentication state.'
  );
}

export { app, auth, db, googleProvider };
