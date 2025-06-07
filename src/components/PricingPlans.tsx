import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import StripeCheckout from './StripeCheckout';

const PricingPlans: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  const monthlyPlans = [
    {
      name: 'Monthly',
      price: '$9.99',
      period: '/month',
      priceId: 'price_monthly_pro',
      popular: false
    },
    {
      name: '3 Months',
      price: '$24.99',
      period: '/3 months',
      priceId: 'price_3month_pro',
      popular: true,
      savings: 'Save 17%'
    },
    {
      name: '6 Months',
      price: '$39.99',
      period: '/6 months',
      priceId: 'price_6month_pro',
      popular: false,
      savings: 'Save 33%'
    }
  ];

  const yearlyPlans = [
    {
      name: 'Yearly',
      price: '$79.99',
      period: '/year',
      priceId: 'price_yearly_pro',
      popular: true,
      savings: 'Save 33%'
    }
  ];

  const currentPlans = isYearly ? yearlyPlans : monthlyPlans;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">Choose Your Plan</CardTitle>
        <div className="flex items-center justify-center space-x-2">
          <Label htmlFor="billing-toggle">Monthly</Label>
          <Switch
            id="billing-toggle"
            checked={isYearly}
            onCheckedChange={setIsYearly}
          />
          <Label htmlFor="billing-toggle">Yearly</Label>
          {isYearly && (
            <Badge className="bg-green-100 text-green-800 ml-2">
              Save 33%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-4 ${
          isYearly ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 md:grid-cols-3'
        }`}>
          {currentPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative p-6 rounded-lg border-2 transition-all ${
                plan.popular 
                  ? 'border-yellow-400 bg-gradient-to-b from-yellow-50 to-orange-50 scale-105' 
                  : 'border-gray-200 hover:border-yellow-200'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                  Most Popular
                </Badge>
              )}
              
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                
                <div>
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                
                {plan.savings && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {plan.savings}
                  </Badge>
                )}
                
                <StripeCheckout
                  planName={plan.name}
                  price={plan.price}
                  priceId={plan.priceId}
                  popular={plan.popular}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingPlans;