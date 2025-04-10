import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Languages, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="language-toggle"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`lang-icon-${isHovered ? 'hovered' : 'normal'}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="w-4 h-4 flex items-center justify-center"
          >
            {isHovered ? (
              <Globe className="w-4 h-4 text-cyan-400" />
            ) : (
              <Languages className="w-4 h-4 text-cyan-400" />
            )}
          </motion.div>
        </AnimatePresence>
        
        <span className="lang-icon font-display text-sm">
          {language === 'en' ? 'العربية' : 'English'}
        </span>
        
        <motion.div 
          className="absolute inset-0 bg-purple-500/5 rounded-lg -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.button>
  );
}