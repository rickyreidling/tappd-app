// ==========================================
// 1. AUTH CONTEXT (src/context/AuthContext.jsx)
// ==========================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth event:', event);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// ==========================================
// 2. SIGNUP COMPONENT (src/components/SignupForm.jsx)
// ==========================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            date_of_birth: formData.dateOfBirth,
            full_name: `${formData.firstName} ${formData.lastName}`
          },
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });

      if (error) {
        setMessage(error.message);
        setIsSuccess(false);
      } else if (data.user) {
        setIsSuccess(true);
        setMessage('🎉 Account created! Check your email for verification link.');
      }
    } catch (error) {
      setMessage('An unexpected error occurred. Please try again.');
      setIsSuccess(false);
    }

    setIsLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resendVerification = async () => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: formData.email,
      options: {
        emailRedirectTo: `${window.location.origin}/verify-email`
      }
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('📧 Verification email sent! Check your inbox.');
    }
    
    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-white mb-4">Check Your Email!</h2>
          <p className="text-gray-300 mb-6">
            We've sent a verification link to <strong>{formData.email}</strong>
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Click the link in the email to verify your account and start using Tappd! 🔥
          </p>
          
          <div className="space-y-3">
            <button
              onClick={resendVerification}
              disabled={isLoading}
              className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Resend Email'}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🔥 Join Tappd</h1>
          <p className="text-gray-400">Find your perfect match</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {message && (
            <div className={`p-3 rounded-xl text-sm ${
              isSuccess ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : '🚀 Sign Up'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-purple-400 hover:text-purple-300 font-semibold"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 3. LOGIN COMPONENT (src/components/LoginForm.jsx)
// ==========================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setNeedsVerification(false);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setMessage(error.message);
        
        // Check if it's an email not confirmed error
        if (error.message.includes('Email not confirmed')) {
          setNeedsVerification(true);
        }
      } else if (data.user) {
        // Check if email is confirmed
        if (!data.user.email_confirmed_at) {
          setMessage('📧 Please verify your email before logging in');
          setNeedsVerification(true);
        } else {
          // Successfully logged in - redirect to main app
          navigate('/');
        }
      }
    } catch (error) {
      setMessage('An unexpected error occurred. Please try again.');
    }

    setIsLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resendVerification = async () => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: formData.email,
      options: {
        emailRedirectTo: `${window.location.origin}/verify-email`
      }
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('📧 Verification email sent! Check your inbox.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🔥 Welcome Back</h1>
          <p className="text-gray-400">Login to your Tappd account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {message && (
            <div className={`p-3 rounded-xl text-sm ${
              message.includes('sent!') ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
            }`}>
              {message}
              {needsVerification && (
                <div className="mt-2">
                  <button
                    onClick={resendVerification}
                    disabled={isLoading}
                    className="text-purple-400 hover:text-purple-300 underline disabled:opacity-50"
                  >
                    Resend verification email
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : '🚀 Login'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-purple-400 hover:text-purple-300 font-semibold"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 4. EMAIL VERIFICATION PAGE (src/components/VerifyEmail.jsx)
// ==========================================

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the tokens from the URL
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');

        console.log('🔐 Verification params:', { type, hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });

        if (type === 'signup' && accessToken && refreshToken) {
          // Set the session with the tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('❌ Verification error:', error);
            setStatus('error');
            setMessage(error.message);
          } else if (data.user) {
            console.log('✅ User verified:', data.user.email);
            setStatus('success');
            setMessage('🎉 Email verified successfully! Welcome to Tappd!');
            
            // Redirect to main app after 3 seconds
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 3000);
          }
        } else {
          setStatus('error');
          setMessage('Invalid verification link or missing parameters');
        }
      } catch (error) {
        console.error('❌ Verification error:', error);
        setStatus('error');
        setMessage('An error occurred during verification');
      }
    };

    handleEmailVerification();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
        {status === 'verifying' && (
          <>
            <div className="text-6xl mb-4 animate-spin">⏳</div>
            <h2 className="text-2xl font-bold text-white mb-4">Verifying Your Email...</h2>
            <p className="text-gray-400">Please wait while we verify your account.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to Tappd!</h2>
            <p className="text-gray-300 mb-6">{message}</p>
            <p className="text-gray-400 text-sm">Redirecting to your dashboard...</p>
            <div className="mt-4">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                🔥 Enter Tappd
              </button>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-white mb-4">Verification Failed</h2>
            <p className="text-red-400 mb-6">{message}</p>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/signup')}
                className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors"
              >
                Sign Up Again
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
              >
                Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 5. PROTECTED ROUTE COMPONENT (src/components/ProtectedRoute.jsx)
// ==========================================

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">🔥 Loading Tappd...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.email_confirmed_at) {
    return <Navigate to="/signup" replace />;
  }

  return <>{children}</>;
};

// Export all components
export { 
  AuthProvider,
  SignupForm, 
  LoginForm,
  VerifyEmail, 
  ProtectedRoute 
};