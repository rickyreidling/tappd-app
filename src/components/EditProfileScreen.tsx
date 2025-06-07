import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PhotoUpload from '@/components/PhotoUpload';

interface EditProfileScreenProps {
  onBack: () => void;
  onSave: () => void;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ onBack, onSave }) => {
  const { userProfile, updateProfile } = useAppContext();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: userProfile?.display_name || '',
    age: userProfile?.age?.toString() || '',
    bio: userProfile?.bio || '',
    pronouns: userProfile?.pronouns || '',
    orientation: userProfile?.orientation || '',
    lookingFor: userProfile?.looking_for || '',
    bodyType: userProfile?.body_type || '',
    location: userProfile?.location || '',
    thirstMode: userProfile?.thirst_mode || false,
    interests: userProfile?.interests || [],
    socialLinks: userProfile?.social_links || {},
    avatarUrl: userProfile?.avatar_url || ''
  });
  const [newInterest, setNewInterest] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      toast({ title: 'Profile updated successfully!' });
      onSave();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({ 
        title: 'Error updating profile', 
        description: error.message || 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-2xl font-bold">Edit Profile</h2>
      </div>

      {/* Profile Photo */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <PhotoUpload 
            currentPhoto={formData.avatarUrl}
            onPhotoChange={(url) => handleInputChange('avatarUrl', url)}
            size="lg"
          />
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              placeholder="Your display name"
            />
          </div>
          
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              placeholder="Your age"
            />
          </div>
          
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, State"
            />
          </div>
        </CardContent>
      </Card>

      {/* Identity */}
      <Card>
        <CardHeader>
          <CardTitle>Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Pronouns</Label>
            <Select value={formData.pronouns} onValueChange={(value) => handleInputChange('pronouns', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select pronouns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="he/him">he/him</SelectItem>
                <SelectItem value="she/her">she/her</SelectItem>
                <SelectItem value="they/them">they/them</SelectItem>
                <SelectItem value="he/they">he/they</SelectItem>
                <SelectItem value="she/they">she/they</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Orientation</Label>
            <Select value={formData.orientation} onValueChange={(value) => handleInputChange('orientation', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select orientation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gay">Gay</SelectItem>
                <SelectItem value="lesbian">Lesbian</SelectItem>
                <SelectItem value="bisexual">Bisexual</SelectItem>
                <SelectItem value="pansexual">Pansexual</SelectItem>
                <SelectItem value="queer">Queer</SelectItem>
                <SelectItem value="questioning">Questioning</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Looking For</Label>
            <Select value={formData.lookingFor} onValueChange={(value) => handleInputChange('lookingFor', value)}>
              <SelectTrigger>
                <SelectValue placeholder="What are you looking for?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friends">Friends</SelectItem>
                <SelectItem value="dating">Dating</SelectItem>
                <SelectItem value="hookups">Hookups</SelectItem>
                <SelectItem value="relationship">Relationship</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Body Type</Label>
            <Select value={formData.bodyType} onValueChange={(value) => handleInputChange('bodyType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select body type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slim">Slim</SelectItem>
                <SelectItem value="athletic">Athletic</SelectItem>
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="muscular">Muscular</SelectItem>
                <SelectItem value="curvy">Curvy</SelectItem>
                <SelectItem value="plus-size">Plus Size</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Interests/Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Interests & Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add an interest (e.g., kink, poly, vibes)"
              onKeyPress={(e) => e.key === 'Enter' && addInterest()}
            />
            <Button onClick={addInterest} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {formData.interests.map((interest, index) => (
              <div key={index} className="flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                <span>{interest}</span>
                <button onClick={() => removeInterest(interest)}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Thirst Mode</Label>
              <p className="text-sm text-gray-600">Show up in the 🔥 Thirst tab</p>
            </div>
            <Switch
              checked={formData.thirstMode}
              onCheckedChange={(checked) => handleInputChange('thirstMode', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={loading} className="flex-1">
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default EditProfileScreen;