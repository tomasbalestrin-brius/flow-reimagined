import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cwluzpskecidagfjhveq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3bHV6cHNrZWNpZGFnZmpodmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTkwNjYsImV4cCI6MjA3OTIzNTA2Nn0.0TuRXL4ZLNTGTosXyEM1GX8z9L1WPTEzIsT_C-WHH6U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
