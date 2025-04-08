import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, Trophy, ArrowUp, User as UserIcon, Star, Activity, Check 
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import useSound from 'use-sound';
import { quotes } from './data/quotes';
import { exercises } from './data/exercises';
import { FavoritesModal } from './components/FavoritesModal';
import { StatsModal } from './components/StatsModal';
import { LanguageToggle } from './components/LanguageToggle';
import { NameDialog } from './components/NameDialog';
import { LoadingScreen } from './components/LoadingScreen';
import { useLanguage } from './contexts/LanguageContext';
import type { User, Mission, Exercise, FavoriteExercise } from './types';
import { loadUser, saveUser, findUserByName } from './lib/storage';

function App() {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [dailyMission, setDailyMission] = useState<Mission | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [processingExercise, setProcessingExercise] = useState<number | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  
  const [playClick] = useSound('/sounds/click.mp3', { 
    volume: 0.4,
    preload: true,
    interrupt: true
  });
  const [playSuccess] = useSound('/sounds/success.mp3', { 
    volume: 0.5,
    preload: true 
  });
  const [playLevelUp] = useSound('/sounds/levelup.mp3', { 
    volume: 0.6,
    preload: true 
  });
  const [playHover] = useSound('/sounds/click.mp3', { 
    volume: 0.2,
    preload: true,
    interrupt: true 
  });

  useEffect(() => {
    // Load saved user data if it exists
    const savedUser = loadUser();
    if (savedUser) {
      setUser(savedUser);
      setDailyMission(generateDailyMission(savedUser.level));
    }
  }, []);

  const handleNameSubmit = (name: string) => {
    // Check if user already exists
    const existingUser = findUserByName(name);
    
    if (existingUser) {
      setUser(existingUser);
      setDailyMission(generateDailyMission(existingUser.level));
    } else {
      // Create new user
      const newUser: User = {
        id: crypto.randomUUID(),
        name,
        email: '',
        level: 1,
        experience: 0,
        completedMissions: 0,
        streak: 0,
        stats: {
          totalExercises: 0,
          totalReps: 0,
          totalDistance: 0,
          personalBests: {},
          exerciseHistory: []
        },
        favorites: []
      };
      
      setUser(newUser);
      saveUser(newUser);
      setDailyMission(generateDailyMission(1));
      setShowWelcome(true);
      playSuccess();
    }
  };

  const calculateRequiredExp = (level: number) => {
    return Math.floor(200 * Math.pow(1.5, level - 1));
  };

  const generateDailyMission = (level: number): Mission => {
    const difficulty = Math.min(Math.floor(level / 5), 2);
    const exercisePool = difficulty === 0 ? exercises.beginner : 
                        difficulty === 1 ? exercises.intermediate : 
                        exercises.advanced;
    
    const selectedExercises = [];
    const categories = ['Core', 'Upper Body', 'Lower Body', 'Cardio'];
    
    const getProgressedReps = (baseReps: number, progression: number, level: number) => {
      return Math.floor(baseReps + (progression * (level - 1)));
    };
    
    categories.forEach(category => {
      const categoryExercises = exercisePool.filter(ex => 
        ex.type.toLowerCase().includes(category.toLowerCase()) ||
        (category === 'Core' && ['Plank', 'Crunch', 'V-Up', 'L-Sit', 'Flag'].some(term => 
          ex.type.toLowerCase().includes(term.toLowerCase())
        ))
      );
      
      if (categoryExercises.length > 0) {
        const randomEx = categoryExercises[Math.floor(Math.random() * categoryExercises.length)];
        const progressedReps = getProgressedReps(randomEx.reps, randomEx.progression || 1, level);
        
        selectedExercises.push({
          ...randomEx,
          reps: progressedReps,
          completed: false
        });
      }
    });

    while (selectedExercises.length < 6) {
      const randomEx = exercisePool[Math.floor(Math.random() * exercisePool.length)];
      if (!selectedExercises.find(ex => ex.type === randomEx.type)) {
        const progressedReps = getProgressedReps(randomEx.reps, randomEx.progression || 1, level);
        selectedExercises.push({
          ...randomEx,
          reps: progressedReps,
          completed: false
        });
      }
    }

    const baseReward = 100;
    const levelMultiplier = 1 + (level - 1) * 0.1;
    const difficultyMultiplier = 1 + difficulty * 0.5;

    return {
      id: Date.now(),
      title: t('mission.title'),
      description: quotes[Math.floor(Math.random() * quotes.length)],
      exercises: selectedExercises.slice(0, 6),
      difficulty,
      experienceReward: Math.floor(baseReward * levelMultiplier * difficultyMultiplier),
      completed: false
    };
  };

  const toggleFavorite = (exercise: Exercise) => {
    if (!user) return;
    
    try {
      const isFavorite = user.favorites.some(fav => fav.type === exercise.type);
      
      if (isFavorite) {
        const updatedUser = {
          ...user,
          favorites: user.favorites.filter(fav => fav.type !== exercise.type)
        };
        setUser(updatedUser);
        saveUser(updatedUser);
        toast.success(`Removed ${exercise.type} from favorites!`, {
          icon: '💔',
          duration: 2000
        });
      } else {
        const newFavorite: FavoriteExercise = {
          id: crypto.randomUUID(),
          type: exercise.type,
          personalBest: exercise.reps,
          timesPerformed: 1,
          lastPerformed: new Date()
        };
        
        const updatedUser = {
          ...user,
          favorites: [...user.favorites, newFavorite]
        };

        setUser(updatedUser);
        saveUser(updatedUser);
        toast.success(`Added ${exercise.type} to favorites!`, {
          icon: '⭐',
          duration: 2000
        });
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast.error('Failed to update favorites');
    }
  };

  const handleExerciseComplete = async (index: number) => {
    if (!dailyMission || !user || !user.stats || processingExercise !== null) return;

    setProcessingExercise(index);
    
    try {
      playClick();
      
      const exercise = dailyMission.exercises[index];
      
      // Create a new array with the updated exercise
      const updatedExercises = dailyMission.exercises.map((ex, i) => 
        i === index ? { ...ex, completed: true } : ex
      );

      // Update mission state immediately
      setDailyMission(prevMission => ({
        ...prevMission!,
        exercises: updatedExercises,
        completed: updatedExercises.every(ex => ex.completed)
      }));

      // Update user stats
      const updatedStats = {
        ...user.stats,
        totalExercises: user.stats.totalExercises + 1,
        totalReps: user.stats.totalReps + (exercise.reps || 0),
        totalDistance: user.stats.totalDistance + (exercise.distance || 0),
        personalBests: {
          ...user.stats.personalBests,
          [exercise.type]: Math.max(
            exercise.reps || 0,
            user.stats.personalBests[exercise.type] || 0
          )
        },
        exerciseHistory: [
          ...user.stats.exerciseHistory,
          {
            date: new Date(),
            exercise: exercise.type,
            reps: exercise.reps,
            duration: exercise.type === 'Plank' ? exercise.reps : undefined,
            distance: exercise.distance
          }
        ]
      };

      // Check if all exercises are completed
      const allCompleted = updatedExercises.every(ex => ex.completed);

      if (allCompleted && !dailyMission.completed) {
        await new Promise(resolve => setTimeout(resolve, 300));
        playSuccess();

        const newExperience = user.experience + dailyMission.experienceReward;
        const experienceNeeded = calculateRequiredExp(user.level);
        let newLevel = user.level;
        let remainingExp = newExperience;

        if (newExperience >= experienceNeeded) {
          await new Promise(resolve => setTimeout(resolve, 500));
          playLevelUp();
          newLevel++;
          remainingExp = newExperience - experienceNeeded;
          toast.success(`Level Up! You are now level ${newLevel}!`, {
            icon: '⬆️',
            duration: 3000
          });
        }

        // Update user with all changes
        const updatedUser = {
          ...user,
          level: newLevel,
          experience: remainingExp,
          completedMissions: user.completedMissions + 1,
          stats: updatedStats
        };
        
        setUser(updatedUser);
        saveUser(updatedUser);

        // Generate new mission after a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDailyMission(generateDailyMission(newLevel));
      } else {
        // Update user stats only
        const updatedUser = {
          ...user,
          stats: updatedStats
        };
        setUser(updatedUser);
        saveUser(updatedUser);
      }
    } catch (error) {
      console.error('Error completing exercise:', error);
      toast.error('Failed to complete exercise');
    } finally {
      await new Promise(resolve => setTimeout(resolve, 300));
      setProcessingExercise(null);
    }
  };

  if (showLoading) {
    return <LoadingScreen onComplete={() => setShowLoading(false)} />;
  }

  if (!user) {
    return (
      <NameDialog
        onSubmit={handleNameSubmit}
        playClick={playClick}
        playHover={playHover}
      />
    );
  }

  const experienceNeeded = calculateRequiredExp(user.level);
  const experiencePercentage = Math.min((user.experience / experienceNeeded) * 100, 100);

  return (
    <div className="min-h-screen bg-[#070412] flex flex-col overflow-hidden relative animated-bg">
      <LanguageToggle />
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D1B4E]/30 via-[#070412] to-[#4C1D95]/30" />
      
      <Toaster />
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-[#070412]/90 backdrop-blur-sm"
            onClick={() => setShowWelcome(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="text-center p-8 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#2D1B4E]/40 to-[#2D1B4E]/40 rounded-lg blur-xl" />
              <div className="relative">
                <h2 className="text-4xl sm:text-6xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-yellow-600/90 to-yellow-500/90 mb-4">
                  {t('welcome.title')}
                </h2>
                <p className="text-xl sm:text-2xl font-body text-purple-200/90">{t('welcome.subtitle')}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex-1 max-h-screen flex flex-col p-2 sm:p-4 gap-2 sm:gap-4">
        <motion.header 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="glass-card rounded-xl p-3 sm:p-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#2D1B4E]/30 rounded-lg">
                <UserIcon className="text-yellow-600/90 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold font-display text-yellow-600/90">{user.name}</h2>
                <p className="text-sm font-body text-purple-200/90">
                  {t('header.level')} {user.level} {t('header.hunter')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowStats(true)}
                onMouseEnter={() => playHover()}
                className="flex items-center gap-2 bg-[#2D1B4E]/30 p-2 rounded-lg border border-yellow-600/20 hover:bg-[#2D1B4E]/40 transition-colors"
              >
                <Activity className="text-yellow-600/90 w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm text-yellow-600/90 hidden sm:inline">{t('header.stats')}</span>
              </button>
              
              <button
                onClick={() => setShowFavorites(true)}
                onMouseEnter={() => playHover()}
                className="flex items-center gap-2 bg-[#2D1B4E]/30 p-2 rounded-lg border border-yellow-600/20 hover:bg-[#2D1B4E]/40 transition-colors"
              >
                <Star className="text-yellow-600/90 w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm text-yellow-600/90 hidden sm:inline">{t('header.favorites')}</span>
              </button>
              
              <div className="flex items-center gap-2 bg-[#2D1B4E]/30 p-2 rounded-lg border border-yellow-600/20">
                <Trophy className="text-yellow-600/90 w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm text-yellow-600/90">{user.completedMissions}</span>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3 sm:space-y-4">
          {dailyMission && (
            <motion.div
              key={dailyMission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card rounded-xl p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <h3 className="text-base sm:text-xl font-bold font-display text-yellow-600/90">
                  {dailyMission.title}
                </h3>
                <span className="text-sm text-yellow-600/90 bg-[#2D1B4E]/30 px-3 py-1 rounded-full border border-yellow-600/20 w-fit">
                  {dailyMission.experienceReward} {t('mission.exp')}
                </span>
              </div>
              
              <p className="text-sm sm:text-base font-body text-purple-200/90 italic mb-4 sm:mb-6">"{dailyMission.description}"</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dailyMission.exercises.map((exercise, idx) => (
                  <motion.div
                    key={`${dailyMission.id}-${idx}`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`w-full exercise-card flex items-center gap-3 p-3 rounded-lg transition-all ${
                      exercise.completed 
                        ? 'bg-green-900/20 border border-green-500/30' 
                        : 'glass-effect'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        exercise.completed
                          ? 'bg-green-900/20 text-green-400'
                          : 'bg-[#2D1B4E]/30 text-yellow-600/90'
                      }`}
                    >
                      <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-bold font-display text-yellow-600/90">
                          {exercise.type}
                        </h4>
                        {exercise.completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-green-400"
                          >
                            <ArrowUp className="w-4 h-4 rotate-45" />
                          </motion.div>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-purple-200/90">
                        {exercise.sets} x {exercise.reps} {t('mission.reps')}
                        {exercise.distance && ` • ${exercise.distance}m`}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleFavorite(exercise)}
                      onMouseEnter={() => playHover()}
                      className={`p-2 rounded-lg transition-colors ${
                        user?.favorites.some(fav => fav.type === exercise.type)
                          ? 'text-yellow-500 hover:bg-[#2D1B4E]/30'
                          : 'text-purple-200/40 hover:text-yellow-500/80 hover:bg-[#2D1B4E]/30'
                      }`}
                    >
                      <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    <button
                      onClick={() => !exercise.completed && handleExerciseComplete(idx)}
                      onMouseEnter={() => !exercise.completed && playHover()}
                      disabled={exercise.completed || processingExercise !== null}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                        exercise.completed 
                          ? 'bg-green-900/20 text-green-400 cursor-default' 
                          : processingExercise === idx
                          ? 'bg-[#2D1B4E]/30 cursor-wait'
                          : 'bg-[#2D1B4E]/30 hover:bg-[#2D1B4E]/40 text-yellow-600/90 cursor-pointer'
                      }`}
                    >
                      {exercise.completed 
                        ? <Check className="w-5 h-5" />
                        : processingExercise === idx
                        ? <div className="w-5 h-5 border-2 border-yellow-600/20 border-t-yellow-600/90 rounded-full animate-spin" />
                        : <Check className="w-5 h-5" />}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-4 sm:p-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/5 via-yellow-500/10 to-yellow-600/5 animate-pulse-slow" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-yellow-600/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-600/90" />
                </div>
                <span className="text-lg font-display text-yellow-600/90">
                  Level {user.level}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm font-body">
                <span className="text-purple-200/60">{user.experience}</span>
                <span className="text-purple-200/40">/</span>
                <span className="text-purple-200/60">{experienceNeeded}</span>
                <span className="text-yellow-600/90 font-display">{t('mission.exp')}</span>
              </div>
            </div>

            <div className="h-4 bg-[#2D1B4E]/30 rounded-full overflow-hidden relative">
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[length:20px_20px]" />
              </div>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${experiencePercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full progress-animate relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent animate-shine" />
                <div className="absolute inset-0 bg-yellow-600/20 blur-sm" />
              </motion.div>

              <div className="absolute inset-0 flex justify-between px-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-px h-full bg-purple-200/10"
                    style={{ left: `${(i + 1) * 20}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showFavorites && (
          <FavoritesModal
            favorites={user.favorites}
            onClose={() => setShowFavorites(false)}
            onRemove={(id) => {
              const updatedUser = {
                ...user,
                favorites: user.favorites.filter(fav => fav.id !== id)
              };
              setUser(updatedUser);
              saveUser(updatedUser);
              toast.success('Removed from favorites!', {
                icon: '💔',
                duration: 2000
              });
            }}
            playClick={playClick}
            playHover={playHover}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showStats && user && user.stats && (
          <StatsModal
            stats={user.stats}
            onClose={() => setShowStats(false)}
            playClick={playClick}
            playHover={playHover}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;