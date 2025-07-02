import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Clock, MapPin, MessageCircle, Heart } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface ProfileViewer {
  id: string;
  name: string;
  age: number;
  photo: string;
  location: string;
  viewedAt: Date;
  isOnline: boolean;
}

const WhoViewedMeTab: React.FC = () => {
  const { isPremium } = useAppContext();
  const { toast } = useToast();
  const [viewers, setViewers] = useState<ProfileViewer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPremium) {
      setLoading(false);
      return;
    }

    // Load real profile viewers from localStorage
    const loadViewers = () => {
      try {
        const savedViewers = localStorage.getItem('profileViewers');
        if (savedViewers) {
          const parsedViewers = JSON.parse(savedViewers).map((viewer: any) => ({
            ...viewer,
            viewedAt: new Date(viewer.viewedAt)
          }));
          console.log('📊 Loaded profile viewers:', parsedViewers.length);
          setViewers(parsedViewers);
        } else {
          console.log('📊 No profile viewers found');
          setViewers([]);
        }
      } catch (error) {
        console.error('❌ Error loading profile viewers:', error);
        setViewers([]);
      }
      setLoading(false);
    };

    loadViewers();

    // Listen for new profile views
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'profileViewers') {
        console.log('🔄 Profile viewers updated, reloading...');
        loadViewers();
      }
    };

    const handleCustomEvent = () => {
      console.log('🔄 Custom profile view event, reloading...');
      loadViewers();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileViewUpdated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileViewUpdated', handleCustomEvent);
    };
  }, [isPremium]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const handleTapBack = (viewer: ProfileViewer) => {
    // Check tap limits
    if (window.ProUtils && !window.ProUtils.canTap(isPremium)) {
      toast({ 
        title: "Daily tap limit reached", 
        description: "Upgrade to PRO for unlimited taps!",
        variant: "destructive"
      });
      return;
    }

    if (window.ProUtils) {
      window.ProUtils.incrementTapCount();
    }

    toast({
      title: `💖 Tapped ${viewer.name}!`,
      description: "They'll be notified of your interest!"
    });
  };

  const handleMessage = (viewer: ProfileViewer) => {
    // Use the global chat function if available
    if (window.openChatFromMessages) {
      // Convert viewer to user format for chat
      const user = {
        id: viewer.id,
        name: viewer.name,
        photos: [viewer.photo],
        isOnline: viewer.isOnline,
        lastOnline: viewer.isOnline ? 'Online now' : 'Offline'
      };
      
      // Create a conversation if it doesn't exist
      const conversations = JSON.parse(localStorage.getItem('conversations') || '{}');
      if (!conversations[user.id]) {
        const conversationData = {
          id: user.id,
          name: user.name,
          avatar: user.photos[0],
          lastMessage: 'Say hello! 👋',
          timestamp: new Date().toISOString(),
          timeDisplay: new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          unread: false,
          messages: []
        };
        conversations[user.id] = conversationData;
        localStorage.setItem('conversations', JSON.stringify(conversations));
        window.dispatchEvent(new CustomEvent('conversationUpdated'));
      }
      
      window.openChatFromMessages(user.id);
    } else {
      toast({
        title: `Opening chat with ${viewer.name}...`,
        description: "💬 Starting conversation"
      });
    }
  };

  const clearViewHistory = () => {
    localStorage.removeItem('profileViewers');
    setViewers([]);
    toast({
      title: "View history cleared",
      description: "All profile view records have been removed"
    });
  };

  if (!isPremium) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">PRO Feature</h3>
          <p className="text-gray-600 mb-4">Upgrade to PRO to see who viewed your profile</p>
          <Button 
            onClick={() => window.location.hash = '#upgrade'}
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            🚀 Upgrade to PRO
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Profile Viewers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Profile Viewers ({viewers.length})
          </CardTitle>
          {viewers.length > 0 && (
            <Button
              onClick={clearViewHistory}
              variant="outline"
              size="sm"
              className="text-gray-500 hover:text-red-600"
            >
              Clear History
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {viewers.length === 0 ? (
          <div className="text-center py-8">
            <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No profile views yet</h3>
            <p className="text-gray-600 mb-4">When people view your profile, they'll appear here</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Pro Tip:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Complete your profile to attract more views</li>
                <li>• Add multiple photos to stand out</li>
                <li>• Be active in the app to increase visibility</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {viewers.map((viewer) => (
              <div key={viewer.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={viewer.photo} alt={viewer.name} />
                    <AvatarFallback className="bg-purple-500 text-white">
                      {viewer.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {viewer.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{viewer.name}, {viewer.age}</h4>
                    {viewer.isOnline && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        Online
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {viewer.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(viewer.viewedAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleTapBack(viewer)}
                    variant="outline"
                    size="sm"
                    className="border-purple-300 text-purple-600 hover:bg-purple-50"
                  >
                    <Heart className="w-3 h-3 mr-1" />
                    Tap Back
                  </Button>
                  <Button
                    onClick={() => handleMessage(viewer)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Message
                  </Button>
                </div>
              </div>
            ))}

            {viewers.length >= 10 && (
              <div className="text-center py-4 border-t">
                <p className="text-sm text-gray-500">Showing recent 50 profile views</p>
                <p className="text-xs text-gray-400 mt-1">Older views are automatically removed</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhoViewedMeTab;