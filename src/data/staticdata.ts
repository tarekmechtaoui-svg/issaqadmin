import { Order, Product, Category } from '../types';

export const orders: Order[] = [
  {
    id: 1,
    customerName: "John Doe",
    email: "john@example.com",
    product: "Wireless Headphones",
    quantity: 2,
    price: 199.99,
    status: "Completed",
    date: "2024-01-15"
  },
  {
    id: 2,
    customerName: "Jane Smith",
    email: "jane@example.com",
    product: "Smart Watch",
    quantity: 1,
    price: 299.99,
    status: "Pending",
    date: "2024-01-16"
  },
  {
    id: 3,
    customerName: "Bob Johnson",
    email: "bob@example.com",
    product: "Laptop",
    quantity: 1,
    price: 1299.99,
    status: "Shipped",
    date: "2024-01-14"
  },
  {
    id: 4,
    customerName: "Alice Brown",
    email: "alice@example.com",
    product: "Smartphone",
    quantity: 1,
    price: 899.99,
    status: "Processing",
    date: "2024-01-17"
  }
];

export const products: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 199.99,
    stock: 45,
    status: "In Stock"
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "Electronics",
    price: 299.99,
    stock: 23,
    status: "In Stock"
  },
  {
    id: 3,
    name: "Laptop",
    category: "Electronics",
    price: 1299.99,
    stock: 12,
    status: "Low Stock"
  },
  {
    id: 4,
    name: "Smartphone",
    category: "Electronics",
    price: 899.99,
    stock: 0,
    status: "Out of Stock"
  },
  {
    id: 5,
    name: "Desk Chair",
    category: "Furniture",
    price: 249.99,
    stock: 34,
    status: "In Stock"
  }
];

export const categories: Category[] = [
  {
    id: 1,
    name: "Electronics",
    productCount: 15,
    status: "Active"
  },
  {
    id: 2,
    name: "Furniture",
    productCount: 8,
    status: "Active"
  },
  {
    id: 3,
    name: "Clothing",
    productCount: 23,
    status: "Active"
  },
  {
    id: 4,
    name: "Books",
    productCount: 56,
    status: "Active"
  },
  {
    id: 5,
    name: "Sports",
    productCount: 12,
    status: "Inactive"
  }
];