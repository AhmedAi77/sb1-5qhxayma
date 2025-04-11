import { getAnalytics, logEvent, setUserId, setUserProperties, isSupported } from 'firebase/analytics';
import app from './firebase';

// Initialize analytics conditionally
let analytics: any = null;

// Initialize analytics
const initAnalytics = async () => {
  if (await isSupported()) {
    try {
      analytics = getAnalytics(app);
      console.log('📊 Analytics initialized successfully');
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  } else {
    console.log('📊 Analytics not supported in this environment');
  }
};

// Initialize immediately
initAnalytics();

// Track screen view
export const trackScreenView = (screenName: string) => {
  if (!analytics) return;
  
  try {
    logEvent(analytics, 'screen_view', {
      firebase_screen: screenName,
      firebase_screen_class: screenName,
    });
    console.log(`📊 Screen tracked: ${screenName}`);
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

// Track user action/event
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (!analytics) return;
  
  try {
    logEvent(analytics, eventName, eventParams);
    console.log(`📊 Event tracked: ${eventName}`, eventParams);
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

// Track user login
export const trackLogin = (method: string) => {
  if (!analytics) return;
  
  try {
    logEvent(analytics, 'login', {
      method: method
    });
    console.log(`📊 Login tracked: ${method}`);
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

// Set user ID for tracking
export const setAnalyticsUserId = (userId: string) => {
  if (!analytics) return;
  
  try {
    setUserId(analytics, userId);
    console.log(`📊 User ID set: ${userId}`);
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

// Set user properties for better segmentation
export const setAnalyticsUserProperties = (properties: Record<string, any>) => {
  if (!analytics) return;
  
  try {
    setUserProperties(analytics, properties);
    console.log('📊 User properties set:', properties);
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

// Track exercise start
export const trackExerciseStart = (exerciseId: string, exerciseName: string) => {
  trackEvent('exercise_start', {
    exercise_id: exerciseId,
    exercise_name: exerciseName,
  });
};

// Track exercise completion
export const trackExerciseComplete = (exerciseId: string, exerciseName: string, timeSpentSeconds: number) => {
  trackEvent('exercise_complete', {
    exercise_id: exerciseId,
    exercise_name: exerciseName,
    time_spent_seconds: timeSpentSeconds,
  });
};

// Track level up
export const trackLevelUp = (newLevel: number, xpGained: number) => {
  trackEvent('level_up', {
    new_level: newLevel,
    xp_gained: xpGained,
  });
};

// Track app errors
export const trackError = (errorCode: string, errorMessage: string) => {
  trackEvent('app_error', {
    error_code: errorCode,
    error_message: errorMessage,
  });
};

export default {
  trackScreenView,
  trackEvent,
  trackLogin,
  setAnalyticsUserId,
  setAnalyticsUserProperties,
  trackExerciseStart,
  trackExerciseComplete,
  trackLevelUp,
  trackError,
}; 