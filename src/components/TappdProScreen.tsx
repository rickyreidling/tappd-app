import React from 'react';
import { Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star } from 'lucide-react';
import ProFeaturesList from './ProFeaturesList';
import PricingPlans from './PricingPlans';
import WhoViewedMeTab from './WhoViewedMeTab';
import CustomThirstBadge from './CustomThirstBadge';
import ProfileThemes from './ProfileThemes';
import { useAppContext } from '@/contexts/AppContext';

const TappdProScreen: React.FC = () => {
  const { isPremium } = useAppContext();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Tappd PRO
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          {isPremium ? 'Welcome to PRO! Enjoy your premium features.' : 'Unlock premium features and supercharge your connections'}
        </p>
      </div>

      {isPremium ? (
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="viewers">Viewers</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="features" className="space-y-6">
            <ProFeaturesList />
          </TabsContent>
          
          <TabsContent value="viewers">
            <WhoViewedMeTab />
          </TabsContent>
          
          <TabsContent value="customize">
            <CustomThirstBadge />
          </TabsContent>
          
          <TabsContent value="themes">
            <ProfileThemes />
          </TabsContent>
        </Tabs>
      ) : (
        <>
          {/* Features Grid */}
          <ProFeaturesList />

          {/* Pricing Plans */}
          <PricingPlans />

          {/* Testimonials */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">What PRO Users Say</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center space-y-2">
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">
                    "Tappd PRO completely changed my dating game. The advanced filters helped me find exactly what I was looking for!"
                  </p>
                  <p className="font-semibold">- Alex, 28</p>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">
                    "Being able to see who viewed my profile was a game changer. Made so many meaningful connections!"
                  </p>
                  <p className="font-semibold">- Jordan, 25</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 space-y-2">
            <p>Cancel anytime • No hidden fees • Secure payment</p>
            <p>Join thousands of PRO users finding better connections</p>
          </div>
        </>
      )}
    </div>
  );
};

export default TappdProScreen;