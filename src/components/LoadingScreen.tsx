import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Trophy, ArrowUp, Volume2 } from 'lucide-react';
import { sounds, initSoundEffects, unlockAudio } from '../lib/soundManager';

interface Props {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [soundsReady, setSoundsReady] = useState(false);

  // Function to test sound effects
  const playSoundEffect = () => {
    sounds.click();
    setTimeout(() => sounds.system(), 200);
    setSoundsReady(true);
  };

  useEffect(() => {
    // Initialize sound effects first
    initSoundEffects();
    
    // Make sure audio is unlocked
    unlockAudio();
    
    // Play loading sound with loop - try multiple times with increasing volume
    let attempts = 0;
    const tryPlaySound = () => {
      if (attempts < 3) {
        attempts++;
        // Try with increasing volume each attempt
        sounds.loading({ loop: true, volume: 0.2 + (attempts * 0.1) });
        setSoundsReady(true);
      }
    };
    
    setTimeout(tryPlaySound, 100);
    setTimeout(tryPlaySound, 300);
    setTimeout(tryPlaySound, 600);
    
    // Simulate loading with a smooth progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = 4 + Math.random() * 10;
        const next = prev + increment;
        
        // Play system sound when reaching certain progress points
        if (next >= 25 && prev < 25 && soundsReady) {
          sounds.click();
        }
        if (next >= 50 && prev < 50 && soundsReady) {
          sounds.system();
        }
        if (next >= 75 && prev < 75 && soundsReady) {
          sounds.click();
        }
        if (next >= 100 && prev < 100 && soundsReady) {
          sounds.success();
        }
        
        return next > 100 ? 100 : next;
      });
    }, 150);

    // Show loading screen for a shorter time - 1.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      sounds.stopLoading(); // Stop loading sound
      setTimeout(onComplete, 300); // Faster exit animation
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      sounds.stopLoading(); // Ensure sound stops when component unmounts
    };
  }, [onComplete, soundsReady]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-dark z-50 flex flex-col items-center justify-center p-4"
        >
          {/* Sound indicator button */}
          <motion.div 
            className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-purple-900/30 backdrop-blur-sm px-3 py-1 rounded-md cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={playSoundEffect}
          >
            <Volume2 size={16} className="text-purple-300" />
            <span className="text-purple-300 text-xs">
              {soundsReady ? 'Sound On' : 'Click for Sound'}
            </span>
          </motion.div>
          
          {/* Background subtle art elements - NO glitch effects */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Power level circles */}
            <motion.div 
              className="absolute top-1/4 left-1/4 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Smooth animations instead of glitchy ones */}
            <motion.div
              className="absolute inset-x-0 top-[20%] h-[1px] bg-purple-400/20"
              animate={{ scaleX: [0, 1, 0], opacity: [0, 0.6, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
            
            <motion.div
              className="absolute inset-x-0 bottom-[30%] h-[1px] bg-cyan-400/20"
              animate={{ scaleX: [0, 1, 0], opacity: [0, 0.6, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, delay: 1.5 }}
            />
            
            {/* Subtle floating particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className={`absolute w-1 h-1 rounded-full ${
                  i % 2 === 0 ? 'bg-purple-400/30' : 'bg-cyan-400/30'
                }`}
                style={{
                  top: `${30 + Math.random() * 40}%`,
                  left: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  x: [0, Math.random() * 10 - 5, 0],
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm flex flex-col items-center gap-6 relative z-10"
          >
            {/* Modern training app logo */}
            <div className="relative mb-2">
              <motion.div
                className="w-20 h-20 flex items-center justify-center relative"
              >
                {/* Animated background circle */}
                <motion.div 
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/20 to-cyan-500/20"
                  animate={{ 
                    boxShadow: [
                      "0 0 10px rgba(124, 58, 237, 0.2)", 
                      "0 0 20px rgba(124, 58, 237, 0.4)", 
                      "0 0 10px rgba(124, 58, 237, 0.2)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Ring effect */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-purple-500/20"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                {/* Dumbbell icon with pulsing animation */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    y: [0, -2, 0]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                  className="relative"
                >
                  <Dumbbell size={36} className="text-cyan-400" />
                </motion.div>
                
                {/* Trophy mini icon for gamification */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.3, type: "spring" }}
                  className="absolute -top-1 -right-1 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full p-1.5 shadow-lg"
                >
                  <Trophy size={14} className="text-dark" />
                </motion.div>
                
                {/* Level up indicator */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.3, type: "spring" }}
                  className="absolute -bottom-1 -right-1 bg-gradient-to-br from-green-400 to-green-600 rounded-full p-1.5 shadow-lg"
                >
                  <ArrowUp size={14} className="text-dark" />
                </motion.div>
              </motion.div>
            </div>
            
            {/* Loading text */}
            <motion.div 
              className="uppercase text-sm tracking-widest font-bold text-purple-200 font-display"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Preparing Your Training
            </motion.div>
            
            {/* Simple progress bar */}
            <div className="w-full max-w-xs h-1.5 bg-purple-900/30 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 bg-size-200 animate-shine rounded-full"
                style={{ 
                  width: `${progress}%`,
                  backgroundSize: "200% 100%"
                }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}