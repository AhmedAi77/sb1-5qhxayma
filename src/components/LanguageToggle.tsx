import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Languages } from 'lucide-react';
import { motion } from 'framer-motion';

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();
  
  // Toggle language with immediate feedback
  const handleToggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
  };

  return (
    <motion.button
      onClick={handleToggleLanguage}
      className="language-toggle"
      whileTap={{ scale: 0.92 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      aria-label={t('language.toggle')}
    >
      <div className="flex items-center gap-2 relative">
        <Languages className="w-4 h-4 text-cyan-400" />
        <span className="lang-icon font-display text-sm">
          {t('language.toggle')}
        </span>
      </div>
    </motion.button>
  );
}