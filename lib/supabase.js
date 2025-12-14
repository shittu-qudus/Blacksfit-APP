// src/lib/supabase.js
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://ehvsoqbdjmrfsvbqbujo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodnNvcWJkam1yZnN2YnFidWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1OTgzNjgsImV4cCI6MjA4MTE3NDM2OH0.-Eu45m9uJVsM1ZurWZ2wzBiw32EC7pOp253nKWxYUFs';

// Initialize the Supabase client with React Native configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce', 
  },
  global: {
    headers: {
      'X-Client-Info': 'blacksfits-react-native/1.0',
    },
  },
});

// Helper functions for auth state management
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const updateUserProfile = async (updates) => {
  const { data, error } = await supabase.auth.updateUser(updates);
  if (error) throw error;
  return data;
};