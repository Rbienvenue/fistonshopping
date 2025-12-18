# 📦 Storage Buckets Setup Guide

**Problem:** SQL migrations can't modify storage permissions. **Solution:** Set up buckets via Supabase Dashboard.

---

## ✅ Step 1: Run the SQL Migration First

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor** → **New Query**
4. Open file: `supabase/migrations/20251218_add_product_management.sql`
5. Copy all content
6. Paste into SQL Editor
7. Click **Run** ✓

**Expected Result:** Table columns added, indexes created, functions added (no errors)

---

## 📸 Step 2: Create Storage Buckets

### Create "product-images" Bucket (PUBLIC)

1. **Storage** → **Buckets** → **+ New Bucket**
   - Bucket name: `product-images`
   - Make it public: ✅ YES
   - Click **Create Bucket**

2. Configuration:
   - File size limit: 5MB
   - Allowed file types: JPEG, PNG, WebP, GIF

### Create "payment-proofs" Bucket (PRIVATE)

1. **Storage** → **Buckets** → **+ New Bucket**
   - Bucket name: `payment-proofs`
   - Make it public: ❌ NO (private)
   - Click **Create Bucket**

2. Configuration:
   - File size limit: 10MB
   - Allowed file types: JPEG, PNG, PDF

---

## 🔐 Step 3: Set Up RLS Policies

### For product-images (PUBLIC BUCKET)

#### Policy 1: Everyone can READ
1. Select `product-images` bucket
2. **Policies** → **New Policy** → **For SELECT**
3. **Policy Name:** "Anyone can view product images"
4. **Target roles:** `anon`, `authenticated`
5. **Using expression:** Leave blank (allows all)
6. Click **Review** → **Save policy**

#### Policy 2: Only admins can UPLOAD
1. **Policies** → **New Policy** → **For INSERT**
2. **Policy Name:** "Admins can upload product images"
3. **Target roles:** `authenticated`
4. **With check expression:**
```sql
EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
  AND is_admin = true
)
```
5. Click **Review** → **Save policy**

#### Policy 3: Only admins can UPDATE
1. **Policies** → **New Policy** → **For UPDATE**
2. **Policy Name:** "Admins can update product images"
3. **Target roles:** `authenticated`
4. **Using expression:**
```sql
EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
  AND is_admin = true
)
```
5. Click **Review** → **Save policy**

#### Policy 4: Only admins can DELETE
1. **Policies** → **New Policy** → **For DELETE**
2. **Policy Name:** "Admins can delete product images"
3. **Target roles:** `authenticated`
4. **Using expression:**
```sql
EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
  AND is_admin = true
)
```
5. Click **Review** → **Save policy**

---

### For payment-proofs (PRIVATE BUCKET)

#### Policy 1: Everyone can UPLOAD
1. Select `payment-proofs` bucket
2. **Policies** → **New Policy** → **For INSERT**
3. **Policy Name:** "Anyone can upload payment proofs"
4. **Target roles:** `authenticated`
5. **With check expression:** Leave blank (allows all authenticated users)
6. Click **Review** → **Save policy**

#### Policy 2: Only admins can VIEW
1. **Policies** → **New Policy** → **For SELECT**
2. **Policy Name:** "Admins can view payment proofs"
3. **Target roles:** `authenticated`
4. **Using expression:**
```sql
EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
  AND is_admin = true
)
```
5. Click **Review** → **Save policy**

---

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] SQL migration ran without errors
- [ ] `stock_quantity` column exists on products table
- [ ] `discounted_price` column exists on products table
- [ ] `discount_expiry` column exists on products table
- [ ] `is_active` column exists on products table
- [ ] `product-images` bucket exists and is PUBLIC
- [ ] `payment-proofs` bucket exists and is PRIVATE
- [ ] 4 policies set up for product-images
- [ ] 2 policies set up for payment-proofs
- [ ] Helper functions created: `is_discount_active`, `get_product_price`, `get_discount_percentage`
- [ ] Performance indexes created

---

## 🧪 Testing Storage Access

### Test Product Image Upload (as Admin)

```typescript
// This should succeed if you're admin
const { data, error } = await supabase.storage
  .from('product-images')
  .upload(`products/${Date.now()}.jpg`, file);
```

### Test Product Image View (as Anyone)

```typescript
// This should always work
const { data } = supabase.storage
  .from('product-images')
  .getPublicUrl(`products/sample.jpg`);
```

### Test Payment Proof Upload (as Customer)

```typescript
// This should succeed for any authenticated user
const { data, error } = await supabase.storage
  .from('payment-proofs')
  .upload(`orders/${Date.now()}.pdf`, file);
```

### Test Payment Proof View (as Admin only)

```typescript
// This should fail for non-admins
const { data } = supabase.storage
  .from('payment-proofs')
  .download(`orders/sample.pdf`);
```

---

## 🐛 Troubleshooting

### Error: "Bucket already exists"
- Go to Storage → Buckets
- Delete old buckets with same name
- Create new ones

### Error: "Permission denied"
- Verify user has `is_admin = true` in profiles table
- Check RLS policies are correct
- Make sure auth user ID matches

### Error: "File too large"
- Product images: max 5MB
- Payment proofs: max 10MB
- Compress files before uploading

### Files not showing up
- Check bucket is set to PUBLIC (for product-images)
- Verify RLS policies are enabled
- Check user has correct role

---

## 📝 Summary

| Bucket | Public? | Max Size | File Types | Who Can Upload | Who Can View |
|--------|---------|----------|------------|----------------|--------------|
| product-images | ✅ Yes | 5MB | JPEG, PNG, WebP, GIF | Admins only | Everyone |
| payment-proofs | ❌ No | 10MB | JPEG, PNG, PDF | Any user | Admins only |

---

## 🔗 Related Files

- `supabase/migrations/20251218_add_product_management.sql` - Database changes
- `src/hooks/useImageUpload.ts` - Upload functions
- `src/pages/Admin.tsx` - Admin dashboard
- `IMAGE_UPLOAD_GUIDE.md` - Image upload implementation

---

**✅ After completing these steps, your storage is ready for production!**
