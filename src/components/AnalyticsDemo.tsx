import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import analytics from '../lib/analytics';

export const AnalyticsDemo: React.FC = () => {
  const [eventCount, setEventCount] = useState(0);
  const [lastEvent, setLastEvent] = useState<string | null>(null);
  
  useEffect(() => {
    // Track screen view when component mounts
    analytics.trackScreenView('analytics_demo');
  }, []);
  
  const trackSimpleEvent = () => {
    analytics.trackEvent('demo_button_click');
    updateEventState('demo_button_click');
  };
  
  const trackParameterizedEvent = () => {
    analytics.trackEvent('feature_toggle', { 
      feature_name: 'dark_mode',
      enabled: true 
    });
    updateEventState('feature_toggle (dark_mode)');
  };
  
  const trackUserAction = () => {
    analytics.trackEvent('user_action', {
      action_type: 'avatar_change',
      success: true,
      time_taken: 2.5
    });
    updateEventState('user_action (avatar_change)');
  };
  
  const trackLevelUp = () => {
    analytics.trackLevelUp(5, 1000);
    updateEventState('level_up (level 5)');
  };
  
  const trackError = () => {
    analytics.trackError('auth/invalid-email', 'The email address is badly formatted.');
    updateEventState('error (auth/invalid-email)');
  };
  
  const updateEventState = (eventName: string) => {
    setEventCount(prev => prev + 1);
    setLastEvent(eventName);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card p-4 m-4"
    >
      <h2 className="text-xl text-purple-300 font-display mb-4">Analytics Demo</h2>
      
      <div className="mb-6 bg-purple-900/30 p-3 rounded-md">
        <h3 className="text-cyan-300 text-lg mb-2">Event Tracker</h3>
        <p className="text-purple-200 mb-2">Events tracked: <span className="text-white font-bold">{eventCount}</span></p>
        {lastEvent && (
          <p className="text-purple-200">
            Last event: <span className="text-white font-bold">{lastEvent}</span>
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-secondary p-3"
          onClick={trackSimpleEvent}
        >
          Track Simple Event
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-secondary p-3"
          onClick={trackParameterizedEvent}
        >
          Track Feature Toggle
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-secondary p-3"
          onClick={trackUserAction}
        >
          Track User Action
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-secondary p-3"
          onClick={trackLevelUp}
        >
          Track Level Up
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-secondary p-3"
          onClick={trackError}
        >
          Track Error
        </motion.button>
      </div>
      
      <div className="mt-6 p-3 bg-purple-900/20 rounded-md text-sm">
        <p className="text-purple-200 mb-2">
          <span className="text-cyan-300">Note:</span> Events are being tracked in Firebase Analytics. You can see the console logs below and check the Firebase dashboard for results.
        </p>
        <p className="text-purple-200">
          <span className="text-cyan-300">Pro Tip:</span> It may take up to 24 hours for events to appear in the Firebase Analytics dashboard.
        </p>
      </div>
    </motion.div>
  );
}; 