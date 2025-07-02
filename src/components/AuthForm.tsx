import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [debugModal, setDebugModal] = useState(false);
  
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the Terms of Service and Privacy Policy to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      console.log('🔍 Starting signup process...');
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('❌ Signup error:', error);
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user && data.session) {
        console.log('✅ User signed up and session created:', data.user.id);
        
        toast({
          title: "Welcome to Tappd! 🎉",
          description: "Redirecting to app...",
        });
        
        // Simple page refresh to reload with new auth state
        console.log('🔄 Signup complete - refreshing page...');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        console.log('⚠️ User created but no session - email verification might be required');
        toast({
          title: "Check Your Email",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error) {
      console.error('❌ Signup error:', error);
      toast({
        title: "Sign Up Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('🔍 Starting signin process...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('❌ Signin error:', error);
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user && data.session) {
        console.log('✅ User signed in successfully:', data.user.id);
        
        toast({
          title: "Welcome back! 🚀",
          description: "Redirecting to app...",
        });
        
        // Simple page refresh to reload with new auth state
        console.log('🔄 Signin complete - refreshing page...');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('❌ Signin error:', error);
      toast({
        title: "Sign In Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      
      if (error) {
        toast({
          title: "Reset Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setResetEmailSent(true);
      toast({
        title: "Reset Email Sent! 📧",
        description: "Check your email for password reset instructions.",
      });
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-2xl">🔥</span>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Tappd
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2 font-medium">Tap in. Find out. 😉</p>
          <p className="text-xs text-orange-600 mt-1 font-semibold">🧪 Testing Mode - Email Verification Disabled</p>

          {/* DEBUG BUTTONS */}
          <div className="flex gap-2 justify-center mt-3">
            <Button 
              onClick={() => {
                console.log('🧪 Debug button clicked!');
                setDebugModal(true);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs"
            >
              🚨 TEST MODAL
            </Button>
            
            <Button 
              onClick={() => {
                console.log('🔍 Direct Terms test...');
                setShowTerms(true);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs"
            >
              📄 Terms Test
            </Button>
            
            <Button 
              onClick={() => {
                console.log('🔒 Direct Privacy test...');
                setShowPrivacy(true);
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-xs"
            >
              🔒 Privacy Test
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="signin" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="border-2 border-gray-200 focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="border-2 border-gray-200 focus:border-purple-500"
                  />
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-purple-600 hover:text-purple-800 font-medium underline transition-colors"
                    disabled={loading}
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2.5 shadow-lg transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In 🚀"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="border-2 border-gray-200 focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="border-2 border-gray-200 focus:border-purple-500"
                  />
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start space-x-3 py-2 bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="mt-1 border-2 border-gray-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500 data-[state=checked]:border-purple-500"
                  />
                  <div className="text-sm leading-relaxed">
                    <label htmlFor="terms" className="text-gray-700 cursor-pointer">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => {
                          console.log('🔍 Terms of Service link clicked!');
                          setShowTerms(true);
                          console.log('Terms state set to:', true);
                        }}
                        className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 font-bold underline decoration-2 hover:bg-purple-100 px-2 py-1 rounded transition-all duration-200 border border-purple-300"
                      >
                        📄 Terms of Service
                      </button>
                      {' '}and{' '}
                      <button
                        type="button"
                        onClick={() => {
                          console.log('🔒 Privacy Policy link clicked!');
                          setShowPrivacy(true);
                          console.log('Privacy state set to:', true);
                        }}
                        className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 font-bold underline decoration-2 hover:bg-purple-100 px-2 py-1 rounded transition-all duration-200 border border-purple-300"
                      >
                        🔒 Privacy Policy
                      </button>
                    </label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2.5 shadow-lg transition-all duration-200"
                  disabled={loading || !agreedToTerms}
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {resetEmailSent && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 text-center">
                📧 Password reset email sent! Check your inbox.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <TermsOfService open={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyPolicy open={showPrivacy} onClose={() => setShowPrivacy(false)} />

      {/* DEBUG MODAL */}
      {debugModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-green-600">🎉 Modal System Works!</h2>
            <p className="text-gray-700 mb-4">
              If you can see this, your modal system is working!
            </p>
            <Button 
              onClick={() => setDebugModal(false)}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Close Test Modal
            </Button>
          </div>
        </div>
      )}

      {/* DEBUG INFO */}
      <div className="fixed top-4 right-4 bg-black/80 text-white p-2 rounded text-xs font-mono">
        Debug: T={showTerms ? '✅' : '❌'} P={showPrivacy ? '✅' : '❌'} D={debugModal ? '✅' : '❌'}
      </div>

      {/* DEBUG STATE DISPLAY */}
      <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs font-mono">
        Auth: Email={email.slice(0,10)}... Terms={agreedToTerms ? '✅' : '❌'} Loading={loading ? '⏳' : '✅'}
      </div>
    </div>
  );
};

export default AuthForm;