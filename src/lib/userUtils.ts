import { toast } from 'react-hot-toast';
import { User, Exercise, FavoriteExercise } from '../types';
import { saveUser } from './storage';

export const toggleFavorite = (
  user: User | null, 
  exercise: Exercise,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
): void => {
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

export const createNewUser = (name: string): User => {
  return {
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
}; 