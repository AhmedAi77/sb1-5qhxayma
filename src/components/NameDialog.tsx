import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  onSubmit: (name: string) => void;
  playClick: () => void;
  playHover: () => void;
}

export function NameDialog({ onSubmit, playClick, playHover }: Props) {
  const { t } = useLanguage();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      playClick();
      onSubmit(name.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-[#070412]/90 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-md glass-card rounded-2xl p-8"
      >
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col items-center mb-8">
            <Zap className="w-12 h-12 text-yellow-600/90 mb-4" />
            <h1 className="text-5xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-yellow-600/90 to-yellow-500/90">
              ARISE
            </h1>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium font-display text-yellow-600/90 mb-2">
              {t('signup.name')}
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-600/90 w-5 h-5" />
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => playHover()}
                className="w-full pl-10 pr-4 py-3 bg-[#2D1B4E]/30 border border-yellow-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600/40 focus:border-transparent placeholder-purple-200/50 text-yellow-600/90 font-body"
                placeholder={t('signup.namePlaceholder')}
                required
                minLength={2}
                maxLength={30}
                autoFocus
              />
            </div>
          </div>

          <motion.button
            type="submit"
            className="w-full btn-primary py-3 rounded-lg font-bold font-display text-[#070412] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => playHover()}
            disabled={!name.trim()}
          >
            {t('signup.submit')}
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}