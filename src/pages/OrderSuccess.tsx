import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface LocationState {
  orderId?: string;
}

const OrderSuccess = () => {
  const location = useLocation();
  const state = location.state as LocationState | null;
  const orderId = state?.orderId || '';

  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      toast.success('Order ID copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md w-full">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-success" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-8">Thank you for your order. Our team will review your payment and contact you shortly to confirm delivery.</p>

        {orderId && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
            <Card className="p-4 bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground uppercase font-medium mb-2">Your Order ID</p>
              <div className="flex items-center justify-between gap-2 bg-background rounded p-3">
                <code className="font-mono text-sm font-bold break-all">{orderId}</code>
                <button
                  onClick={copyOrderId}
                  className="p-1.5 hover:bg-muted rounded transition-colors flex-shrink-0"
                  title="Copy Order ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Save this ID to track your order status
              </p>
            </Card>
          </motion.div>
        )}

        <div className="space-y-3">
          {orderId && (
            <Link to="/order-track">
              <Button className="w-full btn-accent">
                Track Your Order
              </Button>
            </Link>
          )}
          <Link to="/">
            <Button className="w-full btn-primary" variant="outline">
              <Home className="w-5 h-5 mr-2" /> Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
