import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface MultiPhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

const MultiPhotoUpload: React.FC<MultiPhotoUploadProps> = ({ 
  photos = [], 
  onPhotosChange, 
  maxPhotos = 3 
}) => {
  const { currentUser, isPremium } = useAppContext();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const effectiveMaxPhotos = isPremium ? 10 : maxPhotos;

  const uploadPhoto = async (file: File) => {
    if (!currentUser) {
      toast({ title: 'Error', description: 'Please sign in to upload photos', variant: 'destructive' });
      return;
    }

    if (photos.length >= effectiveMaxPhotos) {
      toast({ 
        title: 'Photo limit reached', 
        description: `${isPremium ? 'PRO users' : 'Free users'} can upload up to ${effectiveMaxPhotos} photos`,
        variant: 'destructive' 
      });
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
      const filePath = `${currentUser.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, { 
          cacheControl: '3600', 
          upsert: true,
          metadata: { userId: currentUser.id }
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      const newPhotos = [...photos, publicUrl];
      onPhotosChange(newPhotos);
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

  const removePhoto = async (index: number) => {
    const photoUrl = photos[index];
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);

    // Try to delete from storage (optional, don't block UI if it fails)
    try {
      if (photoUrl && currentUser) {
        const urlParts = photoUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `${currentUser.id}/${fileName}`;
        
        await supabase.storage
          .from('profile-photos')
          .remove([filePath]);
      }
    } catch (error) {
      console.warn('Could not delete photo from storage:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadPhoto(file);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Profile Photos</h3>
        <span className="text-sm text-gray-500">
          {photos.length}/{effectiveMaxPhotos} photos
          {!isPremium && ' (Upgrade to PRO for 10 photos)'}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <Card key={index} className="relative aspect-square overflow-hidden">
            <img 
              src={photo} 
              alt={`Profile ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <Button
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2 w-6 h-6 p-0"
              onClick={() => removePhoto(index)}
            >
              <X className="w-4 h-4" />
            </Button>
            {index === 0 && (
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                Main
              </div>
            )}
          </Card>
        ))}
        
        {photos.length < effectiveMaxPhotos && (
          <Card className="aspect-square border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id={`photo-upload-${photos.length}`}
              disabled={uploading}
            />
            <label 
              htmlFor={`photo-upload-${photos.length}`} 
              className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-purple-600 transition-colors"
            >
              {uploading ? (
                <div className="text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <span className="text-sm">Uploading...</span>
                </div>
              ) : (
                <div className="text-center">
                  <Plus className="w-8 h-8 mb-2" />
                  <span className="text-sm">Add Photo</span>
                </div>
              )}
            </label>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MultiPhotoUpload;