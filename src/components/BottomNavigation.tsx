import { Home, MessageCircle, User, Crown, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BottomNavigationProps {
  activeTab: 'explore' | 'messages' | 'profile' | 'upgrade' | 'backstage';
  onTabChange: (tab: 'explore' | 'messages' | 'profile' | 'upgrade' | 'backstage') => void;
  isPro: boolean;
}

export function BottomNavigation({ activeTab, onTabChange, isPro }: BottomNavigationProps) {
  const navItems = [
    {
      id: 'explore' as const,
      label: 'Explore',
      icon: Home,
      show: true
    },
    {
      id: 'messages' as const,
      label: 'Messages',
      icon: MessageCircle,
      show: true
    },
    {
      id: 'profile' as const,
      label: 'My Profile',
      icon: User,
      show: true
    },
    {
      id: 'upgrade' as const,
      label: 'Tappd PRO',
      icon: Crown,
      show: !isPro
    },
    {
      id: 'backstage' as const,
      label: 'Backstage',
      icon: Crown,
      show: isPro
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.filter(item => item.show).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isUpgrade = item.id === 'upgrade';
          const isBackstage = item.id === 'backstage';
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                isActive
                  ? 'text-purple-600'
                  : isUpgrade
                  ? 'text-yellow-600'
                  : isBackstage
                  ? 'text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              } ${
                isBackstage ? 'animate-pulse' : ''
              }`}
            >
              <div className="relative">
                {isBackstage ? (
                  <div className="relative">
                    <Icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
                    <Sparkles className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
                    <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-sm animate-pulse" />
                  </div>
                ) : (
                  <Icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
                )}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full" />
                )}
              </div>
              
              {isUpgrade ? (
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black border-0 text-xs px-2 py-0.5">
                  {item.label}
                </Badge>
              ) : isBackstage ? (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs px-2 py-0.5 shadow-lg">
                  {item.label}
                </Badge>
              ) : (
                <span className={`text-xs font-medium ${
                  isActive ? 'text-purple-600' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}