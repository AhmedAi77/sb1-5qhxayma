import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, Trophy, ArrowUp, User as UserIcon, Star, Activity, Check,
  LucideIcon, Heart, Flame, StretchVertical, MoveRight, Footprints, GraduationCap
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import useSound from 'use-sound';
import { 
  FavoritesModal, 
  StatsModal,
  LanguageToggle,
  NameDialog,
  LoadingScreen,
  SplashScreen
} from './components';
import { useLanguage } from './contexts/LanguageContext';
import type { User, Mission, Exercise } from './types';
import { 
  loadUser, 
  saveUser,
  findUserByName, 
  generateDailyMission, 
  calculateRequiredExp,
  toggleFavorite as toggleFavoriteExercise, 
  createNewUser
} from './lib';

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

// Function to add highlight spans to important words in a quote
const formatQuote = (quote: string): React.ReactNode => {
  // Words that should be highlighted
  const highlightWords = [
    'strength', 'power', 'progress', 'success', 'master', 'achieve', 
    'victory', 'overcome', 'potential', 'limits', 'push', 'challenge',
    'exceed', 'tomorrow', 'future', 'destiny', 'energy', 'focus',
    'discipline', 'determination', 'consistency', 'training'
  ];
  
  // Split the quote into words
  const words = quote.split(' ');
  
  // Create an array of spans with highlighted words
  return words.map((word, index) => {
    const cleanWord = word.replace(/[.,!?;"'()]/g, '').toLowerCase();
    
    if (highlightWords.includes(cleanWord)) {
      return (
        <React.Fragment key={index}>
          <span className="highlight-subtle">
            {word}
          </span>
          {' '}
        </React.Fragment>
      );
    }
    
    return (
      <React.Fragment key={index}>
        <span>{word}</span>
        {' '}
      </React.Fragment>
    );
  });
};

// Sparks effect component
function SparksEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sparks, setSparks] = useState<React.ReactNode[]>([]);
  const [floatingParticles, setFloatingParticles] = useState<React.ReactNode[]>([]);
  
  const createSpark = useCallback((x: number, y: number, type: string = 'default') => {
    const id = Date.now() + Math.random();
    const duration = 0.5 + Math.random() * 0.8;
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 80;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    const sparkClass = type === 'cyan' 
      ? 'spark spark-cyan' 
      : type === 'purple' 
        ? 'spark spark-purple' 
        : type === 'gold'
          ? 'spark spark-gold'
          : type === 'white'
            ? 'spark spark-white'
            : 'spark';
    
    const size = 2 + Math.random() * 4;
    
    const spark = (
      <div
        key={id}
        className={sparkClass}
        style={{
          '--x': `${x}px`,
          '--y': `${y}px`,
          '--tx': `${tx}px`,
          '--ty': `${ty}px`,
          '--duration': `${duration}s`,
          '--size': `${size}px`,
          '--rotation': `${Math.random() * 360}deg`,
          left: 0,
          top: 0,
        } as React.CSSProperties}
        onAnimationEnd={() => {
          setSparks(current => current.filter(s => (s as React.ReactElement).key !== id.toString()));
        }}
      />
    );
    
    setSparks(current => [...current, spark]);
  }, []);
  
  // Create drifting particles that move in smooth patterns
  useEffect(() => {
    if (!containerRef.current) return;
    
    const createDriftingParticles = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return [];
      
      const particles = [];
      const count = 45; // Increased particle count
      
      for (let i = 0; i < count; i++) {
        const id = `drift-${Date.now()}-${i}`;
        const size = 1 + Math.random() * 3;
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        const duration = 15 + Math.random() * 20;
        const delay = Math.random() * 10;
        
        // Create more particle types
        const types = ['default', 'cyan', 'purple', 'gold', 'white'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        // Different movement patterns
        const pattern = Math.floor(Math.random() * 5);
        
        let className = `drifting-particle pattern-${pattern}`;
        if (type === 'cyan') className += ' drift-cyan';
        if (type === 'purple') className += ' drift-purple';
        if (type === 'gold') className += ' drift-gold';
        if (type === 'white') className += ' drift-white';
        
        particles.push(
          <div
            key={id}
            className={className}
            style={{
              '--x': `${x}px`,
              '--y': `${y}px`,
              '--size': `${size}px`,
              '--duration': `${duration}s`,
              '--delay': `${delay}s`,
              '--opacity': `${0.3 + Math.random() * 0.4}`,
              '--glow': `${3 + Math.random() * 7}px`,
            } as React.CSSProperties}
          />
        );
      }
      
      return particles;
    };
    
    setFloatingParticles(createDriftingParticles());
    
    // Recreate some particles occasionally for continuous refreshing effect
    const interval = setInterval(() => {
      setFloatingParticles(prev => {
        // Remove 5-10 particles
        const removeCount = 5 + Math.floor(Math.random() * 5);
        const remaining = prev.slice(0, prev.length - removeCount);
        
        // Add new ones
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return prev;
        
        const newParticles = [];
        for (let i = 0; i < removeCount; i++) {
          const id = `drift-${Date.now()}-${i}`;
          const size = 1 + Math.random() * 3;
          const x = Math.random() * rect.width;
          const y = Math.random() * rect.height;
          const duration = 15 + Math.random() * 20;
          
          // Create more particle types
          const types = ['default', 'cyan', 'purple', 'gold', 'white'];
          const type = types[Math.floor(Math.random() * types.length)];
          
          // Different movement patterns
          const pattern = Math.floor(Math.random() * 5);
          
          let className = `drifting-particle pattern-${pattern}`;
          if (type === 'cyan') className += ' drift-cyan';
          if (type === 'purple') className += ' drift-purple';
          if (type === 'gold') className += ' drift-gold';
          if (type === 'white') className += ' drift-white';
          
          newParticles.push(
            <div
              key={id}
              className={className}
              style={{
                '--x': `${x}px`,
                '--y': `${y}px`,
                '--size': `${size}px`,
                '--duration': `${duration}s`,
                '--delay': '0s',
                '--opacity': `${0.3 + Math.random() * 0.4}`,
                '--glow': `${3 + Math.random() * 7}px`,
              } as React.CSSProperties}
            />
          );
        }
        
        return [...remaining, ...newParticles];
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Create energy points for the background
  const [energyPoints, setEnergyPoints] = useState<React.ReactNode[]>([]);
  
  // Generate random sparks occasionally
  useEffect(() => {
    const createRandomSpark = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        
        const types = ['cyan', 'purple', 'gold', 'white', 'default'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        createSpark(x, y, type);
      }
    };
    
    const interval = setInterval(() => {
      // Randomly create 1-5 sparks (increased)
      const count = 1 + Math.floor(Math.random() * 5);
      for (let i = 0; i < count; i++) {
        setTimeout(createRandomSpark, i * 150);
      }
    }, 2500); // More frequent
    
    return () => clearInterval(interval);
  }, [createSpark]);
  
  useEffect(() => {
    const points = [];
    // Create more energy points for a richer background
    for (let i = 0; i < 40; i++) {
      const id = `energy-${i}`;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 4;
      const duration = 3 + Math.random() * 4;
      const size = 1 + Math.random() * 2;
      
      // More color variety
      const colorType = Math.random();
      let color;
      if (colorType < 0.3) color = 'cyan';
      else if (colorType < 0.6) color = 'gold';
      else if (colorType < 0.8) color = 'purple';
      else color = 'white';
      
      points.push(
        <div
          key={id}
          className={`energy-point energy-${color}`}
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        />
      );
    }
    setEnergyPoints(points);
  }, []);
  
  // Add event listener to create sparks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Create multiple sparks for each click
        const count = 15 + Math.floor(Math.random() * 15); // Increased
        const types = ['default', 'cyan', 'purple', 'gold', 'white'];
        
        for (let i = 0; i < count; i++) {
          const type = types[Math.floor(Math.random() * types.length)];
          setTimeout(() => {
            createSpark(x, y, type);
          }, i * 25); // Faster sequence
        }
      }
    };
    
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [createSpark]);
  
  return (
    <div ref={containerRef} className="spark-container">
      {sparks}
      {energyPoints}
      {floatingParticles}
    </div>
  );
}

function App() {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [dailyMission, setDailyMission] = useState<Mission | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [processingExercise, setProcessingExercise] = useState<number | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  
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
      setDailyMission(generateDailyMission(savedUser.level, t));
    }
  }, [t]);

  const handleNameSubmit = (name: string) => {
    // Check if user already exists
    const existingUser = findUserByName(name);
    
    if (existingUser) {
      setUser(existingUser);
      setDailyMission(generateDailyMission(existingUser.level, t));
    } else {
      // Create new user
      const newUser = createNewUser(name);
      
      setUser(newUser);
      saveUser(newUser);
      setDailyMission(generateDailyMission(1, t));
      setShowWelcome(true);
      playSuccess();
    }
  };

  const handleToggleFavorite = (exercise: Exercise) => {
    toggleFavoriteExercise(user, exercise, setUser);
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

        // Display toast notification for completing mission
        toast.success(t('mission.completed'), {
          icon: '🏆',
          duration: 3000,
          style: {
            background: 'rgba(15, 7, 40, 0.95)',
            color: '#FCD34D',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: '0.75rem',
            padding: '0.75rem 1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.3)'
          }
        });

        const newExperience = user.experience + dailyMission.experienceReward;
        const experienceNeeded = calculateRequiredExp(user.level);
        let newLevel = user.level;
        let remainingExp = newExperience;

        if (newExperience >= experienceNeeded) {
          await new Promise(resolve => setTimeout(resolve, 500));
          playLevelUp();
          newLevel++;
          remainingExp = newExperience - experienceNeeded;
          toast.success(`${t('level.up')} ${newLevel}!`, {
            icon: '⬆️',
            duration: 4000,
            style: {
              background: 'rgba(15, 7, 40, 0.95)',
              color: '#FCD34D',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              borderRadius: '0.75rem',
              padding: '0.75rem 1rem',
              boxShadow: '0 10px 15px -3px rgba(234, 179, 8, 0.3), 0 4px 6px -2px rgba(234, 179, 8, 0.15)'
            }
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
        setDailyMission(generateDailyMission(newLevel, t));
      } else {
        // Show completion toast for individual exercise
        toast.success(t('exercise.completed'), {
          icon: '✅',
          duration: 2000,
          style: {
            background: 'rgba(15, 7, 40, 0.95)',
            color: '#48BB78',
            border: '1px solid rgba(72, 187, 120, 0.3)',
            borderRadius: '0.75rem',
            padding: '0.5rem 0.75rem'
          }
        });
        
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

  if (!user) {
    return (
      <>
        {showSplash && (
          <SplashScreen onComplete={() => {
            setShowSplash(false);
            setShowLoading(true);
          }} />
        )}
        {showLoading && (
          <LoadingScreen onComplete={() => setShowLoading(false)} />
        )}
        {!showSplash && !showLoading && (
      <NameDialog
        onSubmit={handleNameSubmit}
        playClick={playClick}
        playHover={playHover}
      />
        )}
      </>
    );
  }

  return (
    <div className="relative min-h-screen text-white bg-gradient-to-br from-[#070412] via-[#0a0215] to-[#0f0421] overflow-x-hidden">
      <Toaster position="top-center" />
      
      {/* Sparks Effect */}
      <SparksEffect />
      
      <div className="animated-bg">
        <div className="nebula" style={{ top: '10%', left: '20%' }}></div>
        <div className="nebula"></div>
        <div className="nebula"></div>
        
        {/* Scanning line effect */}
        <div className="scanning-line" style={{ animationDelay: '0s' }}></div>
        <div className="scanning-line" style={{ animationDelay: '7.5s' }}></div>
        
        {/* Stars effect */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={`star-${i}`} 
            className="star"
            style={{
              '--top': `${Math.random() * 100}%`,
              '--left': `${Math.random() * 100}%`,
              '--duration': `${3 + Math.random() * 5}s`,
              '--delay': `${Math.random() * 5}s`,
              '--opacity': `${0.3 + Math.random() * 0.3}`,
              '--opacity-bright': `${0.7 + Math.random() * 0.3}`,
              '--size': `${1 + Math.random() * 2}px`,
            } as React.CSSProperties}
          ></div>
        ))}
        
        {/* Data stream effect */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={`data-stream-${i}`} 
            className="data-stream"
            style={{
              '--left': `${Math.random() * 100}%`,
              '--duration': `${6 + Math.random() * 6}s`,
              '--delay': `${Math.random() * 10}s`,
              '--opacity': `${0.2 + Math.random() * 0.2}`,
            } as React.CSSProperties}
          ></div>
        ))}
        
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={`particle-${i}`} 
            className={`particle ${i % 2 === 0 ? 'particle-cyan' : ''}`}
            style={{
              '--left': `${Math.random() * 100}%`,
              '--duration': `${15 + Math.random() * 15}s`,
              '--delay': `${Math.random() * 5}s`,
              '--opacity': `${0.2 + Math.random() * 0.3}`,
            } as React.CSSProperties}
          ></div>
        ))}
      </div>
      
      {showSplash && (
        <SplashScreen onComplete={() => {
          setShowSplash(false);
          setShowLoading(true);
        }} />
      )}
      
      {showLoading && (
        <LoadingScreen onComplete={() => setShowLoading(false)} />
      )}
      
      {!showSplash && !showLoading && (
        <>
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

          <div className="container mx-auto px-4 py-6 flex flex-col gap-6 min-h-screen">
        <motion.header 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-4 sm:p-6 border border-purple-600/30"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-600/40 flex items-center justify-center">
                    <UserIcon className="text-purple-300 w-6 h-6" />
              </div>
              <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg sm:text-xl font-display text-purple-300 drop-shadow-md">{user.name}</h1>
                      <div className="flex items-center gap-1 bg-purple-600/15 px-2 py-0.5 rounded-full border border-purple-600/25">
                        <Trophy className="text-purple-300 w-3.5 h-3.5" />
                        <span className="text-xs text-purple-300">{t('header.level')} {user.level}</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-purple-200/80 font-body">{t('header.hunter')}</p>
              </div>
            </div>
            
                <div className="flex items-center gap-3">
                  <motion.button
                onClick={() => setShowStats(true)}
                onMouseEnter={() => playHover()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="header-button flex items-center justify-center gap-2 bg-purple-500/15 p-3 rounded-lg border-2 border-purple-500/30 hover:bg-purple-500/20 transition-colors min-w-[46px] min-h-[46px]"
                  >
                    <Activity className="text-purple-300 w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm font-semibold text-purple-300 hidden sm:inline">{t('header.stats')}</span>
                  </motion.button>
                  
                  <motion.button
                onClick={() => setShowFavorites(true)}
                onMouseEnter={() => playHover()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="header-button flex items-center justify-center gap-2 bg-purple-500/15 p-3 rounded-lg border-2 border-purple-500/30 hover:bg-purple-500/20 transition-colors min-w-[46px] min-h-[46px]"
                  >
                    <Star className="text-purple-300 w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm font-semibold text-purple-300 hidden sm:inline">{t('header.favorites')}</span>
                  </motion.button>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="header-button flex items-center justify-center gap-2 bg-purple-500/15 p-3 rounded-lg border-2 border-purple-500/30 min-w-[46px] min-h-[46px]"
                  >
                    <Trophy className="text-purple-300 w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm font-semibold text-purple-300">{user.completedMissions}</span>
                  </motion.div>
                </div>
          </div>
        </motion.header>

          {dailyMission && (
            <motion.div
              key={dailyMission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
                className="glass-card rounded-xl p-4 sm:p-6 border border-purple-600/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="system-title">System</h3>
                  <span className="mission-section text-sm text-cyan-400 bg-purple-600/20 px-3 py-1 rounded-full border border-purple-600/30">
                  {dailyMission.experienceReward} {t('mission.exp')}
                </span>
              </div>
              
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="system-quote">{formatQuote(dailyMission.description)}</p>
                </motion.div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-6 mb-4">
                  <h3 className="text-base sm:text-xl font-bold font-display text-cyan-400 drop-shadow-sm">
                    {dailyMission.title}
                  </h3>
                </div>
                
                <div className="space-y-3">
                {dailyMission.exercises.map((exercise, idx) => (
                  <motion.div
                    key={`${dailyMission.id}-${idx}`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                      whileHover={!exercise.completed ? { x: 5 } : {}}
                    className={`w-full exercise-card flex items-center gap-3 p-3 rounded-lg transition-all ${
                      exercise.completed 
                          ? 'exercise-completed bg-green-900/30 border border-green-500/40' 
                          : 'glass-effect border border-purple-600/20 hover:border-purple-600/40'
                    }`}
                  >
                    <div
                        className={`p-2 rounded-lg transition-colors exercise-icon ${
                        exercise.completed
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-purple-600/20 text-purple-400'
                      }`}
                    >
                        {(() => {
                          const Icon = getExerciseIcon(exercise.type);
                          return <Icon className="w-4 h-4 sm:w-5 sm:h-5" />;
                        })()}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold font-display text-cyan-400 drop-shadow-sm">
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
                        <p className="text-xs sm:text-sm text-purple-200">
                        {exercise.sets} x {exercise.reps} {t('mission.reps')}
                        {exercise.distance && ` • ${exercise.distance}m`}
                      </p>
                    </div>

                    <button
                        onClick={() => handleToggleFavorite(exercise)}
                      onMouseEnter={() => playHover()}
                      className={`p-2 rounded-lg transition-colors ${
                        user?.favorites.some(fav => fav.type === exercise.type)
                            ? 'text-purple-400 bg-purple-600/10 hover:bg-purple-600/20'
                            : 'text-purple-200/60 hover:text-purple-400 hover:bg-purple-600/10'
                      }`}
                    >
                      <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    <button
                      onClick={() => !exercise.completed && handleExerciseComplete(idx)}
                      onMouseEnter={() => !exercise.completed && playHover()}
                      disabled={exercise.completed || processingExercise !== null}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors exercise-check ${
                        exercise.completed 
                            ? 'bg-green-900/30 text-green-400 cursor-default' 
                          : processingExercise === idx
                            ? 'bg-purple-600/20 cursor-wait'
                            : 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 cursor-pointer'
                        }`}
                      >
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
        </>
      )}
    </div>
  );
}

export default App;