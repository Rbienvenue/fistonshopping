import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyChooseUs from '@/components/home/WhyChooseUs';

const Index = () => {
  return (
    <Layout>
      <Helmet>
        <title>Fiston Shopping – Premium Electronics in Kigali | Fast Delivery Rwanda</title>
        <meta name="description" content="Buy premium home electronics in Kigali with Fiston Shopping. Fast same-day delivery, quality products, trusted service. Ovens, appliances, and more at best prices." />
        <meta name="keywords" content="buy electronics Kigali, home appliances Rwanda, online shopping Rwanda, premium electronics, fast delivery Rwanda, kitchen appliances, home electronics Kigali for sale" />
        <link rel="canonical" href="https://fistonshopping.com" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Fiston Shopping – Premium Home Electronics in Kigali" />
        <meta property="og:description" content="Shop premium home electronics with same-day delivery in Kigali. Quality products, trusted service, seamless shopping experience." />
        <meta property="og:url" content="https://fistonshopping.com" />
      </Helmet>
      
      <HeroSection />
      <FeaturedProducts />
      <WhyChooseUs />
    </Layout>
  );
};

export default Index;
