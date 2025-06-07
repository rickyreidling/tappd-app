import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { UserGrid } from '@/components/UserGrid';
import { PricingSection } from '@/components/PricingSection';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockUsers } from '@/data/mockUsers';
import { Users, CreditCard, Map, Heart } from 'lucide-react';

const AppLayout: React.FC = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [activeTab, setActiveTab] = useState('discover');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white shadow-sm">
            <TabsTrigger value="discover" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Discover</span>
            </TabsTrigger>
            <TabsTrigger value="likes" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>Likes</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center space-x-2">
              <Map className="w-4 h-4" />
              <span>Map</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Upgrade</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover" className="space-y-6">
            <UserGrid 
              users={mockUsers} 
              isPremium={isPremium}
              maxVisible={isPremium ? 999 : 6}
            />
          </TabsContent>
          
          <TabsContent value="likes" className="space-y-6">
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No likes yet</h3>
              <p className="text-gray-600 mb-4">Start browsing to see who likes you!</p>
              <Button onClick={() => setActiveTab('discover')}>
                Start Discovering
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="map" className="space-y-6">
            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
              <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Map View</h3>
              <p className="text-gray-600">See guys near you on an interactive map</p>
              <div className="mt-6 bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <span className="text-gray-500">Map integration coming soon</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="pricing">
            <PricingSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AppLayout;