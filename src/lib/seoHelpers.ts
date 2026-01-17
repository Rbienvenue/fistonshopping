/**
 * SEO Helper functions for structured data and meta tags
 */

interface ProductStructuredData {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  id: string;
  inStock: boolean;
}

export const generateProductStructuredData = (product: ProductStructuredData) => {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "brand": {
      "@type": "Brand",
      "name": "Fiston Shopping"
    },
    "offers": {
      "@type": "Offer",
      "url": typeof window !== 'undefined' ? window.location.href : '',
      "priceCurrency": "RWF",
      "price": product.price.toString(),
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "100"
    }
  };
};

export const generateOrgStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Fiston Shopping",
    "url": "https://fistonshopping.com",
    "logo": "https://fistonshopping.com/logo.png",
    "description": "Premium home electronics and appliances in Kigali with fast delivery",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kigali",
      "addressRegion": "Rwanda",
      "addressCountry": "RW"
    },
    "sameAs": [
      "https://www.facebook.com/fistonshopping",
      "https://www.instagram.com/fistonshopping",
      "https://www.twitter.com/fistonshopping"
    ]
  };
};

export const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

/**
 * Generate SEO-friendly meta description for products
 */
export const generateProductDescription = (product: {
  name: string;
  price: number;
  category: string;
}): string => {
  return `Buy ${product.name} at best price in Kigali. Premium ${product.category} - RWF ${product.price.toLocaleString()}. Fast delivery across Rwanda. Shop now!`;
};

/**
 * Generate SEO keywords for products
 */
export const generateProductKeywords = (product: {
  name: string;
  category: string;
}): string => {
  const baseKeywords = [
    product.name.toLowerCase(),
    `${product.name} for sale`,
    `buy ${product.name}`,
    `${product.name} Kigali`,
    `${product.category}`,
    `${product.category} for sale`,
    `${product.category} Kigali`,
    `${product.category} Rwanda`,
    `home electronics Kigali`,
    `premium appliances`
  ];
  return baseKeywords.join(", ");
};
