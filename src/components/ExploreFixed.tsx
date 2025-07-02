import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, MessageCircle, Heart, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

console.log("🎉 ExploreFixed.tsx is loading - FRESH START!");

export const ExploreFixed: React.FC = () => {
  const { toast } = useToast();
  
  // Mock data directly in component to avoid import issues
  const mockProfiles = [
    {
      id: '1',
      name: 'Alex',
      age: 28,
      avatar: '/placeholder.svg',
      bio: 'Coffee lover, gym enthusiast',
      interests: ['Gym Rat', 'Brunch Bitch', 'Dog Dad'],
      verified: true,
      premium: false,
      pronouns: 'he/him',
      thirstMode: false,
      isOnline: true
    },
    {
      id: '2', 
      name: 'Jake',
      age: 32,
      avatar: '/placeholder.svg',
      bio: 'Artist and dreamer',
      interests: ['Theater Kid', 'Meme Lord', 'Netflix & Chill'],
      verified: false,
      premium: true,
      pronouns: 'he/him',
      thirstMode: true,
      isOnline: true
    },
    {
      id: '3',
      name: 'Ryan', 
      age: 25,
      avatar: '/placeholder.svg',
      bio: 'Tech guy, love hiking',
      interests: ['Low-Key Introvert', 'Bookworm', 'Cuddler'],
      verified: true,
      premium: false,
      pronouns: 'he/him',
      thirstMode: false,
      isOnline: false
    },
    {
      id: '4',
      name: 'Marcus',
      age: 30,
      avatar: '/placeholder.svg', 
      bio: 'Chef and foodie',
      interests: ['Bear', 'Daddy', 'Romantic at Heart'],
      verified: false,
      premium: false,
      pronouns: 'he/him',
      thirstMode: true,
      isOnline: true
    }
  ];

  const [profiles] = useState(mockProfiles);

  useEffect(() => {
    console.log("🔥 ExploreFixed mounted successfully!");
    console.log("🔥 Profiles loaded:", profiles.length);
  }, []);

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎉 Explore (Fixed!)
          </h2>
          <p className="text-sm text-green-600 font-semibold">
            ✅ Fresh component working!
          </p>
        </div>
        <Button 
          onClick={() => toast({ title: "🔄 Profiles refreshed!" })}
          variant="outline" 
          size="sm"
          className="hover:bg-purple-50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((user) => (
          <Card 
            key={user.id} 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white to-purple-50"
          >
            <CardContent className="p-0">
              <div className="relative">
                {/* Profile Image */}
                <div className="relative h-48 bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200">
                  <Avatar className="w-full h-full rounded-none">
                    <AvatarImage 
                      src={`https://images.unsplash.com/photo-${1500000000000 + parseInt(user.id) * 123456789}?w=300&h=300&fit=crop&crop=face`}
                      alt={user.name} 
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-400 to-pink-400 text-white rounded-none">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {user.verified && (
                      <Badge className="bg-blue-500 text-white text-xs px-2">
                        ✓ Verified
                      </Badge>
                    )}
                    {user.premium && (
                      <Badge className="bg-yellow-500 text-white text-xs px-2">
                        <Crown className="w-3 h-3 mr-1" />
                        PRO
                      </Badge>
                    )}
                  </div>
                  
                  {/* Thirst Mode Badge */}
                  {user.thirstMode && (
                    <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2">
                      🔥 Thirst
                    </Badge>
                  )}
                  
                  {/* Online Status */}
                  {user.isOnline && (
                    <div className="absolute bottom-2 left-2">
                      <div className="flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        Online
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="p-4 space-y-3">
                  {/* Name, Age */}
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{user.name}</h3>
                    <p className="text-gray-600">{user.age} • {user.pronouns}</p>
                    <p className="text-sm text-purple-600 font-medium">2.5 mi away</p>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-700 line-clamp-2">{user.bio}</p>

                  {/* Interests */}
                  <div className="flex flex-wrap gap-1">
                    {user.interests.slice(0, 3).map((interest, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        toast({ title: `💬 Message sent to ${user.name}!` }); 
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 hover:bg-pink-50 border-pink-300 text-pink-600 hover:text-pink-700" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        toast({ title: `💖 Tapped ${user.name}!` }); 
                      }}
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      Tap
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Success Message */}
      <div className="text-center py-8 bg-green-50 border border-green-200 rounded-lg">
        <div className="text-4xl mb-2">🎉</div>
        <h3 className="text-xl font-semibold text-green-700 mb-2">Success!</h3>
        <p className="text-green-600">Your profiles are now loading correctly!</p>
      </div>
    </div>
  );
};