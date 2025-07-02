import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://sstmnoilasukcxjacrjj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzdG1ub2lsYXN1a2N4amFjcmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxODY5MDYsImV4cCI6MjA2Mjc2MjkwNn0.EZYiW-p_o0wuVxNvm9FOJh2wrdU7_hS1vyDNy4OEzoI';

// Create client with email confirmation DISABLED
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    confirmEmailChange: false,
    confirmSignUp: false
  }
});

console.log('✅ Supabase client initialized with email confirmation DISABLED');
console.log('⚠️ Users can now sign up without confirming their email');

export { supabase };
