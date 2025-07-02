import React, { useState, useEffect } from 'react';
import { Camera, Upload, User, MapPin, Heart, Tag, ChevronDown, X } from 'lucide-react';
// import PhotoUploadComponent from './PhotoUploadComponent';
// import { ProfilePhotoService } from './ProfilePhotoService';

const GayDatingProfile = () => {
  const [profile, setProfile] = useState({
    displayName: '',
    age: '',
    bio: '',
    location: '',
    pronouns: '',
    orientation: '',
    lookingFor: '',
    bodyType: '',
    height: '',
    weight: '',
    ethnicity: '',
    position: '',
    relationship: '',
    hivStatus: '',
    lastTested: '',
    interests: [],
    tribe: '',
    smokingDrinking: '',
    languages: [],
    profilePic: null,
    // profile_photo_url: '', // Will be added when PhotoUploadComponent is ready
    additionalPics: [],
    thirstMode: false,
    isPaid: false // Add subscription status
  });

  const [newInterest, setNewInterest] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Load saved profile on component mount
  useEffect(() => {
    const savedProfile = window.profileData || {};
    console.log('Loading saved profile:', savedProfile);
    if (Object.keys(savedProfile).length > 0) {
      setProfile(prev => ({ ...prev, ...savedProfile }));
    }
    
    // Initialize Supabase bucket (one-time setup)
    // ProfilePhotoService.createBucketIfNotExists();
  }, []);

  // Save profile changes automatically whenever profile state changes
  useEffect(() => {
    // Only save if profile has meaningful data (avoid saving initial empty state)
    const hasData = profile.displayName || profile.age || profile.bio || profile.location || 
                    profile.pronouns || profile.orientation || profile.profilePic || 
                    /* profile.profile_photo_url || */ profile.additionalPics.length > 0 || 
                    profile.interests.length > 0;
    
    if (hasData) {
      const profileToSave = { ...profile };
      window.profileData = profileToSave;
      console.log('Profile auto-saved:', profileToSave);
    }
  }, [profile]);

  const pronounOptions = [
    'He/Him', 'They/Them', 'He/They', 'She/Her', 'She/They', 'Any Pronouns'
  ];

  const orientationOptions = [
    'Gay', 'Bisexual', 'Queer', 'Pansexual', 'Questioning', 'Fluid'
  ];

  const lookingForOptions = [
    'Chat', 'Dates', 'Friends', 'Networking', 'Relationship', 'Right Now', 'Fun'
  ];

  const bodyTypeOptions = [
    'Slim', 'Average', 'Athletic', 'Muscular', 'Stocky', 'Large', 'Bear'
  ];

  const ethnicityOptions = [
    'Asian', 'Black', 'Latino', 'Middle Eastern', 'Mixed', 'Native American', 'Pacific Islander', 'White', 'Other'
  ];

  const positionOptions = [
    'Top', 'Bottom', 'Versatile', 'Versatile Top', 'Versatile Bottom', 'Side', 'Oral'
  ];

  const relationshipOptions = [
    'Single', 'Taken', 'Open Relationship', 'Married', 'Partnered', 'It\'s Complicated'
  ];

  const hivStatusOptions = [
    'Negative', 'Negative, on PrEP', 'Positive', 'Positive, Undetectable', 'Ask Me'
  ];

  const tribeOptions = [
    'Bear', 'Cub', 'Daddy', 'Jock', 'Leather', 'Muscle', 'Otter', 'Pup', 'Rugged', 'Twink', 'Wolf'
  ];

  const smokingDrinkingOptions = [
    'Never', 'Socially', 'Regularly', 'Trying to Quit', 'No Smoking/Social Drinking', 'Ask Me'
  ];

  const commonInterests = [
    'Art', 'Bars', 'Beach', 'Books', 'Camping', 'Coffee', 'Cooking', 'Dancing', 'Fashion', 'Fitness',
    'Gaming', 'Hiking', 'Movies', 'Music', 'Photography', 'Sports', 'Theater', 'Travel', 'Yoga'
  ];

  const handleInputChange = (field, value) => {
    console.log(`Updating ${field}:`, value);
    setProfile(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      console.log('Updated profile state:', updated);
      return updated;
    });
  };

  // New photo change handler for the PhotoUploadComponent (temporarily disabled)
  // const handlePhotoChange = (newPhotoUrl) => {
  //   console.log('Photo updated with new URL:', newPhotoUrl);
  //   setProfile(prev => ({
  //     ...prev,
  //     profile_photo_url: newPhotoUrl,
  //     profilePic: newPhotoUrl // Keep backward compatibility
  //   }));
  // };

  // Legacy image upload for additional photos (keeping existing functionality)
  const handleImageUpload = (event, isProfile = true) => {
    const file = event.target.files[0];
    console.log('File selected:', file);
    
    if (file) {
      // Check photo limits for additional pics
      if (!isProfile) {
        const maxPhotos = profile.isPaid ? 10 : 3;
        if (profile.additionalPics.length >= maxPhotos) {
          if (!profile.isPaid) {
            setShowUpgradeModal(true);
          }
          return;
        }
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result;
        console.log('File read successfully, size:', result.length);
        
        if (isProfile) {
          console.log('Setting profile pic');
          setProfile(prev => ({
            ...prev,
            profilePic: result
            // profile_photo_url: result  // Commented out for now
          }));
        } else {
          console.log('Adding additional pic');
          setProfile(prev => ({
            ...prev,
            additionalPics: [...prev.additionalPics, result]
          }));
        }
      };
      
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index) => {
    setProfile(prev => ({
      ...prev,
      additionalPics: prev.additionalPics.filter((_, i) => i !== index)
    }));
  };

  const handleUpgrade = () => {
    // This will now open the external link via the anchor tag
    console.log('Redirecting to tappd.app/pro');
  };

  const addInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const saveProfile = () => {
    // Explicitly save to in-memory storage
    const profileToSave = { ...profile };
    window.profileData = profileToSave;
    
    console.log('Profile manually saved to window.profileData:', window.profileData);
    console.log('Current profile state:', profile);
    
    // Verify it was saved
    setTimeout(() => {
      console.log('Verification - window.profileData contains:', window.profileData);
    }, 100);
    
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const CustomSelect = ({ value, onChange, options, placeholder }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
    </div>
  );

  // Get the current photo URL for display
  const getCurrentPhotoUrl = () => {
    return profile.profilePic; // Simplified for now, will use profile_photo_url later
  };

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-center z-10">
        <h1 className="text-2xl font-bold text-purple-600">Edit Profile</h1>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            Profile saved successfully!
          </div>
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <h3 className="text-lg font-semibold mb-4">Upgrade to Premium</h3>
              <p className="text-gray-600 mb-4">
                Free accounts can upload up to 3 photos. Upgrade to Premium to upload up to 10 photos and unlock more features!
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <a
                  href="https://tappd.app/pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all inline-block text-center"
                >
                  Upgrade
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Account Status Banner */}
        <div className={`p-4 rounded-lg border-2 ${
          profile.isPaid 
            ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`text-2xl ${profile.isPaid ? '👑' : '🆓'}`}>
                {profile.isPaid ? '👑' : '🆓'}
              </div>
              <div>
                <div className="font-semibold">
                  {profile.isPaid ? 'Tappd Pro Account' : 'Free Account'}
                </div>
                <div className="text-sm text-gray-600">
                  {profile.isPaid 
                    ? 'Upload up to 10 photos • Unlimited features' 
                    : 'Upload up to 3 photos • Limited features'
                  }
                </div>
              </div>
            </div>
            {!profile.isPaid && (
              <a
                href="https://tappd.app/pro"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all inline-block"
              >
                Upgrade
              </a>
            )}
          </div>
        </div>

        {/* Profile Photo Section - UPDATED with PhotoUploadComponent */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Profile Photos</h2>
          
          {/* Main Profile Photo - NEW Beautiful Upload Component */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Main Photo</label>
            {/* PhotoUploadComponent will go here once created */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                {getCurrentPhotoUrl() ? (
                  <img
                    src={getCurrentPhotoUrl()}
                    alt="Profile"
                    className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, true)}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Additional Photos - Keeping existing functionality */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Additional Photos</label>
              <span className="text-xs text-gray-500">
                {profile.additionalPics.length}/{profile.isPaid ? 10 : 3} photos
              </span>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {profile.additionalPics.map((pic, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={pic}
                    alt={`Additional ${index + 1}`}
                    className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {profile.additionalPics.length < (profile.isPaid ? 10 : 3) && (
                <label className="cursor-pointer w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center flex-shrink-0 hover:border-blue-500 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {profile.additionalPics.length >= (profile.isPaid ? 10 : 3) && (
              <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                {profile.isPaid 
                  ? 'Maximum of 10 photos reached' 
                  : 'Free accounts limited to 3 photos. Upgrade for up to 10 photos!'
                }
              </div>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input
                type="text"
                value={profile.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your display name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your age"
                min="18"
                max="99"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City, State"
            />
          </div>
        </div>

        {/* Identity */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Identity</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pronouns</label>
              <CustomSelect
                value={profile.pronouns}
                onChange={(value) => handleInputChange('pronouns', value)}
                options={pronounOptions}
                placeholder="Select pronouns"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Orientation</label>
              <CustomSelect
                value={profile.orientation}
                onChange={(value) => handleInputChange('orientation', value)}
                options={orientationOptions}
                placeholder="Select orientation"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Looking For</label>
            <CustomSelect
              value={profile.lookingFor}
              onChange={(value) => handleInputChange('lookingFor', value)}
              options={lookingForOptions}
              placeholder="What are you looking for?"
            />
          </div>
        </div>

        {/* Physical Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Physical Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
              <CustomSelect
                value={profile.bodyType}
                onChange={(value) => handleInputChange('bodyType', value)}
                options={bodyTypeOptions}
                placeholder="Select body type"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
              <input
                type="text"
                value={profile.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 5'10&quot;"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
              <input
                type="text"
                value={profile.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 175 lbs"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ethnicity</label>
              <CustomSelect
                value={profile.ethnicity}
                onChange={(value) => handleInputChange('ethnicity', value)}
                options={ethnicityOptions}
                placeholder="Select ethnicity"
              />
            </div>
          </div>
        </div>

        {/* Intimacy & Relationship */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Intimacy & Relationship</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <CustomSelect
                value={profile.position}
                onChange={(value) => handleInputChange('position', value)}
                options={positionOptions}
                placeholder="Select position"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship Status</label>
              <CustomSelect
                value={profile.relationship}
                onChange={(value) => handleInputChange('relationship', value)}
                options={relationshipOptions}
                placeholder="Select relationship status"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">HIV Status</label>
              <CustomSelect
                value={profile.hivStatus}
                onChange={(value) => handleInputChange('hivStatus', value)}
                options={hivStatusOptions}
                placeholder="Select HIV status"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Tested</label>
              <input
                type="text"
                value={profile.lastTested}
                onChange={(e) => handleInputChange('lastTested', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 3 months ago"
              />
            </div>
          </div>
        </div>

        {/* Lifestyle */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Lifestyle</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tribe</label>
              <CustomSelect
                value={profile.tribe}
                onChange={(value) => handleInputChange('tribe', value)}
                options={tribeOptions}
                placeholder="Select tribe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Smoking/Drinking</label>
              <CustomSelect
                value={profile.smokingDrinking}
                onChange={(value) => handleInputChange('smokingDrinking', value)}
                options={smokingDrinkingOptions}
                placeholder="Smoking/Drinking habits"
              />
            </div>
          </div>
        </div>

        {/* Interests & Tags */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Interests & Tags</h2>
          
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add an interest (e.g., kink, poly, vibes)"
              />
              <button
                onClick={addInterest}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {commonInterests.map(interest => (
                <button
                  key={interest}
                  onClick={() => {
                    if (!profile.interests.includes(interest)) {
                      setProfile(prev => ({
                        ...prev,
                        interests: [...prev.interests, interest]
                      }));
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    profile.interests.includes(interest)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {profile.interests.map(interest => (
                <span
                  key={interest}
                  className="inline-flex items-center bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
                >
                  {interest}
                  <button
                    onClick={() => removeInterest(interest)}
                    className="ml-2 hover:bg-blue-600 rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
          
          <div className={`p-4 rounded-lg border-2 transition-all ${
            profile.thirstMode 
              ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 shadow-lg' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`text-3xl transition-all ${profile.thirstMode ? 'animate-pulse' : ''}`}>
                  🔥
                </div>
                <div>
                  <div className="font-medium flex items-center space-x-2">
                    <span>Thirst Mode</span>
                    {profile.thirstMode && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {profile.thirstMode 
                      ? 'You\'re showing up in the 🔥 Thirst tab - ready to connect!'
                      : 'Show up in the 🔥 Thirst tab for more visibility'
                    }
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.thirstMode}
                  onChange={(e) => handleInputChange('thirstMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer transition-all peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  profile.thirstMode 
                    ? 'bg-orange-500 shadow-lg' 
                    : 'bg-gray-200'
                }`}></div>
              </label>
            </div>
            {profile.thirstMode && (
              <div className="mt-3 p-3 bg-white bg-opacity-70 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-2 text-sm text-orange-700">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Thirst Mode is ON</span>
                </div>
                <div className="text-xs text-orange-600 mt-1">
                  Your profile will appear with a 🔥 indicator and show higher in search results
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Preview Section */}
        {(profile.displayName || getCurrentPhotoUrl()) && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Profile Preview</h2>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg max-w-sm">
              {/* Profile Image */}
              {getCurrentPhotoUrl() && (
                <div className="relative">
                  <img
                    src={getCurrentPhotoUrl()}
                    alt="Profile preview"
                    className="w-full h-64 object-cover"
                  />
                  {profile.thirstMode && (
                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 animate-pulse">
                      <span>🔥</span>
                      <span>THIRST</span>
                    </div>
                  )}
                  {profile.isPaid && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <span>👑</span>
                      <span>PRO</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Profile Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">
                    {profile.displayName || 'Your Name'}{profile.age && `, ${profile.age}`}
                  </h3>
                  {profile.thirstMode && (
                    <div className="text-xl animate-bounce">🔥</div>
                  )}
                </div>
                
                {profile.location && (
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {profile.location}
                  </div>
                )}
                
                {profile.bio && (
                  <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                    {profile.bio}
                  </p>
                )}
                
                {/* Quick Stats */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {profile.bodyType && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {profile.bodyType}
                    </span>
                  )}
                  {profile.position && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      {profile.position}
                    </span>
                  )}
                  {profile.tribe && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {profile.tribe}
                    </span>
                  )}
                </div>
                
                {/* Photo Count */}
                {profile.additionalPics.length > 0 && (
                  <div className="mt-3 text-xs text-gray-500 flex items-center">
                    <Camera className="w-3 h-3 mr-1" />
                    {profile.additionalPics.length + 1} photo{profile.additionalPics.length > 0 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="sticky bottom-0 bg-white pt-4 pb-6 border-t border-gray-200 -mx-6 px-6">
          <button
            onClick={saveProfile}
            className="w-full bg-blue-500 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default GayDatingProfile;