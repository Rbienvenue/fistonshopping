import React, { useState } from 'react';
import { Eye, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ViewPaymentProofButtonProps {
  filePath: string;
}

const ViewPaymentProofButton: React.FC<ViewPaymentProofButtonProps> = ({ filePath }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleViewProof = async () => {
    setIsLoading(true);
    try {
      // Generate a signed URL for the private file (valid for 7 days)
      const { data, error } = await supabase.storage
        .from('payment-proofs')
        .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days

      if (error) {
        toast.error(`Failed to load proof: ${error.message}`);
        return;
      }

      if (data?.signedUrl) {
        // Open in new tab
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error('Error generating signed URL:', error);
      toast.error('Failed to load payment proof');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadProof = async () => {
    setIsLoading(true);
    try {
      // Generate a signed URL for the private file
      const { data, error } = await supabase.storage
        .from('payment-proofs')
        .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days

      if (error) {
        toast.error(`Failed to download proof: ${error.message}`);
        return;
      }

      if (data?.signedUrl) {
        // Download the file
        const link = document.createElement('a');
        link.href = data.signedUrl;
        link.download = filePath.split('/').pop() || 'payment-proof';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download payment proof');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="outline"
        className="text-xs h-8 text-primary hover:text-primary"
        onClick={handleViewProof}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <>
            <Eye className="w-3 h-3 mr-1" /> View
          </>
        )}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-xs h-8"
        onClick={handleDownloadProof}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <>
            <Download className="w-3 h-3 mr-1" /> Download
          </>
        )}
      </Button>
    </div>
  );
};

export default ViewPaymentProofButton;
