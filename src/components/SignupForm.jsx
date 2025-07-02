// SignupForm.jsx (Enhanced with TOS & Privacy Modals)

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import TermsOfService from '@/components/TermsOfService';
import PrivacyPolicy from '@/components/PrivacyPolicy';

const useToast = () => {
  return {
    toast: ({ title, description }) => {
      alert(`${title}\n${description}`);
    }
  };
};

const Input = ({ type = 'text', placeholder, className, value, onChange, required, ...props }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className || ''}`}
      value={value}
      onChange={onChange}
      required={required}
      {...props}
    />
  );
};

const SignupForm = ({ onLogin = null }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [stars, setStars] = useState([]);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      const numStars = Math.floor(Math.random() * 3) + 3;

      for (let i = 0; i < numStars; i++) {
        newStars.push({
          id: Math.random(),
          x: Math.random() * 60 + 20,
          y: Math.random() * 60 + 20,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          duration: Math.random() * 1000 + 500
        });
      }
      setStars(newStars);
    };

    generateStars();
    const interval = setInterval(generateStars, 800);
    return () => clearInterval(interval);
  }, []);

  const manualLogin = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    localStorage.setItem('demo_user_' + userData.email, JSON.stringify(userData));
    window.location.reload();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp && !agreedToTerms) {
      toast({
        title: 'Terms Required',
        description: 'Please agree to the Terms of Service and Privacy Policy'
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        await new Promise(res => setTimeout(res, 1500));
        toast({
          title: 'Check your email! 📧',
          description: `We sent a confirmation link to ${formData.email}.`
        });
        setTimeout(() => {
          const mockUser = {
            id: 'demo-user-' + Date.now(),
            email: formData.email,
            email_confirmed_at: new Date().toISOString()
          };
          const mockToken = 'demo-token-' + Date.now();
          manualLogin(mockUser, mockToken);
        }, 3000);
      } else {
        await new Promise(res => setTimeout(res, 1000));
        const existingUser = localStorage.getItem('demo_user_' + formData.email);
        if (existingUser) {
          const userData = JSON.parse(existingUser);
          const mockToken = 'demo-token-' + Date.now();
          manualLogin(userData, mockToken);
        } else {
          throw new Error('Invalid email or password. Please sign up first.');
        }
      }
    } catch (error) {
      toast({ title: 'Error', description: error.message || 'Something went wrong.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #8B5FBF 0%, #D946EF 50%, #F97316 100%)' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 relative" style={{ background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ff9500 100%)', boxShadow: '0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3)' }}>
                {stars.map(star => (
                  <div
                    key={star.id}
                    className="absolute rounded-full bg-white animate-pulse"
                    style={{
                      left: `${star.x}%`,
                      top: `${star.y}%`,
                      width: `${star.size}px`,
                      height: `${star.size}px`,
                      opacity: star.opacity,
                      boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
                      animation: `twinkle ${star.duration}ms ease-in-out infinite`
                    }}
                  />
                ))}
                <style dangerouslySetInnerHTML={{ __html: `@keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }` }} />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tappd</h1>
            <p className="text-gray-600 mb-6">Tap in. Find out. 😊</p>
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button type="button" onClick={() => setIsSignUp(false)} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${!isSignUp ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Sign In</button>
              <button type="button" onClick={() => setIsSignUp(true)} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${isSignUp ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Sign Up</button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="your@email.com" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} placeholder="••••••••" className="w-full pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="flex items-center">
                <input type="checkbox" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <button type="button" onClick={() => setShowTerms(true)} className="text-purple-600 hover:text-purple-800 font-semibold underline">Terms of Service</button>{' '}and{' '}
                  <button type="button" onClick={() => setShowPrivacy(true)} className="text-purple-600 hover:text-purple-800 font-semibold underline">Privacy Policy</button>
                </label>
              </div>
            )}

            <button type="submit" disabled={isLoading} className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'}`}>
              {isLoading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </div>
        </form>
        <TermsOfService open={showTerms} onClose={() => setShowTerms(false)} />
        <PrivacyPolicy open={showPrivacy} onClose={() => setShowPrivacy(false)} />
      </div>
    </div>
  );
};

export default SignupForm;
