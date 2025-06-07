import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MessageCircle, Heart, MapPin, Crown } from 'lucide-react';
import { mockUsers } from '@/data/mockUsers';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface ProfileViewScreenProps {
  userId: string;
  onBack: () => void;
  onMessage?: (userId: string) => void;
}

export const ProfileViewScreen: React.FC<ProfileViewScreenProps> = ({
  userId,
  onBack,
  onMessage
}) => {
  const { isPremium } = useAppContext();
  const { toast } = useToast();
  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <p className="text-center mt-8">Profile not found</p>
        </div>
      </div>
    );
  }

  const calculateDistance = () => {
    // Mock distance calculation
    const distances = ['0.5 mi', '1.2 mi', '2.8 mi', '4.1 mi', '6.3 mi'];
    return distances[Math.floor(Math.random() * distances.length)];
  };

  const handleTap = () => {
    toast({ title: `Tapped ${user.name}!`, description: "They'll be notified" });
  };

  const handleMessage = () => {
    onMessage?.(userId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        {/* Header */}
        <div className="absolute top-4 left-4 z-10">
          <Button onClick={onBack} variant="ghost" size="sm" className="bg-white/80">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* Main Photo */}
        <div className="relative h-96 bg-gray-200">
          <img 
            src={user.avatar_url} 
            alt={user.name}
            className="w-full h-full object-cover"
          />
          {user.thirst_mode && (
            <Badge className="absolute top-4 right-4 bg-red-500">
              🔥 Thirst Mode
            </Badge>
          )}
          {isPremium && (
            <Badge className="absolute bottom-4 right-4 bg-yellow-500">
              <Crown className="w-3 h-3 mr-1" />
              PRO
            </Badge>
          )}
        </div>

        {/* Profile Info */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-600">{user.age} years old</p>
              {user.location && (
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {user.location} • {calculateDistance()} away
                  </span>
                </div>
              )}
            </div>
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>

          {/* Bio */}
          {user.bio && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-gray-700">{user.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Photos */}
          {isPremium && user.photos && user.photos.length > 1 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">More Photos</h3>
                <div className="grid grid-cols-3 gap-2">
                  {user.photos.slice(1, 6).map((photo, index) => (
                    <img 
                      key={index}
                      src={photo}
                      alt={`${user.name} photo ${index + 2}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleTap}
              variant="outline" 
              className="flex-1"
            >
              <Heart className="w-4 h-4 mr-2" />
              Tap
            </Button>
            <Button 
              onClick={handleMessage}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};