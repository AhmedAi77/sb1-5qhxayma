import { Achievement } from '../types';
import { 
  Trophy, Medal, Star, Target, Flame, Zap, 
  Timer, Crown, Award, Shield 
} from 'lucide-react';

export const achievements: Achievement[] = [
  {
    id: 'first-mission',
    name: 'First Steps',
    description: 'Complete your first training mission',
    icon: Medal.name,
    requirement: 1,
    progress: 0
  },
  {
    id: 'dedication',
    name: 'Dedicated Hunter',
    description: 'Complete 10 training missions',
    icon: Trophy.name,
    requirement: 10,
    progress: 0
  },
  {
    id: 'master',
    name: 'Training Master',
    description: 'Reach level 10',
    icon: Crown.name,
    requirement: 10,
    progress: 0
  },
  {
    id: 'streak-warrior',
    name: 'Streak Warrior',
    description: 'Maintain a 7-day training streak',
    icon: Flame.name,
    requirement: 7,
    progress: 0
  },
  {
    id: 'endurance',
    name: 'Endurance Champion',
    description: 'Complete 100 exercises',
    icon: Shield.name,
    requirement: 100,
    progress: 0
  }
];

export const checkAchievements = (user: User): Achievement[] => {
  return achievements.map(achievement => {
    let progress = 0;
    
    switch (achievement.id) {
      case 'first-mission':
        progress = Math.min(user.completedMissions, 1);
        break;
      case 'dedication':
        progress = Math.min(user.completedMissions, 10);
        break;
      case 'master':
        progress = Math.min(user.level, 10);
        break;
      case 'streak-warrior':
        progress = Math.min(user.streak, 7);
        break;
      case 'endurance':
        progress = Math.min(user.stats.totalExercises, 100);
        break;
    }
    
    return {
      ...achievement,
      progress,
      unlockedAt: progress >= achievement.requirement ? new Date() : undefined
    };
  });
};