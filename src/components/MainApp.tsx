import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppContext } from '@/contexts/AppContext';
import AuthForm from './AuthForm';
import ProfileForm from './ProfileForm';
import ExploreGrid from './ExploreGrid';
import { BottomNavigation } from './BottomNavigation';
import MessagesScreen from './MessagesScreen';
import ProfileScreen from './ProfileScreen';
import TappdProScreen from './TappdProScreen';
import BackstageScreen from './BackstageScreen';
import EmailTestDebugger from './EmailTestDebugger';
import TapLimitTracker from './TapLimitTracker';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Settings, Crown, TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ActiveTab = 'explore' | 'messages' | 'profile' | 'upgrade' | 'backstage';

const MainApp: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    userProfile, 
    hasProfile, 
    loadProfile,
    isPremium,
    emailVerified
  } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showEmailTest, setShowEmailTest] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log('✅ Session found:', session.user.id);
        setCurrentUser(session.user);
        await loadProfile(session.user.id);
      } else {
        console.log('ℹ️ No active session');
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = async (user: any) => {
    console.log('✅ Auth success for user:', user.id);
    setCurrentUser(user);
    await loadProfile(user.id);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      toast({ title: "Signed out successfully" });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleProfileComplete = () => {
    setShowProfile(false);
    toast({ title: "Profile saved!", description: "Welcome to Tappd!" });
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'explore':
        return (
          <div className="space-y-4">
            <TapLimitTracker />
            <ExploreGrid />
          </div>
        );
      case 'messages':
        return <MessagesScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'upgrade':
        return <TappdProScreen />;
      case 'backstage':
        return <BackstageScreen />;
      default:
        return <ExploreGrid />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen">
        <Tabs defaultValue="auth" className="w-full">
          <TabsList className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur">
            <TabsTrigger value="auth">Sign In</TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Email Test
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="auth" className="mt-0">
            <AuthForm onAuthSuccess={handleAuthSuccess} />
          </TabsContent>
          
          <TabsContent value="test" className="mt-16">
            <EmailTestDebugger />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (!hasProfile || showProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
        <div className="flex justify-between items-center p-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Complete Your Profile</h1>
            <p className="text-white/80 text-sm">🧪 Testing Mode - Email Verification Bypassed</p>
          </div>
          <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-white">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
        <ProfileForm onComplete={handleProfileComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Tappd
            </h1>
            <p className="text-xs text-orange-600 font-medium">🧪 Testing Mode - PRO Features Active</p>
          </div>
          <div className="flex items-center gap-2">
            {isPremium && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                <Crown className="w-4 h-4" />
                PRO
              </div>
            )}
            <Button onClick={() => setShowEmailTest(true)} variant="ghost" size="sm">
              <TestTube className="w-4 h-4" />
            </Button>
            <Button onClick={() => setShowProfile(true)} variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button onClick={handleSignOut} variant="ghost" size="sm">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto p-4">
        {renderActiveScreen()}
      </main>
      
      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isPro={isPremium}
      />
      
      {showEmailTest && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto">
          <div className="p-4">
            <Button onClick={() => setShowEmailTest(false)} className="mb-4">
              ← Back to App
            </Button>
            <EmailTestDebugger />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainApp;