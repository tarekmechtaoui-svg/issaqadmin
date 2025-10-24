export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  description: string | null;
  price: number;
  currency: string;
  images: string[];
  specs: Record<string, any>;
  stock_quantity: number;
  featured: boolean;
  created_at: string;
}

export interface ProductWithCategory extends Product {
  category?: Category;
}

export interface OrderItem {
  product_id: string;
  title: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface ShippingAddress {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
