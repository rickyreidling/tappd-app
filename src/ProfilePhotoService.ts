import { supabase } from '@/lib/supabase';

export class ProfilePhotoService {
  private static readonly BUCKET_NAME = 'profile-photos';
  
  /**
   * Upload a profile photo to Supabase Storage
   */
  static async uploadProfilePhoto(file: File, userId: string): Promise<string | null> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Compress image if needed (optional enhancement)
      const compressedFile = await this.compressImage(file);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading photo:', error);
        return null;
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      return publicData.publicUrl;
    } catch (error) {
      console.error('Error in uploadProfilePhoto:', error);
      return null;
    }
  }

  /**
   * Delete old profile photo
   */
  static async deleteProfilePhoto(photoUrl: string): Promise<boolean> {
    try {
      if (!photoUrl || !photoUrl.includes(this.BUCKET_NAME)) {
        return true; // Nothing to delete or not our URL
      }

      // Extract file path from URL
      const urlParts = photoUrl.split(`${this.BUCKET_NAME}/`);
      if (urlParts.length < 2) return false;
      
      const filePath = urlParts[1];

      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        console.error('Error deleting photo:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteProfilePhoto:', error);
      return false;
    }
  }

  /**
   * Update user profile with new photo URL
   */
  static async updateProfilePhoto(userId: string, photoUrl: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          profile_photo_url: photoUrl,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating profile photo URL:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateProfilePhoto:', error);
      return false;
    }
  }

  /**
   * Complete photo upload process
   */
  static async replaceProfilePhoto(file: File, userId: string, currentPhotoUrl?: string): Promise<string | null> {
    try {
      // Delete old photo if exists
      if (currentPhotoUrl) {
        await this.deleteProfilePhoto(currentPhotoUrl);
      }

      // Upload new photo
      const newPhotoUrl = await this.uploadProfilePhoto(file, userId);
      
      if (!newPhotoUrl) {
        throw new Error('Failed to upload new photo');
      }

      // Update profile with new URL
      const updateSuccess = await this.updateProfilePhoto(userId, newPhotoUrl);
      
      if (!updateSuccess) {
        // Clean up uploaded file if profile update fails
        await this.deleteProfilePhoto(newPhotoUrl);
        throw new Error('Failed to update profile with new photo URL');
      }

      return newPhotoUrl;
    } catch (error) {
      console.error('Error in replaceProfilePhoto:', error);
      return null;
    }
  }

  /**
   * Compress image for better performance (optional)
   */
  private static async compressImage(file: File, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 800x800)
        const maxSize = 800;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Create storage bucket if it doesn't exist (run once during setup)
   */
  static async createBucketIfNotExists(): Promise<void> {
    try {
      const { data, error } = await supabase.storage.getBucket(this.BUCKET_NAME);
      
      if (error && error.message.includes('not found')) {
        // Create bucket
        const { error: createError } = await supabase.storage.createBucket(this.BUCKET_NAME, {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          fileSizeLimit: 5242880 // 5MB
        });

        if (createError) {
          console.error('Error creating bucket:', createError);
        } else {
          console.log('Profile photos bucket created successfully');
        }
      }
    } catch (error) {
      console.error('Error checking/creating bucket:', error);
    }
  }
}