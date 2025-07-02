import { User } from '@/types/user';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Crown, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface ExploreCardProps {
  user: User;
  onProfileClick: (user: User) => void;
  onFavoriteClick: (userId: string) => void;
  isFavorited: boolean;
  locationEnabled?: boolean;
}

export function ExploreCard({ user, onProfileClick, onFavoriteClick, isFavorited, locationEnabled = false }: ExploreCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const distance = locationEnabled && user.distance ? 
    (user.distance < 1 ? 'Nearby' : `${user.distance}mi`) : 
    'Nearby';
  const topInterest = user.interests[0] || 'Exploring';

  return (
    <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
      <div onClick={() => onProfileClick(user)} className="p-0">
        {/* Profile Photo */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={user.avatar}
            alt={user.name}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 animate-pulse" />
          )}
          
          {/* PRO Badge */}
          {user.premium && (
            <div className="absolute top-1 left-1">
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black border-0 text-xs px-1.5 py-0.5 flex items-center">
                <Crown className="w-2.5 h-2.5 mr-0.5" />
                PRO
              </Badge>
            </div>
          )}

          {/* ⋯ Three-dot Menu */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 z-10">
            <button
              className="p-1 rounded-full bg-white/80 backdrop-blur-md text-gray-700 hover:bg-gray-100 shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                // You can hook this to a dropdown or menu logic later
                alert(`Options for ${user.name}`);
              }}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteClick(user.id);
            }}
            className={`absolute top-1 right-1 p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 ${
              isFavorited 
                ? 'bg-red-500/90 text-white shadow-lg' 
                : 'bg-white/90 text-gray-600 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <Heart className={`w-3 h-3 ${isFavorited ? 'fill-current animate-pulse' : ''}`} />
          </button>
        </div>
        
        {/* Card Content */}
        <div className="p-2 space-y-1">
          {/* Name and Age */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 truncate">{user.name}</h3>
            <span className="text-gray-600 text-sm">{user.age}</span>
          </div>

          {/* Distance */}
          <p className="text-gray-500 text-xs">{distance}</p>

          {/* Top Interest */}
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 text-xs px-1.5 py-0.5 w-fit">
            {topInterest}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
