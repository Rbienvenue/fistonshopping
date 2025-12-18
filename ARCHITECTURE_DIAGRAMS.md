# 📋 Project Complete Walkthrough & Technical Diagrams

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT (React + TypeScript)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  UI Layer (Shadcn/UI Components)                               │
│  ├── Pages (8 total)                                           │
│  │   ├── Index (Homepage)                                      │
│  │   ├── Products (Listing)                                    │
│  │   ├── ProductDetail (Single product)                        │
│  │   ├── Cart (Shopping cart)                                  │
│  │   ├── Auth (Login/Signup)                                   │
│  │   ├── Admin (Dashboard) ✨ ENHANCED                          │
│  │   ├── OrderSuccess (Confirmation)                           │
│  │   └── NotFound (404)                                        │
│  │                                                              │
│  ├── Components (40+ Shadcn UI + Custom)                       │
│  │                                                              │
│  └── Context Layer (Global State)                              │
│      ├── AuthContext (User & Auth)                             │
│      ├── CartContext (Shopping cart)                           │
│      └── ThemeContext (Dark/Light mode)                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│              React Query (Server State Management)              │
│                                                                 │
│  Hooks (Data fetching & mutations)                             │
│  ├── useProducts (fetch, create, update, delete)              │
│  ├── useOrders (fetch, update status)                         │
│  ├── useAuth (login, signup, logout)                          │
│  ├── useImageUpload (upload, delete images) ✨ NEW             │
│  └── ...                                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓ REST API
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Supabase)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Authentication Service                     │   │
│  │  ├── Email/Password auth                               │   │
│  │  ├── Session management                                │   │
│  │  └── User profile trigger                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         PostgreSQL Database (5 Tables)                  │   │
│  │                                                          │   │
│  │  ├── profiles                                           │   │
│  │  │   ├── id, email, full_name                          │   │
│  │  │   └── is_admin ← Admin access control               │   │
│  │  │                                                       │   │
│  │  ├── products ✨ ENHANCED                               │   │
│  │  │   ├── name, description, price                      │   │
│  │  │   ├── stock_quantity (NEW) 📦                        │   │
│  │  │   ├── discounted_price (NEW) 💰                      │   │
│  │  │   ├── discount_expiry (NEW) 📅                       │   │
│  │  │   ├── is_active (NEW) 👁️                             │   │
│  │  │   └── images[]                                       │   │
│  │  │                                                       │   │
│  │  ├── orders                                             │   │
│  │  │   ├── customer info (name, phone, address)          │   │
│  │  │   ├── payment_proof_url                             │   │
│  │  │   ├── status (pending/approved/rejected)            │   │
│  │  │   └── total_amount                                  │   │
│  │  │                                                       │   │
│  │  ├── order_items (joins products → orders)             │   │
│  │  │   ├── quantity, price_at_purchase                   │   │
│  │  │   └── timestamps                                    │   │
│  │  │                                                       │   │
│  │  └── admin_settings                                    │   │
│  │      ├── store_name, store_description                │   │
│  │      └── social media & contact info                  │   │
│  │                                                          │   │
│  │  Indexes: (performance optimization)                    │   │
│  │  ├── products(category, in_stock, is_active, created) │   │
│  │  └── orders(status, created_at)                       │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           Storage Buckets (File Storage)                │   │
│  │                                                          │   │
│  │  product-images/ (PUBLIC)                               │   │
│  │  ├── Read: Anyone ✅                                    │   │
│  │  ├── Write: Admin only 🔒                              │   │
│  │  ├── Max: 5MB per file                                 │   │
│  │  ├── Types: JPEG, PNG, WebP, GIF                       │   │
│  │  └── Files: products/image-123.jpg                     │   │
│  │                                                          │   │
│  │  payment-proofs/ (PRIVATE)                              │   │
│  │  ├── Read: Admin only 🔒                               │   │
│  │  ├── Write: Anyone ✅                                   │   │
│  │  ├── Max: 10MB per file                                │   │
│  │  ├── Types: JPEG, PNG, PDF                             │   │
│  │  └── Files: payment-proofs/proof-456.jpg               │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Row Level Security (RLS) Policies:                           │
│  ├── products: SELECT all, INSERT/UPDATE/DELETE admins       │
│  ├── orders: INSERT all, SELECT/UPDATE admins               │
│  ├── storage.objects: READ public, WRITE admin per bucket    │
│  └── profiles: SELECT/UPDATE own, admins SELECT all          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete Data Flow for Adding a Product

```
STEP 1: User (Admin) Action
┌─────────────────────────┐
│ Admin opens dashboard   │
│ Clicks "Add Product"    │
└────────────┬────────────┘
             ↓
STEP 2: Form Displayed
┌──────────────────────────────────────────┐
│ Product Add Form                         │
│ ┌──────────────────────────────────────┐ │
│ │ Name: ________________________        │ │
│ │ Price: ______ RWF                   │ │
│ │ Discounted Price: ______ RWF        │ │
│ │ Discount Expires: ___/___/___       │ │
│ │ Stock: ______                       │ │
│ │ Category: _______________           │ │
│ │ Description: _______________        │ │
│ │ Images: [Choose Files]              │ │
│ │         [product1.jpg]              │ │
│ │         [product2.png]              │ │
│ │                                    │ │
│ │ [Cancel] [Add Product]             │ │
│ └──────────────────────────────────────┘ │
└────────────┬─────────────────────────────┘
             ↓
STEP 3: Form Submitted
┌────────────────────────┐
│ Admin clicks submit    │
│ Form validated         │
└────────────┬───────────┘
             ↓
STEP 4: Image Upload
┌──────────────────────────────────────────┐
│ useImageUpload Hook                      │
│                                          │
│ 1. Validate files                        │
│    ├─ Check size ≤ 5MB ✅               │
│    ├─ Check type (JPEG/PNG/WebP) ✅     │
│    └─ Generate unique names             │
│                                          │
│ 2. Upload to Supabase Storage            │
│    ├─ product-images/                   │
│    ├─ product-1734518400-abc123.jpg     │
│    └─ product-1734518400-def456.png     │
│                                          │
│ 3. Get public URLs                       │
│    ├─ https://cdn.supabase.co/.../j     │
│    └─ https://cdn.supabase.co/.../p     │
│                                          │
│ 4. Return results                        │
│    ├─ urls[] = [url1, url2]             │
│    └─ Progress: 100%                     │
└────────────┬──────────────────────────────┘
             ↓
STEP 5: Product Record Creation
┌──────────────────────────────────────────┐
│ INSERT INTO products (...)               │
│ VALUES (                                 │
│   'Product Name',                        │
│   'Description',                         │
│   5000,              ← price             │
│   4000,              ← discounted_price  │
│   '2025-12-25',      ← discount_expiry   │
│   'Electronics',                         │
│   10,                ← stock_quantity    │
│   [url1, url2],      ← images            │
│   true,              ← in_stock          │
│   true               ← is_active         │
│ )                                        │
└────────────┬──────────────────────────────┘
             ↓
STEP 6: Database Confirmation
┌────────────────────────────────────────┐
│ Product saved                          │
│ ID: a1b2c3d4-e5f6-7890-1234-567890ab │
│ created_at: 2025-12-18T14:32:00Z      │
└────────────┬───────────────────────────┘
             ↓
STEP 7: UI Update
┌────────────────────────────────────────┐
│ Admin dashboard refreshes              │
│ New product appears in products list   │
│ Toast: "Product added successfully"    │
│                                        │
│ Product Card Display:                  │
│ ┌──────────────────────────────────┐   │
│ │ [IMG1] Name        Stock: 10 ✅  │   │
│ │ Category                         │   │
│ │ 5000 RWF → 4000 RWF (20% OFF) 🔴│   │
│ │ Expires: Dec 25, 2025            │   │
│ │ [Edit] [Delete]                  │   │
│ └──────────────────────────────────┘   │
└────────────┬───────────────────────────┘
             ↓
STEP 8: Public Visibility
┌────────────────────────────────────┐
│ Product appears on:                │
│ ├── Homepage (Featured section)    │
│ ├── Products page (with filters)   │
│ ├── Search results                 │
│ └── Product detail page (if clicked)│
│                                    │
│ Customer sees:                     │
│ ├─ Product image (from storage)    │
│ ├─ Name & description              │
│ ├─ Discounted price (if active)    │
│ ├─ Discount % (20% OFF 🔴)         │
│ └─ Add to cart button              │
└────────────────────────────────────┘
```

---

## 📱 Admin Dashboard Component Structure

```
Admin Dashboard
│
├── Header
│   ├── "Admin Dashboard" Title
│   └── [Sign Out] Button
│
├── Tabs
│   ├── Orders Tab
│   │   └── Table
│   │       ├── Columns:
│   │       │   ├── Client ID (UUID first 8 chars)
│   │       │   ├── Full Name + Phone
│   │       │   ├── Delivery Address
│   │       │   ├── Amount (RWF)
│   │       │   ├── Payment Proof Link
│   │       │   ├── Status Badge (color-coded)
│   │       │   └── Actions (Approve/Reject if pending)
│   │       │
│   │       └── Rows (sorted by status)
│   │           ├── Pending orders (first)
│   │           ├── Approved orders
│   │           └── Rejected orders (last)
│   │
│   └── Products Tab
│       ├── [+ Add Product] Button
│       │
│       ├── Add Product Form (Collapsible) ✨
│       │   ├── Name input
│       │   ├── Category input
│       │   ├── Description textarea
│       │   ├── Price input (RWF)
│       │   ├── Discounted Price input
│       │   ├── Discount Expiry date picker
│       │   ├── Stock Quantity input
│       │   ├── File input (multiple images)
│       │   └── [Cancel] [Add Product] Buttons
│       │       └── Shows progress bar during upload
│       │
│       └── Product Cards (Grid)
│           ├── Image thumbnail
│           ├── Name + Category
│           ├── Stock indicator (color-coded)
│           ├── Price & Discounted Price
│           ├── Discount % badge
│           ├── Discount expiry countdown
│           ├── [Edit] Button
│           └── [Delete] Button
```

---

## 🔐 Authentication & Authorization Flow

```
SIGNUP FLOW
┌──────────────┐
│ User signs up│
│ email, pwd   │
└──────┬───────┘
       ↓
┌──────────────────────────────┐
│ Supabase Auth                │
│ (creates auth.users record)  │
└──────┬───────────────────────┘
       ↓
┌──────────────────────────────┐
│ Trigger: on_auth_user_create │
│ (creates profiles record)     │
│ is_admin = false (default)    │
└──────┬───────────────────────┘
       ↓
┌──────────────────────────────┐
│ Session stored in localStorage
└──────┬───────────────────────┘
       ↓
┌──────────────────────────────┐
│ Redirect to home page        │
│ User is logged in            │
└──────────────────────────────┘

ADMIN ACCESS
┌──────────────────────────────┐
│ User attempts /admin route   │
└──────┬───────────────────────┘
       ↓
┌──────────────────────────────┐
│ Admin.tsx checks:            │
│ if (!user) → redirect /      │
│ if (!isAdmin) → redirect /   │
└──────┬───────────────────────┘
       ↓
┌──────────────────────────────┐
│ WHERE is_admin = true        │
│ IN profiles WHERE id = uid   │
└──────┬───────────────────────┘
       ↓
  ✅ YES          ❌ NO
   ↓               ↓
GRANT ACCESS   DENY ACCESS
(show Admin)    (redirect home)

RLS POLICY CHECK
┌──────────────────────────────┐
│ User tries to INSERT product │
└──────┬───────────────────────┘
       ↓
┌──────────────────────────────┐
│ Policy: Admins can insert    │
│ EXISTS (SELECT 1 FROM        │
│   profiles WHERE             │
│   id = auth.uid() AND        │
│   is_admin = true)           │
└──────┬───────────────────────┘
       ↓
  ✅ YES          ❌ NO
   ↓               ↓
INSERT OK     PERMISSION
              DENIED
```

---

## 💾 Database Triggers & Functions

```
TRIGGERS CREATED:
├── on_auth_user_created
│   Event: INSERT on auth.users
│   Action: Create profiles record
│   →creates profile with is_admin=false
│
├── update_products_updated_at
│   Event: UPDATE on products
│   Action: Set updated_at = NOW()
│
├── update_orders_updated_at
│   Event: UPDATE on orders
│   Action: Set updated_at = NOW()
│
├── update_admin_settings_updated_at
│   Event: UPDATE on admin_settings
│   Action: Set updated_at = NOW()
│
└── update_profiles_updated_at
    Event: UPDATE on profiles
    Action: Set updated_at = NOW()

HELPER FUNCTIONS:
├── is_discount_active(expiry)
│   Returns: BOOLEAN
│   Logic: expiry IS NOT NULL AND expiry > NOW()
│
├── get_product_price(regular, discount, expiry)
│   Returns: DECIMAL
│   Logic: IF discount_active THEN discount ELSE regular
│
├── get_discount_percentage(regular, discount, expiry)
│   Returns: INTEGER
│   Logic: ROUND(((regular - discount) / regular) * 100)
│
└── handle_new_user()
    Trigger function for new user signup
    Creates profile record automatically
```

---

## 📊 Pricing Logic Example

```
Product: "Laptop"
Regular Price: 1,000,000 RWF
Discounted Price: 800,000 RWF
Discount Expiry: 2025-12-25

CALCULATION:
┌─────────────────────────────────┐
│ Today < Discount Expiry         │
│ 2025-12-18 < 2025-12-25 ✅     │
│                                 │
│ Display Price: 800,000 RWF 🟢   │
│ Discount: (200,000 / 1,000,000) │
│          = 20% OFF 🏷️           │
│ Expires in: 7 days ⏰           │
└─────────────────────────────────┘

AFTER EXPIRY:
┌─────────────────────────────────┐
│ Today ≥ Discount Expiry         │
│ 2025-12-26 ≥ 2025-12-25 ✅     │
│                                 │
│ Display Price: 1,000,000 RWF    │
│ No discount badge 🔴            │
│ Discount: Hidden/Inactive       │
└─────────────────────────────────┘
```

---

## 🔗 API Calls Made by Frontend

```
PRODUCTS
├── GET /rest/v1/products
│   └─ Fetch all products with filtering
│
├── POST /rest/v1/products
│   └─ Admin only: Create new product
│
├── PATCH /rest/v1/products?id=eq.{id}
│   └─ Admin only: Update product
│
└── DELETE /rest/v1/products?id=eq.{id}
    └─ Admin only: Delete product

ORDERS
├── GET /rest/v1/orders
│   └─ Admin only: Fetch all orders
│
├── POST /rest/v1/orders
│   └─ Anyone: Create new order
│
├── PATCH /rest/v1/orders?id=eq.{id}
│   └─ Admin only: Update order status
│
└── POST /rest/v1/order_items
    └─ Anyone: Add items to order

STORAGE
├── POST /storage/v1/object/product-images/{path}
│   └─ Admin only: Upload product image
│
├── GET /storage/v1/object/public/product-images/{path}
│   └─ Anyone: Get public image URL
│
├── DELETE /storage/v1/object/product-images/{path}
│   └─ Admin only: Delete product image
│
├── POST /storage/v1/object/payment-proofs/{path}
│   └─ Anyone: Upload payment proof
│
└── GET /storage/v1/object/payment-proofs/{path}?token=...
    └─ Admin only: Get signed URL for private file

AUTH
├── POST /auth/v1/signup
│   └─ Create new user account
│
├── POST /auth/v1/token?grant_type=password
│   └─ Login with email/password
│
├── POST /auth/v1/logout
│   └─ Logout (remove session)
│
└── GET /auth/v1/user
    └─ Get current user info
```

---

## 🎯 Project Statistics

| Metric | Count | Notes |
|--------|-------|-------|
| Pages | 8 | With fallback 404 |
| Components | 40+ | Shadcn UI library |
| Custom Hooks | 6 | Data & state management |
| Tables | 5 | PostgreSQL |
| Storage Buckets | 2 | Product images + Proofs |
| Routes | 8 | React Router |
| Context Providers | 3 | Auth, Cart, Theme |
| RLS Policies | 10+ | Granular access control |
| Database Triggers | 5 | Automation & timestamps |
| Helper Functions | 3 | Pricing logic |
| Indexes | 5+ | Performance optimization |
| API Endpoints | 15+ | Via Supabase |
| Total Lines | 5000+ | Frontend code |

---

## 📦 Dependencies Breakdown

### Core (5)
- react (18)
- react-router-dom (6)
- typescript
- vite
- tailwindcss

### Backend (1)
- @supabase/supabase-js

### State Management (2)
- @tanstack/react-query
- React Context (built-in)

### UI (5)
- shadcn/ui (40+ components)
- lucide-react (icons)
- framer-motion (animations)
- class-variance-authority
- clsx

### Forms (2)
- react-hook-form
- @hookform/resolvers

### Notifications (1)
- sonner

### Build Tools (1)
- esbuild

---

## 🚀 Deployment Readiness

✅ **Frontend:**
- [x] TypeScript for type safety
- [x] ESLint for code quality
- [x] Responsive design (mobile/tablet/desktop)
- [x] Optimized components
- [x] Error boundaries
- [x] Loading states

✅ **Backend:**
- [x] Database migrations
- [x] RLS policies
- [x] Triggers & functions
- [x] Indexes for performance
- [x] Storage buckets
- [x] Error handling

✅ **Security:**
- [x] Role-based access
- [x] File validation
- [x] Input sanitization
- [x] Secure storage
- [x] CORS configuration

---

**Project Architecture Document**  
Created: December 2025  
Updated: December 18, 2025  
Status: ✅ Complete & Production-Ready
