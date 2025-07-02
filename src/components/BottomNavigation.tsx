import React from 'react';
import { Compass, MessageCircle, Activity, User, Crown } from 'lucide-react';

const BottomNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'upgrade', label: 'Pro', icon: Crown }
  ];

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    
    // 🔧 Force refresh MessagesScreen when Messages tab is clicked
    if (tabId === 'messages') {
      setTimeout(() => {
        if (window.refreshMessages) {
          console.log('🔄 Forcing Messages refresh from BottomNavigation');
          window.refreshMessages();
        }
      }, 100);
    }
  };

  return (
    <nav className="flex justify-around py-2 border-t border-white/10 bg-black text-white">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex flex-col items-center gap-1 text-xs ${
              activeTab === tab.id ? 'text-white' : 'text-gray-500'
            }`}
          >
            <Icon className="w-5 h-5" />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;