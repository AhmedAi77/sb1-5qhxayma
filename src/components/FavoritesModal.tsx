import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Trophy, Clock, Activity, ArrowRight, ArrowLeft, Info, Trash2, Dumbbell, LucideIcon, Heart, Flame, StretchVertical, MoveRight, Footprints } from 'lucide-react';
import type { FavoriteExercise, Exercise } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const getExerciseIcon = (type: string): LucideIcon => {
  const icons: Record<string, LucideIcon> = {
    'Crunches': Flame,
    'Push-ups': Dumbbell,
    'Squats': StretchVertical,
    'Planks': StretchVertical,
    'Lunges': Footprints,
    'Burpees': Activity,
    'Jumping Jacks': MoveRight,
    'High Knees': MoveRight,
    'Mountain Climbers': Footprints,
    'Bird Dogs': StretchVertical,
    'Fire Hydrants': Footprints,
    'Glute Bridges': Heart,
    'Wall Push-ups': Dumbbell,
    'Russian Twists': Flame
  };
  
  return icons[type] || Dumbbell;
};

interface Props {
  favorites: FavoriteExercise[];
  onRemove: (id: string) => void;
  onClose: () => void;
  playClick?: () => void;
  playHover?: () => void;
}

export function FavoritesModal({ favorites, onRemove, onClose, playClick, playHover }: Props) {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [selectedExercise, setSelectedExercise] = useState<FavoriteExercise | null>(null);
  const [energyPoints, setEnergyPoints] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    // Create energy points for the favorites modal
    const points = [];
    for (let i = 0; i < 10; i++) {
      const id = `fav-energy-${i}`;
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

  // Test console log to verify changes are being picked up
  useEffect(() => {
    console.log('FavoritesModal mounted with updated changes!');
    console.log('Selected exercise:', selectedExercise);
  }, [selectedExercise]);

  const handleViewDetails = (exercise: FavoriteExercise) => {
    console.log('Viewing details for exercise:', exercise);
    playClick?.();
    setSelectedExercise(exercise);
  };

  const handleBack = () => {
    console.log('Going back from details view');
    playClick?.();
    setSelectedExercise(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-card rounded-xl p-6 max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Energy points */}
        {energyPoints}
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600/30 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-xl font-display text-cyan-400 drop-shadow-sm">{t('favorites.title')}</h2>
          </div>
          <button
            onClick={onClose}
            onMouseEnter={() => playHover?.()}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-purple-200" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 scrollbar-hide relative z-10">
          {favorites.length > 0 ? (
            <div className="space-y-3">
              {favorites.map(favorite => (
                <motion.div
                  key={favorite.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  whileHover={{ x: 5 }}
                  className="glass-effect rounded-lg p-3 flex items-center"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center mr-3 exercise-icon">
                    {(() => {
                      const Icon = getExerciseIcon(favorite.type);
                      return <Icon className="w-5 h-5 text-purple-400" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-cyan-400 drop-shadow-sm">{favorite.type}</h4>
                    <p className="text-sm text-purple-200">
                      <span className="text-cyan-300">{t('favorites.best')}:</span> {favorite.personalBest} {t('mission.reps')}
                    </p>
                    {favorite.lastPerformed && (
                      <p className="text-xs text-purple-300/70 mt-1">
                        {t('favorites.timesPerformed')}: {favorite.timesPerformed}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      playClick?.();
                      onRemove(favorite.id);
                    }}
                    onMouseEnter={() => playHover?.()}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title={t('favorites.remove')}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 relative z-10">
              <div className="w-16 h-16 mx-auto bg-purple-600/10 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-purple-400/50" />
              </div>
              <p className="text-purple-200/70 mb-2">{t('favorites.empty')}</p>
              <p className="text-purple-200/50 text-sm max-w-xs mx-auto">
                {t('favorites.emptyMessage')}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}