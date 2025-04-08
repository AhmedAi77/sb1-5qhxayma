import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Award, Clock } from 'lucide-react';
import type { UserStats } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  stats: UserStats;
  onClose: () => void;
  playClick?: () => void;
  playHover?: () => void;
}

export function StatsModal({ stats, onClose, playClick, playHover }: Props) {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  // Early return with loading state if stats is undefined
  if (!stats) {
    return (
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
          className="glass-card rounded-xl w-full max-w-lg p-6 text-center"
          onClick={e => e.stopPropagation()}
        >
          <div className="text-yellow-600/90">Loading stats...</div>
        </motion.div>
      </motion.div>
    );
  }

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
          className="glass-card rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-yellow-600/20">
            <h2 className="text-2xl font-display text-yellow-600/90">{t('stats.title')}</h2>
            <button
              onClick={onClose}
              onMouseEnter={() => playHover?.()}
              className="p-2 hover:bg-[#2D1B4E]/30 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-yellow-600/90" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-effect rounded-lg p-4 text-center">
                <Activity className="w-6 h-6 text-yellow-600/90 mx-auto mb-2" />
                <div className="text-2xl font-display text-yellow-600/90">
                  {stats.totalExercises || 0}
                </div>
                <div className="text-sm text-purple-200/60">{t('stats.exercises')}</div>
              </div>
              
              <div className="glass-effect rounded-lg p-4 text-center">
                <Award className="w-6 h-6 text-yellow-600/90 mx-auto mb-2" />
                <div className="text-2xl font-display text-yellow-600/90">
                  {stats.totalReps || 0}
                </div>
                <div className="text-sm text-purple-200/60">{t('stats.totalReps')}</div>
              </div>
              
              <div className="glass-effect rounded-lg p-4 text-center">
                <Clock className="w-6 h-6 text-yellow-600/90 mx-auto mb-2" />
                <div className="text-2xl font-display text-yellow-600/90">
                  {(stats.totalDistance || 0).toFixed(1)}
                </div>
                <div className="text-sm text-purple-200/60">{t('stats.miles')}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-display text-yellow-600/90">{t('stats.personalBests')}</h3>
              <div className="space-y-2">
                {Object.entries(stats.personalBests || {}).map(([exercise, value]) => (
                  <div key={exercise} className="glass-effect rounded-lg p-3 flex justify-between items-center">
                    <span className="text-purple-200/90">{exercise}</span>
                    <span className="text-yellow-600/90 font-display">
                      {value} {exercise.toLowerCase().includes('plank') ? t('stats.seconds') : t('stats.reps')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-display text-yellow-600/90">{t('stats.recentActivity')}</h3>
              <div className="space-y-2">
                {(stats.exerciseHistory || []).slice(-5).reverse().map((entry, idx) => (
                  <div key={idx} className="glass-effect rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-200/90">{entry.exercise}</span>
                      <span className="text-yellow-600/90 font-display">
                        {entry.reps} {entry.duration ? t('stats.seconds') : entry.distance ? t('stats.miles.short') : t('stats.reps')}
                      </span>
                    </div>
                    <div className="text-xs text-purple-200/40 mt-1">
                      {new Date(entry.date).toLocaleDateString(isRTL ? 'ar-SA' : undefined)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}