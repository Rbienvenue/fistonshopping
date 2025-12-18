import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number').max(20),
  deliveryAddress: z.string().min(10, 'Please provide a detailed address').max(500),
});

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const createOrder = useCreateOrder();

  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    deliveryAddress: '',
  });
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setPaymentProof(file);
    }
  };

  const uploadPaymentProof = async (): Promise<string> => {
    if (!paymentProof) throw new Error('No payment proof selected');

    const fileExt = paymentProof.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, paymentProof);

    if (uploadError) throw uploadError;

    // For private buckets, store the file path (not URL)
    // Signed URLs will be generated dynamically when admin views the proof
    return fileName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const result = checkoutSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (!paymentProof) {
      toast.error('Please upload payment proof screenshot');
      return;
    }

    setIsUploading(true);

    try {
      const paymentProofUrl = await uploadPaymentProof();

      await createOrder.mutateAsync({
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        deliveryAddress: formData.deliveryAddress,
        paymentProofUrl,
        items,
        totalAmount: totalPrice,
      });

      clearCart();
      navigate('/order-success');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="customerName">Full Name *</Label>
          <Input
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="mt-1"
            required
          />
          {errors.customerName && (
            <p className="text-sm text-destructive mt-1">{errors.customerName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="+250 7XX XXX XXX"
            className="mt-1"
            required
          />
          {errors.phoneNumber && (
            <p className="text-sm text-destructive mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        <div>
          <Label htmlFor="deliveryAddress">Delivery Address *</Label>
          <Textarea
            id="deliveryAddress"
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={handleInputChange}
            placeholder="Enter your full delivery address including district, sector, cell..."
            className="mt-1 min-h-[100px]"
            required
          />
          {errors.deliveryAddress && (
            <p className="text-sm text-destructive mt-1">{errors.deliveryAddress}</p>
          )}
        </div>

        <div>
          <Label htmlFor="paymentProof">Payment Proof Screenshot *</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Upload a screenshot of your mobile money payment
          </p>
          <div className="mt-1">
            <label
              htmlFor="paymentProof"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors bg-muted/50"
            >
              {paymentProof ? (
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{paymentProof.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="w-8 h-8" />
                  <span className="text-sm">Click to upload payment proof</span>
                </div>
              )}
              <input
                id="paymentProof"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total Amount:</span>
          <span className="text-2xl font-bold text-primary">
            {totalPrice.toLocaleString()} RWF
          </span>
        </div>

        <Button
          type="submit"
          className="w-full btn-accent py-6 text-lg font-semibold"
          disabled={isUploading || createOrder.isPending}
        >
          {isUploading || createOrder.isPending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Place Order'
          )}
        </Button>
      </div>
    </motion.form>
  );
};

export default CheckoutForm;
