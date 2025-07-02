import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { SettingsScreen } from './SettingsScreen';
import { 
  Camera, 
  Plus, 
  X, 
  MapPin, 
  Heart, 
  Star, 
  Settings,
  Sparkles,
  Crown,
  Zap,
  Shield
} from 'lucide-react';

interface ProfileFormProps {
  onComplete?: () => void;
  showSettingsButton?: boolean; // NEW: Control settings button visibility
}

export default function ProfileForm({ onComplete, showSettingsButton = false }: ProfileFormProps) {
  const { toast } = useToast();
  const { currentUser, userProfile, isPremium } = useAppContext();
  const [showSettings, setShowSettings] = useState(false);

  // Photo limits based on subscription
  const photoLimit = isPremium ? 10 : 3;

  // Form state
  const [formData, setFormData] = useState({
    displayName: '',
    age: '',
    bio: '',
    location: '',
    interests: [],
    lookingFor: [],
    orientation: '',
    tribe: '',
    bodyType: '',
    height: '',
    weight: '',
    relationship: '',
    pronouns: '',
    position: '',
    ethnicity: '',
    bodyHair: '',
    smoking: '',
    drinking: '',
    drugs: '',
    hivStatus: '',
    prepStatus: '',
    lastTested: '',
    saferSex: [],
    meetAt: '',
    genderIdentity: '',
    acceptsNSFW: ''
  });

  const [photos, setPhotos] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');

  // Load saved profile data on component mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      const savedPhotos = localStorage.getItem('userPhotos');
      
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        console.log('📂 Loading saved profile:', profileData);
        setFormData(profileData);
      } else if (userProfile) {
        // Fallback to AppContext data
        setFormData({
          displayName: userProfile?.display_name || '',
          age: userProfile?.age || '',
          bio: userProfile?.bio || '',
          location: userProfile?.location || '',
          interests: userProfile?.interests || [],
          lookingFor: userProfile?.looking_for || [],
          orientation: userProfile?.orientation || '',
          tribe: userProfile?.tribe || '',
          bodyType: userProfile?.body_type || '',
          height: userProfile?.height || '',
          weight: userProfile?.weight || '',
          relationship: userProfile?.relationship_status || '',
          pronouns: userProfile?.pronouns || '',
          position: userProfile?.position || '',
          ethnicity: userProfile?.ethnicity || '',
          bodyHair: userProfile?.body_hair || '',
          smoking: userProfile?.smoking || '',
          drinking: userProfile?.drinking || '',
          drugs: userProfile?.drugs || '',
          hivStatus: userProfile?.hiv_status || '',
          prepStatus: userProfile?.prep_status || '',
          lastTested: userProfile?.last_tested || '',
          saferSex: userProfile?.safer_sex || [],
          meetAt: userProfile?.meet_at || '',
          genderIdentity: userProfile?.gender_identity || '',
          acceptsNSFW: userProfile?.accepts_nsfw || ''
        });
      }
      
      if (savedPhotos) {
        const photosData = JSON.parse(savedPhotos);
        console.log('📸 Loading saved photos:', photosData.length);
        setPhotos(photosData);
      }
    } catch (error) {
      console.error('❌ Error loading saved profile:', error);
    }
  }, [userProfile]);

  // Handle subscription downgrades - limit photos if user goes from premium to free
  useEffect(() => {
    if (!isPremium && photos.length > 3) {
      setPhotos(prev => prev.slice(0, 3));
      toast({
        title: "Photos limited to 3",
        description: "Upgrade to Pro for up to 10 photos!",
        variant: "destructive"
      });
    }
  }, [isPremium, photos.length, toast]);

  // Popular interests/tags
  const popularInterests = [
    'Fitness', 'Travel', 'Photography', 'Music', 'Movies', 'Gaming',
    'Cooking', 'Art', 'Books', 'Hiking', 'Dancing', 'Fashion',
    'Tech', 'Sports', 'Yoga', 'Coffee', 'Wine', 'Pets',
    'Beach', 'Mountains', 'Festivals', 'Theater', 'Volunteering',
    'Drag', 'Bears', 'Leather', 'Pups', 'Kink', 'Photography'
  ];

  // Comprehensive dropdown options based on Grindr/Scruff research
  const orientationOptions = ['Gay', 'Bi', 'Pan', 'Queer', 'Questioning', 'Fluid', 'Demisexual', 'Asexual', 'Other'];
  
  const tribeOptions = ['Twink', 'Bear', 'Otter', 'Daddy', 'Jock', 'Leather', 'Pup', 'Muscle', 'Cub', 'Wolf', 
    'Geek', 'Rugged', 'Discreet', 'Drag', 'Trans', 'Femme', 'Butch', 'Vers', 'Clean-Cut', 'College', 'Military', 'Other'];
  
  const bodyTypeOptions = ['Slim', 'Athletic', 'Fit', 'Average', 'Muscular', 'Large', 'Stocky', 'Toned', 'Big & Beautiful', 'Heavyset'];
  
  const relationshipOptions = ['Single', 'Open Relationship', 'Partnered', 'Married', 'It\'s Complicated', 'Exploring', 
    'Polyamorous', 'Dating', 'Committed', 'Divorced', 'Widowed'];
  
  const positionOptions = ['Top', 'Versatile Top', 'Versatile', 'Versatile Bottom', 'Bottom', 'Side', 'Ask Me', 'Oral Only'];
  
  const pronounOptions = ['He/Him', 'They/Them', 'She/Her', 'He/They', 'She/They', 'Ask Me', 'Any Pronouns', 'Other'];
  
  const ethnicityOptions = ['Asian', 'Black/African', 'Latino/Hispanic', 'White/Caucasian', 'Native American', 
    'Pacific Islander', 'Middle Eastern', 'South Asian', 'Mixed Race', 'Other', 'Prefer not to say'];
  
  const bodyHairOptions = ['Smooth', 'Little', 'Some', 'Natural', 'Furry', 'Trimmed', 'Ask Me'];
  
  const smokingOptions = ['Non-smoker', 'Socially', 'Regularly', 'Trying to quit', 'Ask Me'];
  
  const drinkingOptions = ['Non-drinker', 'Socially', 'Regularly', 'Rarely', 'Ask Me'];
  
  const drugsOptions = ['Never', 'Socially', 'Regularly', '420 Friendly', 'Ask Me', 'Prefer not to say'];
  
  const hivStatusOptions = ['Negative', 'Positive', 'Undetectable', 'Ask Me', 'Prefer not to say'];
  
  const prepStatusOptions = ['On PrEP', 'Not on PrEP', 'Considering PrEP', 'Ask Me', 'N/A'];
  
  const lastTestedOptions = ['Within 3 months', '3-6 months ago', '6-12 months ago', 'Over a year ago', 'Never tested', 'Prefer not to say'];
  
  const saferSexOptions = ['Condoms always', 'Condoms sometimes', 'PrEP user', 'Undetectable', 'Monogamous', 'Ask Me'];
  
  const meetAtOptions = ['My place', 'Your place', 'Hotel', 'Public first', 'Anywhere', 'Ask Me'];
  
  const genderIdentityOptions = ['Man', 'Cis Man', 'Trans Man', 'Woman', 'Cis Woman', 'Trans Woman', 
    'Non-Binary', 'Non-Conforming', 'Queer', 'Genderfluid', 'Agender', 'Two-Spirit', 'Other'];
  
  const acceptsNSFWOptions = ['Yes', 'No', 'Ask first', 'Friends only'];
  
  const lookingForOptions = ['Friends', 'Dates', 'Relationship', 'Networking', 'Fun', 'Chat', 'Now', 'Today', 
    'This week', 'Hookups', 'FWB', 'Long-term', 'Marriage', 'Activity partner'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value) 
        ? (prev[field as keyof typeof prev] as string[]).filter((item: string) => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  const addInterest = (interest: string) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
    setNewInterest('');
  };

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (photos.length + files.length > photoLimit) {
      toast({
        title: `Photo limit reached!`,
        description: `${isPremium ? 'Pro users' : 'Free users'} can upload up to ${photoLimit} photos. ${!isPremium ? 'Upgrade to Pro for 10 photos!' : ''}`,
        variant: "destructive"
      });
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhotos(prev => {
          if (prev.length < photoLimit) {
            return [...prev, result];
          }
          return prev;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Save profile data to localStorage
      const profileData = {
        ...formData,
        photos: photos,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      
      // Also save individual pieces that might be used elsewhere
      localStorage.setItem('userDisplayName', formData.displayName);
      localStorage.setItem('userAge', formData.age);
      localStorage.setItem('userPhotos', JSON.stringify(photos));
      
      console.log('✅ Profile saved:', profileData);
      
      toast({
        title: "Profile updated! ✨",
        description: "Your fabulous profile has been saved successfully!"
      });
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      toast({
        title: "Oops! Something went wrong",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const DropdownField = ({ label, value, options, field, placeholder = "Select..." }: {
    label: string;
    value: string;
    options: string[];
    field: string;
    placeholder?: string;
  }) => (
    <div>
      <Label className="text-sm font-semibold text-gray-700">{label}</Label>
      <select
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full mt-2 p-3 border border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white text-gray-900 shadow-sm"
        style={{ colorScheme: 'light' }}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  const MultiSelectField = ({ label, selectedValues, options, field, placeholder = "Select..." }: {
    label: string;
    selectedValues: string[];
    options: string[];
    field: string;
    placeholder?: string;
  }) => (
    <div>
      <Label className="text-sm font-semibold text-gray-700">{label}</Label>
      <div className="mt-2 p-3 border border-purple-200 rounded-lg bg-white min-h-[48px] flex flex-wrap gap-2">
        {selectedValues.map(value => (
          <Badge 
            key={value} 
            className="bg-purple-500 text-white cursor-pointer hover:bg-purple-600"
            onClick={() => handleMultiSelect(field, value)}
          >
            {value} ×
          </Badge>
        ))}
        <select
          onChange={(e) => {
            if (e.target.value) {
              handleMultiSelect(field, e.target.value);
              e.target.value = '';
            }
          }}
          className="border-0 outline-0 bg-transparent flex-1 min-w-[120px] text-gray-900"
          style={{ colorScheme: 'light' }}
        >
          <option value="">{placeholder}</option>
          {options.filter(option => !selectedValues.includes(option)).map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700">
      {/* Show Settings Screen if open */}
      {showSettings && (
        <SettingsScreen onClose={() => setShowSettings(false)} />
      )}
      
      {/* Main Profile Form */}
      {!showSettings && (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="relative rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500 p-6 text-white overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl">🏳️‍🌈</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Tappd</h1>
                  <p className="text-white/80 text-sm">Let's Make You Unforgettable 🔥</p>
                </div>
              </div>
              
              {/* Settings Button - Only show if showSettingsButton prop is true */}
              {showSettingsButton && (
                <Button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-200"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              )}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-white/90">First impressions matter ✨</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photos */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-600" />
                  Profile Photos
                  <Badge className={`${isPremium ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'} text-white`}>
                    {isPremium ? (
                      <>
                        <Crown className="w-3 h-3 mr-1" />
                        Up to 10 (Pro)
                      </>
                    ) : (
                      'Up to 3 (Free)'
                    )}
                  </Badge>
                </h2>
                <p className="text-gray-600">
                  Show your best self! First photo will be your main pic.
                  {!isPremium && (
                    <span className="block text-purple-600 font-medium mt-1">
                      💎 Upgrade to Pro for up to 10 photos!
                    </span>
                  )}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={photo} 
                        alt={`Profile ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <Badge className="absolute bottom-2 left-2 bg-purple-600">
                          Main
                        </Badge>
                      )}
                    </div>
                  ))}
                  
                  {photos.length < photoLimit && (
                    <label className="border-2 border-dashed border-purple-300 rounded-lg h-40 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors bg-purple-50">
                      <Plus className="w-8 h-8 text-purple-400 mb-2" />
                      <span className="text-purple-600 font-medium">Add Photo</span>
                      <span className="text-xs text-purple-400">{photos.length}/{photoLimit}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-600" />
                  About You
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="displayName">Display Name *</Label>
                    <Input
                      id="displayName"
                      value={formData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      placeholder="How should people know you?"
                      className="border-purple-200 focus:border-purple-500"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="25"
                      className="border-purple-200 focus:border-purple-500"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself... What makes you unique? 🌟"
                    rows={4}
                    className="border-purple-200 focus:border-purple-500 resize-none"
                    style={{ colorScheme: 'light' }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.bio.length}/500 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, State"
                      className="pl-10 border-purple-200 focus:border-purple-500"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Identity & Preferences */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-600" />
                  Identity & Preferences
                </h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DropdownField
                    label="Gender Identity"
                    value={formData.genderIdentity}
                    options={genderIdentityOptions}
                    field="genderIdentity"
                    placeholder="Select gender identity..."
                  />

                  <DropdownField
                    label="Pronouns"
                    value={formData.pronouns}
                    options={pronounOptions}
                    field="pronouns"
                    placeholder="Select pronouns..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DropdownField
                    label="Sexual Orientation"
                    value={formData.orientation}
                    options={orientationOptions}
                    field="orientation"
                    placeholder="Select orientation..."
                  />

                  <DropdownField
                    label="Ethnicity"
                    value={formData.ethnicity}
                    options={ethnicityOptions}
                    field="ethnicity"
                    placeholder="Select ethnicity..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DropdownField
                    label="Tribe/Community"
                    value={formData.tribe}
                    options={tribeOptions}
                    field="tribe"
                    placeholder="Select tribe..."
                  />

                  <DropdownField
                    label="Position"
                    value={formData.position}
                    options={positionOptions}
                    field="position"
                    placeholder="Select position..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DropdownField
                    label="Body Type"
                    value={formData.bodyType}
                    options={bodyTypeOptions}
                    field="bodyType"
                    placeholder="Select body type..."
                  />

                  <div>
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      placeholder="5'10&quot;"
                      className="mt-2 border-purple-200 focus:border-purple-500"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="weight">Weight (optional)</Label>
                    <Input
                      id="weight"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      placeholder="180 lbs"
                      className="mt-2 border-purple-200 focus:border-purple-500"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DropdownField
                    label="Relationship Status"
                    value={formData.relationship}
                    options={relationshipOptions}
                    field="relationship"
                    placeholder="Select status..."
                  />

                  <DropdownField
                    label="Body Hair"
                    value={formData.bodyHair}
                    options={bodyHairOptions}
                    field="bodyHair"
                    placeholder="Select body hair..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lifestyle */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  Lifestyle
                </h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <DropdownField
                    label="Smoking"
                    value={formData.smoking}
                    options={smokingOptions}
                    field="smoking"
                    placeholder="Select smoking..."
                  />

                  <DropdownField
                    label="Drinking"
                    value={formData.drinking}
                    options={drinkingOptions}
                    field="drinking"
                    placeholder="Select drinking..."
                  />

                  <DropdownField
                    label="Drugs"
                    value={formData.drugs}
                    options={drugsOptions}
                    field="drugs"
                    placeholder="Select drugs..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sexual Health */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  Sexual Health (Optional)
                </h2>
                <p className="text-gray-600 text-sm">All health information is completely optional and private.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DropdownField
                    label="HIV Status"
                    value={formData.hivStatus}
                    options={hivStatusOptions}
                    field="hivStatus"
                    placeholder="Select status..."
                  />

                  <DropdownField
                    label="PrEP Status"
                    value={formData.prepStatus}
                    options={prepStatusOptions}
                    field="prepStatus"
                    placeholder="Select PrEP status..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DropdownField
                    label="Last Tested"
                    value={formData.lastTested}
                    options={lastTestedOptions}
                    field="lastTested"
                    placeholder="When were you last tested..."
                  />

                  <DropdownField
                    label="Meet At"
                    value={formData.meetAt}
                    options={meetAtOptions}
                    field="meetAt"
                    placeholder="Where do you prefer to meet..."
                  />
                </div>

                <MultiSelectField
                  label="Safer Sex Practices"
                  selectedValues={formData.saferSex}
                  options={saferSexOptions}
                  field="saferSex"
                  placeholder="Add safer sex practice..."
                />

                <DropdownField
                  label="Accepts NSFW Pics"
                  value={formData.acceptsNSFW}
                  options={acceptsNSFWOptions}
                  field="acceptsNSFW"
                  placeholder="Select preference..."
                />
              </CardContent>
            </Card>

            {/* Interests */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Interests & Hobbies
                </h2>
                <p className="text-gray-600">What are you passionate about?</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add an interest..."
                    className="border-purple-200 focus:border-purple-500"
                    style={{ colorScheme: 'light' }}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest(newInterest))}
                  />
                  <Button 
                    type="button" 
                    onClick={() => addInterest(newInterest)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Add
                  </Button>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Popular interests:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularInterests.map(interest => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => addInterest(interest)}
                        disabled={formData.interests.includes(interest)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          formData.interests.includes(interest)
                            ? 'bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed'
                            : 'bg-white border-purple-200 hover:border-purple-500 hover:bg-purple-50'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Your interests:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map(interest => (
                      <Badge 
                        key={interest} 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 cursor-pointer"
                        onClick={() => removeInterest(interest)}
                      >
                        {interest} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Looking For */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-600" />
                  What I'm Looking For
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <MultiSelectField
                  label="I'm looking for"
                  selectedValues={formData.lookingFor}
                  options={lookingForOptions}
                  field="lookingFor"
                  placeholder="Add what you're looking for..."
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-semibold"
              >
                Save Profile ✨
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}