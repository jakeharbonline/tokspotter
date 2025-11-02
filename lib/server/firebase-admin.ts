import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let app: App;
let db: Firestore;

export function initAdmin() {
  if (getApps().length === 0) {
    const credentials = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    app = initializeApp({
      credential: cert(credentials),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });

    db = getFirestore(app);
    console.log('✅ Firebase Admin initialized');
  }

  return { app, db: db || getFirestore() };
}

export function getDb(): Firestore {
  if (!db) {
    const { db: firestore } = initAdmin();
    return firestore;
  }
  return db;
}
