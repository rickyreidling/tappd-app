import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://sstmnoilasukcxjacrjj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzdG1ub2lsYXN1a2N4amFjcmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxODY5MDYsImV4cCI6MjA2Mjc2MjkwNn0.EZYiW-p_o0wuVxNvm9FOJh2wrdU7_hS1vyDNy4OEzoI';

// Create client with email confirmation disabled for testing
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    // Disable email confirmation for testing
    confirmEmailChange: false,
    confirmSignUp: false
  }
});

export { supabase };