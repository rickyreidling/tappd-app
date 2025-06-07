import React from 'react';
import { PlanCard } from '@/components/PlanCard';
import { PlanType } from '@/types/user';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PricingSectionProps {
  onBack?: () => void;
}

const plans: PlanType[] = [
  {
    name: 'Free',
    price: 0,
    features: [
      'Basic profile creation',
      'Limited daily likes',
      'Basic search filters',
      'View public photos'
    ],
    maxProfiles: 10,
    unlimitedLikes: false,
    seeWhoLiked: false,
    boosts: 0
  },
  {
    name: 'Pro',
    price: 19.99,
    features: [
      'Advanced search filters',
      'Read receipts',
      'Incognito browsing',
      'Priority customer support',
      'Ad-free experience'
    ],
    maxProfiles: 100,
    unlimitedLikes: true,
    seeWhoLiked: true,
    boosts: 3
  },
  {
    name: 'Premium',
    price: 39.99,
    features: [
      'Everything in Pro',
      'Travel mode',
      'Super likes',
      'Profile verification',
      'Advanced analytics',
      'VIP badge'
    ],
    maxProfiles: 999,
    unlimitedLikes: true,
    seeWhoLiked: true,
    boosts: 10
  }
];

export const PricingSection: React.FC<PricingSectionProps> = ({ onBack }) => {
  const handlePlanSelect = (plan: PlanType) => {
    if (plan.price === 0) {
      toast({
        title: "Welcome to Prowlr!",
        description: "You're all set with the free plan.",
      });
    } else {
      toast({
        title: "Upgrade Selected",
        description: `You selected the ${plan.name} plan for $${plan.price}/month.`,
      });
    }
  };
  
  return (
    <div className="py-12 bg-gradient-to-br from-purple-50 to-pink-50">
      {onBack && (
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock more connections and features with our premium plans
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              isPopular={index === 1}
              onSelect={() => handlePlanSelect(plan)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;