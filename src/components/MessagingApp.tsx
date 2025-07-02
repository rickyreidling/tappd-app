import React, { useState, useEffect } from 'react';
import TappdActivityCenter from './TappdActivityCenter';
import SignupForm from './SignupForm';

const MainApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken && 
            storedUser !== 'null' && storedToken !== 'null') {
          const userData = JSON.parse(storedUser);
          if (userData && (userData.email || userData.id)) {
            setUser(userData);
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
      setIsLoading(false);
    };

    checkAuthStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        setTimeout(checkAuthStatus, 100);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle successful login/signup
  const handleLogin = (userData, token) => {
    console.log('🎉 Login successful:', userData);
    
    try {
      // Store authentication data
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      // Update state
      setUser(userData);
      setIsLoggedIn(true);
      
      console.log('✅ User logged in and state updated');
    } catch (error) {
      console.error('❌ Login storage error:', error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
    console.log('🚪 User logged out');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-600">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isLoggedIn) {
    console.log('🔐 Showing login form, onLogin function:', typeof handleLogin);
    return <SignupForm onLogin={handleLogin} />;
  }

  // Show main app if authenticated
  console.log('✅ User is logged in, showing main app');
  return <TappdActivityCenter user={user} onLogout={handleLogout} />;
};

export default MainApp;