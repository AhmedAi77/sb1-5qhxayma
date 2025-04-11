import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '../lib/analytics';
import { useFirebase } from '../contexts/FirebaseContext';

/**
 * Custom hook for tracking analytics throughout the app.
 * 
 * Usage:
 * 1. For page tracking: Simply add useAnalytics() at the top level of your page component
 * 2. For event tracking: const { trackEvent } = useAnalytics(); trackEvent('button_click');
 */
export const useAnalytics = () => {
  const location = useLocation();
  const { currentUser } = useFirebase();
  
  // Automatically track page views when location changes
  useEffect(() => {
    // Extract page name from the path
    const pageName = location.pathname.split('/').pop() || 'home';
    analytics.trackScreenView(pageName);
  }, [location]);
  
  // Set user ID when user changes
  useEffect(() => {
    if (currentUser?.uid) {
      analytics.setAnalyticsUserId(currentUser.uid);
      
      // Set some basic user properties
      analytics.setAnalyticsUserProperties({
        account_created_at: currentUser.metadata.creationTime,
        last_login_at: currentUser.metadata.lastSignInTime,
        has_email: !!currentUser.email,
        has_phone: !!currentUser.phoneNumber,
      });
    }
  }, [currentUser]);
  
  // Return analytics functions to be used
  return {
    trackScreenView: analytics.trackScreenView,
    trackEvent: analytics.trackEvent,
    trackLogin: analytics.trackLogin,
    trackExerciseStart: analytics.trackExerciseStart,
    trackExerciseComplete: analytics.trackExerciseComplete,
    trackLevelUp: analytics.trackLevelUp,
    trackError: analytics.trackError,
    setUserProperties: analytics.setAnalyticsUserProperties,
  };
}; 