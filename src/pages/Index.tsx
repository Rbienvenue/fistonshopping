import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyChooseUs from '@/components/home/WhyChooseUs';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedProducts />
      <WhyChooseUs />
    </Layout>
  );
};

export default Index;
