import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Heart, MessageCircle, Eye, Filter, Image, Zap } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import StripeDebugger from './StripeDebugger';

interface TappdProUpgradeProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'messages' | 'who_viewed_me' | 'no_match_message' | 'general';
}

const TappdProUpgrade: React.FC<TappdProUpgradeProps> = ({
  isOpen,
  onClose,
  trigger = 'general'
}) => {
  const { upgradeToProWithStripe, currentUser } = useAppContext();

  const benefits = [
    { icon: <MessageCircle className="w-5 h-5" />, title: "Unlimited messages", description: "Chat as much as you want" },
    { icon: <Eye className="w-5 h-5" />, title: "View who's seen your profile", description: "See your profile visitors" },
    { icon: <Heart className="w-5 h-5" />, title: "Message anyone, anytime", description: "No mutual tap required" },
    { icon: <Image className="w-5 h-5" />, title: "Upload and view private photos", description: "Share exclusive content" },
    { icon: <Filter className="w-5 h-5" />, title: "Use advanced filters", description: "Find exactly who you want" },
    { icon: <Zap className="w-5 h-5" />, title: "Enjoy an ad-free experience", description: "No interruptions" }
  ];

  const handleUpgrade = async (priceId: string) => {
    try {
      console.log('🚀 TappdProUpgrade: Starting upgrade with priceId:', priceId);
      await upgradeToProWithStripe(priceId);
    } catch (error) {
      console.error('💥 TappdProUpgrade: Upgrade failed:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 relative">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-full p-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 animate-pulse">✨</div>
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Unlock All of Tappd ✨
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 my-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-2 mt-0.5">
                <div className="text-purple-600">{benefit.icon}</div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
              <Check className="w-5 h-5 text-green-500 mt-1" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <StripeDebugger />
          
          <div className="space-y-3">
            <Button 
              onClick={() => handleUpgrade('price_yearly_pro')} 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4"
            >
              💎 Upgrade to Tappd PRO (Yearly)
            </Button>
            <Button 
              onClick={() => handleUpgrade('price_monthly_pro')} 
              variant="outline" 
              className="w-full"
            >
              Monthly Plan
            </Button>
            <Button variant="ghost" onClick={onClose} className="w-full">
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TappdProUpgrade;