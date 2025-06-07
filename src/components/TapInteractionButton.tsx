import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Crown } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface TapInteractionButtonProps {
  userId: string;
  userName: string;
  onTap?: () => void;
}

const TapInteractionButton: React.FC<TapInteractionButtonProps> = ({ 
  userId, 
  userName, 
  onTap 
}) => {
  const { isPremium, addTapBack } = useAppContext();
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasTapped, setHasTapped] = useState(() => {
    return localStorage.getItem(`tapped_${userId}`) === 'true';
  });

  const handleTap = async () => {
    if (hasTapped) return;

    // Check tap limits for free users
    if (!isPremium) {
      const today = new Date().toDateString();
      const storedData = localStorage.getItem('dailyTaps');
      let dailyCount = 0;
      
      if (storedData) {
        const { date, count } = JSON.parse(storedData);
        if (date === today) {
          dailyCount = count;
        }
      }
      
      if (dailyCount >= 10) {
        toast({
          title: "Daily Limit Reached",
          description: "Upgrade to PRO for unlimited taps!",
          variant: "destructive"
        });
        return;
      }
      
      // Increment tap count
      const newCount = dailyCount + 1;
      localStorage.setItem('dailyTaps', JSON.stringify({ 
        date: today, 
        count: newCount 
      }));
    }

    // Animate button
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    
    // Mark as tapped
    setHasTapped(true);
    localStorage.setItem(`tapped_${userId}`, 'true');
    
    // Add to tap backs
    addTapBack(userId);
    
    // Show success toast
    toast({
      title: "Tap Sent! 💖",
      description: `You tapped ${userName}`,
    });
    
    // Call parent callback
    onTap?.();
  };

  if (hasTapped) {
    return (
      <Button 
        disabled 
        className="w-full bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
        variant="outline"
      >
        <Heart className="w-4 h-4 mr-2 fill-current" />
        Tapped
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleTap}
      className={`w-full transition-all duration-300 ${
        isAnimating 
          ? 'scale-110 bg-gradient-to-r from-pink-500 to-red-500 shadow-lg' 
          : 'bg-gradient-to-r from-pink-400 to-red-400 hover:from-pink-500 hover:to-red-500'
      }`}
    >
      {isPremium && <Crown className="w-4 h-4 mr-2" />}
      <Heart className={`w-4 h-4 mr-2 ${isAnimating ? 'animate-pulse' : ''}`} />
      {isAnimating ? (
        <>
          <Sparkles className="w-4 h-4 mr-1 animate-spin" />
          Tapping...
        </>
      ) : (
        'Tap'
      )}
    </Button>
  );
};

export default TapInteractionButton;