import React, { useEffect } from 'react';
import analytics from '../lib/analytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  useEffect(() => {
    // Track app initialization
    analytics.trackEvent('app_initialized', {
      timestamp: new Date().toISOString(),
      language: window.navigator.language
    });
    
    console.log('📊 Analytics provider initialized');
    
    // Track app lifecycle events
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        analytics.trackEvent('app_foreground');
      } else {
        analytics.trackEvent('app_background');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  return <>{children}</>;
}; 