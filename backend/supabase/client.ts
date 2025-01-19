import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rdllxeujmpzxjjzyrhmy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbGx4ZXVqbXB6eGpqenlyaG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNzQ5ODIsImV4cCI6MjA1MTg1MDk4Mn0.4gfKxNiV4wyfX8-5A7vGLXkF9PjaxYBWEJmS9q7pw-A";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);