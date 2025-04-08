import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, User as UserIcon, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SignUpFormProps {
  onSignUp: (name: string, email: string) => Promise<void>;
  playClick: () => void;
  playHover: () => void;
  isSigningUp: boolean;
}

export function SignUpForm({ onSignUp, playClick, playHover, isSigningUp }: SignUpFormProps) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cooldownTime, setCooldownTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (cooldownTime && cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime(prev => prev ? prev - 1 : null);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cooldownTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSigningUp || cooldownTime) return;
    
    try {
      playClick();
      await onSignUp(name, email);
      setCooldownTime(60); // Set cooldown timer after attempt
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

  const isDisabled = !name.trim() || !email.trim() || isSigningUp || Boolean(cooldownTime);

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col items-center mb-8">
        <Zap className="w-12 h-12 text-yellow-600/90 mb-4" />
        <h1 className="text-5xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-yellow-600/90 to-yellow-500/90">
          {t('signup.title')}
        </h1>
      </div>

      <div>
        <label className="block text-sm font-medium font-display text-yellow-600/90 mb-2">
          {t('signup.name')}
        </label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-600/90 w-5 h-5" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onMouseEnter={() => playHover()}
            className="w-full pl-10 pr-4 py-3 bg-[#2D1B4E]/30 border border-yellow-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600/40 focus:border-transparent placeholder-purple-200/50 text-yellow-600/90 font-body"
            placeholder={t('signup.namePlaceholder')}
            disabled={isSigningUp}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium font-display text-yellow-600/90 mb-2">
          {t('signup.email')}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-600/90 w-5 h-5" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onMouseEnter={() => playHover()}
            className="w-full pl-10 pr-4 py-3 bg-[#2D1B4E]/30 border border-yellow-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600/40 focus:border-transparent placeholder-purple-200/50 text-yellow-600/90 font-body"
            placeholder={t('signup.emailPlaceholder')}
            disabled={isSigningUp}
          />
        </div>
      </div>

      <motion.button
        type="submit"
        className="w-full btn-primary py-3 rounded-lg font-bold font-display text-[#070412] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={() => !isDisabled && playHover()}
        disabled={isDisabled}
      >
        {isSigningUp ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-[#070412]/30 border-t-[#070412] rounded-full animate-spin" />
            <span>{t('signup.processing')}</span>
          </div>
        ) : cooldownTime ? (
          `${t('signup.wait')} ${cooldownTime}s`
        ) : (
          t('signup.submit')
        )}
      </motion.button>
    </motion.form>
  );
}