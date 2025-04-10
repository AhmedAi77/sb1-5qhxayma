import { Mission, Exercise } from '../types';
import { exercises } from '../data/exercises';
import { quotes } from '../data/quotes';

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
    title: getTranslation('mission.title'),
    description: quotes[Math.floor(Math.random() * quotes.length)],
    exercises: selectedExercises.slice(0, 6),
    difficulty,
    experienceReward: Math.floor(baseReward * levelMultiplier * difficultyMultiplier),
    completed: false
  };
}; 