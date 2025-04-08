import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  playHover: () => void;
  playClick: () => void;
}

export function AuthForm({ playHover, playClick }: Props) {
  const { t } = useLanguage();
  const { signUp, signIn } = useAuth();
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !name.trim() || !password) return;

    try {
      setLoading(true);
      playClick();

      if (isSignUp) {
        await signUp(name.trim(), password);
      } else {
        await signIn(name.trim(), password);
      }
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium font-display text-yellow-600/90 mb-2">
          {t('auth.name.label')}
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
            placeholder={t('auth.name.placeholder')}
            required
            disabled={loading}
            minLength={2}
            maxLength={30}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium font-display text-yellow-600/90 mb-2">
          {t('auth.password.label')}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-600/90 w-5 h-5" />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => playHover()}
            className="w-full pl-10 pr-4 py-3 bg-[#2D1B4E]/30 border border-yellow-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600/40 focus:border-transparent placeholder-purple-200/50 text-yellow-600/90 font-body"
            placeholder={t('auth.password.placeholder')}
            required
            disabled={loading}
            minLength={6}
          />
        </div>
      </div>

      <motion.button
        type="submit"
        className="w-full btn-primary py-3 rounded-lg font-bold font-display text-[#070412] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        onMouseEnter={() => playHover()}
      >
        {loading ? t('auth.processing') : isSignUp ? t('auth.signUp') : t('auth.signIn')}
      </motion.button>

      <button
        type="button"
        onClick={() => {
          playClick();
          setIsSignUp(!isSignUp);
          setName('');
          setPassword('');
        }}
        className="w-full text-center text-sm text-yellow-600/90 hover:text-yellow-500/90 transition-colors"
      >
        {isSignUp ? t('auth.haveAccount') : t('auth.needAccount')}
      </button>
    </motion.form>
  );
}