import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (photoUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
  currentPhoto, 
  onPhotoChange, 
  size = 'md' 
}) => {
  const { currentUser } = useAppContext();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const uploadPhoto = async (file: File) => {
    if (!currentUser) {
      toast({ title: 'Error', description: 'Please sign in to upload photos', variant: 'destructive' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Error', description: 'Please select an image file', variant: 'destructive' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Error', description: 'Image must be less than 5MB', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `profiles/${currentUser.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, { 
          cacheControl: '3600', 
          upsert: true,
          metadata: { userId: currentUser.id }
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      onPhotoChange(publicUrl);
      toast({ title: 'Success', description: 'Photo uploaded successfully!' });
    } catch (error: any) {
      console.error('Photo upload error:', error);
      toast({ 
        title: 'Upload failed', 
        description: error.message || 'Could not upload photo. Please try again.',
        variant: 'destructive' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadPhoto(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadPhoto(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  return (
    <div className="flex items-center gap-4">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={currentPhoto} />
        <AvatarFallback className="text-xl">
          <Camera className="w-6 h-6" />
        </AvatarFallback>
      </Avatar>
      
      <div className="space-y-2">
        <div 
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
            dragOver ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="photo-upload"
            disabled={uploading}
          />
          <label htmlFor="photo-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-600">
                {uploading ? 'Uploading...' : 'Click or drag to upload'}
              </span>
            </div>
          </label>
        </div>
        
        {currentPhoto && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onPhotoChange('')}
            className="w-full"
          >
            <X className="w-4 h-4 mr-2" />
            Remove Photo
          </Button>
        )}
      </div>
    </div>
  );
};

export default PhotoUpload;