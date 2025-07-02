import React, { useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { Activity, Crown, EyeOff, Flag, Heart, MapPin, MessageCircle, MoreHorizontal, RefreshCw, Search, Send, Shield, User, X, Filter, Zap } from 'lucide-react';
import MessagesScreen from '@/components/MessagesScreen';
import ProfileForm from '@/components/ProfileForm';
import TappdActivityCenter from '@/components/TappdActivityCenter';
import TappdProScreen from '@/components/TappdProScreen';
import SignupForm from './SignupForm';
import PricingPlans from '@/components/PricingPlans';

// Pro Utilities
const ProUtils = {
  // Track profile views for Pro users
  trackProfileView: (viewedUserId, viewedUserData) => {
    try {
      const viewers = JSON.parse(localStorage.getItem('profileViewers') || '[]');
      const existingViewIndex = viewers.findIndex(v => v.id === viewedUserId);
      
      const viewData = {
        id: viewedUserId,
        name: viewedUserData.name,
        age: viewedUserData.age,
        photo: viewedUserData.photos?.[0] || '',
        location: viewedUserData.location || 'Unknown',
        viewedAt: new Date(),
        isOnline: viewedUserData.isOnline || true
      };
      
      if (existingViewIndex !== -1) {
        viewers[existingViewIndex] = viewData; // Update existing
      } else {
        viewers.unshift(viewData); // Add new at top
      }
      
      localStorage.setItem('profileViewers', JSON.stringify(viewers.slice(0, 50))); // Keep last 50
      console.log('📊 Profile view tracked:', viewedUserData.name);
    } catch (error) {
      console.error('❌ Error tracking profile view:', error);
    }
  },

  // Get custom thirst badge
  getCustomThirstBadge: () => {
    return localStorage.getItem('customThirstBadge') || '🔥';
  },

  // Get profile theme
  getProfileTheme: () => {
    return localStorage.getItem('profileTheme') || 'sunset';
  },

  // Check if incognito mode is enabled
  isIncognitoMode: () => {
    return localStorage.getItem('incognitoMode') === 'true';
  },

  // Get daily tap count
  getDailyTapCount: () => {
    const today = new Date().toDateString();
    const tapData = JSON.parse(localStorage.getItem('dailyTaps') || '{}');
    return tapData[today] || 0;
  },

  // Increment daily tap count
  incrementTapCount: () => {
    const today = new Date().toDateString();
    const tapData = JSON.parse(localStorage.getItem('dailyTaps') || '{}');
    tapData[today] = (tapData[today] || 0) + 1;
    localStorage.setItem('dailyTaps', JSON.stringify(tapData));
    return tapData[today];
  },

  // Check if user can tap (unlimited for Pro, 20/day for free)
  canTap: (isPremium) => {
    if (isPremium) return true;
    return ProUtils.getDailyTapCount() < 20;
  }
};

// Enhanced ChatModal Component with Pro features
const ChatModal = ({ user, isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { isPremium } = useAppContext();

  useEffect(() => {
    if (isOpen && user) {
      const conversations = JSON.parse(localStorage.getItem('conversations') || '{}');
      const existing = conversations[user.id]?.messages || [];
      setMessages(existing);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const saveConversationData = (userId, userData, messageList) => {
    const conversations = JSON.parse(localStorage.getItem('conversations') || '{}');
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    const conversationData = {
      id: userId,
      name: userData.name,
      avatar: userData.photos?.[0] || '',
      lastMessage: messageList[messageList.length - 1]?.text || '',
      timestamp: now.toISOString(),
      timeDisplay: timeString,
      unread: false,
      messages: messageList,
      isPriority: isPremium // Pro users get priority messaging
    };
    
    conversations[userId] = conversationData;
    localStorage.setItem('conversations', JSON.stringify(conversations));
    
    console.log('💾 SAVED CONVERSATION:', conversationData);
    return conversations;
  };

  const handleSend = () => {
    if (!message.trim()) return;
    
    console.log('📤 SENDING MESSAGE:', { userId: user.id, message: message.trim() });
    
    const newMsg = {
      id: Date.now(),
      text: message,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString()
    };
    
    const updated = [...messages, newMsg];
    setMessages(updated);
    setMessage('');
    
    // Save conversation data with Pro priority
    saveConversationData(user.id, user, updated);
    
    // Enhanced event dispatching
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('conversationUpdated'));
      const storageEvent = new StorageEvent('storage', {
        key: 'conversations',
        newValue: JSON.stringify(JSON.parse(localStorage.getItem('conversations') || '{}')),
        url: window.location.href
      });
      window.dispatchEvent(storageEvent);
      
      if (window.refreshMessages) {
        window.refreshMessages();
      }
      console.log('📡 DISPATCHED ALL EVENTS');
    }, 100);
    
    // Auto-reply
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        text: "Thanks for your message! 😊",
        sender: user.name,
        timestamp: new Date().toLocaleTimeString()
      };
      const final = [...updated, reply];
      setMessages(final);
      
      saveConversationData(user.id, user, final);
      
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('conversationUpdated'));
      }, 100);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg w-full max-w-md h-[500px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.photos?.[0]} alt={user.name} />
              <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{user.name}</h3>
                {isPremium && <Badge className="bg-yellow-500 text-white text-xs">PRO</Badge>}
              </div>
              <p className="text-sm text-gray-500">
                {ProUtils.isIncognitoMode() ? 'Online' : (user.isOnline ? 'Online now' : user.lastOnline)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { setMessages([]); onClose(); }}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>Start your conversation with {user.name}!</p>
              {isPremium && (
                <p className="text-xs text-yellow-600 mt-2">💫 PRO Priority Messaging Active</p>
              )}
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-3 py-2 rounded-lg ${
                  msg.sender === 'me' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-purple-200' : 'text-gray-500'}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Message ${user.name}...`}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button onClick={handleSend} disabled={!message.trim()} className="bg-purple-600 hover:bg-purple-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Settings Screen with Pro features
const SettingsScreen = ({ onBack }) => {
  const { toast } = useToast();
  const { isPremium } = useAppContext();
  const [pushNotifications, setPushNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [hidden, setHidden] = useState([]);
  const [blocked, setBlocked] = useState([]);

  const users = [
    { id: '1', name: 'Alex', age: 28, photos: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=face'] },
    { id: '2', name: 'Jake', age: 32, photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face'] },
    { id: '3', name: 'Ryan', age: 25, photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face'] },
    { id: '4', name: 'Marcus', age: 30, photos: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face'] },
    { id: '5', name: 'Tyler', age: 26, photos: ['https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=600&fit=crop&crop=face'] },
    { id: '6', name: 'Chris', age: 29, photos: ['https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=600&fit=crop&crop=face'] }
  ];

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem('hiddenProfiles') || '[]');
    const b = JSON.parse(localStorage.getItem('blockedProfiles') || '[]');
    const push = localStorage.getItem('pushNotifications') === 'true';
    const dark = localStorage.getItem('darkMode') === 'true';
    const incognito = localStorage.getItem('incognitoMode') === 'true';
    
    setHidden(h);
    setBlocked(b);
    setPushNotifications(push);
    setDarkMode(dark);
    setIncognitoMode(incognito);

    // Apply proper styling based on dark mode setting
    const appContainer = document.querySelector('.h-screen');
    
    if (dark) {
      // Apply dark mode styling
      if (appContainer) {
        appContainer.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%)';
      }
      document.documentElement.style.setProperty('--profile-bg', '#374151');
      document.documentElement.style.setProperty('--profile-text', '#ffffff');
      document.documentElement.style.setProperty('--input-bg', '#374151');
      document.documentElement.style.setProperty('--input-text', '#ffffff');
      document.documentElement.style.setProperty('--card-bg', '#1f2937');
      document.documentElement.classList.add('dark-mode');
    } else {
      // Ensure light mode is applied
      if (appContainer) {
        appContainer.style.background = 'linear-gradient(135deg, rgb(147, 51, 234) 0%, rgb(219, 39, 119) 50%, rgb(249, 115, 22) 100%)';
      }
      document.documentElement.style.removeProperty('--profile-bg');
      document.documentElement.style.removeProperty('--profile-text');
      document.documentElement.style.removeProperty('--input-bg');
      document.documentElement.style.removeProperty('--input-text');
      document.documentElement.style.removeProperty('--card-bg');
      document.documentElement.classList.remove('dark-mode');
    }
  }, []);

  const getUserById = (id) => users.find(user => user.id === id);

  const handleUnhide = (userId) => {
    const updated = hidden.filter(id => id !== userId);
    setHidden(updated);
    localStorage.setItem('hiddenProfiles', JSON.stringify(updated));
    const user = getUserById(userId);
    toast({ title: "Profile unhidden", description: `${user?.name || 'User'} will appear in your feed again.` });
  };

  const handleUnblock = (userId) => {
    const updated = blocked.filter(id => id !== userId);
    setBlocked(updated);
    localStorage.setItem('blockedProfiles', JSON.stringify(updated));
    const user = getUserById(userId);
    toast({ title: "Profile unblocked", description: `${user?.name || 'User'} has been unblocked.` });
  };

  const togglePushNotifications = () => {
    const newValue = !pushNotifications;
    setPushNotifications(newValue);
    localStorage.setItem('pushNotifications', newValue.toString());
    
    if (newValue && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setTimeout(() => {
            new Notification('Tappd Notifications Enabled! 🎉', {
              body: 'You\'ll now receive notifications for new messages and matches.',
              icon: '/favicon.ico'
            });
          }, 500);
          
          toast({
            title: "Push notifications enabled",
            description: "You'll receive a test notification shortly to confirm it's working!"
          });
        } else {
          setPushNotifications(false);
          localStorage.setItem('pushNotifications', 'false');
          toast({
            title: "Notification permission denied",
            description: "Please enable notifications in your browser settings and try again.",
            variant: "destructive"
          });
        }
      });
    } else if (!newValue) {
      toast({
        title: "Push notifications disabled",
        description: "You won't receive browser notifications anymore."
      });
    } else if (!('Notification' in window)) {
      setPushNotifications(false);
      localStorage.setItem('pushNotifications', 'false');
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support push notifications.",
        variant: "destructive"
      });
    }
  };

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('darkMode', newValue.toString());
    
    // Enhanced dark mode - change EVERYTHING properly
    const appContainer = document.querySelector('.h-screen');
    const profileContainer = document.querySelector('.min-h-screen');
    
    if (newValue) {
      // Dark mode: change main app background
      if (appContainer) {
        appContainer.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%)';
      }
      
      // Dark mode: change profile page background too
      if (profileContainer) {
        profileContainer.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%)';
      }
      
      // Apply dark theme for profile forms (but not black boxes)
      document.documentElement.style.setProperty('--profile-bg', '#374151');
      document.documentElement.style.setProperty('--profile-text', '#ffffff');
      document.documentElement.style.setProperty('--input-bg', '#374151');
      document.documentElement.style.setProperty('--input-text', '#ffffff');
      document.documentElement.style.setProperty('--card-bg', '#1f2937');
      
      // Add global dark mode class
      document.documentElement.classList.add('dark-mode');
      
    } else {
      // Light mode: restore original backgrounds
      if (appContainer) {
        appContainer.style.background = 'linear-gradient(135deg, rgb(147, 51, 234) 0%, rgb(219, 39, 119) 50%, rgb(249, 115, 22) 100%)';
      }
      
      if (profileContainer) {
        profileContainer.style.background = 'linear-gradient(135deg, rgb(147, 51, 234) 0%, rgb(219, 39, 119) 50%, rgb(249, 115, 22) 100%)';
      }
      
      // Reset all dark mode styling
      document.documentElement.style.removeProperty('--profile-bg');
      document.documentElement.style.removeProperty('--profile-text');
      document.documentElement.style.removeProperty('--input-bg');
      document.documentElement.style.removeProperty('--input-text');
      document.documentElement.style.removeProperty('--card-bg');
      
      // Remove global dark mode class
      document.documentElement.classList.remove('dark-mode');
    }
    
    toast({
      title: newValue ? "Dark mode enabled" : "Dark mode disabled",
      description: newValue ? "App and profile changed to dark theme." : "App and profile restored to light theme."
    });
  };

  // Pro Feature: Incognito Mode Toggle
  const toggleIncognitoMode = () => {
    if (!isPremium) {
      toast({
        title: "PRO Feature",
        description: "Upgrade to PRO to use Incognito Mode",
        variant: "destructive"
      });
      return;
    }

    const newValue = !incognitoMode;
    setIncognitoMode(newValue);
    localStorage.setItem('incognitoMode', newValue.toString());
    
    toast({
      title: newValue ? "Incognito mode enabled" : "Incognito mode disabled",
      description: newValue ? "You're now browsing privately" : "Your online status is now visible"
    });
  };

  const handleSignOut = () => {
    // Clear all user data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('conversations');
    localStorage.removeItem('hiddenProfiles');
    localStorage.removeItem('blockedProfiles');
    localStorage.removeItem('pushNotifications');
    localStorage.removeItem('darkMode');
    localStorage.removeItem('incognitoMode');
    localStorage.removeItem('customThirstBadge');
    localStorage.removeItem('profileTheme');
    localStorage.removeItem('dailyTaps');
    localStorage.removeItem('profileViewers');
    
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account."
    });
    
    // Refresh the page to show login screen
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleDeleteAccount = () => {
    // Triple confirmation for account deletion
    const confirmation = window.confirm(
      "⚠️ WARNING: Are you sure you want to delete your account?\n\nThis will permanently delete:\n- Your profile and photos\n- All messages and conversations\n- All matches and connections\n- All app settings\n- Your PRO subscription\n\nThis action CANNOT be undone."
    );
    
    if (confirmation) {
      const finalConfirmation = window.confirm(
        "🚨 FINAL WARNING 🚨\n\nYou are about to permanently delete your account and ALL data.\n\nClick OK to continue to final confirmation, or Cancel to stop."
      );
      
      if (finalConfirmation) {
        const typeConfirmation = window.prompt(
          "To confirm account deletion, type DELETE (in capital letters):"
        );
        
        if (typeConfirmation === "DELETE") {
          // Clear all data
          localStorage.clear();
          
          toast({
            title: "Account deleted",
            description: "Your account and all data have been permanently deleted.",
            variant: "destructive"
          });
          
          // Refresh the page to show login screen
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          toast({
            title: "Account deletion cancelled",
            description: "Your account is safe. Deletion was cancelled.",
          });
        }
      }
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/10">
          ← Back
        </Button>
        <h2 className="text-xl font-bold text-white">Settings</h2>
        {isPremium && <Badge className="bg-yellow-500 text-white">PRO</Badge>}
      </div>

      {/* Notifications & Privacy */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Notifications & Privacy</h3>
        
        <div className="bg-white/10 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-medium">Push Notifications</p>
              <p className="text-white/70 text-sm">Get notified about new messages and matches</p>
            </div>
            <Button
              onClick={togglePushNotifications}
              variant={pushNotifications ? "default" : "outline"}
              size="sm"
              className={pushNotifications ? "bg-green-500 hover:bg-green-600" : "bg-white/10 border-white/20 text-white hover:bg-white hover:text-black"}
            >
              {pushNotifications ? 'ON' : 'OFF'}
            </Button>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-medium">Dark Mode</p>
              <p className="text-white/70 text-sm">Switch between light and dark theme</p>
            </div>
            <Button
              onClick={toggleDarkMode}
              variant={darkMode ? "default" : "outline"}
              size="sm"
              className={darkMode ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-white/10 border-white/20 text-white hover:bg-white hover:text-black"}
            >
              {darkMode ? 'ON' : 'OFF'}
            </Button>
          </div>

          {/* Pro Feature: Incognito Mode */}
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-white font-medium">Incognito Mode</p>
                {!isPremium && <Badge className="bg-yellow-500 text-white text-xs">PRO</Badge>}
              </div>
              <p className="text-white/70 text-sm">Browse privately without showing online status</p>
            </div>
            <Button
              onClick={toggleIncognitoMode}
              variant={incognitoMode ? "default" : "outline"}
              size="sm"
              className={incognitoMode ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-white/10 border-white/20 text-white hover:bg-white hover:text-black"}
              disabled={!isPremium}
            >
              {incognitoMode ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>
      </div>

      {/* Usage Stats - Pro Feature */}
      {isPremium && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">PRO Usage Stats</h3>
          <div className="bg-white/10 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white">Daily Taps Used:</span>
              <span className="text-yellow-400 font-bold">Unlimited ∞</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Profile Views:</span>
              <span className="text-yellow-400 font-bold">{JSON.parse(localStorage.getItem('profileViewers') || '[]').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Priority Messages:</span>
              <span className="text-yellow-400 font-bold">Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Free User Daily Limits */}
      {!isPremium && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Daily Limits</h3>
          <div className="bg-white/10 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white">Daily Taps Used:</span>
              <span className="text-white font-bold">{ProUtils.getDailyTapCount()}/20</span>
            </div>
            <Button
              onClick={() => {
                window.location.hash = '#upgrade';
                // The hash change will be handled by the new useEffect in MainApp
              }}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
              size="sm"
            >
              🚀 Upgrade to PRO for Unlimited Taps
            </Button>
          </div>
        </div>
      )}

      {/* Hidden & Blocked Profiles */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Hidden & Blocked Profiles</h3>
        
        {/* Blocked Profiles */}
        <div>
          <h4 className="text-md font-medium text-white mb-2">Blocked Profiles ({blocked.length})</h4>
          {blocked.length === 0 ? (
            <p className="text-white/70 text-sm">No blocked users.</p>
          ) : (
            <div className="space-y-2">
              {blocked.map(userId => {
                const user = getUserById(userId);
                if (!user) return null;
                return (
                  <div key={userId} className="bg-red-500/20 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.photos?.[0]} alt={user.name} />
                        <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">{user.name}, {user.age}</p>
                        <p className="text-white/70 text-sm">Blocked user</p>
                      </div>
                    </div>
                    <Button onClick={() => handleUnblock(userId)} variant="outline" size="sm"
                            className="bg-red-500/20 border-red-300 text-white hover:bg-red-500 hover:text-white">
                      <Shield className="w-4 h-4 mr-1" /> Unblock
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Hidden Profiles */}
        <div>
          <h4 className="text-md font-medium text-white mb-2">Hidden Profiles ({hidden.length})</h4>
          {hidden.length === 0 ? (
            <p className="text-white/70 text-sm">No hidden users.</p>
          ) : (
            <div className="space-y-2">
              {hidden.map(userId => {
                const user = getUserById(userId);
                if (!user) return null;
                return (
                  <div key={userId} className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.photos?.[0]} alt={user.name} />
                        <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">{user.name}, {user.age}</p>
                        <p className="text-white/70 text-sm">Hidden from feed</p>
                      </div>
                    </div>
                    <Button onClick={() => handleUnhide(userId)} variant="outline" size="sm"
                            className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-black">
                      <EyeOff className="w-4 h-4 mr-1" /> Unhide
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Account Management */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Account Management</h3>
        
        <div className="bg-white/10 rounded-lg p-4 space-y-3">
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="lg"
            className="w-full bg-blue-500/20 border-blue-300 text-white hover:bg-blue-500 hover:text-white"
          >
            Sign Out
          </Button>
          
          <Button
            onClick={handleDeleteAccount}
            variant="outline"
            size="lg"
            className="w-full bg-red-500/20 border-red-300 text-white hover:bg-red-500 hover:text-white"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Explore Component with Pro features
const ExploreComponent = ({ setActiveTab, chatUser, setChatUser, showChat, setShowChat }) => {
  const { toast } = useToast();
  const { isPremium } = useAppContext();
  
  const users = [
    { id: '1', name: 'Alex', age: 28, bio: 'Coffee lover, gym enthusiast. Looking for genuine connections and meaningful conversations.', 
      interests: ['Gym Rat', 'Brunch Bitch', 'Dog Dad'], verified: true, premium: false, thirstMode: false, isOnline: true, 
      mutualMatch: false, distance: 0.5, height: '5\'10"', build: 'Athletic', status: 'Single', lastOnline: 'Online now',
      tribe: 'Jock', occupation: 'Personal Trainer', education: 'Bachelor\'s Degree', pronouns: 'he/him',
      lookingFor: ['Dates', 'LTR', 'Friends'], relationshipType: 'Single', hivPrepStatus: 'Negative, On PrEP',
      bodyHair: 'Some', ethnicity: 'White', role: 'Versatile', smoking: 'No', drinking: 'Socially', drugs: 'Never',
      photos: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=face'] },
    { id: '2', name: 'Jake', age: 32, bio: 'Artist and dreamer. Love deep conversations and spontaneous adventures.', 
      interests: ['Theater Kid', 'Meme Lord', 'Netflix & Chill'], verified: false, premium: true, thirstMode: true, 
      isOnline: true, mutualMatch: false, distance: 1.2, height: '6\'1"', build: 'Slim', status: 'Single', lastOnline: 'Online now',
      tribe: 'Twink', occupation: 'Graphic Designer', education: 'Art School', pronouns: 'he/him',
      lookingFor: ['Hookups', 'Fun', 'NSA'], relationshipType: 'Single', hivPrepStatus: 'Negative, On PrEP',
      bodyHair: 'Smooth', ethnicity: 'Latino', role: 'Bottom', smoking: 'Socially', drinking: 'Yes', drugs: 'Sometimes',
      photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face'] },
    { id: '3', name: 'Ryan', age: 25, bio: 'Tech guy, love hiking. Seeking genuine connections and outdoor adventures.', 
      interests: ['Low-Key Introvert', 'Bookworm', 'Cuddler'], verified: true, premium: false, thirstMode: false, 
      isOnline: false, mutualMatch: true, distance: 2.1, height: '5\'9"', build: 'Average', status: 'Single', 
      lastOnline: 'Online 2 hours ago', tribe: 'Otter', occupation: 'Software Engineer', education: 'Master\'s in CS', pronouns: 'he/him',
      lookingFor: ['Dates', 'LTR', 'Chat'], relationshipType: 'Single', hivPrepStatus: 'Negative, Not on PrEP',
      bodyHair: 'Hairy', ethnicity: 'White', role: 'Top', smoking: 'No', drinking: 'Rarely', drugs: 'Never',
      photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face'] },
    { id: '4', name: 'Marcus', age: 30, bio: 'Chef and foodie. Love creating amazing dishes and sharing them with special people.', 
      interests: ['Bear', 'Daddy', 'Romantic at Heart'], verified: false, premium: false, thirstMode: true, isOnline: true, 
      mutualMatch: false, distance: 3.5, height: '6\'0"', build: 'Muscular', status: 'Open', lastOnline: 'Online now',
      tribe: 'Bear', occupation: 'Chef', education: 'Culinary School', pronouns: 'he/him',
      lookingFor: ['Hookups', 'FWB', 'Kinky Fun'], relationshipType: 'Open Relationship', hivPrepStatus: 'Negative, On PrEP',
      bodyHair: 'Very Hairy', ethnicity: 'Black', role: 'Versatile Top', smoking: 'No', drinking: 'Yes', drugs: 'Sometimes',
      photos: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face'] },
    { id: '5', name: 'Tyler', age: 26, bio: 'Beach vibes and good times. Love surfing, volleyball, and making new friends.', 
      interests: ['Beach Bum', 'Poolside Vibes', 'Flirty AF'], verified: true, premium: true, thirstMode: false, 
      isOnline: true, mutualMatch: false, distance: 1.8, height: '5\'11"', build: 'Athletic', status: 'Single', 
      lastOnline: 'Online now', tribe: 'Wolf', occupation: 'Surf Instructor', education: 'College', pronouns: 'he/him',
      lookingFor: ['Dates', 'Fun', 'Travel Buddy'], relationshipType: 'Single', hivPrepStatus: 'Negative, On PrEP',
      bodyHair: 'Trimmed', ethnicity: 'White', role: 'Versatile', smoking: 'No', drinking: 'Socially', drugs: 'Never',
      photos: ['https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=600&fit=crop&crop=face'] },
    { id: '6', name: 'Chris', age: 29, bio: 'Drama queen with a heart of gold. Love reality TV, great cocktails, and fabulous friends.', 
      interests: ['Drag Race Fan', 'Bravo Babe', 'Drama'], verified: false, premium: false, thirstMode: true, 
      isOnline: false, mutualMatch: false, distance: 4.2, height: '5\'8"', build: 'Slim', status: 'Complicated', 
      lastOnline: 'Online 1 hour ago', tribe: 'Twink', occupation: 'Event Planner', education: 'Communications', pronouns: 'he/him',
      lookingFor: ['Friends', 'Chat', 'Drinks'], relationshipType: 'It\'s Complicated', hivPrepStatus: 'Negative, On PrEP',
      bodyHair: 'Smooth', ethnicity: 'Asian', role: 'Bottom', smoking: 'Socially', drinking: 'Yes', drugs: 'Socially',
      photos: ['https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=600&fit=crop&crop=face'] }
  ];

  const [profiles, setProfiles] = useState(users);
  const [selected, setSelected] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hidden, setHidden] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [sortDistance, setSortDistance] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Pro Feature: Advanced Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    ageMin: 18,
    ageMax: 65,
    maxDistance: 10,
    bodyType: 'all',
    tribe: 'all',
    thirstMode: false,
    onlineOnly: false
  });

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem('hiddenProfiles') || '[]');
    const b = JSON.parse(localStorage.getItem('blockedProfiles') || '[]');
    setHidden(h);
    setBlocked(b);
  }, []);

  // Apply Pro filters
  const filteredProfiles = useMemo(() => {
    let filtered = profiles.filter(p => !hidden.includes(p.id) && !blocked.includes(p.id));
    
    if (isPremium && showFilters) {
      filtered = filtered.filter(profile => {
        // Age filter
        if (profile.age < filters.ageMin || profile.age > filters.ageMax) return false;
        
        // Distance filter
        if (profile.distance > filters.maxDistance) return false;
        
        // Body type filter
        if (filters.bodyType !== 'all' && profile.build !== filters.bodyType) return false;
        
        // Tribe filter
        if (filters.tribe !== 'all' && profile.tribe !== filters.tribe) return false;
        
        // Thirst mode filter
        if (filters.thirstMode && !profile.thirstMode) return false;
        
        // Online only filter
        if (filters.onlineOnly && !profile.isOnline) return false;
        
        return true;
      });
    }
    
    return sortDistance ? [...filtered].sort((a, b) => a.distance - b.distance) : filtered;
  }, [profiles, hidden, blocked, sortDistance, isPremium, showFilters, filters]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1500));
    setProfiles([...users].sort(() => Math.random() - 0.5));
    setRefreshing(false);
    toast({ title: "🔄 Profiles refreshed!", description: "Found new people in your area." });
  };

  const handleHide = (id, name) => {
    const updated = [...hidden, id];
    setHidden(updated);
    localStorage.setItem('hiddenProfiles', JSON.stringify(updated));
    setSelected(null);
    toast({ title: "Profile hidden", description: `${name} will no longer appear in your feed.` });
  };

  const handleBlock = (id, name) => {
    const updated = [...blocked, id];
    setBlocked(updated);
    localStorage.setItem('blockedProfiles', JSON.stringify(updated));
    setSelected(null);
    toast({ title: "User blocked", description: `${name} has been blocked.` });
  };

  const handleReport = (id, name) => {
    setSelected(null);
    toast({ title: "Profile reported", description: `Thank you for reporting ${name}. We'll review this profile.`, variant: "destructive" });
  };

  const handleTap = (user) => {
    // Check tap limits for free users
    if (!ProUtils.canTap(isPremium)) {
      toast({ 
        title: "Daily tap limit reached", 
        description: "Upgrade to PRO for unlimited taps!",
        variant: "destructive"
      });
      return;
    }

    ProUtils.incrementTapCount();
    setSelected(null);
    toast({ title: `💖 Tapped ${user.name}!`, description: "They'll be notified of your interest!" });
  };

  const handleMessage = (user) => {
    setSelected(null);
    setChatUser(user);
    setShowChat(true);
  };

  // Track profile views for Pro users
  const handleProfileView = (user) => {
    setSelected(user);
    if (isPremium) {
      ProUtils.trackProfileView(user.id, user);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Explore</h1>
          <p className="text-white/70 text-sm">{filteredProfiles.length} profiles nearby</p>
          {!isPremium && (
            <p className="text-yellow-400 text-xs">Daily taps: {ProUtils.getDailyTapCount()}/20</p>
          )}
        </div>
        <div className="flex gap-2">
          {/* Pro Feature: Advanced Filters */}
          {isPremium && (
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant={showFilters ? "default" : "outline"}
              size="sm"
              className={showFilters ? "bg-yellow-500 text-white" : "bg-white/10 border-white/20 text-white hover:bg-white hover:text-black"}
            >
              <Filter className="w-4 h-4 mr-1" />
              Filters
            </Button>
          )}
          
          <Button
            onClick={() => setSortDistance(!sortDistance)}
            variant={sortDistance ? "default" : "outline"}
            size="sm"
            className={sortDistance ? "bg-purple-500 text-white" : "bg-white/10 border-white/20 text-white hover:bg-white hover:text-black"}
          >
            <MapPin className="w-4 h-4 mr-1" />
            {sortDistance ? 'Distance' : 'Sort'}
          </Button>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-black"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Pro Feature: Advanced Filters Panel */}
      {isPremium && showFilters && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-yellow-400" />
            <h3 className="text-white font-semibold">PRO Advanced Filters</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-white text-sm">Age Range</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  value={filters.ageMin}
                  onChange={(e) => setFilters(prev => ({...prev, ageMin: parseInt(e.target.value)}))}
                  className="w-12 px-1 py-1 text-xs rounded bg-white/10 text-white border-white/20"
                  min="18"
                  max="65"
                />
                <span className="text-white">-</span>
                <input
                  type="number"
                  value={filters.ageMax}
                  onChange={(e) => setFilters(prev => ({...prev, ageMax: parseInt(e.target.value)}))}
                  className="w-12 px-1 py-1 text-xs rounded bg-white/10 text-white border-white/20"
                  min="18"
                  max="65"
                />
              </div>
            </div>
            
            <div>
              <label className="text-white text-sm">Max Distance</label>
              <select
                value={filters.maxDistance}
                onChange={(e) => setFilters(prev => ({...prev, maxDistance: parseInt(e.target.value)}))}
                className="w-full px-2 py-1 text-xs rounded bg-white/10 text-white border-white/20"
              >
                <option value={5}>5 miles</option>
                <option value={10}>10 miles</option>
                <option value={25}>25 miles</option>
                <option value={50}>50 miles</option>
              </select>
            </div>
            
            <div>
              <label className="text-white text-sm">Body Type</label>
              <select
                value={filters.bodyType}
                onChange={(e) => setFilters(prev => ({...prev, bodyType: e.target.value}))}
                className="w-full px-2 py-1 text-xs rounded bg-white/10 text-white border-white/20"
              >
                <option value="all">All</option>
                <option value="Slim">Slim</option>
                <option value="Athletic">Athletic</option>
                <option value="Average">Average</option>
                <option value="Muscular">Muscular</option>
              </select>
            </div>
            
            <div>
              <label className="text-white text-sm">Tribe</label>
              <select
                value={filters.tribe}
                onChange={(e) => setFilters(prev => ({...prev, tribe: e.target.value}))}
                className="w-full px-2 py-1 text-xs rounded bg-white/10 text-white border-white/20"
              >
                <option value="all">All</option>
                <option value="Jock">Jock</option>
                <option value="Twink">Twink</option>
                <option value="Bear">Bear</option>
                <option value="Otter">Otter</option>
                <option value="Wolf">Wolf</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-white text-sm">
              <input
                type="checkbox"
                checked={filters.thirstMode}
                onChange={(e) => setFilters(prev => ({...prev, thirstMode: e.target.checked}))}
                className="rounded"
              />
              Thirst Mode Only
            </label>
            <label className="flex items-center gap-2 text-white text-sm">
              <input
                type="checkbox"
                checked={filters.onlineOnly}
                onChange={(e) => setFilters(prev => ({...prev, onlineOnly: e.target.checked}))}
                className="rounded"
              />
              Online Only
            </label>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {filteredProfiles.map((user) => (
          <Card key={user.id} className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                onClick={() => handleProfileView(user)}>
            <CardContent className="p-0">
              <div className="relative aspect-[3/4] bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage src={user.photos?.[0]} alt={user.name} className="object-[center_20%]" />
                  <AvatarFallback className="text-sm bg-gradient-to-br from-purple-400 to-pink-400 text-white rounded-none">
                    {user.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="absolute top-1 left-1 flex gap-0.5">
                  {user.verified && <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0.5 h-4">✓</Badge>}
                  {user.premium && <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0.5 h-4">PRO</Badge>}
                </div>

                {/* Display custom thirst badge for Pro users */}
                <div className="absolute top-1 right-1 flex items-center gap-1">
                  {user.thirstMode && (
                    <span className="text-lg bg-black/50 rounded px-1">
                      {isPremium ? ProUtils.getCustomThirstBadge() : '🔥'}
                    </span>
                  )}
                  <div className={`w-2 h-2 rounded-full border border-white ${
                    ProUtils.isIncognitoMode() ? 'bg-gray-400' : (user.isOnline ? 'bg-green-500' : 'bg-gray-400')
                  }`}></div>
                </div>

                {user.mutualMatch && <Badge className="absolute bottom-1 left-1 bg-pink-500 text-white text-xs px-1.5 py-0.5 h-4">💖</Badge>}

                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {user.distance}mi
                </div>
              </div>

              <div className="p-2 space-y-1">
                <div>
                  <h3 className="font-semibold text-sm text-gray-800 truncate">{user.name}, {user.age}</h3>
                  <p className="text-sm text-gray-500">{user.height} • {user.build}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {user.interests?.slice(0, 2).map((interest, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-purple-100 text-purple-700 px-2 py-1">
                      {interest}
                    </Badge>
                  ))}
                  {user.interests?.length > 2 && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 px-2 py-1">
                      +{user.interests.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profile Modal with Pro features */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
             onClick={(e) => { if (e.target === e.currentTarget) { setSelected(null); setShowMenu(false); } }}>
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
               onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}>
            <div className="relative">
              <img src={selected.photos?.[0]} alt={selected.name} className="w-full h-80 object-[center_20%]" />
              
              <Button variant="ghost" size="sm" 
                      onClick={(e) => { e.stopPropagation(); setSelected(null); setShowMenu(false); }}
                      className="absolute top-4 left-4 bg-white/80 hover:bg-white rounded-full w-10 h-10 p-0">
                <X className="w-4 h-4" />
              </Button>

              <div className="absolute top-4 right-4 flex gap-2">
                {selected.thirstMode && (
                  <Button variant="ghost" size="sm" 
                          className="bg-orange-500/80 hover:bg-orange-500 rounded-full w-10 h-10 p-0"
                          onClick={(e) => { e.stopPropagation(); toast({ title: "🔥 This user is in thirst mode!", description: "They're looking for something more immediate." }); }}>
                    <span className="text-white text-lg">{isPremium ? ProUtils.getCustomThirstBadge() : '🔥'}</span>
                  </Button>
                )}
                
                <div className="relative">
                  <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white rounded-full w-10 h-10 p-0"
                          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}>
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                  
                  {showMenu && (
                    <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border py-2 w-32 z-10"
                         onClick={(e) => e.stopPropagation()}>
                      <button onClick={(e) => { e.stopPropagation(); handleReport(selected.id, selected.name); setShowMenu(false); }}
                              className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-gray-50 flex items-center gap-2">
                        <Flag className="w-4 h-4" /> Report
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleHide(selected.id, selected.name); setShowMenu(false); }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                        <EyeOff className="w-4 h-4" /> Hide
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleBlock(selected.id, selected.name); setShowMenu(false); }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Block
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  {selected.name}
                  {selected.verified && <Badge className="bg-blue-500 text-white text-xs">Verified</Badge>}
                  {selected.premium && <Badge className="bg-yellow-500 text-white text-xs">PRO</Badge>}
                </h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>◉ Age: {selected.age}</span>
                  <span>•</span>
                  <span>Distance: {selected.distance} mi away</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <div className={`w-2 h-2 rounded-full ${
                    ProUtils.isIncognitoMode() ? 'bg-gray-400' : (selected.isOnline ? 'bg-green-500' : 'bg-gray-400')
                  }`}></div>
                  <span className="text-sm text-gray-500">
                    {ProUtils.isIncognitoMode() ? 'Online' : selected.lastOnline}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-1">About</h3>
                <p className="text-gray-700 leading-relaxed">{selected.bio}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 py-3 bg-gray-50 rounded-lg px-3">
                <div className="text-center">
                  <div className="text-purple-600 font-semibold">{selected.height}</div>
                  <div className="text-xs text-gray-500">Height</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-600 font-semibold">{selected.build}</div>
                  <div className="text-xs text-gray-500">Build</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-600 font-semibold">{selected.status}</div>
                  <div className="text-xs text-gray-500">Status</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {selected.interests?.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tribe:</span>
                    <span className="text-gray-800">{selected.tribe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pronouns:</span>
                    <span className="text-gray-800">{selected.pronouns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Looking For:</span>
                    <span className="text-gray-800">{selected.lookingFor?.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Relationship:</span>
                    <span className="text-gray-800">{selected.relationshipType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ethnicity:</span>
                    <span className="text-gray-800">{selected.ethnicity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Body Hair:</span>
                    <span className="text-gray-800">{selected.bodyHair}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Role:</span>
                    <span className="text-gray-800">{selected.role}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Lifestyle</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Smoking:</span>
                    <span className="text-gray-800">{selected.smoking}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Drinking:</span>
                    <span className="text-gray-800">{selected.drinking}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Drugs:</span>
                    <span className="text-gray-800">{selected.drugs}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Health & Safety</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">HIV/PrEP Status:</span>
                    <span className="text-gray-800">{selected.hivPrepStatus}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Work & Education</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Occupation:</span>
                    <span className="text-gray-800">{selected.occupation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Education:</span>
                    <span className="text-gray-800">{selected.education}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1 border-purple-300 text-purple-600 hover:bg-purple-50"
                  onClick={(e) => { e.stopPropagation(); handleTap(selected); }}
                  disabled={!ProUtils.canTap(isPremium)}
                >
                  <Heart className="w-4 h-4 mr-2" /> 
                  Tap {!isPremium && `(${20 - ProUtils.getDailyTapCount()} left)`}
                </Button>
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={(e) => { e.stopPropagation(); handleMessage(selected); }}>
                  <MessageCircle className="w-4 h-4 mr-2" /> Message
                  {isPremium && <Badge className="ml-1 bg-yellow-500 text-white text-xs">PRO</Badge>}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredProfiles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😅</div>
          <h3 className="text-xl font-semibold text-white mb-2">No profiles match your filters</h3>
          <p className="text-white/70 mb-4">Try adjusting your search criteria!</p>
          <Button onClick={handleRefresh} className="bg-gradient-to-r from-purple-500 to-pink-500">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh to see more
          </Button>
        </div>
      )}
    </div>
  );
};

// Expose ProUtils globally for other components
window.ProUtils = ProUtils;

export default function MainApp() {
  const { currentUser, userProfile, isPremium } = useAppContext();
  
  // Modified: Initialize activeTab based on profile completion
  const [activeTab, setActiveTab] = useState(() => {
    // Check if user has completed their profile
    const user = localStorage.getItem('user');
    const hasCompletedProfile = localStorage.getItem('profileCompleted');
    
    try {
      if (user && user !== 'null') {
        const userData = JSON.parse(user);
        // If profile is not completed or it's a first-time login, go to profile
        if (!hasCompletedProfile || !userData.profileComplete) {
          return 'profile';
        }
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
      return 'profile'; // Default to profile on error
    }
    
    return 'explore'; // Default to explore if profile is complete
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Chat states moved to MainApp level for global access
  const [chatUser, setChatUser] = useState(null);
  const [showChat, setShowChat] = useState(false);

  // FORCE RESET: Set dark mode to OFF on component mount
  useEffect(() => {
    console.log('🔄 MainApp mounted - resetting dark mode to OFF');
    localStorage.setItem('darkMode', 'false');
    setDarkMode(false);
    document.documentElement.classList.remove('dark-mode');
  }, []);

  useEffect(() => {
    // FIRST: Always ensure dark mode defaults to OFF
    if (!localStorage.getItem('darkMode')) {
      localStorage.setItem('darkMode', 'false');
      setDarkMode(false);
      document.documentElement.classList.remove('dark-mode');
      console.log('🌞 Initialized dark mode to OFF');
    }

    // NEW: One-time profile completion check on component mount
    const checkInitialProfileStatus = () => {
      const user = localStorage.getItem('user');
      const hasCompletedProfile = localStorage.getItem('profileCompleted');
      const isFirstLogin = localStorage.getItem('isFirstLogin') === 'true';
      
      try {
        if (user && user !== 'null') {
          const userData = JSON.parse(user);
          
          // Only redirect to profile if this is explicitly a first login OR profile is incomplete
          if (isFirstLogin && !hasCompletedProfile) {
            console.log('🔄 First login detected - redirecting to profile');
            setActiveTab('profile');
            window.location.hash = '#profile';
            // Clear the first login flag so this doesn't happen again
            localStorage.setItem('isFirstLogin', 'false');
          }
        }
      } catch (e) {
        console.error('Error checking profile status:', e);
      }
    };

    const checkAuth = () => {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      let valid = false;
      try {
        if (user && token && user !== 'null' && token !== 'null') {
          const userData = JSON.parse(user);
          valid = userData && (userData.email || userData.id) && token.length > 5;
        }
      } catch (e) {
        valid = false;
      }
      setIsLoggedIn(valid);
    };

    const checkDarkMode = () => {
      const isDark = localStorage.getItem('darkMode') === 'true';
      setDarkMode(isDark);
      
      // Apply dark-mode class to document
      if (isDark) {
        document.documentElement.classList.add('dark-mode');
        console.log('🌙 Dark mode ON');
      } else {
        document.documentElement.classList.remove('dark-mode');
        console.log('🌞 Dark mode OFF');
      }
    };

    // Run checks
    checkInitialProfileStatus(); // Only runs once on mount
    checkAuth();
    checkDarkMode();
    
    const handleStorage = (e) => {
      if (e.key === 'user' || e.key === 'token') setTimeout(checkAuth, 100);
      if (e.key === 'darkMode') {
        console.log('🔄 Dark mode changed:', e.newValue);
        setTimeout(checkDarkMode, 100);
      }
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(checkAuth, 5000);

    // Global chat opener function for MessagesScreen
    window.openChatFromMessages = (conversationId) => {
      console.log('🔗 Opening chat for conversation:', conversationId);
      
      // Find user from conversations
      const conversations = JSON.parse(localStorage.getItem('conversations') || '{}');
      const conversation = conversations[conversationId];
      
      if (conversation) {
        console.log('✅ Found conversation:', conversation);
        
        const user = {
          id: conversation.id,
          name: conversation.name,
          photos: [conversation.avatar],
          isOnline: true,
          lastOnline: 'Online now'
        };
        
        console.log('📱 Opening chat with user:', user);
        
        // Set the chat user and show the modal - STAY on Messages tab
        setChatUser(user);
        setShowChat(true);
        // DON'T switch tabs - stay on current tab (Messages)
        
      } else {
        console.error('❌ Conversation not found for ID:', conversationId);
      }
    };

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
      delete window.openChatFromMessages;
      delete window.ProUtils;
    };
  }, []); // Removed activeTab dependency

  // NEW: Add hash navigation useEffect
  useEffect(() => {
    // Function to handle hash changes
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['explore', 'messages', 'activity', 'profile', 'upgrade', 'settings'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    // Handle initial hash on page load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // NEW: Function to handle profile completion
  const handleProfileComplete = () => {
    console.log('✅ Profile completed - marking as complete and navigating to explore');
    
    // Mark profile as completed
    localStorage.setItem('profileCompleted', 'true');
    localStorage.setItem('isFirstLogin', 'false');
    
    // Update user data to include profile completion
    const user = localStorage.getItem('user');
    if (user && user !== 'null') {
      try {
        const userData = JSON.parse(user);
        userData.profileComplete = true;
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (e) {
        console.error('Error updating user profile completion:', e);
      }
    }
    
    // Navigate to explore
    setActiveTab('explore');
    window.location.hash = '#explore';
  };

  if (!isLoggedIn) return <SignupForm />;

  const renderScreen = () => {
    switch (activeTab) {
      case 'explore': return <ExploreComponent setActiveTab={setActiveTab} chatUser={chatUser} setChatUser={setChatUser} showChat={showChat} setShowChat={setShowChat} />;
      case 'messages': return <MessagesScreen key={Date.now()} />;
      case 'activity': return <TappdActivityCenter />;
      case 'profile': 
        return (
          <div className="p-4 space-y-4">
            {/* Debug indicator */}
            <div className="text-xs text-white/70 mb-2">
              Debug: Dark Mode = {darkMode ? 'ON' : 'OFF'} | localStorage = {localStorage.getItem('darkMode') || 'null'}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Profile</h2>
                {isPremium && <Badge className="bg-yellow-500 text-white">PRO</Badge>}
                {/* NEW: Show completion status */}
                {!localStorage.getItem('profileCompleted') && (
                  <Badge className="bg-orange-500 text-white text-xs">Complete Your Profile</Badge>
                )}
              </div>
              <div className="flex gap-2">
                {/* NEW: Skip profile completion button */}
                {!localStorage.getItem('profileCompleted') && (
                  <Button
                    onClick={() => {
                      localStorage.setItem('profileCompleted', 'true');
                      localStorage.setItem('isFirstLogin', 'false');
                      setActiveTab('explore');
                      window.location.hash = '#explore';
                    }}
                    variant="outline"
                    size="sm"
                    className="bg-yellow-500/20 border-yellow-300 text-white hover:bg-yellow-500 hover:text-white"
                  >
                    Skip & Explore
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setActiveTab('settings');
                    window.location.hash = '#settings';
                  }}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-black"
                >
                  ⚙️ Settings
                </Button>
              </div>
            </div>
            
            {/* CONDITIONAL Dark mode CSS - only when darkMode is true */}
            {darkMode && (
              <style dangerouslySetInnerHTML={{__html: `
                /* Dark mode styles - ONLY applied when darkMode state is true */
                .dark-mode-profile input,
                .dark-mode-profile textarea,
                .dark-mode-profile select {
                  background-color: #374151 !important;
                  color: #ffffff !important;
                  border-color: #6b7280 !important;
                }
                
                .dark-mode-profile input::placeholder,
                .dark-mode-profile textarea::placeholder {
                  color: #9ca3af !important;
                }
                
                /* Card backgrounds in dark mode */
                .dark-mode-profile .bg-white {
                  background-color: #1f2937 !important;
                  color: #ffffff !important;
                }
                
                .dark-mode-profile .bg-gray-50 {
                  background-color: #374151 !important;
                }
                
                .dark-mode-profile .bg-purple-50 {
                  background-color: #374151 !important;
                }
                
                /* Text colors in dark mode */
                .dark-mode-profile .text-gray-800,
                .dark-mode-profile .text-gray-900,
                .dark-mode-profile .text-gray-700,
                .dark-mode-profile .text-gray-600,
                .dark-mode-profile .text-gray-500 {
                  color: #ffffff !important;
                }
                
                .dark-mode-profile .text-gray-400 {
                  color: #d1d5db !important;
                }
                
                /* Border colors */
                .dark-mode-profile .border-purple-200,
                .dark-mode-profile .border-gray-200,
                .dark-mode-profile .border-gray-300 {
                  border-color: #6b7280 !important;
                }
                
                /* Shadows */
                .dark-mode-profile .shadow-sm,
                .dark-mode-profile .shadow,
                .dark-mode-profile .shadow-md {
                  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2) !important;
                }
                
                /* Badge styling */
                .dark-mode-profile .bg-purple-100 {
                  background-color: #374151 !important;
                  color: #a78bfa !important;
                }
                
                /* Photo upload area */
                .dark-mode-profile .border-dashed {
                  border-color: #6b7280 !important;
                  background-color: #374151 !important;
                }
              `}} />
            )}
            
            {/* ProfileForm wrapped with conditional dark mode class */}
            <div className={darkMode ? 'dark-mode-profile' : ''}>
              <ProfileForm 
                onComplete={handleProfileComplete} // Updated to use new function
                showSettingsButton={false}
              />
            </div>
          </div>
        );
      case 'settings':
        return <SettingsScreen onBack={() => {
          setActiveTab('profile');
          window.location.hash = '#profile';
        }} />;
      case 'upgrade': return <TappdProScreen />;
      default: return <ExploreComponent setActiveTab={setActiveTab} chatUser={chatUser} setChatUser={setChatUser} showChat={showChat} setShowChat={setShowChat} />;
    }
  };

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700'}`}>
      <div className="flex-1 overflow-hidden">
        <div className="h-full pb-16 overflow-y-auto">
          {renderScreen()}
        </div>
      </div>

      <div className="bg-purple-900/95 backdrop-blur-sm border-t border-white/30 px-4 py-2">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {[
            { key: 'explore', icon: Search, label: 'Explore' },
            { key: 'messages', icon: MessageCircle, label: 'Messages' },
            { key: 'activity', icon: Activity, label: 'Activity' },
            { key: 'profile', icon: User, label: 'Profile' },
            { key: 'upgrade', icon: Crown, label: isPremium ? 'Pro' : 'Upgrade' }
          ].map(({ key, icon: Icon, label }) => (
            <Button
              key={key}
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveTab(key);
                window.location.hash = `#${key}`;
              }}
              className={`flex flex-col items-center gap-1 px-2 py-2 min-h-12 ${
                activeTab === key ? 'text-yellow-400' : 'text-white/80 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Global ChatModal accessible from anywhere */}
      {chatUser && <ChatModal user={chatUser} isOpen={showChat} onClose={() => setShowChat(false)} />}
    </div>
  );
}