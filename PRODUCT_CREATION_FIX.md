Product Creation Fix - Admin Dashboard

Issues Found

1. Missing Mutation Call ⚠️
The `handleAddProduct` function in `Admin.tsx` (line 57) was only logging the product data and not actually calling the API to create the product. The TODO comment indicated this was incomplete implementation.

Original Code:
```typescript
const handleAddProduct = async (e: React.FormEvent) => {
  e.preventDefault();
  // TODO: Implement product creation API call
  console.log('Add product:', newProduct);
  setShowAddProduct(false);
  // ... reset form
};
```

2. Type Mismatch 🔧
The form was storing all values as strings, but the `Product` type expects:
- `price`: `number` (was stored as string)
- `discounted_price`: `number | null` (was stored as string)
- `stock_quantity`: `number` (was stored as string)

This would cause Supabase validation errors when trying to insert the data.

3. Missing Hook Import
The `useCreateProduct` hook existed in `useProducts.ts` but wasn't imported in `Admin.tsx`.

Solutions Implemented

1. ✅ Import the `useCreateProduct` Hook
```typescript
import { useProducts, useDeleteProduct, useCreateProduct } from '@/hooks/useProducts';
```

2. ✅ Initialize the Mutation Hook
```typescript
const createProduct = useCreateProduct();
```

3. ✅ Implement Proper Product Creation
```typescript
const handleAddProduct = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate required fields
  if (!newProduct.name || !newProduct.category || !newProduct.price || newProduct.stock_quantity === '') {
    console.error('Missing required fields');
    return;
  }

  // Convert string values to appropriate types
  const productData = {
    name: newProduct.name,
    description: newProduct.description || null,
    price: parseFloat(newProduct.price),
    discounted_price: newProduct.discounted_price ? parseFloat(newProduct.discounted_price) : null,
    discount_expiry: newProduct.discount_expiry || null,
    category: newProduct.category,
    stock_quantity: parseInt(newProduct.stock_quantity),
    images: [],
    in_stock: parseInt(newProduct.stock_quantity) > 0,
  };

  try {
    await createProduct.mutateAsync(productData);
    // Reset form on success
    setShowAddProduct(false);
    setNewProduct({...});
  } catch (error) {
    console.error('Error creating product:', error);
  }
};
```

4. ✅ Add Loading State to Submit Button
```typescript
<Button type="submit" disabled={createProduct.isPending}>
  {createProduct.isPending ? (
    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
  ) : (
    'Add Product'
  )}
</Button>
```

What Was Happening

1. User filled out the form with product data (all stored as strings)
2. Clicked "Add Product"
3. `handleAddProduct` was called, logged the data, and cleared the form
4. No API call was made - product was never saved to database
5. User saw no visual feedback that something went wrong

Now It Works

1. User fills out the form
2. Clicks "Add Product"
3. Form validates required fields
4. String values are converted to numbers
5. `useCreateProduct` mutation is called via `mutateAsync`
6. Loading spinner shows during creation
7. On success: Toast notification appears, form is cleared, products list refreshes
8. On error: Toast notification shows the error message

Files Modified
- [src/pages/Admin.tsx](src/pages/Admin.tsx)

Testing the Fix

1. Navigate to the Admin Dashboard
2. Click "Products" tab
3. Click "+ Add Product" button
4. Fill in all required fields:
   - Product Name: "test"
   - Category: "Electronics"
   - Price: "25000"
   - Stock Quantity: "10"
5. Click "Add Product"
6. You should see a loading indicator, then a success toast
7. The new product should appear in the products list below
