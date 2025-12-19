import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden gradient-hero min-h-[600px] lg:min-h-[700px] flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground mb-6"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Premium Electronics</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-secondary-foreground leading-tight mb-6"
            >
              Your Home,{' '}
              <span className="text-primary">Smarter</span>
              <br />
              Than Ever
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-secondary-foreground/80 mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Discover premium home electronics delivered right to your doorstep in Kigali. 
              Quality products, trusted service, seamless shopping experience at Fiston Shopping.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/products">
                <Button size="lg" className="btn-accent px-8 py-6 text-lg group">
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/products">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10"
                >
                  View Catalog
                </Button>
              </Link>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-6 mt-12 justify-center lg:justify-start"
            >
              {[
                { icon: Truck, text: 'Free Delivery' },
                { icon: Shield, text: 'Quality Guaranteed' },
                { icon: Zap, text: 'Fast Processing' },
              ].map((feature) => (
                <div
                  key={feature.text}
                  className="flex items-center gap-2 text-secondary-foreground/70"
                >
                  <feature.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl blur-2xl transform rotate-6" />
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=500&fit=crop"
                alt="Premium Electronics"
                className="relative rounded-3xl shadow-2xl w-full max-w-md mx-auto"
              />
              
              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -left-8 top-1/4 glass-effect rounded-xl p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Fast Delivery</p>
                    <p className="text-xs text-muted-foreground">Same day in Kigali</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute -right-4 bottom-1/4 glass-effect rounded-xl p-4 shadow-lg"
              >
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">500+</p>
                  <p className="text-xs text-muted-foreground">Happy Customers</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
