import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit, MapPin, Calendar, Heart, Users, Settings, Crown } from 'lucide-react';
import EditProfileScreen from './EditProfileScreen';

const ProfileScreen: React.FC = () => {
  const { userProfile, isPremium } = useAppContext();
  const [showEditProfile, setShowEditProfile] = useState(false);

  if (showEditProfile) {
    return (
      <EditProfileScreen 
        onBack={() => setShowEditProfile(false)}
        onSave={() => {
          setShowEditProfile(false);
          // Refresh profile data here
        }}
      />
    );
  }

  if (!userProfile) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Profile not found
              </h3>
              <p className="text-gray-500">
                Please complete your profile setup
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Profile</h2>
        <Button 
          onClick={() => setShowEditProfile(true)}
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userProfile.photos?.[0]} />
                <AvatarFallback className="text-2xl">
                  {userProfile.displayName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              {isPremium && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-1 rounded-full">
                  <Crown className="w-4 h-4" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold">{userProfile.displayName}</h3>
                {userProfile.age && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {userProfile.age}
                  </Badge>
                )}
              </div>
              
              {userProfile.location && (
                <div className="flex items-center gap-1 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{userProfile.location}</span>
                </div>
              )}
              
              {userProfile.bio && (
                <p className="text-gray-700 mb-4">{userProfile.bio}</p>
              )}
              
              <div className="flex flex-wrap gap-2">
                {userProfile.pronouns && (
                  <Badge variant="outline">{userProfile.pronouns}</Badge>
                )}
                {userProfile.orientation && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {userProfile.orientation}
                  </Badge>
                )}
                {userProfile.lookingFor && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {userProfile.lookingFor}
                  </Badge>
                )}
                {userProfile.bodyType && (
                  <Badge variant="outline">{userProfile.bodyType}</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interests/Tags */}
      {userProfile.interests && userProfile.interests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userProfile.interests.map((interest, index) => (
                <Badge key={index} className="bg-purple-100 text-purple-800">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Social Links */}
      {userProfile.socialLinks && Object.keys(userProfile.socialLinks).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(userProfile.socialLinks).map(([platform, url]) => (
                url && (
                  <div key={platform} className="flex items-center justify-between">
                    <span className="capitalize font-medium">{platform}</span>
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      View Profile
                    </a>
                  </div>
                )
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Thirst Mode</span>
              <Badge className={userProfile.thirstMode ? 'bg-red-500' : 'bg-gray-500'}>
                {userProfile.thirstMode ? '🔥 ON' : 'OFF'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Account Type</span>
              <Badge className={isPremium ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' : 'bg-gray-200'}>
                {isPremium ? 'PRO' : 'FREE'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileScreen;