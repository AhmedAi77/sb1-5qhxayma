import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Preload the art image
    const img = new Image();
    img.src = '/solo-leveling-art.jpg';
    img.onload = () => setImageLoaded(true);

    // Show loading screen for 2 seconds
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
          className="fixed inset-0 bg-[#070412] z-50 flex items-center justify-center p-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#2D1B4E]/30 via-[#070412] to-[#4C1D95]/30" />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#2D1B4E]/20 rounded-full blur-[100px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#2D1B4E]/20 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
          
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
                </motion.div>
              )}
              <Zap className="w-16 h-16 text-yellow-600/90 mb-4" />
              <h1 className="text-5xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-yellow-600/90 to-yellow-500/90">
                ARISE
              </h1>
            </motion.div>

            <div className="w-16 h-16 relative">
              <div className="absolute inset-0 border-4 border-yellow-600/20 border-t-yellow-600/90 rounded-full animate-spin" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}