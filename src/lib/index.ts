/**
 * Audio utilities
 */
export {
  playClick,
  playHover,
  playSuccess,
  playLevelUp,
  preloadSounds,
  SOUND_RESOURCES
} from './audio';

/**
 * User management
 */
export {
  loadUser,
  saveUser,
  findUserByName
} from './storage';

export { 
  toggleFavorite,
  createNewUser
} from './userUtils';

/**
 * Mission management
 */
export {
  generateDailyMission,
  calculateRequiredExp
} from './missionUtils';

/**
 * Supabase integration is currently not used but kept for potential future use
 * Uncomment if needed
 */
// export { login, signup, logout } from './auth'; 