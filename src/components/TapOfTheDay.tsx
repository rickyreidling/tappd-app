import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { mockUsers } from '@/data/mockUsers';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Sparkles } from 'lucide-react';

interface TapOfTheDayProps {
  currentUser?: User;
  onProfileClick: (user: User) => void;
  onTapBack: (userId: string) => void;
}

export function TapOfTheDay({ currentUser, onProfileClick, onTapBack }: TapOfTheDayProps) {
  const { addTapBack, tapBacks, mutualTaps } = useAppContext();
  const [dailyTap, setDailyTap] = useState<User | null>(null);
  const [hasTappedBack, setHasTappedBack] = useState(false);

  useEffect(() => {
    // Get today's date as seed for consistent daily selection
    const today = new Date().toDateString();
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Select a user based on today's seed
    const availableUsers = mockUsers.filter(user => user.id !== currentUser?.id);
    if (availableUsers.length > 0) {
      const selectedUser = availableUsers[seed % availableUsers.length];
      setDailyTap(selectedUser);
    }

    // Check if user already tapped back today
    const tapBackKey = `tapback_${today}_${currentUser?.id}`;
    setHasTappedBack(localStorage.getItem(tapBackKey) === 'true');
  }, [currentUser]);

  const handleTapBack = () => {
    if (!dailyTap) return;
    
    const today = new Date().toDateString();
    const tapBackKey = `tapback_${today}_${currentUser?.id}`;
    
    localStorage.setItem(tapBackKey, 'true');
    setHasTappedBack(true);
    
    // Add to app context
    addTapBack(dailyTap.id);
    onTapBack(dailyTap.id);
    
    // Simulate mutual tap (in real app, this would come from backend)
    setTimeout(() => {
      localStorage.setItem(`received_tapback_${dailyTap.id}`, 'true');
    }, 1000);
    
    // Open profile after a brief delay
    setTimeout(() => {
      onProfileClick(dailyTap);
    }, 500);
  };

  if (!dailyTap) return null;

  const isMutualTap = mutualTaps.has(dailyTap.id);

  return (
    <div className="mx-4 mb-6">
      <div className="flex items-center justify-center mb-3">
        <Sparkles className="w-5 h-5 text-purple-500 mr-2 animate-pulse" />
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Tap of the Day 💥
        </h2>
        <Sparkles className="w-5 h-5 text-pink-500 ml-2 animate-pulse" />
      </div>
      
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 p-1 shadow-xl animate-shimmer">
        {/* Animated sparkle border */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 animate-pulse opacity-75 rounded-2xl" />
        
        <div className="relative bg-white rounded-xl p-4">
          <div className="flex items-center space-x-4">
            {/* Profile Photo */}
            <div className="relative">
              <img
                src={dailyTap.photos?.[0] || '/placeholder.svg'}
                alt={dailyTap.name}
                className="w-20 h-20 rounded-full object-cover border-3 border-white shadow-lg transition-transform hover:scale-105"
                onClick={() => onProfileClick(dailyTap)}
              />
              {dailyTap.isOnline && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full animate-pulse" />
              )}
              {isMutualTap && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 border-2 border-white rounded-full flex items-center justify-center animate-bounce">
                  <Heart className="w-3 h-3 text-white fill-current" />
                </div>
              )}
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 cursor-pointer" onClick={() => onProfileClick(dailyTap)}>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {dailyTap.name}
                </h3>
                <span className="text-gray-600 font-medium">{dailyTap.age}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{dailyTap.distance} away</span>
              </div>
              
              {/* One interest tag */}
              {dailyTap.interests[0] && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs font-medium">
                  {dailyTap.interests[0]}
                </Badge>
              )}
              
              {isMutualTap && (
                <div className="mt-2">
                  <Badge className="bg-pink-100 text-pink-700 text-xs">
                    💕 Mutual Tap!
                  </Badge>
                </div>
              )}
            </div>
            
            {/* Tap Back Button */}
            <Button
              onClick={handleTapBack}
              disabled={hasTappedBack}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform ${
                hasTappedBack
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
              }`}
            >
              <Heart className={`w-4 h-4 mr-2 ${hasTappedBack ? 'fill-current' : ''}`} />
              {hasTappedBack ? 'Tapped!' : 'Tap Back'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}