# Fiston Shop Connect - Complete Project Walkthrough

## 📋 Project Overview
Fiston Shop Connect is a modern e-commerce platform built with React, TypeScript, Vite, and Supabase. It features product management, shopping cart, order processing, and admin dashboard.

---

## 🗂️ Project Structure

### Root Files
```
├── package.json              # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── eslint.config.js         # ESLint configuration
├── components.json          # Shadcn/ui configuration
├── .env                     # Environment variables (Supabase credentials)
├── index.html               # Entry HTML file
└── bun.lockb                # Bun package lock file
```

### Directory Structure

#### `/src`
Main application source code

**Core Files:**
- `main.tsx` - React entry point with React-DOM rendering
- `App.tsx` - Main app component with routing and providers
- `App.css` - Global styles
- `index.css` - CSS reset and global utilities
- `vite-env.d.ts` - Vite environment type definitions

#### `/src/pages`
Page components (route-based)

| File | Purpose |
|------|---------|
| `Index.tsx` | Homepage with featured products |
| `Auth.tsx` | Login/Sign up page |
| `Products.tsx` | Products listing page with filtering |
| `ProductDetail.tsx` | Single product detail view |
| `Cart.tsx` | Shopping cart page |
| `Admin.tsx` | **Admin dashboard** (orders + products management) |
| `OrderSuccess.tsx` | Order confirmation page |
| `NotFound.tsx` | 404 error page |

#### `/src/components`

**Layout Components:**
- `layout/Layout.tsx` - Main layout wrapper
- `layout/Header.tsx` - Navigation header
- `layout/Footer.tsx` - Footer

**Feature Components:**
- `NavLink.tsx` - Navigation link component
- `home/HeroSection.tsx` - Hero banner
- `home/FeaturedProducts.tsx` - Featured products showcase
- `home/WhyChooseUs.tsx` - Value proposition section
- `products/ProductCard.tsx` - Product card component
- `products/ProductGrid.tsx` - Product grid layout
- `products/CategoryFilter.tsx` - Category filter
- `cart/CartItem.tsx` - Individual cart item
- `checkout/CheckoutForm.tsx` - Checkout form

**UI Components:** (Shadcn/ui)
- `ui/` - 40+ pre-built UI components
  - Buttons, Forms, Dialogs, Cards, Tables, etc.

#### `/src/contexts`
React Context for state management

| File | Purpose |
|------|---------|
| `AuthContext.tsx` | Authentication & user state |
| `CartContext.tsx` | Shopping cart state |
| `ThemeContext.tsx` | Theme (dark/light mode) |

#### `/src/hooks`
Custom React hooks

| File | Purpose |
|------|---------|
| `useProducts.ts` | Product queries and mutations |
| `useOrders.ts` | Order queries and mutations |
| `useAdminSettings.ts` | Admin settings queries |
| `useImageUpload.ts` | **NEW** - Image upload utilities |
| `use-toast.ts` | Toast notifications |
| `use-mobile.tsx` | Mobile detection |

#### `/src/lib`
Utilities and types

| File | Purpose |
|------|---------|
| `types.ts` | TypeScript interfaces |
| `utils.ts` | Helper functions |

#### `/src/integrations`
Third-party service integrations

| File | Purpose |
|------|---------|
| `supabase/client.ts` | Supabase client initialization |
| `supabase/types.ts` | Generated Supabase types |

#### `/supabase`
Supabase configuration and migrations

```
├── config.toml              # Supabase project config
└── migrations/
    ├── 20251216155206_*.sql # Initial schema migration
    └── 20251218_*.sql       # **NEW** - Product management migration
```

#### `/public`
Static assets
- `robots.txt` - SEO robot rules

---

## 📊 Database Schema

### Tables

#### `profiles` (User Profiles)
```sql
- id: UUID (PK, FK to auth.users)
- email: TEXT
- full_name: TEXT
- is_admin: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `products`
```sql
- id: UUID (PK)
- name: TEXT
- description: TEXT
- price: DECIMAL(10,2)
- discounted_price: DECIMAL(10,2) [NEW]
- discount_expiry: TIMESTAMP [NEW]
- category: TEXT
- stock_quantity: INTEGER [NEW]
- images: TEXT[] (array of URLs)
- in_stock: BOOLEAN
- is_active: BOOLEAN [NEW]
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `orders`
```sql
- id: UUID (PK)
- customer_name: TEXT
- phone_number: TEXT
- delivery_address: TEXT
- payment_proof_url: TEXT
- status: ENUM ('pending', 'approved', 'rejected')
- total_amount: DECIMAL(10,2)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `order_items`
```sql
- id: UUID (PK)
- order_id: UUID (FK to orders)
- product_id: UUID (FK to products)
- quantity: INTEGER
- price_at_purchase: DECIMAL(10,2)
- created_at: TIMESTAMP
```

#### `admin_settings`
```sql
- id: UUID (PK)
- store_name: TEXT
- store_description: TEXT
- instagram_url: TEXT
- whatsapp_number: TEXT
- phone_number: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Storage Buckets

#### `product-images` (PUBLIC)
- Purpose: Product photos
- Access: Public read, Admin write
- File limit: 5MB
- Allowed types: JPEG, PNG, WebP, GIF

#### `payment-proofs` (PRIVATE)
- Purpose: Payment verification images
- Access: Public write, Admin read
- File limit: 10MB
- Allowed types: JPEG, PNG, PDF

---

## 🔐 Row Level Security (RLS) Policies

### Products Table
- **SELECT**: Anyone can view
- **INSERT/UPDATE/DELETE**: Only admins

### Orders Table
- **INSERT**: Anyone can create
- **SELECT/UPDATE**: Only admins

### Storage Objects (product-images)
- **SELECT**: Anyone (public bucket)
- **INSERT/UPDATE/DELETE**: Only admins

### Storage Objects (payment-proofs)
- **INSERT**: Anyone
- **SELECT**: Only admins

---

## 🔄 Data Flow

### User Authentication Flow
```
1. User signs up on Auth page
   ↓
2. Supabase creates auth.user
   ↓
3. Trigger creates profiles record
   ↓
4. User email verified (optional)
   ↓
5. Redirected to home page
```

### Product Upload Flow
```
1. Admin opens Admin Dashboard
   ↓
2. Clicks "Add Product"
   ↓
3. Fills form + selects images
   ↓
4. Images upload to `product-images` bucket
   ↓
5. Product record created in DB with image URLs
   ↓
6. Product appears on homepage
```

### Order Flow
```
1. Customer selects products
   ↓
2. Adds to cart
   ↓
3. Proceeds to checkout
   ↓
4. Enters delivery details
   ↓
5. Uploads payment proof
   ↓
6. Order created (status: pending)
   ↓
7. Admin reviews payment proof
   ↓
8. Admin approves/rejects order
   ↓
9. Customer notified
```

---

## 🎯 Key Features

### ✅ Completed
- [x] User authentication (Supabase Auth)
- [x] Product listing and filtering
- [x] Shopping cart functionality
- [x] Order creation and management
- [x] Admin dashboard (basic)
- [x] Payment proof upload
- [x] Theme switching (dark/light)
- [x] Responsive design
- [x] Toast notifications

### 🚀 New/Enhanced
- [x] Improved admin dashboard with table layout
- [x] Product stock tracking
- [x] Discount management
- [x] Image upload utilities
- [x] Storage bucket configuration
- [x] SQL migration with indexes

### 📋 TODO
- [ ] Image cropping before upload
- [ ] Product edit functionality
- [ ] Batch operations
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Inventory alerts

---

## 📦 Dependencies

### Core
- `react` - UI library
- `react-router-dom` - Routing with future flags enabled
- `typescript` - Type safety

### State Management
- `@tanstack/react-query` - Server state management
- Context API - Local state

### UI Framework
- `shadcn/ui` - Component library
- `tailwindcss` - Styling
- `lucide-react` - Icons
- `framer-motion` - Animations

### Backend
- `@supabase/supabase-js` - Backend service

### Forms
- `react-hook-form` - Form management
- `@hookform/resolvers` - Form validation

### Notifications
- `sonner` - Toast notifications

### Build Tools
- `vite` - Build tool
- `esbuild` - Bundler

---

## 🛠️ Environment Variables

```env
VITE_SUPABASE_URL=https://xmnggboqigffehnfvuif.supabase.co
VITE_SUPABASE_PROJECT_ID=xmnggboqigffehnfvuif
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
# or
bun install
```

### 2. Run Development Server
```bash
npm run dev
# or
bun run dev
```

### 3. Deploy to Production
```bash
npm run build
npm run preview
```

---

## 📱 Routes

| Path | Component | Access |
|------|-----------|--------|
| `/` | Index | Public |
| `/products` | Products | Public |
| `/products/:id` | ProductDetail | Public |
| `/cart` | Cart | Public |
| `/auth` | Auth | Public |
| `/admin` | Admin | Admin only |
| `/order-success` | OrderSuccess | Public |
| `*` | NotFound | Public |

---

## 🔧 Admin Dashboard Features

### Orders Tab
- View all orders in table format
- See customer details (name, phone, address)
- View payment proofs
- Approve/Reject orders
- Status filtering
- Sorted: Pending/Approved first, Rejected last

### Products Tab
- **View Products**
  - Thumbnail preview
  - Stock quantity indicator
  - Price and discount info
  - Discount expiry countdown

- **Add Product Form**
  - Product name & category
  - Description (textarea)
  - Regular & discounted price
  - Stock quantity
  - Discount expiry date
  - Multiple image upload

- **Product Actions**
  - Edit button
  - Delete button

---

## 📚 Database Migration

### Running the New Migration

1. **In Supabase Dashboard:**
   ```sql
   -- Copy and run the SQL from:
   -- supabase/migrations/20251218_add_product_management.sql
   ```

2. **Or via Supabase CLI:**
   ```bash
   supabase migration up
   ```

### What the Migration Does
1. ✅ Adds `stock_quantity` column to products
2. ✅ Adds `discounted_price` column
3. ✅ Adds `discount_expiry` timestamp
4. ✅ Adds `is_active` flag
5. ✅ Creates `product-images` bucket
6. ✅ Creates `payment-proofs` bucket
7. ✅ Sets up RLS policies for storage
8. ✅ Creates helper functions for pricing logic
9. ✅ Creates performance indexes

---

## 🖼️ Image Upload Implementation

### Using the `useImageUpload` Hook

```typescript
import { useImageUpload } from '@/hooks/useImageUpload';

function AdminDashboard() {
  const { uploadProductImages, isUploading, uploadProgress } = useImageUpload();

  const handleUpload = async (files: FileList) => {
    const results = await uploadProductImages(Array.from(files));
    // results contains { url, path, size }
  };

  return (
    <>
      <input type="file" onChange={(e) => handleUpload(e.target.files!)} multiple />
      {isUploading && <p>Uploading: {uploadProgress}%</p>}
    </>
  );
}
```

### Features
- Multi-file upload
- Progress tracking
- File validation (size, type)
- Automatic path generation
- Public URL generation
- Error handling
- Toast notifications

---

## 🔐 Security Best Practices

1. ✅ RLS enabled on all tables
2. ✅ Admin checks before mutations
3. ✅ File type validation
4. ✅ File size limits (5MB/10MB)
5. ✅ Public/Private bucket separation
6. ✅ Signed URLs for private files
7. ✅ Future flags enabled for React Router

---

## 📝 Next Steps

1. **Run the SQL Migration** to set up storage buckets
2. **Test Image Upload** with admin account
3. **Update Admin Dashboard** to use `useImageUpload` hook
4. **Add Image Cropping** (optional enhancement)
5. **Deploy to Production**

---

## 📞 Support

For issues or questions:
1. Check Supabase documentation
2. Review error messages in browser console
3. Check network tab for API calls
4. Verify RLS policies are correctly set

---

**Project Created:** December 2025  
**Last Updated:** December 18, 2025
