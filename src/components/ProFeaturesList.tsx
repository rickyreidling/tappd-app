import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Eye, 
  Filter, 
  MessageCircle, 
  EyeOff, 
  Sparkles, 
  Palette,
  Crown
} from 'lucide-react';

const ProFeaturesList: React.FC = () => {
  const features = [
    {
      icon: Heart,
      title: 'Unlimited Taps & Likes',
      description: 'No daily limits - tap and like as much as you want',
      badge: 'Popular'
    },
    {
      icon: Eye,
      title: 'See Who Viewed Your Profile',
      description: 'Get a list of everyone who checked out your profile',
      badge: 'Exclusive'
    },
    {
      icon: Filter,
      title: 'Advanced Filters',
      description: 'Filter by body type, age, distance, orientation & thirst mode',
      badge: 'Premium'
    },
    {
      icon: MessageCircle,
      title: 'Priority Messaging',
      description: 'Appear at the top of inboxes and bypass message limits',
      badge: 'VIP'
    },
    {
      icon: EyeOff,
      title: 'Incognito Mode',
      description: 'Browse privately without showing online status',
      badge: 'Stealth'
    },
    {
      icon: Sparkles,
      title: 'Custom Thirst Badge',
      description: 'Choose your thirst icon: 🔥, 💦, 🍆, or 🍑',
      badge: 'Fun'
    },
    {
      icon: Palette,
      title: 'Profile Themes',
      description: 'Customize your profile with premium color themes',
      badge: 'Style'
    }
  ];

  const badgeColors = {
    'Popular': 'bg-red-100 text-red-800',
    'Exclusive': 'bg-purple-100 text-purple-800',
    'Premium': 'bg-yellow-100 text-yellow-800',
    'VIP': 'bg-orange-100 text-orange-800',
    'Stealth': 'bg-gray-100 text-gray-800',
    'Fun': 'bg-pink-100 text-pink-800',
    'Style': 'bg-blue-100 text-blue-800'
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
          <Crown className="w-6 h-6 text-yellow-500" />
          PRO Features
        </h2>
        <p className="text-gray-600">Unlock premium features and supercharge your connections</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                    <IconComponent className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <Badge className={badgeColors[feature.badge as keyof typeof badgeColors]}>
                        {feature.badge}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProFeaturesList;