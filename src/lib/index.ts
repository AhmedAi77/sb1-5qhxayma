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
} from './soundManager';

/**
 * User management
 */
export {
  loadUser,
  saveUser,
  findUserByName,
  loadMission,
  saveMission,
  loadSettings,
  saveSettings
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