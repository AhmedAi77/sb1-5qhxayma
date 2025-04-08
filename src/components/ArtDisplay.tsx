import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

export function ArtDisplay({ onComplete }: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Preload both images
    const artImage = new Image();
    const logoImage = new Image();
    
    artImage.src = 'https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/solo-leveling-art.jpg';
    logoImage.src = 'https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/solo-leveling-logo.png';
    
    Promise.all([
      new Promise(resolve => { artImage.onload = resolve; }),
      new Promise(resolve => { logoImage.onload = resolve; })
    ]).then(() => {
      setImageLoaded(true);
      setTimeout(() => setShowContent(true), 500);
    });

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 3000);

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
          className="fixed inset-0 bg-[#070412] z-50 overflow-hidden"
        >
          {imageLoaded && (
            <>
              <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070412]/50 to-[#070412]" />
                <img
                  src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/solo-leveling-art.jpg"
                  alt="Background Art"
                  className="w-full h-full object-cover opacity-60"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-8"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="w-full max-w-lg"
                >
                  <img
                    src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/solo-leveling-logo.png"
                    alt="Logo"
                    className="w-full h-auto mb-8"
                  />
                  <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="text-4xl sm:text-6xl font-display text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-600/90 to-yellow-500/90"
                  >
                    ARISE
                  </motion.h1>
                </motion.div>
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}