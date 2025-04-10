import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Dumbbell, Flame, Circle, TrendingUp, Award, Clock } from 'lucide-react';
import type { UserStats } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  stats: UserStats;
  onClose: () => void;
  playClick?: () => void;
  playHover?: () => void;
}

export function StatsModal({ stats, onClose, playClick, playHover }: Props) {
  const { t } = useLanguage();
  const [energyPoints, setEnergyPoints] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    // Create energy points for the stats modal
    const points = [];
    for (let i = 0; i < 10; i++) {
      const id = `stat-energy-${i}`;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 2;
      
      points.push(
        <div
          key={id}
          className="energy-point"
          style={{
            position: 'absolute',
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${delay}s`,
            zIndex: 0
          }}
        />
      );
    }
    setEnergyPoints(points);
  }, []);

  return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-card rounded-xl w-full max-w-md p-6 space-y-6 relative overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
        {/* Energy points */}
        {energyPoints}
        
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-600/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
            </div>
            <h2 className="text-xl font-display text-yellow-500">{t('stats.title')}</h2>
          </div>
            <button
              onClick={onClose}
              onMouseEnter={() => playHover?.()}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-yellow-600/90" />
            </button>
          </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="stat-card col-span-2 relative">
            <div className="stat-value">{stats.totalExercises}</div>
            <div className="stat-label">{t('stats.totalExercises')}</div>
            <div className="absolute top-3 right-3 text-yellow-500/70">
              <Dumbbell className="w-5 h-5" />
                </div>
              </div>
              
          <div className="stat-card relative">
            <div className="stat-value">{stats.totalReps}</div>
            <div className="stat-label">{t('stats.totalReps')}</div>
            <div className="absolute top-3 right-3 text-yellow-500/70">
              <Flame className="w-5 h-5" />
                </div>
              </div>
              
          <div className="stat-card relative">
            <div className="stat-value">{stats.totalDistance}m</div>
            <div className="stat-label">{t('stats.totalDistance')}</div>
            <div className="absolute top-3 right-3 text-yellow-500/70">
              <Circle className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
          <h3 className="text-lg font-display text-yellow-500">{t('stats.personalBests')}</h3>
          
          <div className="max-h-60 overflow-y-auto pr-1 scrollbar-hide">
            {Object.entries(stats.personalBests).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(stats.personalBests)
                  .sort(([, a], [, b]) => b - a)
                  .map(([exercise, reps], index) => (
                    <motion.div
                      key={exercise}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-effect p-3 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <div className="text-sm font-medium text-yellow-500">{exercise}</div>
                        <div className="text-xs text-purple-200/60">{t('stats.bestReps')}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-yellow-500/10 rounded-lg">
                          <Award className="w-4 h-4 text-yellow-500" />
                        </div>
                        <span className="text-lg font-bold text-yellow-500">{reps}</span>
                  </div>
                    </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-purple-200/60">{t('stats.noBests')}</p>
              </div>
            )}
              </div>
            </div>

            <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-display text-yellow-500">{t('stats.recentActivity')}</h3>
            <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-xs text-yellow-500">{stats.exerciseHistory.length}</span>
            </div>
          </div>
          
          <div className="max-h-40 overflow-y-auto pr-1 scrollbar-hide">
            {stats.exerciseHistory.length > 0 ? (
              <div className="space-y-2">
                {[...stats.exerciseHistory]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((activity, index) => (
                    <motion.div
                      key={`${activity.exercise}-${index}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-effect p-2 rounded-lg flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-yellow-500/10 rounded-lg">
                          <Dumbbell className="w-3.5 h-3.5 text-yellow-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-yellow-500">{activity.exercise}</div>
                          <div className="text-xs text-purple-200/60">
                            {new Date(activity.date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric'
                            })}
                    </div>
                    </div>
                  </div>
                      <div className="text-sm text-yellow-500">
                        {activity.reps} {t('stats.reps')}
                      </div>
                    </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-purple-200/60">{t('stats.noActivity')}</p>
            </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}