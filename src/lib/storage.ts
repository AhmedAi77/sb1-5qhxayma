import type { User, Mission } from '../types';

const STORAGE_KEY = 'arise_user_data';
const MISSIONS_KEY = 'arise_missions_data';
const SETTINGS_KEY = 'arise_settings';

// Enhanced saveUser function with validation and additional logging
export function saveUser(user: User): void {
  try {
    // Validate user data to ensure it's complete
    if (!user || !user.id || !user.name) {
      console.error('Invalid user data:', user);
      throw new Error('Invalid user data provided');
    }

    // Handle date objects for proper JSON serialization
    const processedUser = JSON.parse(
      JSON.stringify(user, (key, value) => {
        // Convert Date objects to ISO strings
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      })
    );

    const users = loadUsers();
    users[user.id] = processedUser;
    
    // Save to localStorage with try-catch
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      console.log('User data saved successfully:', user.id);
    } catch (storageError) {
      console.error('localStorage quota exceeded or storage is unavailable:', storageError);
      // Handle storage errors (e.g., localStorage full)
      handleStorageError(storageError);
    }
  } catch (error) {
    console.error('Error saving user:', error);
    // Still throw the error for upstream handling
    throw error;
  }
}

// Enhanced loadUser function with parsing date strings back to Date objects
export function loadUser(): User | null {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) return null;

    const users = JSON.parse(savedData, (key, value) => {
      // Convert ISO date strings back to Date objects
      if (typeof value === 'string' && 
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z$/.test(value)) {
        return new Date(value);
      }
      return value;
    });
    
    const userId = Object.keys(users)[0]; // Get first user
    if (!userId) return null;
    
    const user = users[userId];
    
    // Validate loaded user data
    if (!isValidUser(user)) {
      console.error('Invalid user data loaded:', user);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error loading user:', error);
    
    // Try to recover from corrupted data
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('Removed corrupted user data');
    } catch (cleanupError) {
      console.error('Failed to clean up corrupted data:', cleanupError);
    }
    
    return null;
  }
}

// Save mission data to persist between sessions
export function saveMission(mission: Mission): void {
  try {
    localStorage.setItem(MISSIONS_KEY, JSON.stringify(mission));
  } catch (error) {
    console.error('Error saving mission:', error);
  }
}

// Load saved mission
export function loadMission(): Mission | null {
  try {
    const savedData = localStorage.getItem(MISSIONS_KEY);
    if (!savedData) return null;
    
    return JSON.parse(savedData, (key, value) => {
      // Convert ISO date strings back to Date objects
      if (typeof value === 'string' && 
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z$/.test(value)) {
        return new Date(value);
      }
      return value;
    });
  } catch (error) {
    console.error('Error loading mission:', error);
    return null;
  }
}

// Enhanced findUserByName with validation
export function findUserByName(name: string): User | null {
  try {
    if (!name || name.trim() === '') {
      console.error('Invalid name provided');
      return null;
    }
    
    const users = loadUsers();
    const foundUser = Object.values(users).find(user => 
      user.name.toLowerCase() === name.toLowerCase()
    );
    
    if (foundUser && !isValidUser(foundUser)) {
      console.error('Found user data is invalid:', foundUser);
      return null;
    }
    
    return foundUser || null;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
}

// Basic user data validation
function isValidUser(user: any): boolean {
  return (
    user &&
    typeof user === 'object' &&
    typeof user.id === 'string' &&
    typeof user.name === 'string' &&
    typeof user.level === 'number' &&
    typeof user.experience === 'number' &&
    user.stats &&
    Array.isArray(user.favorites)
  );
}

// Load all users from storage
function loadUsers(): Record<string, User> {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : {};
  } catch (error) {
    console.error('Error loading users:', error);
    return {};
  }
}

// Handle storage errors like quota exceeded
function handleStorageError(error: any): void {
  // Check if localStorage is full
  if (error instanceof DOMException && 
      (error.name === 'QuotaExceededError' || 
       error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
    
    // Try to clean up some space
    try {
      // Remove old settings or other less important data
      localStorage.removeItem('temp_data');
      
      // Retry the save operation in the calling function
      console.log('Cleaned up storage space, retry save operation');
    } catch (cleanupError) {
      console.error('Failed to clean up storage:', cleanupError);
    }
  }
}

// Save app settings
export function saveSettings(settings: Record<string, any>): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

// Load app settings
export function loadSettings(): Record<string, any> {
  try {
    const savedData = localStorage.getItem(SETTINGS_KEY);
    return savedData ? JSON.parse(savedData) : {};
  } catch (error) {
    console.error('Error loading settings:', error);
    return {};
  }
}