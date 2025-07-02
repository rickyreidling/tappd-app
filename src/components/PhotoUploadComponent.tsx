import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ProfilePhotoService } from './ProfilePhotoService';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoChange?: (newPhotoUrl: string) => void;
  className?: string;
}

const PhotoUploadComponent: React.FC<PhotoUploadProps> = ({
  currentPhotoUrl,
  onPhotoChange,
  className = ''
}) => {
  const { currentUser, userProfile } = useAppContext();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Handle file selection
  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, WebP)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Create preview
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    // Upload to Supabase
    if (currentUser) {
      setIsUploading(true);
      
      try {
        const newPhotoUrl = await ProfilePhotoService.replaceProfilePhoto(
          file,
          currentUser.id,
          currentPhotoUrl
        );

        if (newPhotoUrl) {
          onPhotoChange?.(newPhotoUrl);
          toast({
            title: "Photo updated!",
            description: "Your profile photo has been updated successfully",
          });
        } else {
          throw new Error('Failed to upload photo');
        }
      } catch (error) {
        console.error('Photo upload error:', error);
        toast({
          title: "Upload failed",
          description: "Failed to update your profile photo. Please try again.",
          variant: "destructive"
        });
        setPreviewUrl(null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Get gradient for user
  const getGradientForUser = (name: string) => {
    const gradients = [
      'from-purple-500 via-pink-500 to-red-500',
      'from-blue-500 via-purple-500 to-pink-500', 
      'from-green-500 via-blue-500 to-purple-500',
      'from-yellow-500 via-red-500 to-pink-500',
      'from-indigo-500 via-purple-500 to-pink-500',
      'from-teal-500 via-blue-500 to-purple-500'
    ];
    
    const charCode = name?.charCodeAt(0) || 0;
    return gradients[charCode % gradients.length];
  };

  const userGradient = getGradientForUser(userProfile?.displayName || '');
  const displayPhotoUrl = previewUrl || currentPhotoUrl;

  return (
    <div className={`relative ${className}`}>
      {/* Photo Display */}
      <div className="relative inline-block">
        <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
          <AvatarImage 
            src={displayPhotoUrl} 
            alt="Profile"
            className="object-cover"
          />
          <AvatarFallback className={`text-4xl bg-gradient-to-br ${userGradient} text-white font-bold`}>
            {userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        {/* Upload Status Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {/* Success Indicator */}
        {previewUrl && !isUploading && (
          <div className="absolute inset-0 bg-green-500/20 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
        )}

        {/* Camera Button Overlay */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 disabled:opacity-50"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      {/* Drag & Drop Area */}
      <div
        className={`mt-4 border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-purple-500 bg-purple-50' 
            : 'border-gray-300 hover:border-purple-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-2">
          Drag & drop your photo here, or{' '}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-purple-600 hover:text-purple-800 font-medium"
            disabled={isUploading}
          >
            browse
          </button>
        </p>
        <p className="text-xs text-gray-500">
          JPG, PNG or WebP up to 5MB
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Upload Progress */}
      {isUploading && (
        <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
            <span className="text-sm text-purple-700">Uploading your photo...</span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {previewUrl && !isUploading && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700">Photo updated successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUploadComponent;