import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap } from 'lucide-react';
import { PlanType } from '@/types/user';

interface PlanCardProps {
  plan: PlanType;
  isPopular?: boolean;
  onSelect: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, isPopular, onSelect }) => {
  return (
    <Card className={`p-6 relative ${isPopular ? 'ring-2 ring-purple-500 bg-gradient-to-br from-purple-50 to-pink-50' : 'bg-white'}`}>
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Crown className="w-3 h-3 mr-1" />
          Most Popular
        </Badge>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <div className="text-4xl font-bold text-purple-600 mb-1">
          ${plan.price}
          <span className="text-lg text-gray-500">/month</span>
        </div>
      </div>
      
      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm">
            <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
        
        <li className="flex items-center text-sm">
          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
          <span>See up to {plan.maxProfiles} profiles</span>
        </li>
        
        {plan.unlimitedLikes && (
          <li className="flex items-center text-sm">
            <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
            <span>Unlimited likes</span>
          </li>
        )}
        
        {plan.seeWhoLiked && (
          <li className="flex items-center text-sm">
            <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
            <span>See who liked you</span>
          </li>
        )}
        
        {plan.boosts > 0 && (
          <li className="flex items-center text-sm">
            <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
            <span>{plan.boosts} profile boosts/month</span>
          </li>
        )}
      </ul>
      
      <Button 
        onClick={onSelect}
        className={`w-full ${isPopular ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' : ''}`}
        variant={isPopular ? 'default' : 'outline'}
      >
        {plan.price === 0 ? 'Get Started' : 'Upgrade Now'}
        {isPopular && <Zap className="w-4 h-4 ml-2" />}
      </Button>
    </Card>
  );
};