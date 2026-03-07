import { useState } from 'react';

export const useImageUpload = () => {
  const [isUploading] = useState(false);
  const [uploadProgress] = useState(0);

  const uploadProductImages = async () => {
    return [];
  };

  const deleteProductImage = async () => {
    return false;
  };

  const uploadPaymentProof = async () => {
    return null;
  };

  return {
    uploadProductImages,
    deleteProductImage,
    uploadPaymentProof,
    isUploading,
    uploadProgress,
  };
};
