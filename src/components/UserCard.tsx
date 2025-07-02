import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user';
import { MapPin, Clock, Verified, Star } from 'lucide-react';

interface UserCardProps {
  user: User;
  onClick?: () => void;
  onInteraction?: (userId: string, type: string) => void;
  showInteractions?: boolean;
  nameClassName?: string;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onClick,
  onInteraction,
  showInteractions = true,
  nameClassName = 'text-xl font-bold text-gray-900 truncate' // Fallback style
}) => {
  const handleInteraction = (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
    onInteraction?.(user.id, type);
  };

  const getCardClass = () => {
    let baseClass = 'p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border-2';

    if (user.thirstMode) {
      baseClass += ' bg-gradient-to-br from-red-50 to-orange-50 border-red-200 hover:border-red-300';
    } else if (user.premium) {
      baseClass += ' bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:border-purple-300';
    } else {
      baseClass += ' bg-white border-gray-200 hover:border-gray-300';
    }

    return baseClass;
  };

  return (
    <Card className={getCardClass()} onClick={onClick}>
      <div className="flex items-start space-x-3">
        <div className="relative">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.avatar || user.photos?.[0]} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {user.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
          )}
          {user.thirstMode && (
            <div className="absolute -top-2 -right-2 text-red-500">🔥</div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className={nameClassName}>
              {user.name}, {user.age}
            </h3>
            {user.verified && <Verified className="w-4 h-4 text-blue-500" />}
            {user.premium && <Star className="w-4 h-4 text-yellow-500" />}
          </div>

          <div className="flex items-center text-sm text-gray-600 mt-1">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{user.distance}km away</span>
            {!user.isOnline && user.lastSeen && (
              <>
                <Clock className="w-3 h-3 ml-2 mr-1" />
                <span>{user.lastSeen}</span>
              </>
            )}
          </div>

          {user.thirstMode && (
            <Badge variant="destructive" className="text-xs mt-1">
              🔥 Feeling Frisky
            </Badge>
          )}

          <div className="flex flex-wrap gap-1 mt-2">
            {user.tribe && (
              <Badge variant="outline" className="text-xs">{user.tribe}</Badge>
            )}
            {user.bodyType && (
              <Badge variant="outline" className="text-xs">{user.bodyType}</Badge>
            )}
          </div>

          {user.bio && (
            <p className="text-sm text-gray-700 mt-2 line-clamp-2">{user.bio}</p>
          )}
        </div>
      </div>

      {showInteractions && (
        <div className="flex justify-center space-x-2 mt-4 pt-3 border-t border-gray-100">
          <Button size="sm" variant="outline" onClick={(e) => handleInteraction(e, 'tap')} className="flex-1">
            👋 Tap
          </Button>
          <Button size="sm" variant="outline" onClick={(e) => handleInteraction(e, 'like')} className="flex-1">
            ❤️ Like
          </Button>
          <Button size="sm" variant="outline" onClick={(e) => handleInteraction(e, 'woof')} className="flex-1">
            🐺 Woof
          </Button>
          <Button size="sm" variant="outline" onClick={(e) => handleInteraction(e, 'flame')} className="flex-1">
            🔥 Flame
          </Button>
        </div>
      )}
    </Card>
  );
};
