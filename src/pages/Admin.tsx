import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { useProducts, useDeleteProduct, useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LogOut, Package, ShoppingBag, Loader2, Trash2, CheckCircle, XCircle, Clock, 
  Plus, Edit2, Eye, EyeOff, Calendar 
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Layout from '@/components/layout/Layout';
import ViewPaymentProofButton from '@/components/ViewPaymentProofButton';
import { Order, Product, OrderWithItems } from '@/lib/types';

const Admin = () => {
  const { user, isAdmin, signOut, isLoading: authLoading } = useAuth();
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const updateOrderStatus = useUpdateOrderStatus();
  const deleteProduct = useDeleteProduct();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { uploadProductImages, isUploading: isUploadingImages } = useImageUpload();
  
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    discounted_price: '',
    discount_expiry: '',
    category: '',
    stock_quantity: '',
  });
  
  const [editProduct, setEditProduct] = useState({
    name: '',
    description: '',
    price: '',
    discounted_price: '',
    discount_expiry: '',
    category: '',
    stock_quantity: '',
  });

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!user || !isAdmin) return <Navigate to="/" />;

  // Sort orders: pending/approved first, completed last
  const sortedOrders = [...orders].sort((a, b) => {
    const statusOrder = { pending: 0, approved: 1, rejected: 2 };
    return (statusOrder[a.status as keyof typeof statusOrder] ?? 3) - 
           (statusOrder[b.status as keyof typeof statusOrder] ?? 3);
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newProduct.name || !newProduct.category || !newProduct.price || newProduct.stock_quantity === '') {
      console.error('Missing required fields');
      return;
    }

    // Upload images first if any are selected
    let uploadedImageUrls: string[] = [];
    if (selectedImageFiles.length > 0) {
      const uploadResults = await uploadProductImages(selectedImageFiles);
      uploadedImageUrls = uploadResults.map(result => result.url);
      
      if (uploadedImageUrls.length === 0) {
        console.error('Image upload failed');
        return;
      }
    }

    // Convert string values to appropriate types
    const productData = {
      name: newProduct.name,
      description: newProduct.description || null,
      price: parseFloat(newProduct.price),
      discounted_price: newProduct.discounted_price ? parseFloat(newProduct.discounted_price) : null,
      discount_expiry: newProduct.discount_expiry || null,
      category: newProduct.category,
      stock_quantity: parseInt(newProduct.stock_quantity),
      images: uploadedImageUrls,
      in_stock: parseInt(newProduct.stock_quantity) > 0,
    };

    try {
      await createProduct.mutateAsync(productData);
      // Reset form on success
      setShowAddProduct(false);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        discounted_price: '',
        discount_expiry: '',
        category: '',
        stock_quantity: '',
      });
      setSelectedImageFiles([]);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setEditProduct({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      discounted_price: product.discounted_price?.toString() || '',
      discount_expiry: product.discount_expiry || '',
      category: product.category,
      stock_quantity: product.stock_quantity.toString(),
    });
    setShowEditProduct(true);
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingProductId) return;

    // Validate required fields
    if (!editProduct.name || !editProduct.category || !editProduct.price || editProduct.stock_quantity === '') {
      console.error('Missing required fields');
      return;
    }

    // Convert string values to appropriate types
    const productData = {
      id: editingProductId,
      name: editProduct.name,
      description: editProduct.description || null,
      price: parseFloat(editProduct.price),
      discounted_price: editProduct.discounted_price ? parseFloat(editProduct.discounted_price) : null,
      discount_expiry: editProduct.discount_expiry || null,
      category: editProduct.category,
      stock_quantity: parseInt(editProduct.stock_quantity),
      in_stock: parseInt(editProduct.stock_quantity) > 0,
    };

    try {
      await updateProduct.mutateAsync(productData);
      // Reset form on success
      setShowEditProduct(false);
      setEditingProductId(null);
      setEditProduct({
        name: '',
        description: '',
        price: '',
        discounted_price: '',
        discount_expiry: '',
        category: '',
        stock_quantity: '',
      });
    } catch (error) {
      console.error('Error updating product:', error);
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage orders, products, and inventory</p>
          </div>
          <Button variant="outline" onClick={signOut}><LogOut className="w-4 h-4 mr-2" /> Sign Out</Button>
        </div>

        <Tabs defaultValue="orders">
          <TabsList className="mb-6 grid w-full grid-cols-2 lg:grid-cols-2">
            <TabsTrigger value="orders"><ShoppingBag className="w-4 h-4 mr-2" /> Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="products"><Package className="w-4 h-4 mr-2" /> Products ({products.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            {ordersLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : orders.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">No orders yet</p>
            ) : (
              <div className="card-elevated overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Client ID</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedOrders.map((order: OrderWithItems) => (
                        <TableRow key={order.id} className="hover:bg-muted/50">
                          <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.customer_name}</p>
                              <p className="text-xs text-muted-foreground">{order.phone_number}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {order.order_items?.map((item) => (
                                <p key={item.id} className="text-muted-foreground">
                                  {item.product?.name} (x{item.quantity})
                                </p>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-primary">{order.total_amount.toLocaleString()} RWF</TableCell>
                          <TableCell>
                            {order.payment_proof_url ? (
                              <ViewPaymentProofButton filePath={order.payment_proof_url} />
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {order.status === 'pending' && (
                              <div className="flex gap-1">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-xs h-8"
                                  onClick={() => updateOrderStatus.mutate({ id: order.id, status: 'approved' })} 
                                  disabled={!order.payment_proof_url}
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" /> Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  className="text-xs h-8"
                                  onClick={() => updateOrderStatus.mutate({ id: order.id, status: 'rejected' })}
                                >
                                  <XCircle className="w-3 h-3 mr-1" /> Reject
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="products">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Available Products</h2>
                <Button 
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </Button>
              </div>

              {/* Add Product Form */}
              {showAddProduct && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-elevated p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">New Product</h3>
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          placeholder="Enter product name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                          placeholder="e.g., Electronics, Clothing"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Product description"
                        className="w-full px-3 py-2 border rounded-md text-sm bg-background border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Price (RWF)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          placeholder="0"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="discounted_price">Discounted Price (RWF)</Label>
                        <Input
                          id="discounted_price"
                          type="number"
                          value={newProduct.discounted_price}
                          onChange={(e) => setNewProduct({ ...newProduct, discounted_price: e.target.value })}
                          placeholder="Optional"
                        />
                      </div>
                      <div>
                        <Label htmlFor="discount_expiry">Discount Expiry</Label>
                        <Input
                          id="discount_expiry"
                          type="date"
                          value={newProduct.discount_expiry}
                          onChange={(e) => setNewProduct({ ...newProduct, discount_expiry: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="stock_quantity">Stock Quantity</Label>
                      <Input
                        id="stock_quantity"
                        type="number"
                        value={newProduct.stock_quantity}
                        onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
                        placeholder="Number of items in stock"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="images">Product Images</Label>
                      <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => setSelectedImageFiles(Array.from(e.target.files || []))}
                      />
                      {selectedImageFiles.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {selectedImageFiles.map((file, idx) => (
                            <div key={idx} className="relative">
                              <img 
                                src={URL.createObjectURL(file)} 
                                alt={`Preview ${idx}`}
                                className="w-20 h-20 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => setSelectedImageFiles(selectedImageFiles.filter((_, i) => i !== idx))}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedImageFiles.length} image(s) selected • Max 5MB per image
                      </p>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddProduct(false)}
                        disabled={createProduct.isPending || isUploadingImages}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={createProduct.isPending || isUploadingImages}
                      >
                        {createProduct.isPending || isUploadingImages ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                            {isUploadingImages ? 'Uploading images...' : 'Creating...'}
                          </>
                        ) : (
                          'Add Product'
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Edit Product Form */}
              {showEditProduct && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-elevated p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Edit Product</h3>
                  <form onSubmit={handleEditProduct} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-name">Product Name</Label>
                        <Input
                          id="edit-name"
                          value={editProduct.name}
                          onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                          placeholder="Enter product name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-category">Category</Label>
                        <Input
                          id="edit-category"
                          value={editProduct.category}
                          onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                          placeholder="e.g., Electronics, Clothing"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="edit-description">Description</Label>
                      <textarea
                        id="edit-description"
                        value={editProduct.description}
                        onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                        placeholder="Product description"
                        className="w-full px-3 py-2 border rounded-md text-sm bg-background border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="edit-price">Price (RWF)</Label>
                        <Input
                          id="edit-price"
                          type="number"
                          value={editProduct.price}
                          onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                          placeholder="0"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-discounted_price">Discounted Price (RWF)</Label>
                        <Input
                          id="edit-discounted_price"
                          type="number"
                          value={editProduct.discounted_price}
                          onChange={(e) => setEditProduct({ ...editProduct, discounted_price: e.target.value })}
                          placeholder="Optional"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-discount_expiry">Discount Expiry</Label>
                        <Input
                          id="edit-discount_expiry"
                          type="date"
                          value={editProduct.discount_expiry}
                          onChange={(e) => setEditProduct({ ...editProduct, discount_expiry: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="edit-stock_quantity">Stock Quantity</Label>
                      <Input
                        id="edit-stock_quantity"
                        type="number"
                        value={editProduct.stock_quantity}
                        onChange={(e) => setEditProduct({ ...editProduct, stock_quantity: e.target.value })}
                        placeholder="Number of items in stock"
                        required
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowEditProduct(false);
                          setEditingProductId(null);
                        }}
                        disabled={updateProduct.isPending}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={updateProduct.isPending}
                      >
                        {updateProduct.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...
                          </>
                        ) : (
                          'Update Product'
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Products List */}
              {productsLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
              ) : products.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">No products yet. Create your first product!</p>
              ) : (
                <div className="grid gap-4">
                  {products.map((product: Product) => (
                    <motion.div 
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="card-elevated p-4 hover:shadow-lg transition"
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-24 h-24 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          {product.images?.[0] ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name} 
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <Package className="w-8 h-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">{product.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-muted-foreground">Stock:</p>
                              <p className={`text-lg font-bold ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.stock_quantity}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                          <div className="flex flex-wrap gap-4 items-end">
                            <div>
                              <p className="text-xs text-muted-foreground">Price</p>
                              <p className="text-lg font-bold">{product.price.toLocaleString()} RWF</p>
                            </div>
                            {product.discounted_price && (
                              <div>
                                <p className="text-xs text-muted-foreground">Discounted</p>
                                <div className="flex gap-2 items-center">
                                  <p className="text-lg font-bold text-primary">{product.discounted_price.toLocaleString()} RWF</p>
                                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                    {Math.round(((product.price - product.discounted_price) / product.price) * 100)}% OFF
                                  </span>
                                </div>
                              </div>
                            )}
                            {product.discount_expiry && (
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Expires: {new Date(product.discount_expiry).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => handleOpenEditProduct(product)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteProduct.mutate(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
