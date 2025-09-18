// src/lib/scoreManager.ts
// Handles score tracking, point accumulation, and discount calculation

import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizResult } from './quiz';

// Storage keys
const QUIZ_RESULTS_KEY = '@mysuru:quiz_results';
const TOTAL_POINTS_KEY = '@mysuru:total_points';
const ACTIVE_DISCOUNTS_KEY = '@mysuru:active_discounts';

// Discount validity period (in milliseconds)
const DISCOUNT_VALIDITY_PERIOD = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface ActiveDiscount {
  locationId: string;
  discountPercentage: number;
  expiryDate: number; // Timestamp when the discount expires
}

/**
 * Save a quiz result
 * @param result The quiz result to save
 */
export async function saveQuizResult(result: QuizResult): Promise<void> {
  try {
    // Get existing quiz results
    const resultsJson = await AsyncStorage.getItem(QUIZ_RESULTS_KEY);
    const results: QuizResult[] = resultsJson ? JSON.parse(resultsJson) : [];
    
    // Add new result
    results.push(result);
    
    // Save updated results
    await AsyncStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(results));
    
    // Update total points
    await addPoints(result.pointsEarned);
    
    // Create discount offer
    await createDiscount(result.locationId, result.discountPercentage);
  } catch (error) {
    console.error('Error saving quiz result:', error);
  }
}

/**
 * Get all quiz results
 * @returns Array of quiz results
 */
export async function getQuizResults(): Promise<QuizResult[]> {
  try {
    const resultsJson = await AsyncStorage.getItem(QUIZ_RESULTS_KEY);
    return resultsJson ? JSON.parse(resultsJson) : [];
  } catch (error) {
    console.error('Error getting quiz results:', error);
    return [];
  }
}

/**
 * Get total accumulated points
 * @returns Total points
 */
export async function getTotalPoints(): Promise<number> {
  try {
    const pointsJson = await AsyncStorage.getItem(TOTAL_POINTS_KEY);
    return pointsJson ? parseInt(pointsJson, 10) : 0;
  } catch (error) {
    console.error('Error getting total points:', error);
    return 0;
  }
}

/**
 * Add points to the total
 * @param points Points to add
 */
export async function addPoints(points: number): Promise<void> {
  try {
    const currentPoints = await getTotalPoints();
    const newTotal = currentPoints + points;
    await AsyncStorage.setItem(TOTAL_POINTS_KEY, newTotal.toString());
  } catch (error) {
    console.error('Error adding points:', error);
  }
}

/**
 * Create a new discount for a location
 * @param locationId Location ID
 * @param discountPercentage Discount percentage
 */
export async function createDiscount(
  locationId: string,
  discountPercentage: number
): Promise<void> {
  try {
    // Get existing discounts
    const discountsJson = await AsyncStorage.getItem(ACTIVE_DISCOUNTS_KEY);
    const discounts: ActiveDiscount[] = discountsJson ? JSON.parse(discountsJson) : [];
    
    // Check if discount already exists for this location
    const existingIndex = discounts.findIndex(d => d.locationId === locationId);
    
    // Calculate expiry date (7 days from now)
    const expiryDate = Date.now() + DISCOUNT_VALIDITY_PERIOD;
    
    if (existingIndex >= 0) {
      // Update existing discount if the new one is better
      if (discounts[existingIndex].discountPercentage < discountPercentage) {
        discounts[existingIndex].discountPercentage = discountPercentage;
        discounts[existingIndex].expiryDate = expiryDate;
      }
    } else {
      // Add new discount
      discounts.push({
        locationId,
        discountPercentage,
        expiryDate
      });
    }
    
    // Save updated discounts
    await AsyncStorage.setItem(ACTIVE_DISCOUNTS_KEY, JSON.stringify(discounts));
  } catch (error) {
    console.error('Error creating discount:', error);
  }
}

/**
 * Get all active discounts
 * @returns Array of active discounts
 */
export async function getActiveDiscounts(): Promise<ActiveDiscount[]> {
  try {
    const discountsJson = await AsyncStorage.getItem(ACTIVE_DISCOUNTS_KEY);
    const discounts: ActiveDiscount[] = discountsJson ? JSON.parse(discountsJson) : [];
    
    // Filter out expired discounts
    const now = Date.now();
    const activeDiscounts = discounts.filter(d => d.expiryDate > now);
    
    // If some discounts were expired, update storage
    if (activeDiscounts.length < discounts.length) {
      await AsyncStorage.setItem(ACTIVE_DISCOUNTS_KEY, JSON.stringify(activeDiscounts));
    }
    
    return activeDiscounts;
  } catch (error) {
    console.error('Error getting active discounts:', error);
    return [];
  }
}

/**
 * Get discount for a specific location
 * @param locationId Location ID
 * @returns Discount information or null if no active discount
 */
export async function getDiscountForLocation(
  locationId: string
): Promise<ActiveDiscount | null> {
  try {
    const activeDiscounts = await getActiveDiscounts();
    return activeDiscounts.find(d => d.locationId === locationId) || null;
  } catch (error) {
    console.error('Error getting discount for location:', error);
    return null;
  }
}

/**
 * Use a discount (removes it from active discounts)
 * @param locationId Location ID
 * @returns Whether the discount was successfully used
 */
export async function useDiscount(locationId: string): Promise<boolean> {
  try {
    // Get existing discounts
    const discountsJson = await AsyncStorage.getItem(ACTIVE_DISCOUNTS_KEY);
    const discounts: ActiveDiscount[] = discountsJson ? JSON.parse(discountsJson) : [];
    
    // Find discount for the location
    const index = discounts.findIndex(d => d.locationId === locationId);
    
    if (index >= 0) {
      // Remove the discount
      discounts.splice(index, 1);
      
      // Save updated discounts
      await AsyncStorage.setItem(ACTIVE_DISCOUNTS_KEY, JSON.stringify(discounts));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error using discount:', error);
    return false;
  }
}

/**
 * Clear all score data (for testing/reset)
 */
export async function clearAllScoreData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      QUIZ_RESULTS_KEY,
      TOTAL_POINTS_KEY,
      ACTIVE_DISCOUNTS_KEY
    ]);
  } catch (error) {
    console.error('Error clearing score data:', error);
  }
}
