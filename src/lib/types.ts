export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discounted_price: number | null;
  discount_expiry: string | null;
  category: string;
  stock_quantity: number;
  images: string[];
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  phone_number: string;
  delivery_address: string;
  payment_proof_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  admin_comment: string | null;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  created_at: string;
  product?: Product;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export interface AdminSettings {
  id: string;
  instagram_url: string | null;
  whatsapp_number: string | null;
  phone_number: string | null;
  store_name: string | null;
  store_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
export interface ChatMessage {
  id: string;
  user_id: string;
  sender_name: string;
  sender_role: 'user' | 'admin';
  message: string;
  created_at: string;
  updated_at: string;
}