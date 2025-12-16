import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Shield, Headphones, CreditCard } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Same-day delivery within Kigali. We bring electronics right to your doorstep.',
  },
  {
    icon: Shield,
    title: 'Quality Guarantee',
    description: 'All products are genuine with manufacturer warranty. Shop with confidence.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our team is always ready to help via WhatsApp, phone, or Instagram.',
  },
  {
    icon: CreditCard,
    title: 'Easy Payment',
    description: 'Pay securely via Mobile Money. Simple checkout process.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Why Choose <span className="gradient-text">Fiston Shop</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing the best shopping experience for home electronics in Kigali.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="card-elevated p-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
