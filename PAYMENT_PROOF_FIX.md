Payment Proof Image Loading Fix - Admin Dashboard

The Problem

When admins tried to view payment proof images, they encountered:
```
Failed to load resource: the server responded with a status of 404 ()
```

Root Cause Analysis

1. Private Bucket Issue 🔒
   - Payment proofs are stored in a PRIVATE Supabase bucket (`payment-proofs`)
   - Private buckets require signed URLs to access files
   - Public URLs from `getPublicUrl()` don't work for private buckets

2. Wrong Method Used ❌
   - Checkout form used `getPublicUrl()` for a private bucket
   - This returned an invalid URL that returns 404
   - URLs from private buckets need `createSignedUrl()` instead

3. No Dynamic URL Generation ⏰
   - Even if URLs were signed, they expire after a set time
   - Admin needed fresh signed URLs each time they viewed proofs

The Solution

1. Store File Path Instead of URL

Before (CheckoutForm.tsx):
```typescript
// This returns invalid URLs for private buckets
const { data: { publicUrl } } = supabase.storage
  .from('payment-proofs')
  .getPublicUrl(fileName);
return publicUrl;  // ❌ 404 error
```

After (CheckoutForm.tsx):
```typescript
// Store just the file path - URL generation happens when viewing
return fileName;  // ✅ Simple file path stored in database
```

2. Create ViewPaymentProofButton Component

New file: [src/components/ViewPaymentProofButton.tsx](src/components/ViewPaymentProofButton.tsx)

This component:
- Generates fresh signed URLs on demand
- Valid for 7 days (long enough for admin to review)
- Provides View (opens in new tab) and Download buttons
- Shows loading state during URL generation
- Handles errors gracefully

How it works:
```typescript
const handleViewProof = async () => {
  // Generate fresh signed URL every time admin clicks View
  const { data, error } = await supabase.storage
    .from('payment-proofs')
    .createSignedUrl(filePath, 60  60  24  7); // 7 days
  
  if (data?.signedUrl) {
    window.open(data.signedUrl, '_blank');
  }
};
```

3. Update Admin Dashboard

Before (Admin.tsx):
```typescript
{order.payment_proof_url ? (
  <a href={order.payment_proof_url} target="_blank">
    <Eye className="w-4 h-4" /> View
  </a>
) : (
  <span>-</span>
)}
```

After (Admin.tsx):
```typescript
{order.payment_proof_url ? (
  <ViewPaymentProofButton filePath={order.payment_proof_url} />
) : (
  <span>-</span>
)}
```

Files Modified

- [src/components/checkout/CheckoutForm.tsx](src/components/checkout/CheckoutForm.tsx) - Changed to store file path
- [src/pages/Admin.tsx](src/pages/Admin.tsx) - Use new ViewPaymentProofButton component
- [src/components/ViewPaymentProofButton.tsx](src/components/ViewPaymentProofButton.tsx) - NEW component

How It Works Now

Flow for Viewing Payment Proofs:

1. Customer uploads proof
   - Selects image in checkout
   - File is uploaded to `payment-proofs` bucket
   - File path is stored in database (e.g., "1702900000000-abc123.png")

2. Admin views order
   - Sees orders list with payment status
   - Clicks "View" button for proof

3. Dynamic signed URL generation
   - Component requests fresh signed URL from Supabase
   - URL is valid for 7 days
   - Opens in new tab

4. Admin downloads (optional)
   - Can also click "Download" button
   - Saves payment proof locally

Data Flow Diagram:

```
Customer Payment Proof Upload:
├─ SelectFile(image)
├─ Upload to "payment-proofs" bucket
└─ Store filePath in orders.payment_proof_url ✓

Admin Views Payment Proof:
├─ Click "View" button
├─ Component calls createSignedUrl(filePath)
├─ Gets signed URL (valid 7 days)
└─ Opens in new tab ✓
```

Security Details

Private Bucket Benefits:
- ✅ Files not publicly accessible
- ✅ Only authenticated admins can access via signed URLs
- ✅ Signed URLs expire (7 days)
- ✅ Audit trail of file access

Storage Permissions:
```sql
-- Anyone can upload (customers)
CREATE POLICY "Anyone can upload payment proofs" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'payment-proofs');

-- Only admins can view/download
CREATE POLICY "Admins can view payment proofs" 
  ON storage.objects FOR SELECT 
  USING (
    bucket_id = 'payment-proofs' 
    AND EXISTS (SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND is_admin = true)
  );
```

Testing the Fix

1. Place an order with payment proof
   - Go to Cart
   - Click "Checkout"
   - Upload a payment proof screenshot
   - Submit order

2. View in Admin Dashboard
   - Go to Admin Dashboard
   - Click "Orders" tab
   - Find the order you just placed
   - Click "View" button next to payment proof
   - ✅ Image should open in new tab
   - ✅ Click "Download" to save locally

3. Verify no 404 errors
   - Check browser console (F12)
   - Should see no 404 errors
   - Network tab shows successful signed URL requests

Why This Is Better

| Before | After |
|--------|-------|
| ❌ Always returned 404 | ✅ Works every time |
| ❌ No error handling | ✅ Toast notifications |
| ❌ No download option | ✅ Can download proofs |
| ❌ No loading state | ✅ Shows loading indicator |
| ❌ Hard-coded URL | ✅ Fresh URL each time |
| ❌ URLs would expire | ✅ 7-day validity |

Technical Details

Signed URL Generation:
- Duration: 7 days (604,800 seconds)
- Generated on-demand (not stored)
- Admin-only access enforced by Supabase policies
- Works offline once URL is generated

Component Features:
- React functional component with hooks
- State management for loading state
- Toast notifications for errors
- Graceful error handling
- Both View and Download functionality

Troubleshooting

Still seeing 404?
- Clear browser cache
- Check Supabase storage bucket permissions
- Verify admin profile has `is_admin = true`
- Check browser console for specific error message

Can't download proof?
- Ensure file extension is correct in filePath
- Check browser download settings
- Try viewing first, then download

Signed URL expired?
- Generate a fresh one by clicking View again
- URLs are valid for 7 days
- No need to re-upload files
