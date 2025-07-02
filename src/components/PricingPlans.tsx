import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StripeCheckout from './StripeCheckout';

const PricingPlans: React.FC = () => {
  const plans = [
    {
      name: 'Monthly',
      price: '$9.99',
      period: '/month',
      checkoutUrl: 'https://buy.stripe.com/28E8wR0Ku5tM5ck1eT9Zm03',
      popular: false
    },
    {
      name: '3 Months',
      price: '$24.99',
      period: '/3 months',
      checkoutUrl: 'https://buy.stripe.com/cNibJ350K6xQ2084r59Zm02',
      popular: true,
      savings: 'Save 17%'
    },
    {
      name: '6 Months',
      price: '$39.99',
      period: '/6 months',
      checkoutUrl: 'https://buy.stripe.com/dRm9AV3WG4pIeMUg9N9Zm01',
      popular: false,
      savings: 'Save 33%'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">Choose Your Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {plans.map((plan, index) => (
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
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                
                {plan.savings && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {plan.savings}
                  </Badge>
                )}
                
                <a href={plan.checkoutUrl} target="_blank" rel="noopener noreferrer">
                  <button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded">
                    {plan.popular ? 'Get PRO Now' : 'Select Plan'}
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingPlans;