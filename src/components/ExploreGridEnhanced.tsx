import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';
import { mockUsers } from '@/data/mockUsers';
import { Crown, MessageCircle, Heart, RefreshCw, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExploreGridEnhancedProps {
  onProfileClick?: (userId: string) => void;
  onMessageClick?: (userId: string) => void;
}

export const ExploreGridEnhanced: React.FC<ExploreGridEnhancedProps> = ({
  onProfileClick,
  onMessageClick
}) => {
  const { isPremium, currentUser } = useAppContext();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState(mockUsers);
  const [viewedCount, setViewedCount] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const FREE_LIMIT = 60;

  const calculateDistance = () => {
    const distances = [0.5, 1.2, 2.8, 4.1, 6.3, 8.7, 12.4];
    return distances[Math.floor(Math.random() * distances.length)];
  };

  const sortedProfiles = React.useMemo(() => {
    if (!sortByDistance) return profiles;
    
    return [...profiles].sort(() => Math.random() - 0.5).map(user => ({
      ...user,
      distance: calculateDistance()
    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [profiles, sortByDistance]);

  const handleProfileView = (userId: string) => {
    if (!isPremium && viewedCount >= FREE_LIMIT) {
      setShowUpgradeModal(true);
      return;
    }
    
    setViewedCount(prev => prev + 1);
    onProfileClick?.(userId);
  };

  const handleUpgrade = async () => {
    if (isUpgrading) return;
    setIsUpgrading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        toast({ title: "Please sign in first", variant: "destructive" });
        return;
      }

      const response = await fetch(
        'https://sstmnoilasukcxjacrjj.supabase.co/functions/v1/45785200-a879-4b5f-8db6-d160e67743dc',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            priceId: 'monthly',
            userId: currentUser?.id,
            successUrl: `${window.location.origin}?upgrade=success`,
            cancelUrl: `${window.location.origin}?upgrade=cancelled`
          })
        }
      );

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error: any) {
      console.error('Upgrade error:', error);
      toast({ 
        title: "Upgrade failed", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const shuffled = [...mockUsers].sort(() => Math.random() - 0.5);
    setProfiles(shuffled);
    
    if (!isPremium) {
      setViewedCount(0);
    }
    
    setRefreshing(false);
    toast({ title: "Profiles refreshed!" });
  };

  const UpgradeModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center space-y-4">
          <Crown className="w-12 h-12 text-yellow-500 mx-auto" />
          <h3 className="text-xl font-bold">You've reached your free browsing limit</h3>
          <p className="text-gray-600">
            Upgrade to Tappd PRO to unlock unlimited profiles!
          </p>
          <div className="space-y-2">
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
              onClick={handleUpgrade}
              disabled={isUpgrading}
            >
              <Crown className="w-4 h-4 mr-2" />
              {isUpgrading ? 'Processing...' : 'Upgrade to PRO'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowUpgradeModal(false)}
              className="w-full"
            >
              Maybe Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Explore</h2>
          {!isPremium && (
            <p className="text-sm text-gray-500">
              {viewedCount}/{FREE_LIMIT} profiles viewed
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setSortByDistance(!sortByDistance)}
            variant={sortByDistance ? "default" : "outline"}
            size="sm"
          >
            <MapPin className="w-4 h-4 mr-1" />
            {sortByDistance ? 'By Distance' : 'Sort'}
          </Button>
          <Button 
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {sortedProfiles.slice(0, isPremium ? sortedProfiles.length : FREE_LIMIT).map((user) => (
          <Card 
            key={user.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleProfileView(user.id)}
          >
            <CardContent className="p-2 sm:p-3">
              <div className="space-y-2">
                <div className="relative">
                  <Avatar className="w-full aspect-square">
                    <AvatarImage src={user.avatar_url} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {user.thirst_mode && (
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-xs px-1">
                      🔥
                    </Badge>
                  )}
                </div>
                
                <div className="text-center space-y-1">
                  <h3 className="font-semibold text-sm truncate">{user.name}</h3>
                  <p className="text-xs text-gray-500">{user.age}</p>
                  
                  {sortByDistance && user.distance && (
                    <p className="text-xs text-blue-500 font-medium">
                      {user.distance} mi away
                    </p>
                  )}
                  
                  {!sortByDistance && user.location && (
                    <p className="text-xs text-gray-400 truncate">{user.location}</p>
                  )}
                </div>
                
                <div className="flex gap-1 justify-center">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 h-8 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMessageClick?.(user.id);
                    }}
                  >
                    <MessageCircle className="w-3 h-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 h-8 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast({ title: `Tapped ${user.name}!` });
                    }}
                  >
                    <Heart className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showUpgradeModal && <UpgradeModal />}
    </div>
  );
};