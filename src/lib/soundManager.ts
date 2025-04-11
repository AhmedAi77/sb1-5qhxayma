/**
 * Sound Manager for the Solo Leveling App
 * Manages all sound effects and background music
 */

// Sound paths - Updated to use existing files
const SOUND_PATHS = {
  buttonClick: '/sounds/click.mp3',
  systemAction: '/sounds/click.mp3',  // Using click sound
  success: '/sounds/levelup.mp3',     // Using levelup as success sound
  levelUp: '/sounds/levelup.mp3',
  splashScreen: '/sounds/levelup.mp3', // Using levelup for splash since it's more dramatic
  loadingScreen: '/sounds/click.mp3',  // Using click for loading
  hover: '/sounds/click.mp3',         // Using click for hover
};

// Volume settings - Adjusted for better experience
const VOLUME_SETTINGS = {
  buttonClick: 0.6,  // Increased volume for UI feedback
  systemAction: 0.5, // Medium volume for system sounds
  success: 0.7,      // High volume for success feedback
  levelUp: 0.7,      // High volume for level up
  splashScreen: 0.5, // Medium volume for splash
  loadingScreen: 0.5,// Medium volume for loading
  hover: 0.3,        // Lower volume for hover
};

// Create actual audio elements immediately to ensure they're ready
const createAudio = (src: string, volume: number) => {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.preload = 'auto';
  audio.muted = false; // Ensure not muted by default
  
  // Try to load immediately
  try {
    audio.load();
  } catch (e) {
    console.warn('Failed to load audio:', src, e);
  }
  return audio;
};

// Pre-create audio elements for critical sounds
const PRE_LOADED_SOUNDS = {
  buttonClick: createAudio(SOUND_PATHS.buttonClick, VOLUME_SETTINGS.buttonClick),
  systemAction: createAudio(SOUND_PATHS.systemAction, VOLUME_SETTINGS.systemAction),
  success: createAudio(SOUND_PATHS.success, VOLUME_SETTINGS.success),
  levelUp: createAudio(SOUND_PATHS.levelUp, VOLUME_SETTINGS.levelUp),
  splashScreen: createAudio(SOUND_PATHS.splashScreen, VOLUME_SETTINGS.splashScreen),
  loadingScreen: createAudio(SOUND_PATHS.loadingScreen, VOLUME_SETTINGS.loadingScreen),
  hover: createAudio(SOUND_PATHS.hover, VOLUME_SETTINGS.hover),
};

// Track if sounds are globally enabled
let soundsEnabled = true;
// Force audio to be unlocked by default
let audioUnlocked = true;

// Fallback sounds if modern sounds aren't available
const FALLBACK_SOUND_PATHS = {
  click: '/sounds/click.mp3',
  success: '/sounds/levelup.mp3',
  levelUp: '/sounds/levelup.mp3'
};

// Export for compatibility
export const SOUND_RESOURCES = FALLBACK_SOUND_PATHS;

// Anti-buzzing function - prevents too many sounds playing at once
let lastPlayedTime = 0;
const DEBOUNCE_TIME = 20; // ms - reduced to make sounds more responsive

const canPlaySound = (priority = false) => {
  const now = Date.now();
  if (priority) return true; // Priority sounds always play
  
  // Don't play non-priority sounds too close together (prevents buzzing)
  if (now - lastPlayedTime < DEBOUNCE_TIME) {
    return false;
  }
  
  lastPlayedTime = now;
  return true;
};

// Function to unlock audio - should be called after user interaction
export function unlockAudio() {
  // Set flag that we've unlocked audio
  audioUnlocked = true;
  console.log('Attempting to unlock audio...');
  
  // Try playing click and success sounds directly (these are the most critical)
  try {
    // Try click sound first
    const clickSound = PRE_LOADED_SOUNDS.buttonClick;
    clickSound.volume = 0.1;
    clickSound.play()
      .then(() => {
        // Successfully played - pause immediately
        clickSound.pause();
        clickSound.currentTime = 0;
        clickSound.volume = VOLUME_SETTINGS.buttonClick;
        console.log('Click sound played successfully - audio unlocked');
      })
      .catch(err => {
        console.warn('Failed to play click sound:', err);
      });

    // Try success sound second
    setTimeout(() => {
      const successSound = PRE_LOADED_SOUNDS.levelUp;
      successSound.volume = 0.1;
      successSound.play()
        .then(() => {
          // Successfully played - pause immediately
          successSound.pause();
          successSound.currentTime = 0;
          successSound.volume = VOLUME_SETTINGS.levelUp;
          console.log('Success sound played successfully - audio unlocked');
        })
        .catch(err => {
          console.warn('Failed to play success sound:', err);
        });
    }, 100);
  } catch (e) {
    console.warn('Error during audio unlock:', e);
  }
}

// Initialize all sound effects
export function initSoundEffects() {
  // Just preload all sounds to ensure they're ready
  Object.keys(SOUND_PATHS).forEach(key => {
    const soundKey = key as keyof typeof SOUND_PATHS;
    const audio = PRE_LOADED_SOUNDS[soundKey];
    if (audio) {
      try {
        // Force loading again
        audio.load();
        audio.muted = false; // Make sure not muted
      } catch (e) {
        console.warn(`Failed to initialize sound: ${soundKey}`, e);
      }
    }
  });
}

// Function to play a sound effect
export function playSound(sound: keyof typeof PRE_LOADED_SOUNDS, options?: { volume?: number, loop?: boolean, priority?: boolean }) {
  // Don't play if sounds are disabled
  if (!soundsEnabled) return;
  
  // Anti-buzzing check
  if (!canPlaySound(options?.priority)) return;

  try {
    // Use a clone of the audio element to allow multiple sounds to play simultaneously
    const audioElement = PRE_LOADED_SOUNDS[sound];
    if (!audioElement) {
      console.warn(`Sound not found: ${sound}`);
      return;
    }
    
    // Check if the audio element has valid source
    if (!audioElement.src) {
      console.warn(`Invalid source for sound: ${sound}`);
      return;
    }
    
    // Direct method - use the existing audio element without cloning
    // This is more reliable on some browsers
    audioElement.pause();
    audioElement.currentTime = 0;
    
    // Set volume - use dynamic volume control
    const baseVolume = options?.volume ?? VOLUME_SETTINGS[sound];
    const finalVolume = Math.min(baseVolume, 0.8); // Higher max volume cap for better audibility
    audioElement.volume = finalVolume;
    
    // Set loop if provided
    audioElement.loop = options?.loop === true;
    
    // Force unmute
    audioElement.muted = false;
    
    // Play the sound and log any errors
    audioElement.play().catch((error) => {
      console.warn(`Failed to play sound ${sound}:`, error);
    });
  } catch (error) {
    console.error(`Error playing sound ${sound}:`, error);
  }
}

// Legacy functions for compatibility with existing code
export function playClick() {
  playSound('buttonClick', { priority: false });
}

export function playHover() {
  playSound('hover', { priority: false });
}

export function playSuccess() {
  playSound('success', { priority: true });
}

export function playLevelUp() {
  playSound('levelUp', { priority: true });
}

export function preloadSounds() {
  initSoundEffects();
}

// Function to stop a sound effect
export function stopSound(sound: keyof typeof PRE_LOADED_SOUNDS) {
  const audio = PRE_LOADED_SOUNDS[sound];
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

// Function to pause a sound effect
export function pauseSound(sound: keyof typeof PRE_LOADED_SOUNDS) {
  const audio = PRE_LOADED_SOUNDS[sound];
  if (audio) {
    audio.pause();
  }
}

// Function to toggle all sounds (both effects and music)
export function toggleAllSounds(enable: boolean) {
  soundsEnabled = enable;
  // When enable is true, we want to unmute (mute=false)
  // When enable is false, we want to mute (mute=true)
  toggleMuteSounds(!enable);
}

// Function to toggle mute state for all sounds
export function toggleMuteSounds(mute: boolean) {
  Object.values(PRE_LOADED_SOUNDS).forEach((audio) => {
    if (audio) {
      audio.muted = mute;
    }
  });
}

// Helper functions for common sound actions
export const sounds = {
  click: () => playSound('buttonClick'),
  system: () => playSound('systemAction'),
  success: () => playSound('success', { priority: true }),
  levelUp: () => playSound('levelUp', { priority: true }),
  splash: (options?: { loop?: boolean; volume?: number }) => 
    playSound('splashScreen', { ...options, priority: true }),
  loading: (options?: { loop?: boolean; volume?: number }) => 
    playSound('loadingScreen', { ...options, priority: true }),
  stopSplash: () => stopSound('splashScreen'),
  stopLoading: () => stopSound('loadingScreen'),
  mute: () => toggleMuteSounds(true),
  unmute: () => toggleMuteSounds(false),
  hover: () => playSound('hover'),
}; 