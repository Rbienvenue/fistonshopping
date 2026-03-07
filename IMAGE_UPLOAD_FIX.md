Product Image Upload Fix - Admin Dashboard

Issues Found

1. No Image Upload Implementation ⚠️
The form had a file input for images but the selected files were never processed or uploaded. The code was setting `images: []` regardless of file selection.

2. Broken Placeholder Image 🖼️
When no images were uploaded, the code tried to load from `https://via.placeholder.com/120` which resulted in:
```
GET https://via.placeholder.com/120 net::ERR_NAME_NOT_RESOLVED
```

This happens when:
- The external service is unreachable
- No internet connection to that external domain
- CORS issues or network restrictions

3. No Image Preview 👁️
Users couldn't see what images they selected before uploading, leading to confusion.

4. No Image Cleanup 🧹
Users couldn't remove accidentally selected images without resetting the entire form.

Solutions Implemented

1. ✅ Import Image Upload Hook
```typescript
import { useImageUpload } from '@/hooks/useImageUpload';
```

2. ✅ Initialize Image Upload State
```typescript
const { uploadProductImages, isUploading: isUploadingImages } = useImageUpload();
const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
```

3. ✅ Implement Image File Handling in Form
```typescript
<Input
  id="images"
  type="file"
  accept="image/"
  multiple
  onChange={(e) => setSelectedImageFiles(Array.from(e.target.files || []))}
/>
```

4. ✅ Add Image Preview with Removal Option
```typescript
{selectedImageFiles.length > 0 && (
  <div className="mt-3 flex flex-wrap gap-2">
    {selectedImageFiles.map((file, idx) => (
      <div key={idx} className="relative">
        <img 
          src={URL.createObjectURL(file)} 
          alt={`Preview ${idx}`}
          className="w-20 h-20 object-cover rounded-lg border"
        />
        <button
          type="button"
          onClick={() => setSelectedImageFiles(selectedImageFiles.filter((_, i) => i !== idx))}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
        >
          ×
        </button>
      </div>
    ))}
  </div>
)}
```

5. ✅ Upload Images Before Creating Product
```typescript
// Upload images first if any are selected
let uploadedImageUrls: string[] = [];
if (selectedImageFiles.length > 0) {
  const uploadResults = await uploadProductImages(selectedImageFiles);
  uploadedImageUrls = uploadResults.map(result => result.url);
  
  if (uploadedImageUrls.length === 0) {
    console.error('Image upload failed');
    return;
  }
}

// Then create product with uploaded URLs
const productData = {
  // ... other fields
  images: uploadedImageUrls,
  // ... other fields
};
```

6. ✅ Replace External Placeholder with Local Fallback
Instead of relying on external service:
```typescript
// BEFORE (broken):
src={product.images?.[0] || 'https://via.placeholder.com/120'}

// AFTER (works offline):
<div className="w-full md:w-24 h-24 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
  {product.images?.[0] ? (
    <img 
      src={product.images[0]} 
      alt={product.name} 
      className="w-full h-full object-cover rounded-lg"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  ) : (
    <Package className="w-8 h-8 text-muted-foreground" />
  )}
</div>
```

7. ✅ Add Loading State for Image Upload
```typescript
<Button 
  type="submit"
  disabled={createProduct.isPending || isUploadingImages}
>
  {createProduct.isPending || isUploadingImages ? (
    <>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
      {isUploadingImages ? 'Uploading images...' : 'Creating...'}
    </>
  ) : (
    'Add Product'
  )}
</Button>
```

How It Works Now

Adding a Product with Images:

1. Select Images
   - Click file input and select one or more images
   - Preview thumbnails appear with remove buttons (×)
   - Counter shows "N image(s) selected"

2. Upload Process
   - Click "Add Product"
   - Button shows "Uploading images..." with spinner
   - Images are uploaded to Supabase Storage (`product-images` bucket)
   - Unique filenames with timestamps prevent conflicts

3. Create Product
   - After images upload successfully, product record is created
   - Button shows "Creating..." with spinner
   - Image URLs are stored in product's `images` array

4. Success
   - Toast notification: "Product created successfully"
   - Form resets, including image selection
   - New product appears in list with image preview

5. Display with Fallback
   - If product has images: displays first image
   - If product has no images: displays Package icon on muted background
   - Handles image load errors gracefully

Image Upload Details

Hook Used: `useImageUpload` from `src/hooks/useImageUpload.ts`

Features:
- Validates file size (max 5MB by default)
- Validates file type (JPEG, PNG, WebP)
- Creates unique filenames with timestamp
- Uploads to Supabase Storage
- Returns public URLs for each image
- Shows toast notifications on success/error

Storage Bucket: `product-images` (public bucket for displaying product images)

Files Modified
- [src/pages/Admin.tsx](src/pages/Admin.tsx)

Testing the Fix

1. Go to Admin Dashboard → Products tab
2. Click "+ Add Product"
3. Fill in required fields:
   - Product Name
   - Category
   - Price
   - Stock Quantity
4. Select one or more images ← NEW
5. See image previews with remove buttons ← NEW
6. Click "Add Product"
7. Watch "Uploading images..." progress ← NEW
8. Product is created with images
9. Success toast appears
10. New product displays in list with actual images ← FIXED (no more placeholder errors)

Fallback Image

Products without images now show:
- Icon: Package icon (from lucide-react)
- Background: Muted background color
- No external requests: Works offline

This prevents the `net::ERR_NAME_NOT_RESOLVED` error completely.
