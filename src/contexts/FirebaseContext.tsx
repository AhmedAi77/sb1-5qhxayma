import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  firestore, 
  storage, 
  getAnalyticsInstance 
} from '../lib/firebase';
import { Analytics } from 'firebase/analytics';
import { User } from 'firebase/auth';

interface FirebaseContextType {
  auth: typeof auth;
  firestore: typeof firestore;
  storage: typeof storage;
  analytics: Analytics | null;
  currentUser: User | null;
  isLoading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  auth,
  firestore,
  storage,
  analytics: null,
  currentUser: null,
  isLoading: true,
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize analytics
  useEffect(() => {
    const initAnalytics = async () => {
      const analyticsInstance = await getAnalyticsInstance();
      setAnalytics(analyticsInstance);
    };

    initAnalytics();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    auth,
    firestore,
    storage,
    analytics,
    currentUser,
    isLoading,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}; 