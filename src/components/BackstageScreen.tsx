import React from 'react';
import { Crown, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const BackstageScreen: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="w-8 h-8 text-purple-500" />
          <Sparkles className="w-6 h-6 text-yellow-500 animate-bounce" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Backstage
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Welcome to your exclusive PRO area
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            PRO Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Profile Views</span>
            <Badge>142 this week</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Super Likes Remaining</span>
            <Badge>5/5</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Boosts Available</span>
            <Badge>2</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackstageScreen;