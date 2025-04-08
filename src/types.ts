export interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  experience: number;
  completedMissions: number;
  streak: number;
  stats: UserStats;
  favorites: FavoriteExercise[];
  loginHistory?: LoginHistoryEntry[];
}

export interface UserStats {
  totalExercises: number;
  totalReps: number;
  totalDistance: number;
  personalBests: {
    [key: string]: number;
  };
  exerciseHistory: {
    date: Date;
    exercise: string;
    reps: number;
    duration?: number;
    distance?: number;
  }[];
}

export interface LoginHistoryEntry {
  id: string;
  loggedInAt: Date;
  levelAtLogin: number;
  experienceAtLogin: number;
  completedMissionsAtLogin: number;
}

export interface FavoriteExercise {
  id: string;
  type: string;
  personalBest: number;
  lastPerformed?: Date;
  timesPerformed: number;
}

export interface Exercise {
  type: string;
  reps: number;
  sets?: number;
  distance?: number;
  progression?: number;
  completed?: boolean;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  exercises: Exercise[];
  difficulty: number;
  experienceReward: number;
  completed: boolean;
}