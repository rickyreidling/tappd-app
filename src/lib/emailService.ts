import { supabase } from './supabase';

export const sendConfirmationEmail = async (email: string, confirmationUrl: string) => {
  try {
    // Try to call the email service function
    const response = await fetch(
      'https://sstmnoilasukcxjacrjj.supabase.co/functions/v1/send-confirmation-email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, confirmationUrl })
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    // If the function doesn't exist or fails, return fallback message
    return {
      success: false,
      message: 'Confirmation email is currently disabled — please proceed manually.'
    };
  }
};
