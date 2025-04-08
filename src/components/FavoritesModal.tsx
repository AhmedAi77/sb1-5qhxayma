import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Trophy, Clock, Activity } from 'lucide-react';
import type { FavoriteExercise } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  favorites: FavoriteExercise[];
  onRemove: (id: string) => void;
  onClose: () => void;
}

export function FavoritesModal({ favorites, onRemove, onClose }: Props) {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="glass-card rounded-xl w-full max-w-lg p-6 space-y-4 modal-content"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-display text-yellow-600/90">{t('favorites.title')}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#2D1B4E]/30 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-yellow-600/90" />
            </button>
          </div>
          
          <div className="space-y-3">
            {(!favorites || favorites.length === 0) ? (
              <p className="text-center text-purple-200/60 py-8">
                {t('favorites.empty')}
              </p>
            ) : (
              favorites.map(favorite => (
                <motion.div
                  key={favorite.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  className="glass-effect rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#2D1B4E]/30 rounded-lg">
                        <Star className="w-5 h-5 text-yellow-600/90" />
                      </div>
                      <div>
                        <h3 className="font-display text-yellow-600/90">{favorite.type}</h3>
                        <div className="flex flex-wrap items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-xs text-purple-200/60">
                            <Trophy className="w-4 h-4" />
                            <span>{favorite.personalBest} {t('favorites.best')}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-purple-200/60">
                            <Activity className="w-4 h-4" />
                            <span>{favorite.timesPerformed}x {t('favorites.timesPerformed')}</span>
                          </div>
                          {favorite.lastPerformed && (
                            <div className="flex items-center gap-1 text-xs text-purple-200/60">
                              <Clock className="w-4 h-4" />
                              <span>{t('favorites.lastPerformed')}: {new Date(favorite.lastPerformed).toLocaleDateString(isRTL ? 'ar-SA' : undefined)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemove(favorite.id)}
                      className="p-2 hover:bg-[#2D1B4E]/30 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-purple-200/60" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}