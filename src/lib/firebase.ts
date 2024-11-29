import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDmfSKep6vYG4r4slwmXGLmdAIEvYnHnIc",
  authDomain: "ndex236.firebaseapp.com",
  projectId: "ndex236",
  storageBucket: "ndex236.firebasestorage.app",
  messagingSenderId: "413273183972",
  appId: "1:413273183972:web:3d2258028a5becc14b3ef1",
  measurementId: "G-WRBD9RCVL3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics only if supported
let analytics = null;
isSupported().then(yes => {
  if (yes) {
    analytics = getAnalytics(app);
  }
});

export { analytics };
export default app;