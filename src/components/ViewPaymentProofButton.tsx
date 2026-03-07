import React from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ViewPaymentProofButtonProps {
  filePath: string;
}

const ViewPaymentProofButton: React.FC<ViewPaymentProofButtonProps> = ({ filePath }) => {
  const handleViewProof = () => {
    toast.error('Not connected');
  };

  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="outline"
        className="text-xs h-8 text-primary hover:text-primary"
        onClick={handleViewProof}
      >
        <Eye className="w-3 h-3 mr-1" /> View
      </Button>
    </div>
  );
};

export default ViewPaymentProofButton;
