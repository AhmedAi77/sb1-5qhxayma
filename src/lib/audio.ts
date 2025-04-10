// Sound effect URLs
const CLICK_SOUND = '/sounds/click.mp3';
const SUCCESS_SOUND = '/sounds/success.mp3';
const LEVEL_UP_SOUND = '/sounds/levelup.mp3';

// Audio instances cache
const audioCache: { [key: string]: HTMLAudioElement } = {};

/**
 * Get or create an audio instance
 */
function getAudio(url: string, volume: number = 0.4): HTMLAudioElement {
  if (!audioCache[url]) {
    const audio = new Audio(url);
    audio.volume = volume;
    audioCache[url] = audio;
  }
  return audioCache[url];
}

/**
 * Play a click/interaction sound
 */
export function playClick(): void {
  const audio = getAudio(CLICK_SOUND, 0.4);
  audio.currentTime = 0;
  audio.play().catch(err => console.error('Error playing click sound:', err));
}

/**
 * Play a hover interaction sound
 */
export function playHover(): void {
  const audio = getAudio(CLICK_SOUND, 0.2);
  audio.currentTime = 0;
  audio.play().catch(err => console.error('Error playing hover sound:', err));
}

/**
 * Play a success sound (e.g., when completing a mission)
 */
export function playSuccess(): void {
  const audio = getAudio(SUCCESS_SOUND, 0.5);
  audio.currentTime = 0;
  audio.play().catch(err => console.error('Error playing success sound:', err));
}

/**
 * Play a level up celebration sound
 */
export function playLevelUp(): void {
  const audio = getAudio(LEVEL_UP_SOUND, 0.6);
  audio.currentTime = 0;
  audio.play().catch(err => console.error('Error playing level up sound:', err));
}

/**
 * Preload all sounds to avoid delays when playing them for the first time
 */
export function preloadSounds(): void {
  getAudio(CLICK_SOUND, 0.4);
  getAudio(SUCCESS_SOUND, 0.5);
  getAudio(LEVEL_UP_SOUND, 0.6);
}

/**
 * Sound resources for use with the useSound hook
 */
export const SOUND_RESOURCES = {
  click: CLICK_SOUND,
  success: SUCCESS_SOUND,
  levelUp: LEVEL_UP_SOUND
};