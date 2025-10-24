export interface Order {
  id: number;
  customerName: string;
  email: string;
  product: string;
  quantity: number;
  price: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Completed';
  date: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface Category {
  id: number;
  name: string;
  productCount: number;
  status: 'Active' | 'Inactive';
}

export interface MenuItem {
  key: string;
  label: string;
  icon: string;
}

export interface StatCard {
  label: string;
  value: string | number;
  icon: string;
}