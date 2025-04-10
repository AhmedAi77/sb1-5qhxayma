import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Preload the art image
    const img = new Image();
    img.src = '/solo-leveling-art.jpg';
    img.onload = () => setImageLoaded(true);

    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const next = prev + (Math.random() * 15);
        return next > 100 ? 100 : next;
      });
    }, 200);

    // Show loading screen for 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for exit animation
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-[#070412] z-50 flex items-center justify-center p-8 overflow-hidden"
        >
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2D1B4E]/30 via-[#070412] to-[#4C1D95]/30" />
          
          {/* Animated particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={`particle-${i}`} 
              className={`particle ${i % 2 === 0 ? 'particle-cyan' : ''}`}
              style={{
                '--left': `${Math.random() * 100}%`,
                '--duration': `${10 + Math.random() * 8}s`,
                '--delay': `${Math.random() * 2}s`,
                '--opacity': `${0.2 + Math.random() * 0.3}`,
              } as React.CSSProperties}
            />
          ))}
          
          {/* Stars effect */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div 
              key={`star-${i}`} 
              className="star"
              style={{
                '--top': `${Math.random() * 100}%`,
                '--left': `${Math.random() * 100}%`,
                '--duration': `${2 + Math.random() * 3}s`,
                '--delay': `${Math.random() * 2}s`,
                '--opacity': `${0.2 + Math.random() * 0.3}`,
                '--opacity-bright': `${0.7 + Math.random() * 0.3}`,
                '--size': `${1 + Math.random() * 1.5}px`,
              } as React.CSSProperties}
            />
          ))}
          
          {/* Scanning line */}
          <div className="scanning-line" />
          
          {/* Glow effects */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#2D1B4E]/20 rounded-full blur-[100px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#4C1D95]/20 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-center gap-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              {imageLoaded && (
                <motion.div
                  className="w-64 h-64 mb-8 relative overflow-hidden rounded-lg shadow-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <img
                    src="/solo-leveling-art.jpg"
                    alt="Solo Leveling Art"
                    className="w-full h-full object-cover transform scale-105 hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070412] via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#070412]/50 via-transparent to-transparent" />
                  
                  {/* Dynamic data streams overlay */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div 
                      key={`data-stream-overlay-${i}`} 
                      className="data-stream absolute"
                      style={{
                        '--left': `${10 + (i * 20)}%`,
                        '--duration': `${3 + Math.random() * 2}s`,
                        '--delay': `${Math.random() * 2}s`,
                        '--opacity': `${0.2 + Math.random() * 0.2}`,
                      } as React.CSSProperties}
                    />
                  ))}
                </motion.div>
              )}
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <div className="flex flex-col items-center">
                  <motion.div className="mb-3 relative"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-20 h-20 relative">
                      {/* Improved system logo with circuit patterns */}
                      <svg viewBox="0 0 24 24" className="w-full h-full" style={{ filter: "drop-shadow(0 0 8px rgba(79,209,219,0.4))" }}>
                        <defs>
                          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgba(79,209,219,0.9)" />
                            <stop offset="100%" stopColor="rgba(234,179,8,0.9)" />
                          </linearGradient>
                        </defs>
                        
                        {/* Outer circle */}
                        <motion.circle 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          fill="none" 
                          stroke="url(#logoGradient)" 
                          strokeWidth="0.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
                        />
                        
                        {/* Power symbol */}
                        <motion.path
                          d="M12 7v5M7.5 10a4.5 4.5 0 1 0 9 0"
                          stroke="url(#logoGradient)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          fill="none"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                        />
                        
                        {/* Circuit details */}
                        <motion.path
                          d="M4 14l2 2M20 14l-2 2M12 19v2"
                          stroke="rgba(79,209,219,0.7)"
                          strokeWidth="0.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 1, delay: 1.3, ease: "easeInOut" }}
                        />
                      </svg>
                      
                      {/* Digital circuit indicators */}
                      <motion.div 
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1.5 }}
                      >
                        <div className="absolute top-1/4 left-0 w-1 h-1 rounded-full bg-cyan-400/70 animate-pulse-slow" />
                        <div className="absolute top-0 right-1/4 w-1 h-1 rounded-full bg-yellow-500/70 animate-flicker" />
                        <div className="absolute bottom-0 left-1/3 w-1 h-1 rounded-full bg-cyan-400/70 animate-flicker-delay" />
                        <div className="absolute right-0 top-2/3 w-1 h-1 rounded-full bg-yellow-500/70 animate-pulse-slow" />
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  <div className="relative text-center">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                      className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent w-40 mx-auto mb-4"
                    />
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 1.4 }}
                      className="text-base font-mono text-cyan-400/90 uppercase tracking-wider font-bold mb-2"
                      style={{ textShadow: "0 0 10px rgba(79,209,219,0.6)" }}
                    >
                      SYSTEM LOADING
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ 
                        duration: 2, 
                        delay: 1.8,
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                      className="flex items-center justify-center gap-2 text-sm font-mono text-cyan-400/90"
                      style={{ textShadow: "0 0 8px rgba(79,209,219,0.4)" }}
                    >
                      <span className="inline-block w-1.5 h-1.5 bg-cyan-400/90 rounded-full animate-pulse-slow" />
                      <span>INITIALIZING TRAINING PROTOCOLS</span>
                      <span className="inline-block w-1.5 h-1.5 bg-cyan-400/90 rounded-full animate-flicker-delay" />
                    </motion.div>
                    
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, delay: 2.0 }}
                      className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent w-64 mx-auto mt-4"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Loading indicator */}
            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
              <div className="progress-bg w-full h-2">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${loadingProgress}%` }}
                  className="progress-animate h-full"
                />
              </div>
              
              <div className="flex items-center justify-between w-full text-sm text-purple-300/80">
                <span>INITIALIZING</span>
                <span>{Math.floor(loadingProgress)}%</span>
              </div>
              
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-10 h-10 mt-2 relative"
              >
                <div className="absolute inset-0 border-2 border-t-yellow-500/90 border-r-yellow-500/60 border-b-yellow-500/30 border-l-yellow-500/10 rounded-full" />
                <div className="absolute inset-2 border border-t-cyan-400/80 border-r-cyan-400/50 border-b-cyan-400/20 border-l-cyan-400/10 rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}