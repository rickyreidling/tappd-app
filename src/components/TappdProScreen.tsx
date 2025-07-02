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
    <div className="min-h-screen bg-white pb-20 max-h-screen overflow-y-auto">
      {/* Header */}
      <div className="text-center space-y-2 pt-6 pb-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Crown className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            PRO Features
          </h1>
        </div>
        <p className="text-gray-600 text-lg px-6">
          {isPremium ? 'Welcome to PRO! Enjoy your premium features.' : 'Unlock premium features and supercharge your connections'}
        </p>
      </div>

      <div className="px-6 space-y-6">
        {isPremium ? (
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="viewers">Viewers</TabsTrigger>
              <TabsTrigger value="customize">Customize</TabsTrigger>
              <TabsTrigger value="themes">Themes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="space-y-6">
              {/* Yellow gradient wrapper around features */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-6 border-2 border-yellow-200">
                <ProFeaturesList />
              </div>
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
            {/* Features Grid with Yellow Gradient */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-4 border-2 border-yellow-200">
              <ProFeaturesList />
            </div>

            {/* Pricing Plans */}
            <div>
              <PricingPlans />
            </div>

            {/* Testimonials */}
            <Card className="shadow-lg border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-center text-xl">What PRO Users Say</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center space-y-2">
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 italic text-sm">
                      "Tappd PRO completely changed my dating game. The advanced filters helped me find exactly what I was looking for!"
                    </p>
                    <p className="font-semibold text-sm">- Alex, 28</p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 italic text-sm">
                      "Being able to see who viewed my profile was a game changer. Made so many meaningful connections!"
                    </p>
                    <p className="font-semibold text-sm">- Jordan, 25</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 space-y-1 pb-4">
              <p>Cancel anytime • No hidden fees • Secure payment</p>
              <p>Join thousands of PRO users finding better connections</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TappdProScreen;