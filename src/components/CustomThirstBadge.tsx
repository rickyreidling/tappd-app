import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const CustomThirstBadge: React.FC = () => {
  const { isPremium } = useAppContext();
  const { toast } = useToast();
  const [selectedBadge, setSelectedBadge] = useState('🔥');

  const badges = [
    { emoji: '🔥', name: 'Fire', description: 'Classic heat' },
    { emoji: '💦', name: 'Water', description: 'Wet and wild' },
    { emoji: '🍆', name: 'Eggplant', description: 'You know what this means' },
    { emoji: '🍑', name: 'Peach', description: 'Sweet and juicy' }
  ];

  const handleSelect = (emoji: string) => {
    setSelectedBadge(emoji);
    localStorage.setItem('customThirstBadge', emoji);
    toast({
      title: "Thirst Badge Updated!",
      description: `Your new badge is ${emoji}`,
    });
  };

  if (!isPremium) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">PRO Feature</h3>
          <p className="text-gray-600">Upgrade to PRO to customize your thirst badge</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Custom Thirst Badge
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Choose your thirst badge to show your vibe:</p>
          
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => (
              <Button
                key={badge.emoji}
                onClick={() => handleSelect(badge.emoji)}
                variant={selectedBadge === badge.emoji ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <span className="text-2xl">{badge.emoji}</span>
                <div className="text-center">
                  <div className="font-semibold">{badge.name}</div>
                  <div className="text-xs text-gray-500">{badge.description}</div>
                </div>
              </Button>
            ))}
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-2">Your Current Badge:</p>
            <span className="text-4xl">{selectedBadge}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomThirstBadge;