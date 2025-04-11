// Import the Firebase SDK components we need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration - extracted from google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyDTd0uoKHuvvwArkQ6ZOysGKPjCQjzUups",
  authDomain: "solo-leavling-traing-app.firebaseapp.com",
  projectId: "solo-leavling-traing-app",
  storageBucket: "solo-leavling-traing-app.firebasestorage.app",
  messagingSenderId: "738365724343",
  appId: "1:738365724343:android:befe6a9446313948315f32",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics conditionally (it may not be supported in all environments)
export const getAnalyticsInstance = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export default app; 