import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Package, ShoppingBag, Loader2, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const Admin = () => {
  const { user, isAdmin, signOut, isLoading: authLoading } = useAuth();
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const updateOrderStatus = useUpdateOrderStatus();
  const deleteProduct = useDeleteProduct();

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" />;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">{isAdmin ? 'Full admin access' : 'Limited access - contact admin for full permissions'}</p>
          </div>
          <Button variant="outline" onClick={signOut}><LogOut className="w-4 h-4 mr-2" /> Sign Out</Button>
        </div>

        <Tabs defaultValue="orders">
          <TabsList className="mb-6">
            <TabsTrigger value="orders"><ShoppingBag className="w-4 h-4 mr-2" /> Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="products"><Package className="w-4 h-4 mr-2" /> Products ({products.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            {ordersLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : orders.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-elevated p-6">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="font-semibold">{order.customer_name}</h3>
                        <p className="text-sm text-muted-foreground">{order.phone_number}</p>
                        <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{order.total_amount.toLocaleString()} RWF</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${order.status === 'approved' ? 'status-approved' : order.status === 'rejected' ? 'status-rejected' : 'status-pending'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    {order.payment_proof_url && (
                      <a href={order.payment_proof_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">View Payment Proof</a>
                    )}
                    {isAdmin && order.status === 'pending' && (
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" onClick={() => updateOrderStatus.mutate({ id: order.id, status: 'approved' })} disabled={!order.payment_proof_url || !order.delivery_address}>
                          <CheckCircle className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => updateOrderStatus.mutate({ id: order.id, status: 'rejected' })}>
                          <XCircle className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="products">
            {productsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <div className="grid gap-4">
                {products.map((product) => (
                  <div key={product.id} className="card-elevated p-4 flex items-center gap-4">
                    <img src={product.images?.[0] || 'https://via.placeholder.com/80'} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category} • {product.price.toLocaleString()} RWF</p>
                    </div>
                    {isAdmin && (
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteProduct.mutate(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
