import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, Trophy, ArrowUp, User as UserIcon, Star, Activity, Check,
  LucideIcon, Heart, Flame, StretchVertical, MoveRight, Footprints, GraduationCap,
  Zap
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { 
  FavoritesModal, 
  StatsModal,
  LanguageToggle,
  NameDialog,
  LoadingScreen,
  SplashScreen,
  BackgroundMusic,
  MuteButton
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
  createNewUser,
  saveMission,
  loadMission
} from './lib';
import { 
  initSoundEffects, 
  sounds, 
  toggleMuteSounds, 
  unlockAudio 
} from './lib/soundManager';
import analytics from './lib/analytics';

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
  const { language } = useLanguage();
  
  // Words that should be highlighted in English
  const enHighlightWords = [
    'strength', 'power', 'progress', 'success', 'master', 'achieve', 
    'victory', 'overcome', 'potential', 'limits', 'push', 'challenge',
    'exceed', 'tomorrow', 'future', 'destiny', 'energy', 'focus',
    'discipline', 'determination', 'consistency', 'training'
  ];
  
  // Words that should be highlighted in Arabic
  const arHighlightWords = [
    'قوة', 'قوتك', 'تقدم', 'نجاح', 'سيد', 'حقق', 'تحقق', 'تجاوز',
    'إمكانات', 'حدود', 'اضغط', 'تحدي', 'تجاوز', 'غداً', 'مستقبل',
    'مصير', 'طاقة', 'تركيز', 'انضباط', 'إصرار', 'استمرارية', 'تدريب'
  ];
  
  // Choose the right highlight words based on language
  const highlightWords = language === 'en' ? enHighlightWords : arHighlightWords;
  
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
  const { t, language } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [dailyMission, setDailyMission] = useState<Mission | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [processingExercise, setProcessingExercise] = useState<number | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [xpAnimating, setXpAnimating] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  // Update sound functions to use our sound manager
  const playClick = () => {
    sounds.click();
  };
  
  const playSuccess = () => {
    sounds.success();
  };
  
  const playLevelUp = () => {
    sounds.levelUp();
    
    // Track level up in analytics
    analytics.trackLevelUp(user?.level || 0, user?.experience || 0);
  };
  
  const playHover = () => {
    sounds.click();
  };
  
  // Initialize sounds immediately when component mounts
  useEffect(() => {
    // Initialize sound effects as early as possible
    initSoundEffects();
    
    // Force unlock audio
    unlockAudio();
    
    // Try to play a sound immediately
    setTimeout(() => {
      sounds.click();
    }, 500);
    
    // Make sure to save data before closing
    const handleBeforeUnload = () => {
      if (user) saveUser(user);
      if (dailyMission) saveMission(dailyMission);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Detect touch device
  useEffect(() => {
    const detectTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 || 
        (navigator as any).msMaxTouchPoints > 0
      );
    };
    
    detectTouch();
    window.addEventListener('touchstart', () => setIsTouchDevice(true), { once: true });
    
    return () => {
      window.removeEventListener('touchstart', () => setIsTouchDevice(true));
    };
  }, []);

  // Prevent elastic scrolling on iOS
  useEffect(() => {
    const preventPullToRefresh = (e: TouchEvent) => {
      // Prevent only if at the top of the page and pulling down
      if (document.scrollingElement!.scrollTop === 0 && e.touches[0].clientY > 0) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventPullToRefresh, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventPullToRefresh);
    };
  }, []);

  useEffect(() => {
    // Load saved user data if it exists
    const savedUser = loadUser();
    if (savedUser) {
      setUser(savedUser);
      
      // Try to load saved mission first
      const savedMission = loadMission();
      
      if (savedMission) {
        console.log('Loaded saved mission:', savedMission);
        setDailyMission(savedMission);
      } else {
        // Generate new mission if no saved mission exists
        setDailyMission(generateDailyMission(savedUser.level, t));
      }
    }
  }, [t]);

  // Generate a new daily mission if we don't have one
  useEffect(() => {
    if (user && !dailyMission) {
      const newMission = generateDailyMission(user.level, t);
      setDailyMission(newMission);
      saveMission(newMission); // Save the new mission
    }
  }, [user, dailyMission, t]);

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
    }
  };

  const handleToggleFavorite = (exercise: Exercise) => {
    if (!user) return;
    
    const updatedUser = toggleFavoriteExercise(user, exercise.id);
    setUser(updatedUser);
    saveUser(updatedUser);
    
    const isFavorited = updatedUser.favorites.includes(exercise.id);
    
    // Track favorite toggle in analytics
    analytics.trackEvent('favorite_toggle', {
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      is_favorited: isFavorited
    });
    
    sounds.click();
    
    toast(
      `${exercise.name} ${
        isFavorited
          ? t.addedToFavorites
          : t.removedFromFavorites
      }`,
      {
        icon: isFavorited ? '⭐' : '✖️',
        position: language === 'ar' ? 'top-left' : 'top-right',
      }
    );
  };

  const handleExerciseComplete = async (index: number) => {
    if (!dailyMission || !user || !user.stats || processingExercise !== null) return;

    // Set processing state immediately for visual feedback
    setProcessingExercise(index);
    
    try {
      // Play click sound effect immediately
      playClick();
      
      const exercise = dailyMission.exercises[index];
      
      // Create a new array with the updated exercise - do this immediately
      const updatedExercises = dailyMission.exercises.map((ex, i) => 
        i === index ? { ...ex, completed: true } : ex
      );

      // Update mission state immediately for instant UI feedback
      const updatedMission = {
        ...dailyMission,
        exercises: updatedExercises,
        completed: updatedExercises.every(ex => ex.completed)
      };
      setDailyMission(updatedMission);
      saveMission(updatedMission); // Save mission state immediately

      // Trigger XP animation
      setXpAnimating(true);
      // Reset animation state after animation completes
      setTimeout(() => setXpAnimating(false), 1500);

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

      // Show XP gained toast
      const xpGained = Math.floor(10 + Math.random() * 5); // Small XP gain for each exercise
      toast.success(`+${xpGained} XP`, {
        icon: '⚡',
        duration: 2000,
        style: {
          background: 'rgba(15, 7, 40, 0.95)',
          color: '#4FD1DB',
          border: '1px solid rgba(79, 209, 219, 0.5)',
          borderRadius: '0.75rem',
          padding: '0.75rem 1rem',
          fontWeight: 'bold',
          boxShadow: '0 0 20px rgba(79, 209, 219, 0.4), inset 0 0 10px rgba(79, 209, 219, 0.1)'
        }
      });

      // Check if all exercises are completed
      const allCompleted = updatedExercises.every(ex => ex.completed);

      if (allCompleted && !dailyMission.completed) {
        // Play success sound immediately
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
          newLevel++;
          remainingExp = newExperience - experienceNeeded;
          // Play level up sound immediately
          playLevelUp();
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

        // Generate new mission - reduced delay
        setTimeout(() => {
          const newMission = generateDailyMission(newLevel, t);
          setDailyMission(newMission);
          saveMission(newMission); // Save the new mission
        }, 500);
      } else {
        // Play success sound for individual exercise
        playSuccess();
        
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
        
        // Save the updated mission state
        const updatedMission = {
          ...dailyMission,
          exercises: updatedExercises
        };
        saveMission(updatedMission);
        
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
      // Reset processing state with minimal delay
      setTimeout(() => setProcessingExercise(null), 100);
    }
  };

  // Calculate experience progress
  const experienceProgress = user ? (user.experience / calculateRequiredExp(user.level)) * 100 : 0;

  // Add a save interval for user data as a safety measure
  useEffect(() => {
    // Auto-save user data every 60 seconds if there are changes
    if (user) {
      const autoSaveInterval = setInterval(() => {
        console.log('Auto-saving user data...');
        saveUser(user);
      }, 60000); // 60 seconds
      
      return () => {
        clearInterval(autoSaveInterval);
      };
    }
  }, [user]);

  useEffect(() => {
    // Track app initialization
    analytics.trackEvent('app_initialized', {
      timestamp: new Date().toISOString(),
      language: window.navigator.language
    });
  }, []);

  if (!user) {
    return (
      <>
        <BackgroundMusic 
          audioSrc="/sounds/Solo Leveling S1 Soundtrack Collection  俺だけレベルアップな件 OST Cover Compilation (mp3cut.net).mp3"
          volume={0.2}
        />
        <div className="fixed top-4 right-4 z-50">
          <MuteButton />
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
    <div 
      className={`min-h-screen min-h-screen-dvh flex flex-col bg-dark relative overflow-hidden ios-safe-bottom ${isTouchDevice ? 'touch-device' : ''}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <BackgroundMusic 
        audioSrc="/sounds/Solo Leveling S1 Soundtrack Collection  俺だけレベルアップな件 OST Cover Compilation (mp3cut.net).mp3"
        volume={0.15}
      />
      
      {/* For touch devices, add iOS safe area padding */}
      <div className="ios-safe-top"></div>
      
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
            onClick={() => {
              playClick();
              setShowWelcome(false);
            }}
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
                      <div className="flex items-center gap-1 bg-purple-600/30 px-3 py-1 rounded-lg border-2 border-purple-600/40 whitespace-nowrap level-badge">
                        <Trophy className="text-purple-300 w-4 h-4" />
                        <span className="text-sm text-purple-300 inline-block font-semibold">{t('header.level')} {user.level}</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-purple-200/80 font-body">{t('header.hunter')}</p>
              </div>
            </div>
            
                <div className="flex items-center gap-3">
                  <MuteButton />
                  
                  <motion.button
                onClick={() => {
                  playClick();
                  setShowStats(true);
                }}
                onMouseEnter={() => playHover()}
                whileTap={{ scale: 0.92 }}
                className="header-button flex items-center justify-center gap-2 bg-purple-500/30 p-3 rounded-lg border-2 border-purple-500/40 hover:bg-purple-500/40 active:bg-purple-500/50 transition-all duration-150 min-w-[46px] min-h-[46px] rtl-trophy"
                style={{
                  boxShadow: '0 0 12px rgba(138, 79, 219, 0.4)',
                  transform: 'translateZ(0)'
                }}
              >
                    <Activity className="text-purple-300 w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm font-bold text-purple-300 hidden sm:inline whitespace-nowrap">{t('header.stats')}</span>
                  </motion.button>
                  
                  <motion.button
                onClick={() => {
                  playClick();
                  setShowFavorites(true);
                }}
                onMouseEnter={() => playHover()}
                whileTap={{ scale: 0.92 }}
                className="header-button flex items-center justify-center gap-2 bg-purple-500/30 p-3 rounded-lg border-2 border-purple-500/40 hover:bg-purple-500/40 active:bg-purple-500/50 transition-all duration-150 min-w-[46px] min-h-[46px] rtl-trophy"
                style={{
                  boxShadow: '0 0 12px rgba(138, 79, 219, 0.4)',
                  transform: 'translateZ(0)'
                }}
              >
                    <Star className="text-purple-300 w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm font-bold text-purple-300 hidden sm:inline whitespace-nowrap">{t('header.favorites')}</span>
                  </motion.button>
                  
                  <motion.div 
                    whileTap={{ scale: 0.92 }}
                    className="header-button flex items-center justify-center gap-2 bg-purple-500/30 p-3 rounded-lg border-2 border-purple-500/40 hover:bg-purple-500/40 active:bg-purple-500/50 transition-all duration-150 min-w-[46px] min-h-[46px] rtl-trophy trophy-counter"
                    style={{
                      boxShadow: '0 0 12px rgba(138, 79, 219, 0.4)',
                      transform: 'translateZ(0)'
                    }}
                  >
                    <Trophy className="text-purple-300 w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm font-bold text-purple-300 whitespace-nowrap">{user.completedMissions}</span>
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
                  <h3 className="system-title rtl-fix">{t('mission.title')}</h3>
                  <span className="mission-section text-sm text-cyan-400 bg-purple-600/20 px-3 py-1 rounded-full border border-purple-600/30 whitespace-nowrap">
                    {dailyMission.experienceReward} {t('mission.exp')}
                  </span>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="system-quote">{formatQuote(t(dailyMission.description))}</p>
                </motion.div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-6 mb-4">
                  <h3 className="text-base sm:text-xl font-bold font-display text-cyan-400 drop-shadow-sm rtl-fix whitespace-nowrap">
                    {t(dailyMission.title)}
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
                    className={`w-full exercise-card flex items-center gap-3 p-3 rounded-lg transition-all rtl-exercise ${
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
                    
                    <div className="flex-1 text-left rtl-text">
                      <div className="flex items-center gap-2 rtl-flex">
                          <h4 className="text-sm sm:text-base font-bold font-display text-cyan-400 drop-shadow-sm exercise-name">
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
                          {language === 'ar' 
                            ? `${exercise.reps} × ${exercise.sets} ${t('mission.reps')}`
                            : `${exercise.sets} x ${exercise.reps} ${t('mission.reps')}`
                          }
                          {exercise.distance && ` • ${exercise.distance}m`}
                        </p>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => handleToggleFavorite(exercise)}
                        onMouseEnter={() => playHover()}
                        className={`p-2 rounded-lg transition-all rtl-button ${
                          user?.favorites.some(fav => fav.type === exercise.type)
                            ? 'text-yellow-400 bg-purple-600/20 hover:bg-purple-600/30 active:bg-purple-600/40 active:scale-95 favorite-active'
                            : 'text-purple-200/60 hover:text-purple-400 hover:bg-purple-600/10 active:bg-purple-600/20 active:scale-95'
                        }`}
                        style={{
                          transition: 'transform 0.1s ease-out, background-color 0.2s ease, color 0.2s ease'
                        }}
                        title={user?.favorites.some(fav => fav.type === exercise.type) 
                          ? t('favorites.remove') 
                          : t('favorites.add')}
                      >
                        {user?.favorites.some(fav => fav.type === exercise.type) ? (
                          <Star className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                        ) : (
                          <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => !exercise.completed && handleExerciseComplete(idx)}
                      onMouseEnter={() => !exercise.completed && playHover()}
                      disabled={exercise.completed || processingExercise !== null}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all rtl-button ${
                        exercise.completed 
                          ? 'bg-green-900/30 text-green-400 cursor-default' 
                        : processingExercise === idx
                          ? 'bg-purple-600/40 text-purple-300 animate-pulse cursor-wait'
                          : 'bg-purple-600/20 hover:bg-purple-600/30 active:bg-purple-600/50 active:scale-95 text-purple-400 cursor-pointer'
                      }`}
                      style={{
                        transform: processingExercise === idx ? 'scale(0.95)' : 'scale(1)',
                        transition: 'transform 0.1s ease-out, background-color 0.2s ease'
                      }}
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
      
      {/* Stats Modal */}
      <AnimatePresence>
        {showStats && (
          <StatsModal
            stats={user?.stats || { totalExercises: 0, totalReps: 0, totalDistance: 0, personalBests: {}, exerciseHistory: [] }}
            onClose={() => {
              playClick();
              setShowStats(false);
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Favorites Modal */}
      <AnimatePresence>
        {showFavorites && (
          <FavoritesModal
            favorites={user?.favorites || []}
            onRemove={(id) => {
              playClick();
              if (user) {
                const updatedUser = {
                  ...user,
                  favorites: user.favorites.filter(fav => fav.id !== id)
                };
                setUser(updatedUser);
                saveUser(updatedUser);
              }
            }}
            onClose={() => {
              playClick();
              setShowFavorites(false);
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Experience Progress Bar */}
      {user && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-black/40 xp-container z-40"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="container mx-auto flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600/20 border border-purple-600/50 xp-icon-container">
              <Zap className={`w-6 h-6 text-cyan-400 ${xpAnimating ? 'animate-pulse' : ''}`} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-cyan-400 font-semibold">
                  {t('experience.level')} {user.level}
                </span>
                <span className="text-sm text-purple-300">
                  {user.experience} / {calculateRequiredExp(user.level)} XP
                </span>
              </div>
              
              <div className="h-4 w-full xp-bar-container overflow-hidden relative">
                <motion.div 
                  className="xp-bar"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${experienceProgress}%`,
                    transition: { duration: xpAnimating ? 0.8 : 0.3, ease: 'easeOut' }
                  }}
                />
                
                {/* Glow effect */}
                <motion.div 
                  className="xp-glow"
                  initial={{ left: '-20%' }}
                  animate={{
                    left: xpAnimating ? '120%' : '-20%',
                    transition: { duration: 1, ease: 'easeInOut' }
                  }}
                />
                
                {/* Milestone dots for progress visualization */}
                {[25, 50, 75].map(milestone => (
                  <div 
                    key={`milestone-${milestone}`}
                    className="xp-milestone"
                    style={{ left: `${milestone}%` }}
                  />
                ))}
                
                {/* XP gain animation */}
                <AnimatePresence>
                  {xpAnimating && (
                    <motion.div
                      className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="text-sm font-bold text-cyan-300 shadow-glow"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: -20, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                      >
                        +XP
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default App;