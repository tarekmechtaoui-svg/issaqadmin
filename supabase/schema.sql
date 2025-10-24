/*
  Issaq Phone E-commerce Database Schema

  This schema has already been applied to your Supabase database.
  This file is provided for reference and documentation purposes.

  To view your current database schema, use the Supabase dashboard
  or run queries against the database.
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  description text,
  price numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  images text[] DEFAULT '{}',
  specs jsonb DEFAULT '{}'::jsonb,
  stock_quantity integer DEFAULT 0,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  shipping_address jsonb NOT NULL,
  items jsonb NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  shipping numeric(10,2) DEFAULT 0,
  tax numeric(10,2) DEFAULT 0,
  total numeric(10,2) NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read access to categories"
  ON categories FOR SELECT TO anon USING (true);

CREATE POLICY "Allow public read access to products"
  ON products FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous order creation"
  ON orders FOR INSERT TO anon WITH CHECK (true);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Sample Data (already inserted)
/*
INSERT INTO categories (name, slug, description) VALUES
  ('Phones', 'phones', 'Latest smartphones and mobile devices'),
  ('Accessories', 'accessories', 'Cases, chargers, and phone accessories'),
  ('Tablets', 'tablets', 'Tablets and iPad devices'),
  ('Wearables', 'wearables', 'Smartwatches and fitness trackers');

-- Sample products including iPhone 15 Pro Max, Samsung Galaxy S24 Ultra,
-- Google Pixel 8 Pro, OnePlus 12, iPhone 14, and various accessories
-- See migration file for complete sample data
*/
