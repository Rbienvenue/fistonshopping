import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryFilter from '@/components/products/CategoryFilter';
import { useProducts } from '@/hooks/useProducts';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: products = [], isLoading } = useProducts(selectedCategory);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryName = selectedCategory === 'all' ? 'All Products' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
  const metaDescription = `Browse and buy ${categoryName.toLowerCase()} online in Kigali, Rwanda. Premium electronics with fast delivery. Shop the best selection of home appliances at Fiston Shopping.`;

  return (
    <Layout>
      <Helmet>
        <title>{categoryName} - Buy Online in Kigali | Fiston Shopping</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${categoryName}, ${categoryName} for sale, buy ${categoryName.toLowerCase()}, ${categoryName.toLowerCase()} Kigali, Rwanda electronics, home appliances`} />
        <link rel="canonical" href={`https://fistonshopping.com/products${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${categoryName} - Fiston Shopping`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content="https://fistonshopping.com/products" />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Our <span className="gradient-text">Products</span>
          </h1>
          <p className="text-muted-foreground">Browse our collection of premium electronics in Kigali</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        <ProductGrid products={filteredProducts} isLoading={isLoading} />
      </div>
    </Layout>
  );
};

export default Products;
