import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppContext } from '@/contexts/AppContext';
import AuthForm from './AuthForm';
import ProfileForm from './ProfileForm';
import { ExploreGridEnhanced } from './ExploreGridEnhanced';
import { EnhancedMessagingSystem } from './EnhancedMessagingSystem';
import { SettingsScreen } from './SettingsScreen';
import { ProfileViewScreen } from './ProfileViewScreen';
import ProfileScreen from './ProfileScreen';
import TappdProScreen from './TappdProScreen';
import { BottomNavigation } from './BottomNavigation';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ActiveTab = 'explore' | 'messages' | 'profile' | 'upgrade';
type ViewMode = 'main' | 'profile-view' | 'settings';

const MainAppUpdated: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    userProfile, 
    hasProfile, 
    loadProfile,
    isPremium
  } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        await loadProfile(session.user.id);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = async (user: any) => {
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

  const handleProfileClick = (userId: string) => {
    if (userId === currentUser?.id) {
      // Viewing own profile - go to edit mode
      setActiveTab('profile');
      setViewMode('main');
    } else {
      // Viewing someone else's profile - go to view mode
      setSelectedUserId(userId);
      setViewMode('profile-view');
    }
  };

  const handleMessageClick = (userId: string) => {
    setSelectedUserId(userId);
    setActiveTab('messages');
    setViewMode('main');
  };

  const handleBackToExplore = () => {
    setViewMode('main');
    setActiveTab('explore');
    setSelectedUserId(null);
  };

  const renderContent = () => {
    if (viewMode === 'settings') {
      return <SettingsScreen onClose={() => setViewMode('main')} />;
    }

    if (viewMode === 'profile-view' && selectedUserId) {
      return (
        <ProfileViewScreen 
          userId={selectedUserId}
          onBack={handleBackToExplore}
          onMessage={handleMessageClick}
        />
      );
    }

    switch (activeTab) {
      case 'explore':
        return (
          <ExploreGridEnhanced 
            onProfileClick={handleProfileClick}
            onMessageClick={handleMessageClick}
          />
        );
      case 'messages':
        return (
          <EnhancedMessagingSystem 
            selectedUserId={selectedUserId}
            onBack={() => {
              setSelectedUserId(null);
              setActiveTab('explore');
            }}
          />
        );
      case 'profile':
        return <ProfileScreen />;
      case 'upgrade':
        return <TappdProScreen />;
      default:
        return (
          <ExploreGridEnhanced 
            onProfileClick={handleProfileClick} 
            onMessageClick={handleMessageClick} 
          />
        );
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
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  if (!hasProfile || showProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-white">Complete Your Profile</h1>
          <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-white">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
        <ProfileForm onComplete={() => setShowProfile(false)} />
      </div>
    );
  }

  // Full screen modes (settings, profile view)
  if (viewMode === 'settings' || viewMode === 'profile-view') {
    return renderContent();
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Tappd
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isPremium && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                <Crown className="w-4 h-4" />
                PRO
              </div>
            )}
            <Button onClick={() => setViewMode('settings')} variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto p-4">
        {renderContent()}
      </main>
      
      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedUserId(null);
          setViewMode('main');
        }}
        isPro={isPremium}
      />
    </div>
  );
};

export default MainAppUpdated;