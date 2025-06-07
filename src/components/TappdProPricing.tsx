import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface TappdProPricingProps {
  onBack?: () => void;
}

const TappdProPricing: React.FC<TappdProPricingProps> = ({ onBack }) => {
  const handleSubscribe = async (priceId: string, planName: string) => {
    try {
      const response = await fetch(
        'https://sstmnoilasukcxjacrjj.supabase.co/functions/v1/909db335-43e0-44a5-aa91-e34c6982984a',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ priceId })
        }
      );
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive"
      });
    }
  };

  const benefits = [
    'Unlimited profile views',
    'Unlimited daily messages',
    'Advanced filters (body type, online now, etc.)',
    'See who viewed your profile',
    'Access to private photos',
    'No ads'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-yellow-400 mr-2" />
            <h1 className="text-4xl font-bold text-white">Tappd PRO</h1>
          </div>
          <p className="text-xl text-purple-100">Unlock premium features with a 7-day free trial</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="relative">
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500">
              Most Popular
            </Badge>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Monthly Plan</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-purple-600">$9.99</span>
                <span className="text-gray-500">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full mb-4 bg-purple-600 hover:bg-purple-700"
                onClick={() => handleSubscribe('price_1RS6baRwJFFpnjwiLpRySCta', 'Monthly')}
              >
                Start 7-Day Free Trial
              </Button>
              <p className="text-sm text-gray-500 text-center mb-4">
                Cancel anytime during trial
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Annual Plan</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-purple-600">$59.99</span>
                <span className="text-gray-500">/year</span>
                <div className="text-sm text-green-600 font-medium mt-1">
                  Save $60 per year!
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full mb-4 bg-purple-600 hover:bg-purple-700"
                onClick={() => handleSubscribe('price_1RS6dDRwJFFpnjwiNLDYwYzu', 'Annual')}
              >
                Start 7-Day Free Trial
              </Button>
              <p className="text-sm text-gray-500 text-center mb-4">
                Cancel anytime during trial
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">PRO Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {onBack && (
          <div className="text-center">
            <Button variant="outline" onClick={onBack}>
              Back to App
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TappdProPricing;