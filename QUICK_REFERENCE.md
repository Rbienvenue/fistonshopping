# 🚀 Quick Reference - Fiston Shop Connect

## 🎯 What's Included

### ✅ Complete Features
- User authentication (signup/login)
- Product listing & filtering
- Shopping cart
- Order management
- Admin dashboard
- Payment proof upload
- Dark/Light theme
- Responsive design

### 🆕 New Features
- Enhanced admin dashboard (table layout)
- Product stock tracking
- Discount management
- Image upload system
- Storage bucket configuration

---

## 📊 Database Schema at a Glance

### Products Table
```
id (UUID)
├── name (TEXT)
├── description (TEXT)
├── price (DECIMAL) 💰
├── discounted_price (DECIMAL) 🆕 💰
├── discount_expiry (TIMESTAMP) 🆕 📅
├── category (TEXT)
├── stock_quantity (INTEGER) 🆕 📦
├── images (TEXT[])
├── in_stock (BOOLEAN)
├── is_active (BOOLEAN) 🆕 👁️
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### Orders Table
```
id (UUID)
├── customer_name (TEXT)
├── phone_number (TEXT)
├── delivery_address (TEXT)
├── payment_proof_url (TEXT)
├── status (ENUM: pending, approved, rejected) ✏️
├── total_amount (DECIMAL)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### Storage Buckets
```
product-images/ (PUBLIC)
├── Read: Anyone ✅
├── Write: Admin only 🔒
├── Max size: 5MB 📏
└── Types: JPEG, PNG, WebP, GIF 🖼️

payment-proofs/ (PRIVATE)
├── Read: Admin only 🔒
├── Write: Anyone ✅
├── Max size: 10MB 📏
└── Types: JPEG, PNG, PDF 📄
```

---

## 🧭 File Navigation

### Want to...

**Build a feature?**
```
Start in: src/pages/
Create component in: src/components/
Add hook in: src/hooks/
Add type in: src/lib/types.ts
```

**Add a database table?**
```
Create migration: supabase/migrations/YYYYMMDD_*.sql
Update types: src/integrations/supabase/types.ts
Create hook: src/hooks/useNewTable.ts
```

**Handle images?**
```
Use hook: import { useImageUpload } from '@/hooks/useImageUpload';
Upload: uploadProductImages(files)
Delete: deleteProductImage(path)
```

**Manage state?**
```
Global: Use Context (src/contexts/)
Server: Use React Query (src/hooks/)
Local: Use useState()
```

---

## 💻 Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview build
npm run lint         # Check code
```

### Database
```bash
supabase migration up    # Apply migrations
supabase migration new   # Create migration
```

---

## 🔐 Admin Features

### Access
```typescript
// Admin only page
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

if (!user || !isAdmin) return <Navigate to="/" />;
```

### Required Setup
1. Create user account
2. Set `is_admin = true` in profiles table
3. Access /admin route

### Permissions
- ✅ View all orders
- ✅ Approve/reject orders
- ✅ Add/edit/delete products
- ✅ Upload product images
- ✅ View payment proofs
- ✅ Edit admin settings

---

## 📱 Routes

| Route | Component | Auth | Admin |
|-------|-----------|------|-------|
| / | Index | ❌ | ❌ |
| /products | Products | ❌ | ❌ |
| /products/:id | ProductDetail | ❌ | ❌ |
| /cart | Cart | ❌ | ❌ |
| /auth | Auth | ❌ | ❌ |
| /admin | Admin | ✅ | ✅ |
| /order-success | OrderSuccess | ❌ | ❌ |
| * | NotFound | ❌ | ❌ |

---

## 🎣 Custom Hooks

### useAuth()
```typescript
const { user, profile, isAdmin, signIn, signUp, signOut } = useAuth();
```

### useProducts()
```typescript
const { data: products, isLoading } = useProducts(category);
const createProduct = useCreateProduct();
const updateProduct = useUpdateProduct();
const deleteProduct = useDeleteProduct();
```

### useOrders()
```typescript
const { data: orders } = useOrders();
const updateOrderStatus = useUpdateOrderStatus();
```

### useImageUpload()
```typescript
const { 
  uploadProductImages,   // (files) => Promise<ImageUploadResult[]>
  uploadPaymentProof,    // (file) => Promise<ImageUploadResult | null>
  deleteProductImage,    // (path) => Promise<boolean>
  isUploading,           // boolean
  uploadProgress         // 0-100
} = useImageUpload();
```

### useCart()
```typescript
const { items, addItem, removeItem, updateQuantity, clear } = useCart();
```

---

## 📊 Component Hierarchy

```
App
├── ThemeProvider
├── AuthProvider
│   ├── CartProvider
│   │   └── QueryClientProvider
│   │       └── BrowserRouter (with future flags v7)
│   │           └── Routes
│   │               ├── Index
│   │               ├── Products
│   │               ├── ProductDetail
│   │               ├── Cart
│   │               ├── Auth
│   │               ├── Admin ← START HERE for new features
│   │               ├── OrderSuccess
│   │               └── NotFound
```

---

## 🛠️ Configuration

### Environment Variables
```env
VITE_SUPABASE_URL=https://xmnggboqigffehnfvuif.supabase.co
VITE_SUPABASE_PROJECT_ID=xmnggboqigffehnfvuif
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Supabase Project
- Project ID: `xmnggboqigffehnfvuif`
- URL: `https://xmnggboqigffehnfvuif.supabase.co`
- Region: (check dashboard)

---

## 🆕 What Was Added (Dec 18, 2025)

### Files Created
```
✅ supabase/migrations/20251218_add_product_management.sql
✅ src/hooks/useImageUpload.ts
✅ PROJECT_WALKTHROUGH.md
✅ IMAGE_UPLOAD_GUIDE.md
✅ SETUP_SUMMARY.md
✅ QUICK_REFERENCE.md (this file)
```

### Files Updated
```
✨ src/pages/Admin.tsx (complete rewrite - table layout)
✨ src/lib/types.ts (added discount/stock fields)
✨ src/App.tsx (added React Router v7 future flags)
```

---

## ⚡ Common Tasks

### Add a New Product
```typescript
const createProduct = useCreateProduct();
await createProduct.mutate({
  name: 'Product Name',
  description: 'Desc',
  price: 5000,
  discounted_price: 4000,
  discount_expiry: '2025-12-25',
  category: 'Electronics',
  stock_quantity: 10,
  images: ['url1', 'url2'],
  in_stock: true,
});
```

### Upload Images
```typescript
const { uploadProductImages } = useImageUpload();
const files = [file1, file2];
const results = await uploadProductImages(files);
// results = [{ url, path, size }, ...]
```

### Check User Role
```typescript
const { isAdmin } = useAuth();
if (isAdmin) {
  // Show admin controls
}
```

### Apply Discount
```typescript
// Database update
UPDATE products 
SET discounted_price = 4000, 
    discount_expiry = '2025-12-25' 
WHERE id = 'product-id';

// Display: Helper function
const discount = get_discount_percentage(5000, 4000, '2025-12-25');
// Returns: 20 (for 20% off display)
```

---

## 🐛 Debugging

### Check if admin user
```sql
SELECT id, email, is_admin FROM profiles 
WHERE email = 'admin@example.com';
```

### List uploaded images
```
Supabase Dashboard → Storage → product-images
```

### Check RLS policies
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';
```

### Monitor queries
```typescript
import { useQueryClient } from '@tanstack/react-query';
const queryClient = useQueryClient();
console.log(queryClient.getQueryData(['products']));
```

---

## 📈 Performance Tips

1. **Images**
   - Use lazy loading: `loading="lazy"`
   - Compress before upload
   - Use WebP format
   - Cache with `cacheControl: '3600'`

2. **Database**
   - Use indexes (already created)
   - Paginate large result sets
   - Use select() to fetch specific columns

3. **State**
   - React Query caches data
   - Don't refetch unnecessarily
   - Use dependent queries

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Image upload fails | Check admin role & RLS policy |
| Product not visible | Check `is_active = true` |
| Discount not showing | Check `discount_expiry > now()` |
| Admin route redirects | Verify `is_admin = true` in DB |
| Storage CORS error | Check Supabase CORS settings |
| Slow images | Compress & use CDN |

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `PROJECT_WALKTHROUGH.md` | Complete project guide (5000+ words) |
| `IMAGE_UPLOAD_GUIDE.md` | Image upload implementation |
| `SETUP_SUMMARY.md` | Architecture & setup |
| `QUICK_REFERENCE.md` | This file - quick lookup |

---

## 🎓 Next Learning Goals

- [ ] Add product edit functionality
- [ ] Implement image cropping
- [ ] Add batch operations
- [ ] Create analytics dashboard
- [ ] Set up email notifications
- [ ] Add SMS notifications
- [ ] Implement inventory alerts
- [ ] Add export/import functionality

---

## 📞 Quick Contacts

- **Supabase Docs:** https://supabase.com/docs
- **React Docs:** https://react.dev
- **Tailwind Docs:** https://tailwindcss.com/docs
- **TypeScript Docs:** https://www.typescriptlang.org/docs

---

## ✅ Deployment Checklist

Before going live:
- [ ] Run SQL migration
- [ ] Test image upload
- [ ] Verify admin access
- [ ] Check all routes
- [ ] Test on mobile
- [ ] Verify storage buckets
- [ ] Check RLS policies
- [ ] Monitor performance
- [ ] Set up backups
- [ ] Enable HTTPS

---

**Quick Reference Card**  
Version: 1.0  
Last Updated: December 18, 2025  
Status: 🟢 Ready to Use
