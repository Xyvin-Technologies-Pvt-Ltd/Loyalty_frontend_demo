// Image utility functions for Capacitor
import { Capacitor } from '@capacitor/core';

/**
 * Get the proper image URL for Capacitor environment
 * @param {string} imageUrl - The image URL from API or asset path
 * @returns {string} - Processed URL for Capacitor
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // If it's already a full URL (http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative path starting with /, make it absolute
  if (imageUrl.startsWith('/')) {
    // Check if we're in Capacitor environment
    if (Capacitor.isNativePlatform()) {
      // Use the API base URL for Capacitor
      return `http://13.127.95.200${imageUrl}`;
    }
    // For web development, use current origin
    return `${window.location.origin}${imageUrl}`;
  }
  
  // For asset imports, return as is (Vite handles these)
  return imageUrl;
};

/**
 * Get the base URL for API calls in Capacitor
 * @returns {string} - Base URL for API calls
 */
export const getBaseUrl = () => {
  if (Capacitor.isNativePlatform()) {
    // For native apps, use the API base URL
    return 'http://13.127.95.200';
  }
  
  // For web development
  return window.location.origin;
};

/**
 * Check if running in Capacitor
 * @returns {boolean} - True if running in Capacitor
 */
export const isCapacitor = () => {
  return Capacitor.isNativePlatform();
};

/**
 * Handle image loading errors
 * @param {Event} event - The error event
 * @param {string} fallbackSrc - Fallback image source
 */
export const handleImageError = (event, fallbackSrc = '/src/assets/logo.png') => {
  if (event.target.src !== fallbackSrc) {
    event.target.src = fallbackSrc;
  }
};
