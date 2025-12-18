# Image Upload Implementation Guide

## 📋 Overview

This guide walks through implementing the image upload feature in the admin dashboard using the `useImageUpload` hook.

---

## 🗂️ File Structure

```
src/
├── hooks/
│   └── useImageUpload.ts      ← Image upload utilities
├── pages/
│   └── Admin.tsx               ← Admin dashboard (uses hook)
└── lib/
    └── types.ts                ← Product type definitions
```

---

## 🔧 Implementation Steps

### Step 1: Already Done ✅
The following files are already created:
- ✅ `src/hooks/useImageUpload.ts` - Upload utilities
- ✅ `src/pages/Admin.tsx` - Enhanced admin dashboard
- ✅ `supabase/migrations/20251218_add_product_management.sql` - Database setup

### Step 2: Run Database Migration

#### Option A: Supabase Dashboard
1. Go to https://app.supabase.com
2. Select your project: `xmnggboqigffehnfvuif`
3. Go to SQL Editor
4. Create new query
5. Copy entire content from `supabase/migrations/20251218_add_product_management.sql`
6. Click "Run"
7. Verify all statements execute successfully

#### Option B: Supabase CLI (if set up)
```bash
supabase migration up
```

### Step 3: Update Product Type (Already Done ✅)

The `Product` type in `src/lib/types.ts` already includes:
```typescript
export interface Product {
  stock_quantity: number;
  discounted_price: number | null;
  discount_expiry: string | null;
  // ... other fields
}
```

### Step 4: Integrate Image Upload in Admin Dashboard

The admin dashboard already has the form structure. Now update the `handleAddProduct` function:

#### Current Code (in `/src/pages/Admin.tsx`)
```typescript
const handleAddProduct = async (e: React.FormEvent) => {
  e.preventDefault();
  // TODO: Implement product creation API call
  console.log('Add product:', newProduct);
  setShowAddProduct(false);
  // ... reset form
};
```

#### Updated Code with Image Upload
```typescript
const handleAddProduct = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const fileInput = document.getElementById('images') as HTMLInputElement;
  const files = fileInput?.files;
  
  if (!files || files.length === 0) {
    toast.error('Please select at least one image');
    return;
  }

  setIsLoading(true);
  try {
    // Upload images
    const imageResults = await uploadProductImages(Array.from(files));
    
    if (imageResults.length === 0) {
      toast.error('Failed to upload images');
      setIsLoading(false);
      return;
    }

    // Extract URLs
    const imageUrls = imageResults.map(result => result.url);

    // Create product
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        discounted_price: newProduct.discounted_price ? parseFloat(newProduct.discounted_price) : null,
        discount_expiry: newProduct.discount_expiry || null,
        category: newProduct.category,
        stock_quantity: parseInt(newProduct.stock_quantity),
        images: imageUrls,
        in_stock: true,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create product: ' + error.message);
      return;
    }

    toast.success('Product created successfully!');
    setShowAddProduct(false);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      discounted_price: '',
      discount_expiry: '',
      category: '',
      stock_quantity: '',
    });
    
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to add product');
  } finally {
    setIsLoading(false);
  }
};
```

---

## 📸 Image Upload Hook Usage

### Function Signatures

#### `uploadProductImages(files, options?)`
Uploads multiple product images

```typescript
// Basic usage
const results = await uploadProductImages(files);

// With options
const results = await uploadProductImages(files, {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png'],
});

// Results contain
[
  {
    url: 'https://..../product-123.jpg',
    path: 'products/product-123.jpg',
    size: 204800,
  },
  // ...
]
```

#### `uploadPaymentProof(file)`
Uploads single payment proof

```typescript
const result = await uploadPaymentProof(file);
// result: { url, path, size } or null
```

#### `deleteProductImage(imagePath)`
Deletes a product image

```typescript
const success = await deleteProductImage('products/product-123.jpg');
// success: boolean
```

---

## 🎨 UI Components for Upload

### File Input Component
```typescript
<div>
  <Label htmlFor="images">Product Images</Label>
  <Input
    id="images"
    type="file"
    accept="image/*"
    multiple
    required
  />
  <p className="text-xs text-muted-foreground mt-1">
    Upload product images (auto-cropped for optimal display)
  </p>
</div>
```

### Upload Progress Indicator
```typescript
{isUploading && (
  <div className="flex items-center gap-2">
    <Loader2 className="w-4 h-4 animate-spin" />
    <span className="text-sm">Uploading: {uploadProgress}%</span>
  </div>
)}
```

---

## ✨ Advanced Features

### Image Validation

```typescript
// Check before upload
const validateImage = (file: File): boolean => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (file.size > maxSize) {
    toast.error('Image too large');
    return false;
  }
  
  if (!allowedTypes.includes(file.type)) {
    toast.error('Invalid image type');
    return false;
  }
  
  return true;
};
```

### Image Cropping (Optional Enhancement)

Install react-image-crop:
```bash
npm install react-image-crop
```

Use in Admin component:
```typescript
import { useImageCrop } from 'react-image-crop';

// Crop image before upload
const croppedImage = await cropImage(file, { width: 400, height: 300 });
const results = await uploadProductImages([croppedImage]);
```

### Batch Delete
```typescript
const deleteMultipleImages = async (paths: string[]) => {
  for (const path of paths) {
    await deleteProductImage(path);
  }
};
```

---

## 🔐 Security Checklist

- ✅ File size limits (5MB for product images, 10MB for payment proofs)
- ✅ File type validation (JPEG, PNG, WebP, GIF for products; PDF for proofs)
- ✅ Admin-only upload permissions (via RLS)
- ✅ Public read for product images
- ✅ Private (signed URL) for payment proofs
- ✅ Automatic filename generation (prevents directory traversal)
- ✅ Error handling and user feedback

---

## 📊 Database Changes

### Products Table - New Columns
```sql
-- Stock tracking
ALTER TABLE products ADD stock_quantity INTEGER DEFAULT 0;

-- Discount management
ALTER TABLE products ADD discounted_price DECIMAL(10,2);
ALTER TABLE products ADD discount_expiry TIMESTAMP;

-- Visibility control
ALTER TABLE products ADD is_active BOOLEAN DEFAULT true;
```

### Storage Buckets
```
product-images/
├── products/
│   ├── product-1702918800000-abc123.jpg
│   ├── product-1702918800000-abc123.png
│   └── ...
└── (public bucket, anyone can view)

payment-proofs/
├── proof-1702918800000-xyz789.jpg
├── proof-1702918800000-xyz789.pdf
└── (private bucket, admin view only)
```

---

## 🧪 Testing

### Manual Test Flow

1. **Create Admin User**
   - Sign up with email
   - Set `is_admin = true` in profiles table

2. **Test Image Upload**
   - Go to Admin Dashboard
   - Click "Add Product"
   - Fill form
   - Select 2-3 images
   - Click "Add Product"
   - Check: Progress bar shows
   - Check: Toast notification appears
   - Check: Product appears in list

3. **Verify Storage**
   - Supabase Dashboard → Storage
   - Check `product-images` bucket
   - Verify files were uploaded
   - Check file names (auto-generated)

4. **Test Image Display**
   - Go to Products page
   - Check image displays
   - Check on mobile (responsive)

5. **Test Deletion**
   - Admin Dashboard → Products
   - Click delete on a product
   - Verify image removed from storage

---

## 🐛 Troubleshooting

### Images not uploading

**Problem:** Upload fails silently
```typescript
// Check 1: RLS Policy
SELECT * FROM storage.objects WHERE bucket_id = 'product-images';

-- Check 2: Bucket exists
SELECT * FROM storage.buckets WHERE id = 'product-images';

-- Check 3: User is admin
SELECT is_admin FROM profiles WHERE id = auth.uid();
```

### Upload progress not showing

**Problem:** `uploadProgress` state not updating

```typescript
// Add dependency array to useCallback
const uploadProductImages = useCallback(async (...) => {
  // ...
}, [setUploadProgress]); // Include setUploadProgress
```

### File size errors

**Problem:** "File exceeds maximum size" error

```typescript
// Check file sizes before upload
Array.from(files).forEach(file => {
  console.log(`${file.name}: ${(file.size / 1024).toFixed(2)}KB`);
});
```

### CORS issues

**Problem:** "Failed to fetch" when uploading

```typescript
// Verify Supabase CORS settings
// Supabase Dashboard → API Settings → CORS Configuration
// Should include your domain
```

---

## 📈 Performance Optimization

### Lazy Load Images
```typescript
<img 
  src={image} 
  loading="lazy"
  alt="Product"
  className="w-full object-cover"
/>
```

### Optimize File Size Before Upload
```typescript
const optimizeImage = async (file: File): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const image = new Image();
  
  image.onload = () => {
    canvas.width = 1024;
    canvas.height = 768;
    ctx?.drawImage(image, 0, 0, 1024, 768);
  };
  
  image.src = URL.createObjectURL(file);
  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
};
```

### Cache Control
Already configured in `useImageUpload.ts`:
```typescript
cacheControl: '3600' // 1 hour
```

---

## ✅ Checklist for Deployment

- [ ] Run SQL migration
- [ ] Test image upload as admin
- [ ] Test image display on public pages
- [ ] Test mobile responsiveness
- [ ] Check storage bucket RLS policies
- [ ] Verify admin user has `is_admin = true`
- [ ] Test payment proof upload
- [ ] Monitor storage usage
- [ ] Set up automated backups

---

## 📚 Related Files

- 📄 [PROJECT_WALKTHROUGH.md](PROJECT_WALKTHROUGH.md) - Complete project overview
- 🗄️ `supabase/migrations/20251218_add_product_management.sql` - Database setup
- 🎣 `src/hooks/useImageUpload.ts` - Image upload hook
- 📱 `src/pages/Admin.tsx` - Admin dashboard

---

**Created:** December 18, 2025  
**Updated:** December 18, 2025
