/**
 * Calculates the required experience points needed to reach the next level
 * Uses a progressive scaling formula where each level requires more XP
 * @param currentLevel The user's current level
 * @returns The amount of XP needed for the next level
 */
export function calculateRequiredExp(currentLevel: number): number {
  // Base XP requirement for level 1
  const baseXP = 100;
  
  // Progressive scaling factor (makes each level require more XP)
  const scalingFactor = 1.5;
  
  // Calculate required XP using the formula: baseXP * (scalingFactor ^ (level - 1))
  return Math.floor(baseXP * Math.pow(scalingFactor, currentLevel - 1));
}