import { Mission, Exercise } from '../types';
import { exercises } from '../data/exercises';
import { quotes } from '../data/quotes';

/**
 * Calculates the required experience points needed to reach the next level
 * Uses a progressive scaling formula where each level requires more XP
 * @param level The user's current level
 * @returns The amount of XP needed for the next level
 */
export const calculateRequiredExp = (level: number): number => {
  return Math.floor(200 * Math.pow(1.5, level - 1));
};

export const generateDailyMission = (level: number, getTranslation: (key: string) => string): Mission => {
  const difficulty = Math.min(Math.floor(level / 5), 2);
  const exercisePool = difficulty === 0 ? exercises.beginner : 
                       difficulty === 1 ? exercises.intermediate : 
                       exercises.advanced;
  
  const selectedExercises: Exercise[] = [];
  const categories = ['Core', 'Upper Body', 'Lower Body', 'Cardio'];
  
  const getProgressedReps = (baseReps: number, progression: number, level: number): number => {
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
      const progressedReps = getProgressedReps(randomEx.reps || 10, randomEx.progression || 1, level);
      
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
      const progressedReps = getProgressedReps(randomEx.reps || 10, randomEx.progression || 1, level);
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

  // Select a mission title based on the exercise types
  const missionTitles = [
    'Daily Training Challenge',
    'Push Your Limits',
    'Core Strength Builder',
    'Endurance Test',
    'Full Body Circuit'
  ];
  const randomTitleIndex = Math.floor(Math.random() * missionTitles.length);
  const missionTitle = missionTitles[randomTitleIndex];

  // Use one of our motivational quotes that will be translated
  const systemQuotes = [
    'Your strength is not just in your muscles, but in your determination to push beyond limits.',
    'Every rep brings you closer to your potential. Push harder, achieve more.',
    'The master of physical training understands that consistency creates power.'
  ];
  const randomQuoteIndex = Math.floor(Math.random() * systemQuotes.length);
  const motivationalQuote = systemQuotes[randomQuoteIndex];

  return {
    id: Date.now(),
    title: missionTitle,
    description: motivationalQuote,
    exercises: selectedExercises.slice(0, 6),
    difficulty,
    experienceReward: Math.floor(baseReward * levelMultiplier * difficultyMultiplier),
    completed: false
  };
}; 