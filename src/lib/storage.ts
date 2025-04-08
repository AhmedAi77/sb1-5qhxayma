import type { User } from '../types';

const STORAGE_KEY = 'arise_user_data';

export function saveUser(user: User): void {
  try {
    const users = loadUsers();
    users[user.id] = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
}

export function loadUser(): User | null {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) return null;

    const users = JSON.parse(savedData);
    const userId = Object.keys(users)[0]; // Get first user
    return users[userId] || null;
  } catch (error) {
    console.error('Error loading user:', error);
    return null;
  }
}

export function findUserByName(name: string): User | null {
  try {
    const users = loadUsers();
    return Object.values(users).find(user => user.name === name) || null;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
}

function loadUsers(): Record<string, User> {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : {};
  } catch (error) {
    console.error('Error loading users:', error);
    return {};
  }
}