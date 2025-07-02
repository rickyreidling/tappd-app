import React, { useState, useEffect } from 'react';
import BottomNavigation from './BottomNavigation';
import Explore from './Explore'; // Assuming Explore is now here
import TappdActivityCenter from './TappdActivityCenter';
import ProfilesList from './ProfilesList';

const MainAppUpdated = () => {
  const [activeTab, setActiveTab] = useState<'explore' | 'activity' | 'profiles'>('activity');

  useEffect(() => {
    console.log('🔄 Active tab:', activeTab);
  }, [activeTab]);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'explore':
        return <Explore />;
      case 'activity':
        return <TappdActivityCenter />;
      case 'profiles':
        return <ProfilesList />;
      default:
        return <Explore />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <main className="flex-grow overflow-auto">
        {renderActiveScreen()}
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default MainAppUpdated;
