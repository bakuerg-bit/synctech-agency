import { createClient } from '@supabase/supabase-js';

// These environment variables will be loaded from .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Key is missing! Ensure .env.local is set up.');
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);
