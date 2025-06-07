import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Crown } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const TapLimitTracker: React.FC = () => {
  const { isPremium } = useAppContext();
  const [dailyTaps, setDailyTaps] = useState(0);
  const maxDailyTaps = 10;

  useEffect(() => {
    // Load daily taps from localStorage
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('dailyTaps');
    
    if (storedData) {
      const { date, count } = JSON.parse(storedData);
      if (date === today) {
        setDailyTaps(count);
      } else {
        // Reset for new day
        localStorage.setItem('dailyTaps', JSON.stringify({ date: today, count: 0 }));
        setDailyTaps(0);
      }
    } else {
      localStorage.setItem('dailyTaps', JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  const incrementTaps = () => {
    if (isPremium) return true; // No limit for PRO users
    
    if (dailyTaps >= maxDailyTaps) {
      return false; // Limit reached
    }
    
    const newCount = dailyTaps + 1;
    setDailyTaps(newCount);
    
    const today = new Date().toDateString();
    localStorage.setItem('dailyTaps', JSON.stringify({ date: today, count: newCount }));
    
    return true;
  };

  // Expose function globally for other components to use
  (window as any).incrementTaps = incrementTaps;

  if (isPremium) {
    return (
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 text-yellow-700">
            <Crown className="w-5 h-5" />
            <span className="font-semibold">Unlimited Taps - PRO</span>
            <Heart className="w-5 h-5 fill-current" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = (dailyTaps / maxDailyTaps) * 100;
  const isLimitReached = dailyTaps >= maxDailyTaps;

  return (
    <Card className={isLimitReached ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className={`w-5 h-5 ${isLimitReached ? 'text-red-500' : 'text-blue-500'}`} />
              <span className="font-semibold">
                Daily Taps: {dailyTaps}/{maxDailyTaps}
              </span>
            </div>
            {isLimitReached && (
              <span className="text-sm text-red-600 font-medium">Limit Reached</span>
            )}
          </div>
          
          <Progress 
            value={progressPercentage} 
            className={`h-2 ${isLimitReached ? 'bg-red-100' : 'bg-blue-100'}`}
          />
          
          {isLimitReached ? (
            <p className="text-sm text-red-600 text-center">
              You've reached your daily limit. Upgrade to PRO for unlimited taps!
            </p>
          ) : (
            <p className="text-sm text-blue-600 text-center">
              {maxDailyTaps - dailyTaps} taps remaining today
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TapLimitTracker;