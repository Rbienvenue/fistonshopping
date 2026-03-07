import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGetOrderById } from '@/hooks/useOrders';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Package, CheckCircle, XCircle, Clock, ArrowLeft, Phone, MessageCircle, Instagram, Mail } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useNavigate } from 'react-router-dom';

const OrderTrack = () => {
  const navigate = useNavigate();
  const [searchOrderId, setSearchOrderId] = useState('');
  const [submittedOrderId, setSubmittedOrderId] = useState('');
  const { data: order, isLoading, error } = useGetOrderById(submittedOrderId);
  const { data: settings } = useAdminSettings();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchOrderId.trim()) {
      setSubmittedOrderId(searchOrderId.trim());
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'pending':
      default:
        return <Clock className="w-6 h-6 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="space-y-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-primary hover:underline mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
            <h1 className="text-4xl font-bold">Track Your Order</h1>
            <p className="text-muted-foreground">
              Enter your order ID to check the status of your order
            </p>
          </div>

          {/* Search Form */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Find Your Order</CardTitle>
              <CardDescription>
                You received an order ID when you placed your order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="order-id">Order ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="order-id"
                      placeholder="Paste your order ID here..."
                      value={searchOrderId}
                      onChange={(e) => setSearchOrderId(e.target.value)}
                      disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !searchOrderId.trim()}>
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        'Search'
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Error State */}
          {error && submittedOrderId && (
            <Alert variant="destructive">
              <AlertDescription>
                Order not found. Please check your order ID and try again.
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Order Details */}
          {order && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Status Card */}
              <Card className="card-elevated border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Order Status</CardTitle>
                      <CardDescription className="mt-1">
                        Order placed on {formatDate(order.created_at)}
                      </CardDescription>
                    </div>
                    {getStatusIcon(order.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}
                      >
                        {order.status === 'pending' && 'Pending Review'}
                        {order.status === 'approved' && 'Approved'}
                        {order.status === 'rejected' && 'Rejected'}
                      </span>
                    </div>
                  </div>

                  {order.admin_comment && (
                    <div className="bg-muted/50 border border-muted-foreground/20 rounded-lg p-4">
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Note from our team:
                      </p>
                      <p className="text-base text-foreground">{order.admin_comment}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Total Amount</p>
                      <p className="text-2xl font-bold text-primary">
                        {order.total_amount.toLocaleString()} RWF
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Last Updated</p>
                      <p className="text-sm font-medium">{formatDate(order.updated_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Details */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Delivery Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Name</p>
                    <p className="font-medium">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Phone</p>
                    <p className="font-medium">{order.phone_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Delivery Address</p>
                    <p className="font-medium">{order.delivery_address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Items Ordered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.order_items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-start pb-3 border-b border-muted-foreground/10 last:border-0"
                      >
                        <div>
                          <p className="font-medium">{item.product?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">
                            {(item.price_at_purchase * item.quantity).toLocaleString()} RWF
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.price_at_purchase.toLocaleString()} RWF each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Information Box */}
              <Alert className="bg-blue-50 border-blue-200 text-blue-900">
                <AlertDescription>
                  {order.status === 'pending' && (
                    <>We are reviewing your order. Please ensure you have uploaded the payment proof. You will receive updates via SMS.</>
                  )}
                  {order.status === 'approved' && (
                    <>Your order has been approved! You will receive your items at the delivery address provided. Thank you for your business!</>
                  )}
                  {order.status === 'rejected' && (
                    <>Your order has been rejected. Please contact us for more details: contact our support team for assistance.</>
                  )}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Empty State */}
          {!order && !isLoading && !error && submittedOrderId === '' && (
            <Card className="card-elevated bg-muted/30">
              <CardContent className="py-12 text-center">
                <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">
                  Enter your order ID above to get started
                </p>
              </CardContent>
            </Card>
          )}

          {/* Contact Us Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="card-elevated border-l-4 border-l-accent">
              <CardHeader>
                <CardTitle>Need Help? Contact Us</CardTitle>
                <CardDescription>
                  Get in touch with our team if you have any questions about your order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {settings?.phone_number && (
                    <a
                      href={`tel:${settings.phone_number}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Call Us</p>
                        <p className="text-sm text-muted-foreground">{settings.phone_number}</p>
                      </div>
                    </a>
                  )}

                  {settings?.whatsapp_number && (
                    <a
                      href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">WhatsApp</p>
                        <p className="text-sm text-muted-foreground">Message us on WhatsApp</p>
                      </div>
                    </a>
                  )}

                  {settings?.instagram_url && (
                    <a
                      href={settings.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                        <Instagram className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Instagram</p>
                        <p className="text-sm text-muted-foreground">Follow us for updates</p>
                      </div>
                    </a>
                  )}

                  <a
                    href="mailto:nyaminaniildephonse44@gmail.com"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                      <Mail className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email Us</p>
                      <p className="text-sm text-muted-foreground">nyaminaniildephonse44@gmail.com</p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default OrderTrack;
