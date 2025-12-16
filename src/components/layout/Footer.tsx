import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Phone, MessageCircle, Zap, MapPin, Mail } from 'lucide-react';
import { useAdminSettings } from '@/hooks/useAdminSettings';

const Footer = () => {
  const { data: settings } = useAdminSettings();

  const socialLinks = [
    {
      icon: Instagram,
      href: settings?.instagram_url || '#',
      label: 'Instagram',
    },
    {
      icon: MessageCircle,
      href: settings?.whatsapp_number ? `https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}` : '#',
      label: 'WhatsApp',
    },
    {
      icon: Phone,
      href: settings?.phone_number ? `tel:${settings.phone_number}` : '#',
      label: 'Phone',
    },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold">Fiston Shop</h3>
                <p className="text-xs text-secondary-foreground/70">Kigali Electronics</p>
              </div>
            </div>
            <p className="text-secondary-foreground/80 text-sm leading-relaxed">
              {settings?.store_description || 'Your trusted source for quality home electronics in Kigali. We deliver directly to your door.'}
            </p>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold mb-4 text-lg">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-secondary-foreground/80">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Kigali, Rwanda</span>
              </div>
              {settings?.phone_number && (
                <div className="flex items-center gap-3 text-sm text-secondary-foreground/80">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{settings.phone_number}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-secondary-foreground/80">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@fistonshop.rw</span>
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold mb-4 text-lg">Follow Us</h4>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  aria-label={link.label}
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <p className="mt-4 text-sm text-secondary-foreground/60">
              Open: Mon - Sat, 8AM - 8PM
            </p>
          </motion.div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-8 pt-8 text-center">
          <p className="text-sm text-secondary-foreground/60">
            © {new Date().getFullYear()} Fiston Shop Kigali. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
