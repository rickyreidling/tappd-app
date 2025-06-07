import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import MultiPhotoUpload from './MultiPhotoUpload';

interface ProfileFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  onComplete?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, onCancel, onComplete }) => {
  const { userProfile, saveProfile, currentUser, isPremium } = useAppContext();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    display_name: '',
    age: '',
    bio: '',
    pronouns: '',
    body_type: '',
    orientation: '',
    relationship_status: '',
    tribe: '',
    gender_identity: '',
    privacy: 'public',
    looking_for: [] as string[],
    photos: [] as string[],
    social_links: {
      instagram: '',
      twitter: '',
      snapchat: ''
    },
    thirst_mode: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        display_name: userProfile.display_name || userProfile.name || '',
        age: userProfile.age?.toString() || '',
        bio: userProfile.bio || '',
        pronouns: userProfile.pronouns || '',
        body_type: userProfile.body_type || '',
        orientation: userProfile.orientation || '',
        relationship_status: userProfile.relationship_status || '',
        tribe: userProfile.tribe || '',
        gender_identity: userProfile.gender_identity || '',
        privacy: userProfile.privacy || 'public',
        looking_for: userProfile.looking_for || [],
        photos: userProfile.photos || [],
        social_links: userProfile.social_links || { instagram: '', twitter: '', snapchat: '' },
        thirst_mode: userProfile.thirst_mode || false
      });
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!formData.display_name.trim()) {
      toast({
        title: "Display name required",
        description: "Please enter your display name.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const profileData = {
        display_name: formData.display_name,
        name: formData.display_name,
        age: parseInt(formData.age) || null,
        bio: formData.bio,
        pronouns: formData.pronouns,
        body_type: formData.body_type,
        orientation: formData.orientation,
        relationship_status: formData.relationship_status,
        tribe: formData.tribe,
        gender_identity: formData.gender_identity,
        privacy: formData.privacy,
        looking_for: formData.looking_for,
        photos: formData.photos,
        social_links: formData.social_links,
        thirst_mode: formData.thirst_mode
      };

      await saveProfile(profileData);
      
      toast({
        title: "Profile saved!",
        description: "Your profile has been updated successfully.",
      });

      if (onSubmit) onSubmit(profileData);
      if (onComplete) onComplete();
    } catch (error: any) {
      console.error('Profile form error:', error);
      toast({
        title: "Error saving profile",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bodyTypes = ['Slim', 'Athletic', 'Average', 'Muscular', 'Stocky', 'Large', 'Curvy'];
  const tribes = ['Bear', 'Twink', 'Daddy', 'Otter', 'Wolf', 'Jock', 'Leather', 'Pup'];
  const orientations = ['Gay', 'Bi', 'Curious', 'Straight', 'Pansexual', 'Queer'];
  const relationshipStatuses = ['Single', 'Taken', 'Open', 'Married', 'Partnered', 'Complicated'];
  const genderIdentities = ['Male', 'Female', 'Non-binary', 'Trans Male', 'Trans Female', 'Genderfluid', 'Other'];
  const lookingForOptions = ['Chat', 'Dates', 'Friends', 'Hookups', 'LTR', 'Networking'];

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-xl">
      <CardHeader className="text-center pb-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Let's Make You Unforgettable.
        </h1>
        <p className="text-gray-600 text-sm mt-2">
          First impressions matter — but no pressure. Just be you.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <MultiPhotoUpload 
            photos={formData.photos}
            onPhotosChange={(photos) => setFormData(prev => ({ ...prev, photos }))}
            maxPhotos={isPremium ? 10 : 3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="display_name">Display Name *</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              placeholder="Tell people about yourself..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pronouns">Pronouns</Label>
              <Input
                id="pronouns"
                value={formData.pronouns}
                onChange={(e) => setFormData(prev => ({ ...prev, pronouns: e.target.value }))}
                placeholder="he/him, she/her, they/them"
              />
            </div>
            <div>
              <Label>Gender Identity</Label>
              <Select value={formData.gender_identity} onValueChange={(value) => setFormData(prev => ({ ...prev, gender_identity: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select identity" />
                </SelectTrigger>
                <SelectContent>
                  {genderIdentities.map(identity => (
                    <SelectItem key={identity} value={identity}>{identity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Body Type</Label>
              <Select value={formData.body_type} onValueChange={(value) => setFormData(prev => ({ ...prev, body_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select body type" />
                </SelectTrigger>
                <SelectContent>
                  {bodyTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Orientation</Label>
              <Select value={formData.orientation} onValueChange={(value) => setFormData(prev => ({ ...prev, orientation: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select orientation" />
                </SelectTrigger>
                <SelectContent>
                  {orientations.map(orientation => (
                    <SelectItem key={orientation} value={orientation}>{orientation}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Relationship Status</Label>
              <Select value={formData.relationship_status} onValueChange={(value) => setFormData(prev => ({ ...prev, relationship_status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {relationshipStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tribe</Label>
              <Select value={formData.tribe} onValueChange={(value) => setFormData(prev => ({ ...prev, tribe: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your tribe" />
                </SelectTrigger>
                <SelectContent>
                  {tribes.map(tribe => (
                    <SelectItem key={tribe} value={tribe}>{tribe}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Looking For</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {lookingForOptions.map(option => (
                <Badge
                  key={option}
                  variant={formData.looking_for.includes(option) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      looking_for: prev.looking_for.includes(option)
                        ? prev.looking_for.filter(item => item !== option)
                        : [...prev.looking_for, option]
                    }));
                  }}
                >
                  {option}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">🔥 Thirst Mode</Label>
                <p className="text-sm text-gray-600">Show you're feeling frisky</p>
              </div>
              <Switch
                checked={formData.thirst_mode}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, thirst_mode: checked }))}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl text-lg shadow-lg"
            >
              {isLoading ? 'Saving...' : 'Save & Start Tapping'}
            </Button>
            {onCancel && (
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onCancel}
                className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 py-3 rounded-xl font-medium"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;