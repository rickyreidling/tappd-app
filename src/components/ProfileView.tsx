import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Shield, Flag, ArrowLeft, MapPin, Edit } from 'lucide-react';
import { Profile } from '@/types/profile';
import { User } from '@/types/user';
import ProfileActions from './ProfileActions';

interface ProfileViewProps {
  user?: User;
  profile?: Profile;
  onBack?: () => void;
  onStartChat?: () => void;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  profile,
  onBack,
  onStartChat,
  isFavorited,
  onFavoriteToggle
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [liked, setLiked] = useState(isFavorited || false);

  const displayData = user || profile;
  if (!displayData) return null;

  const handleLike = () => {
    setLiked(!liked);
    if (onFavoriteToggle) onFavoriteToggle();
  };

  const photos = user?.photos || profile?.photos || [];
  const name = user?.name || profile?.name || profile?.display_name || '';
  const age = user?.age || profile?.age || 0;
  const bio = user?.bio || profile?.bio || '';
  const location = user?.location || profile?.location || '';
  const distance = user?.distance || profile?.distance;
  const userId = user?.id || profile?.user_id || '';

  const nextPhoto = () => {
    if (photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white">
      <Card className="border-0 shadow-lg bg-white dark:bg-zinc-900">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4 border-b bg-white dark:bg-zinc-900 dark:border-zinc-700">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h2 className="font-semibold">Profile</h2>
            <ProfileActions userId={userId} userName={name} />
          </div>

          <div className="relative aspect-square bg-gray-100 dark:bg-zinc-800">
            {photos.length > 0 ? (
              <>
                <img
                  src={photos[currentPhotoIndex]}
                  alt={name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={nextPhoto}
                />
                {photos.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {photos.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 w-2 rounded-full ${
                          index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                    {name[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>

          <div className="p-4 space-y-4 bg-white dark:bg-zinc-900">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">
                  {name}{age ? `, ${age}` : ''}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={liked ? 'text-red-500' : 'text-gray-400 dark:text-gray-300'}
                >
                  <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                </Button>
              </div>

              {location && (
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">
                    {location} {distance && `• ${distance}km away`}
                  </span>
                </div>
              )}
            </div>

            {bio && (
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{bio}</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-white dark:bg-zinc-900 dark:border-zinc-700">
            <Button
              onClick={onStartChat}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileView;
