import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Heart, MapPin } from 'lucide-react';

interface ProfileVisitor {
  id: string;
  visitor_id: string;
  viewed_at: string;
  visitor: {
    id: string;
    name: string;
    age: number;
    avatar_url?: string;
    distance?: string;
  };
}

interface WhoViewedMeProps {
  currentUserId: string;
  isProUser: boolean;
  onShowUpgrade: () => void;
  onTapUser: (userId: string) => void;
}

export const WhoViewedMe: React.FC<WhoViewedMeProps> = ({
  currentUserId,
  isProUser,
  onShowUpgrade,
  onTapUser
}) => {
  const [visitors, setVisitors] = useState<ProfileVisitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isProUser) {
      loadProfileVisitors();
    } else {
      setLoading(false);
    }
  }, [currentUserId, isProUser]);

  const loadProfileVisitors = async () => {
    try {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const { data, error } = await supabase
        .from('profile_visitors')
        .select(`
          *,
          visitor:profiles!visitor_id(
            id,
            name,
            age,
            avatar_url
          )
        `)
        .eq('profile_id', currentUserId)
        .gte('viewed_at', threeDaysAgo.toISOString())
        .order('viewed_at', { ascending: false });

      if (error) throw error;
      
      // Add mock distance data
      const visitorsWithDistance = (data || []).map(visitor => ({
        ...visitor,
        visitor: {
          ...visitor.visitor,
          distance: `${Math.floor(Math.random() * 10) + 1} km away`
        }
      }));
      
      setVisitors(visitorsWithDistance);
    } catch (error) {
      console.error('Error loading profile visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTapBack = (userId: string) => {
    onTapUser(userId);
  };

  if (!isProUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-6 mb-6">
          <Heart className="w-12 h-12 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Who Viewed Me</h2>
        <p className="text-gray-600 mb-6 max-w-sm">
          See who's been checking out your profile in the last 72 hours!
        </p>
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-0.5 rounded-full">
          <Button
            onClick={onShowUpgrade}
            className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-3 rounded-full font-semibold"
          >
            💎 Upgrade to Tappd PRO
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-900">Who Viewed Me</h1>
        <p className="text-sm text-gray-600">Last 72 hours</p>
      </div>
      
      <div className="p-4 space-y-3">
        {visitors.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-6 mx-auto w-fit mb-4">
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-gray-600">No profile views yet</p>
            <p className="text-sm text-gray-500 mt-1">Keep swiping to get noticed!</p>
          </div>
        ) : (
          visitors.map((visitor) => (
            <div
              key={visitor.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center space-x-4"
            >
              <Avatar className="w-16 h-16">
                <AvatarImage src={visitor.visitor.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-semibold">
                  {visitor.visitor.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {visitor.visitor.name}, {visitor.visitor.age}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    NEW
                  </Badge>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {visitor.visitor.distance || 'Nearby'}
                </div>
                
                <p className="text-xs text-gray-500">
                  Viewed {new Date(visitor.viewed_at).toLocaleDateString()}
                </p>
              </div>
              
              <Button
                onClick={() => handleTapBack(visitor.visitor.id)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full font-semibold"
              >
                Tap Back
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};