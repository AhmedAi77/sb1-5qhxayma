import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, ArrowUp, Volume2 } from 'lucide-react';
import { sounds, initSoundEffects, unlockAudio } from '../lib/soundManager';
import { useAudio } from './BackgroundMusic';

interface Props {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const [soundsInitialized, setSoundsInitialized] = useState(false);
  const { startPlaying } = useAudio();

  useEffect(() => {
    // Initialize sound effects first
    initSoundEffects();
    
    // Force unlock audio
    unlockAudio();
    
    // Automatically start playing the background music - no click required
    startPlaying();
    setSoundsInitialized(true);
    
    // Force play splash sounds immediately
    setTimeout(() => {
      sounds.splash({ loop: false });
      
      // Also try a click sound for good measure
      setTimeout(() => {
        sounds.click();
      }, 200);
    }, 100);
    
    // Play system sounds occasionally
    const soundInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        sounds.system();
      }
    }, 800); // Less frequent to prevent sound fatigue

    // Show splash screen for 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      sounds.stopSplash(); // Stop splash sound
      sounds.success(); // Play success sound
      setTimeout(onComplete, 500); // Wait for exit animation
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(soundInterval);
      sounds.stopSplash(); // Ensure sound stops when component unmounts
    };
  }, [onComplete, startPlaying]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-black z-50 overflow-hidden"
        >
          {/* Sound indicator in corner - always shows "Sound On" now */}
          <motion.div 
            className="absolute top-4 right-4 z-[70] flex items-center gap-2 bg-purple-900/30 backdrop-blur-sm px-3 py-1 rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Volume2 size={16} className="text-purple-300" />
            <span className="text-purple-300 text-xs">Sound On</span>
          </motion.div>
          
          {/* Dark background gradient matching app theme */}
          <div className="absolute inset-0 bg-gradient-radial from-purple-950/90 via-dark to-black"></div>
          
          {/* Character background - WITH contained glitch effect */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {/* Character Image Container - Apply glitch effect only to this container */}
            <div className="relative w-auto h-[98vh] max-w-[100%] overflow-hidden flex items-center justify-center">
              <div 
                className="character-glitch relative w-auto h-full flex items-center justify-center" 
                style={{ 
                  filter: "brightness(1.15) contrast(1.08) saturate(1.05)",
                  boxShadow: "0 0 30px rgba(138, 79, 219, 0.3)"
                }}
              >
                <img 
                  src="/bf6bff01b58c1261896cb7e6fe65412a.jpg" 
                  alt="Character"
                  className="h-full w-auto max-h-[98vh] object-contain"
                  style={{ opacity: 1 }}
                />
                {/* Further reduced glitch elements */}
                <div className="absolute inset-0 digital-distortion pointer-events-none opacity-25"></div>
                <div className="absolute inset-0 glitch-scanlines pointer-events-none opacity-20"></div>
                <div className="absolute inset-0 glitch-noise pointer-events-none opacity-15"></div>
                <div className="absolute inset-0 glitch-flicker pointer-events-none opacity-30"></div>
              </div>
            </div>
            
            {/* Overlay gradients with pointer-events-none to prevent interfering with interactions */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none"></div>
          </div>
          
          {/* All content centered in the middle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 ios-safe-padding">
            {/* Logo with enhanced shadow - no glitch effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="splash-logo relative z-20 mx-auto mb-6"
              style={{
                filter: "drop-shadow(0px 0px 20px rgba(138, 79, 219, 0.5))"
              }}
            >
              <motion.div>
                <img 
                  src="/images/Solo-Leveling-Logo-PNG.png" 
                  alt="Solo Leveling Logo" 
                  className="w-full h-auto"
                />
              </motion.div>
            </motion.div>
            
            {/* Training theme elements - positioned under the logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="relative z-20 flex flex-wrap items-center justify-center gap-3"
            >
              <div className="bg-purple-600/20 backdrop-blur-sm p-2 rounded-full">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <Dumbbell size={24} className="text-purple-400" />
                </motion.div>
              </div>
              
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              >
                <p className="text-purple-400 text-base sm:text-lg tracking-widest font-display uppercase font-bold">
                  Training System
                </p>
              </motion.div>
              
              <div className="bg-purple-600/20 backdrop-blur-sm p-2 rounded-full">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, -5, 0, 5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: 0.5
                  }}
                >
                  <ArrowUp size={24} className="text-purple-400" />
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          {/* Ambient effects matching purple theme - no glitching */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Ambient glow effects */}
            <div className="absolute left-0 top-1/3 w-[200px] h-[350px] bg-purple-600/10 blur-[100px] animate-pulse"></div>
            <div className="absolute right-0 bottom-1/3 w-[200px] h-[350px] bg-purple-600/10 blur-[100px] animate-pulse delay-700"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-purple-600/15 blur-[70px] animate-pulse-slow"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 