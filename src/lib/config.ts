// src/lib/config.ts
// COMPLETE REPLACEMENT - Make sure this is the ONLY config file

export const API_CONFIG = {
  // Use your actual IP address for Expo Go
  BASE_URL: 'http://192.168.3.153:8000', // Your WiFi IP - ALWAYS use this for Expo Go
  TIMEOUT: 30000,

  // Endpoints
  ENDPOINTS: {
    HEALTH: '/health',
    RECOMMENDATIONS: '/recommendations',
    INTERACTIONS: '/interactions',
    COURSES: '/courses',
    MODEL_INFO: '/model/info'
  }
};

// Supabase configuration (keep existing)
export const SUPABASE_CONFIG = {
  URL: 'https://wxvnjjxbvbevwmvqyack.supabase.co',
  ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dm5qanhidmJldndtdnF5YWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDYyMDAsImV4cCI6MjA2MTc4MjIwMH0.-Lstafz3cOl5KHuCpKgG-Xt9zRi12aJDqZr0mdHMzXc'
};

// SIMPLIFIED - No conditional logic, always use your IP for Expo Go
export const getApiUrl = () => {
  const url = 'http://192.168.3.153:8000';
  console.log('🔗 API URL configured as:', url);
  return url;
};

// Export the URL directly for easy debugging
export const API_URL = 'http://192.168.3.153:8000';

// Debug function
export const debugConfig = () => {
  console.log('🔧 Current API Configuration:');
  console.log('  URL:', getApiUrl());
  console.log('  Timeout:', API_CONFIG.TIMEOUT);
  console.log('  Base URL:', API_CONFIG.BASE_URL);
};

// Call debug on import
debugConfig();