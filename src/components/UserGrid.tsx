import React, { useState } from 'react';
import { UserCard } from '@/components/UserCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Profile } from '@/types/profile';
import { Lock, Eye, Crown } from 'lucide-react';

interface UserGridProps {
  users: Profile[];
  onUserClick?: (user: Profile) => void;
  viewMode?: 'grid' | 'list';
  isPremium?: boolean;
  maxVisible?: number;
}

export const UserGrid: React.FC<UserGridProps> = ({ 
  users, 
  onUserClick,
  viewMode = 'grid',
  isPremium = false, 
  maxVisible = 10 
}) => {
  const [showUpgrade, setShowUpgrade] = useState(false);
  
  const visibleUsers = isPremium ? users : users.slice(0, maxVisible);
  const hiddenCount = users.length - visibleUsers.length;
  
  const handleUserClick = (user: Profile) => {
    if (onUserClick) {
      onUserClick(user);
    }
  };
  
  const handleUpgrade = () => {
    setShowUpgrade(true);
  };
  
  const gridClass = viewMode === 'grid' 
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
    : 'space-y-4';
  
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-gray-900">Nearby Guys</h2>
          <Badge className="bg-gradient-to-r from-green-400 to-blue-400 text-white">
            <Eye className="w-3 h-3 mr-1" />
            {users.filter(u => u.is_online).length} online
          </Badge>
        </div>
        
        {!isPremium && (
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            Free Plan: {maxVisible} profiles max
          </Badge>
        )}
      </div>
      
      <div className={gridClass}>
        {visibleUsers.map((user) => (
          <UserCard 
            key={user.id} 
            user={user} 
            onClick={() => handleUserClick(user)}
            viewMode={viewMode}
          />
        ))}
        
        {!isPremium && hiddenCount > 0 && (
          <div className={viewMode === 'grid' ? 'col-span-full' : ''}>
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-dashed border-purple-300 rounded-lg p-8 text-center">
              <Lock className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {hiddenCount} more guys nearby
              </h3>
              <p className="text-gray-600 mb-4">
                Upgrade to see all profiles and get unlimited access
              </p>
              <Button 
                onClick={handleUpgrade}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};