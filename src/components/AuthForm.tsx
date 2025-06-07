import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';

interface AuthFormProps {
  onAuthSuccess: (user: any) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const { toast } = useToast();
  const { setCurrentUser, loadProfile, setEmailVerified } = useAppContext();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the Terms of Service and Privacy Policy to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Create user account - email confirmation disabled in client config
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user && data.session) {
        // User is immediately signed in without email confirmation
        console.log('✅ User signed up and session created:', data.session.user.id);
        
        // Create user record in our users table
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            email_verified: true // Skip email verification for testing
          });
        
        if (userError && userError.code !== '23505') {
          console.error('Error creating user record:', userError);
        }
        
        setCurrentUser(data.user);
        setEmailVerified(true); // Skip email verification
        
        toast({
          title: "Account Created!",
          description: "Welcome to Tappd! Let's set up your profile.",
        });
        
        // Proceed directly to main app
        onAuthSuccess(data.user);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: error.message,
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user && data.session) {
        console.log('✅ User signed in with session:', data.session.user.id);
        setCurrentUser(data.user);
        setEmailVerified(true); // Skip email verification for testing
        
        // Load profile
        try {
          await loadProfile(data.user.id);
        } catch (profileError) {
          console.error('Profile load error:', profileError);
          // Continue anyway - user can create profile later
        }
        
        onAuthSuccess(data.user);
      }
    } catch (error: any) {
      console.error('Signin error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 via-yellow-400 via-green-400 via-blue-400 via-indigo-400 to-purple-400 flex items-center justify-center shadow-xl border-4 border-white/50 animate-pulse">
              <span className="text-3xl font-bold text-white drop-shadow-lg">✨</span>
            </div>
          </div>
          <CardTitle className="text-4xl font-black bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent tracking-wider drop-shadow-lg">
            Tappd
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2 font-medium">Tap in. Find out. 😉</p>
          <p className="text-xs text-orange-600 mt-1 font-semibold">🧪 Testing Mode - Email Verification Disabled</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-purple-100 to-pink-100">
              <TabsTrigger value="signin" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white font-semibold">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white font-semibold">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-2 focus:border-purple-400 transition-colors"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-2 focus:border-purple-400 transition-colors"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 shadow-lg transition-all" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In 🚀'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-2 focus:border-purple-400 transition-colors"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-2 focus:border-purple-400 transition-colors"
                  />
                </div>
                
                <div className="flex items-start space-x-3 py-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="mt-1 border-2 border-gray-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500 data-[state=checked]:border-purple-500"
                  />
                  <div className="text-sm leading-relaxed">
                    <label htmlFor="terms" className="text-gray-700 cursor-pointer">
                      ✅ I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => setShowTerms(true)}
                        className="text-purple-600 hover:text-purple-800 font-medium underline transition-colors"
                      >
                        Terms of Service
                      </button>
                      {' '}and{' '}
                      <button
                        type="button"
                        onClick={() => setShowPrivacy(true)}
                        className="text-purple-600 hover:text-purple-800 font-medium underline transition-colors"
                      >
                        Privacy Policy
                      </button>
                    </label>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 shadow-lg transition-all disabled:opacity-50" 
                  disabled={loading || !agreedToTerms}
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  New here? It only takes 30 seconds to get started.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <TermsOfService open={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyPolicy open={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
};

export default AuthForm;