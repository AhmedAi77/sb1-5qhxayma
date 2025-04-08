import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Languages } from 'lucide-react';
import { motion } from 'framer-motion';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <motion.button
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="language-toggle"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <Languages className="w-4 h-4 text-yellow-600/90" />
        <span className="text-yellow-600/90 font-display text-sm">
          {language === 'en' ? 'العربية' : 'English'}
        </span>
      </div>
    </motion.button>
  );
}