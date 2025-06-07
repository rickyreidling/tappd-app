import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown, Sparkles } from 'lucide-react';

interface WelcomeToProProps {
  onContinue: () => void;
}

const WelcomeToPro: React.FC<WelcomeToProProps> = ({ onContinue }) => {
  const benefits = [
    'Unlimited profile views',
    'Unlimited daily messages', 
    'Advanced filters (body type, online now, etc.)',
    'See who viewed your profile',
    'Access to private photos',
    'No ads'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-12 w-12 text-yellow-500 mr-3" />
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-purple-600 mb-2">
            Welcome to Prowlr PRO! 🎉
          </CardTitle>
          <p className="text-lg text-gray-600">
            You now have access to all premium features
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-center text-purple-800">
              Your PRO Benefits
            </h3>
            <div className="grid gap-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={onContinue}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
            >
              Start Exploring with PRO ✨
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>Your subscription will auto-renew. Cancel anytime in settings.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeToPro;