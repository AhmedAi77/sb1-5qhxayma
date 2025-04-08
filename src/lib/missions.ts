import { Exercise } from '../types';
import { exercises } from '../data/exercises';

interface Mission {
  id: string;
  exercises: Exercise[];
  experienceReward: number;
  completed: boolean;
}

/**
 * Generates a daily mission based on the user's current level
 * @param level The user's current level
 * @returns A new daily mission with exercises scaled to the user's level
 */
export function generateDailyMission(level: number): Mission {
  // Base experience reward that scales with level
  const baseExperienceReward = 100 + (level - 1) * 25;

  // Determine difficulty based on level
  const difficulty = Math.min(Math.floor(level / 5), 2);
  const exercisePool = difficulty === 0 ? exercises.beginner : 
                      difficulty === 1 ? exercises.intermediate : 
                      exercises.advanced;
  
  // Generate 3-5 exercises based on level
  const numExercises = Math.min(3 + Math.floor(level / 5), 5);
  
  // Helper function to calculate progressed reps
  const getProgressedReps = (baseReps: number, progression: number, level: number) => {
    return Math.floor(baseReps + (progression * (level - 1)));
  };

  // Select random exercises from the pool
  const selectedExercises: Exercise[] = [];
  const usedTypes = new Set<string>();

  while (selectedExercises.length < numExercises) {
    const randomEx = exercisePool[Math.floor(Math.random() * exercisePool.length)];
    
    if (!usedTypes.has(randomEx.type)) {
      usedTypes.add(randomEx.type);
      
      const progressedReps = getProgressedReps(
        randomEx.reps,
        randomEx.progression || 1,
        level
      );

      selectedExercises.push({
        type: randomEx.type,
        reps: progressedReps,
        sets: randomEx.sets,
        distance: randomEx.distance,
        completed: false
      });
    }
  }

  return {
    id: crypto.randomUUID(),
    exercises: selectedExercises,
    experienceReward: baseExperienceReward,
    completed: false
  };
}