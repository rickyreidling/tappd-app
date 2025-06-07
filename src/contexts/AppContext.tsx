import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/profile';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  isPremium: boolean;
  setPremium: (premium: boolean) => void;
  currentUser: any;
  setCurrentUser: (user: any) => void;
  userProfile: Profile | null;
  setUserProfile: (profile: Profile | null) => void;
  updateProfile: (profileData: any) => Promise<void>;
  saveProfile: (profileData: Partial<Profile>) => Promise<void>;
  loadProfile: (userId: string) => Promise<Profile | null>;
  hasProfile: boolean;
  tapBacks: Set<string>;
  addTapBack: (userId: string) => void;
  mutualTaps: Set<string>;
  addMutualTap: (userId: string) => void;
  subscriptionData: any;
  setSubscriptionData: (data: any) => void;
  upgradeToProWithStripe: (priceId: string) => Promise<void>;
  emailVerified: boolean;
  setEmailVerified: (verified: boolean) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [tapBacks, setTapBacks] = useState<Set<string>>(new Set());
  const [mutualTaps, setMutualTaps] = useState<Set<string>>(new Set());
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [emailVerified, setEmailVerified] = useState(true);
  const { toast } = useToast();

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const setPremium = (premium: boolean) => setIsPremium(premium);

  const updateProfile = async (profileData: any) => {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: currentUser.id,
          display_name: profileData.display_name || profileData.name || '',
          name: profileData.display_name || profileData.name || '',
          age: parseInt(profileData.age) || null,
          bio: profileData.bio || '',
          pronouns: profileData.pronouns || '',
          orientation: profileData.orientation || '',
          looking_for: profileData.looking_for || [],
          body_type: profileData.body_type || '',
          location: profileData.location || '',
          avatar_url: profileData.photos?.[0] || '',
          photos: profileData.photos || [],
          thirst_mode: profileData.thirst_mode || false,
          interests: profileData.interests || [],
          social_links: profileData.social_links || {},
          tribe: profileData.tribe || '',
          relationship_status: profileData.relationship_status || '',
          gender_identity: profileData.gender_identity || '',
          privacy: profileData.privacy || 'public',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Profile save error details:', error);
        throw new Error(`Profile save failed: ${error.message}`);
      }
      
      setUserProfile(data);
      toast({ title: 'Profile updated successfully!' });
      
    } catch (error: any) {
      console.error('Profile save error:', error);
      toast({ 
        title: 'Error updating profile', 
        description: error.message || 'Please try again',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const upgradeToProWithStripe = async (priceId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please sign in to upgrade');
      }

      const response = await fetch(
        'https://sstmnoilasukcxjacrjj.supabase.co/functions/v1/45785200-a879-4b5f-8db6-d160e67743dc',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            priceId,
            userId: currentUser?.id || session.user.id,
            successUrl: window.location.origin + '?upgrade=success',
            cancelUrl: window.location.origin + '?upgrade=cancelled'
          })
        }
      );

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Checkout failed');
      }
      
      if (result.url) {
        window.location.href = result.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      toast({
        title: "Upgrade Error",
        description: error.message || 'Checkout failed',
        variant: "destructive"
      });
      throw error;
    }
  };

  const addTapBack = (userId: string) => {
    setTapBacks(prev => new Set([...prev, userId]));
  };

  const addMutualTap = (userId: string) => {
    setMutualTaps(prev => new Set([...prev, userId]));
  };

  const saveProfile = async (profileData: Partial<Profile>) => {
    if (!currentUser) return;
    await updateProfile(profileData);
  };

  const loadProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setUserProfile(data);
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error loading profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('upgrade') === 'success') {
      setIsPremium(true);
      toast({
        title: "Welcome to PRO!",
        description: "Enjoy your premium features!",
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);

  const hasProfile = userProfile && (userProfile.display_name || userProfile.name);

  return (
    <AppContext.Provider
      value={{
        sidebarOpen, toggleSidebar, isPremium, setPremium,
        currentUser, setCurrentUser, userProfile, setUserProfile,
        updateProfile, saveProfile, loadProfile, hasProfile: !!hasProfile,
        tapBacks, addTapBack, mutualTaps, addMutualTap,
        subscriptionData, setSubscriptionData, upgradeToProWithStripe,
        emailVerified, setEmailVerified,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};