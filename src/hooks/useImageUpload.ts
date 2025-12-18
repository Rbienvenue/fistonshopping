import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UploadOptions {
  maxSize?: number; // in bytes, default 5MB
  allowedTypes?: string[]; // MIME types
}

interface ImageUploadResult {
  url: string;
  path: string;
  size: number;
}

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadProductImages = useCallback(
    async (files: File[], options?: UploadOptions): Promise<ImageUploadResult[]> => {
      const maxSize = options?.maxSize || 5 * 1024 * 1024; // 5MB default
      const allowedTypes = options?.allowedTypes || ['image/jpeg', 'image/png', 'image/webp'];

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const results: ImageUploadResult[] = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          // Validate file size
          if (file.size > maxSize) {
            toast.error(`File ${file.name} exceeds maximum size of ${maxSize / 1024 / 1024}MB`);
            continue;
          }

          // Validate file type
          if (!allowedTypes.includes(file.type)) {
            toast.error(`File type ${file.type} is not allowed`);
            continue;
          }

          // Create unique filename with timestamp
          const timestamp = Date.now();
          const random = Math.random().toString(36).substring(2, 8);
          const ext = file.name.split('.').pop();
          const fileName = `product-${timestamp}-${random}.${ext}`;
          const filePath = `products/${fileName}`;

          // Upload to storage
          const { data, error } = await supabase.storage
            .from('product-images')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false,
            });

          if (error) {
            toast.error(`Failed to upload ${file.name}: ${error.message}`);
            continue;
          }

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          results.push({
            url: urlData.publicUrl,
            path: filePath,
            size: file.size,
          });

          // Update progress
          setUploadProgress(Math.round(((i + 1) / files.length) * 100));
        }

        if (results.length > 0) {
          toast.success(`Successfully uploaded ${results.length} image(s)`);
        }

        return results;
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to upload images'
        );
        return [];
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    []
  );

  const deleteProductImage = useCallback(
    async (imagePath: string): Promise<boolean> => {
      try {
        const { error } = await supabase.storage
          .from('product-images')
          .remove([imagePath]);

        if (error) {
          toast.error(`Failed to delete image: ${error.message}`);
          return false;
        }

        toast.success('Image deleted successfully');
        return true;
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to delete image'
        );
        return false;
      }
    },
    []
  );

  const uploadPaymentProof = useCallback(
    async (file: File): Promise<ImageUploadResult | null> => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

      setIsUploading(true);

      try {
        // Validate file size
        if (file.size > maxSize) {
          toast.error(`File exceeds maximum size of ${maxSize / 1024 / 1024}MB`);
          return null;
        }

        // Validate file type
        if (!allowedTypes.includes(file.type)) {
          toast.error(`File type ${file.type} is not allowed`);
          return null;
        }

        // Create unique filename
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const ext = file.name.split('.').pop();
        const fileName = `proof-${timestamp}-${random}.${ext}`;
        const filePath = `payment-proofs/${fileName}`;

        // Upload to storage
        const { data, error } = await supabase.storage
          .from('payment-proofs')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          toast.error(`Failed to upload proof: ${error.message}`);
          return null;
        }

        // Get URL (will be signed URL for private bucket)
        const { data: urlData } = await supabase.storage
          .from('payment-proofs')
          .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days

        toast.success('Payment proof uploaded successfully');

        return {
          url: urlData?.signedUrl || '',
          path: filePath,
          size: file.size,
        };
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to upload payment proof'
        );
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  return {
    uploadProductImages,
    deleteProductImage,
    uploadPaymentProof,
    isUploading,
    uploadProgress,
  };
};
