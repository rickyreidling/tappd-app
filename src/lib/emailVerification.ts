import { supabase } from './supabase';

export const sendVerificationEmail = async (email: string, userId: string) => {
  try {
    // Wait for session to be fully established
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    
    if (!session) {
      throw new Error('No authenticated session found');
    }

    // Generate verification token
    const token = crypto.randomUUID();
    const confirmationUrl = `${window.location.origin}/verify-email?token=${token}`;
    
    console.log('🚀 Starting email verification process...');
    console.log('📧 Email:', email);
    console.log('👤 User ID:', userId);
    console.log('🔑 Token:', token);
    
    // Store token in database with proper auth context
    const { error: dbError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: email,
        verification_token: token,
        verification_sent_at: new Date().toISOString(),
        email_verified: false
      }, {
        onConflict: 'id'
      });
    
    if (dbError) {
      console.error('❌ Database error:', dbError);
      throw dbError;
    }
    
    console.log('✅ Database updated successfully');

    // Call the existing Supabase function for email sending
    console.log('📨 Calling Supabase email function...');
    
    const emailResponse = await fetch('https://sstmnoilasukcxjacrjj.supabase.co/functions/v1/c9c5c46b-fe8e-4609-a476-5b7f3e58b6b1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        email: email,
        userId: userId,
        token: token
      })
    });
    
    console.log('📧 Email function response status:', emailResponse.status);
    
    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('❌ Email function failed:', errorText);
      throw new Error(`Email function failed: ${errorText}`);
    }
    
    const emailResult = await emailResponse.json();
    console.log('✅ Email function result:', emailResult);
    
    // Also try direct Supabase auth resend as backup
    console.log('🔄 Attempting direct auth resend as backup...');
    
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: confirmationUrl
        }
      });
      
      if (resendError) {
        console.warn('⚠️ Direct resend failed:', resendError.message);
      } else {
        console.log('✅ Direct resend succeeded');
      }
    } catch (resendError) {
      console.warn('⚠️ Direct resend error:', resendError);
    }
    
    console.log('🏁 Email verification process completed');
    
    return { 
      success: true, 
      message: 'Verification email sent successfully',
      token,
      functionResult: emailResult
    };
    
  } catch (error: any) {
    console.error('❌ Verification email error:', error);
    return { success: false, error: error.message };
  }
};

export const verifyEmailToken = async (token: string) => {
  try {
    // Use the deployed Supabase function for verification
    const response = await fetch('https://sstmnoilasukcxjacrjj.supabase.co/functions/v1/b6cc9dab-0e67-4317-9d8f-aea545a1b55e', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      return { success: true, message: 'Email verified successfully' };
    } else {
      return { success: false, error: result.error || 'Verification failed' };
    }
    
  } catch (error: any) {
    console.error('Email verification error:', error);
    return { success: false, error: error.message || 'Verification failed' };
  }
};

export const checkEmailVerification = async (userId: string) => {
  try {
    // Ensure we have a valid session before checking
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Session error during verification check:', sessionError);
      return { verified: false };
    }
    
    const { data: users, error } = await supabase
      .from('users')
      .select('email_verified')
      .eq('id', userId)
      .limit(1);
    
    if (error) {
      console.error('Check verification error:', error);
      return { verified: false };
    }
    
    // Handle case where no user found
    if (!users || users.length === 0) {
      return { verified: false };
    }
    
    return { verified: users[0]?.email_verified || false };
  } catch (error: any) {
    console.error('Check verification error:', error);
    return { verified: false };
  }
};