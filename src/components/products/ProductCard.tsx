import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.in_stock) {
      toast.error('This product is out of stock');
      return;
    }
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link to={`/products/${product.id}`}>
        <div className="card-elevated overflow-hidden">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <motion.img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Quick Actions */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
              <Button
                onClick={handleAddToCart}
                className="flex-1 btn-accent"
                size="sm"
                disabled={!product.in_stock}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="secondary" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </div>

            {/* Stock Badge */}
            {!product.in_stock && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-destructive text-destructive-foreground text-xs font-medium rounded-md">
                Out of Stock
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-3 right-3 px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-md capitalize">
              {product.category}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.description}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-lg font-bold text-primary">
                {product.price.toLocaleString()} RWF
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
