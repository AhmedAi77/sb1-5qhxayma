import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: Props) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show splash screen for 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for exit animation
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

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
          {/* Dark purple background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-950/90 via-black to-black"></div>
          
          {/* Full screen character image as background */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(/bf6bff01b58c1261896cb7e6fe65412a.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Overlay gradients for better visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/70"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>
          </div>
          
          {/* Content container - positioned in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-[280px] sm:w-[320px] md:w-[380px] relative z-20"
              style={{
                filter: "drop-shadow(0px 0px 15px rgba(255, 215, 0, 0.3))"
              }}
            >
              <img 
                src="/images/Solo-Leveling-Logo-PNG.png" 
                alt="Solo Leveling Logo" 
                className="w-full h-auto"
              />
            </motion.div>
            
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="relative z-20 mt-6 text-center"
            >
              <p className="text-red-400 text-lg sm:text-xl tracking-widest font-display">Arise...</p>
            </motion.div>
          </div>
          
          {/* Red accents and particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute left-0 top-1/3 w-[150px] h-[350px] bg-red-600/10 blur-[90px] animate-pulse"></div>
            <div className="absolute right-0 bottom-1/3 w-[180px] h-[250px] bg-red-600/10 blur-[90px] animate-pulse delay-700"></div>
            
            {/* Glitching effects */}
            <div className="w-[2px] h-[40px] bg-red-600/70 absolute left-[20%] top-[25%] animate-flicker"></div>
            <div className="w-[3px] h-[25px] bg-red-600/70 absolute right-[30%] top-[35%] animate-flicker-delay"></div>
            <div className="w-[1px] h-[20px] bg-red-600/70 absolute left-[40%] bottom-[30%] animate-flicker-delay-2"></div>
            <div className="w-[2px] h-[15px] bg-red-600/70 absolute right-[45%] bottom-[40%] animate-flicker"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 