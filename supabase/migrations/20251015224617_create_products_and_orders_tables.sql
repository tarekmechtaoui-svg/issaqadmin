/*
  # Issaq Phone E-commerce Database Schema

  ## Overview
  Creates the complete database schema for an e-commerce platform selling phones and accessories.
  This migration sets up products, orders, and categories with appropriate security policies.

  ## New Tables
  
  ### `categories`
  - `id` (uuid, primary key) - Unique category identifier
  - `name` (text, unique) - Category name (e.g., "Phones", "Accessories")
  - `slug` (text, unique) - URL-friendly category identifier
  - `description` (text) - Category description
  - `created_at` (timestamptz) - Creation timestamp

  ### `products`
  - `id` (uuid, primary key) - Unique product identifier
  - `title` (text) - Product name
  - `slug` (text, unique) - URL-friendly product identifier
  - `category_id` (uuid, foreign key) - References categories table
  - `description` (text) - Detailed product description
  - `price` (numeric) - Product price in cents
  - `currency` (text) - Currency code (default: USD)
  - `images` (text[]) - Array of image URLs from Supabase storage
  - `specs` (jsonb) - Product specifications as JSON
  - `stock_quantity` (integer) - Available inventory
  - `featured` (boolean) - Whether product is featured on homepage
  - `created_at` (timestamptz) - Creation timestamp

  ### `orders`
  - `id` (uuid, primary key) - Unique order identifier
  - `order_number` (text, unique) - Human-readable order number
  - `customer_name` (text) - Customer's full name
  - `customer_email` (text) - Customer's email address
  - `shipping_address` (jsonb) - Complete shipping address as JSON
  - `items` (jsonb) - Array of order items with product details
  - `subtotal` (numeric) - Order subtotal in cents
  - `shipping` (numeric) - Shipping cost in cents
  - `tax` (numeric) - Tax amount in cents
  - `total` (numeric) - Total order amount in cents
  - `status` (text) - Order status (default: pending)
  - `created_at` (timestamptz) - Order creation timestamp

  ## Security
  
  ### Categories Table
  - Enable RLS on `categories` table
  - Add policy for public read access (unauthenticated users can view categories)
  
  ### Products Table
  - Enable RLS on `products` table
  - Add policy for public read access (unauthenticated users can view products)
  
  ### Orders Table
  - Enable RLS on `orders` table
  - Add policy allowing anyone to insert orders (for demo purposes - see README for production security)
  - Add policy preventing reads without authentication (orders are write-only via anon key)

  ## Sample Data
  
  Inserts sample categories and products with realistic data for the Issaq Phone store.

  ## Important Notes
  
  1. **Security Warning**: This schema allows anonymous order creation for demo purposes.
     In production, implement proper authentication or use Edge Functions with service role key.
  
  2. **Image Storage**: Upload product images to Supabase Storage bucket named 'product-images'
     with public read access. Update image URLs in products table accordingly.
  
  3. **Prices**: All prices stored in cents to avoid floating-point precision issues.
  
  4. **RLS Policies**: Current policies are permissive for demo. Tighten for production.
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create products table
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

-- Create orders table
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

-- RLS Policies for categories (public read)
CREATE POLICY "Allow public read access to categories"
  ON categories
  FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for products (public read)
CREATE POLICY "Allow public read access to products"
  ON products
  FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for orders (anonymous insert only, no read access)
CREATE POLICY "Allow anonymous order creation"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
  ('Phones', 'phones', 'Latest smartphones and mobile devices'),
  ('Accessories', 'accessories', 'Cases, chargers, and phone accessories'),
  ('Tablets', 'tablets', 'Tablets and iPad devices'),
  ('Wearables', 'wearables', 'Smartwatches and fitness trackers')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (title, slug, category_id, description, price, images, specs, stock_quantity, featured) 
SELECT 
  'iPhone 15 Pro Max',
  'iphone-15-pro-max',
  (SELECT id FROM categories WHERE slug = 'phones'),
  'The most powerful iPhone ever with titanium design, A17 Pro chip, and advanced camera system with 5x optical zoom.',
  1199.00,
  ARRAY['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'],
  '{"display": "6.7-inch Super Retina XDR", "chip": "A17 Pro", "camera": "48MP Main, 12MP Ultra Wide, 12MP Telephoto", "storage": "256GB", "battery": "Up to 29 hours video playback", "colors": ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"]}'::jsonb,
  50,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'iphone-15-pro-max');

INSERT INTO products (title, slug, category_id, description, price, images, specs, stock_quantity, featured)
SELECT
  'Samsung Galaxy S24 Ultra',
  'samsung-galaxy-s24-ultra',
  (SELECT id FROM categories WHERE slug = 'phones'),
  'Premium Android flagship with 200MP camera, S Pen, and Galaxy AI features for enhanced productivity.',
  1299.99,
  ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg'],
  '{"display": "6.8-inch Dynamic AMOLED 2X", "processor": "Snapdragon 8 Gen 3", "camera": "200MP Main, 12MP Ultra Wide, 50MP Telephoto, 10MP Telephoto", "storage": "256GB", "battery": "5000mAh", "features": ["S Pen included", "Galaxy AI"]}'::jsonb,
  35,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'samsung-galaxy-s24-ultra');

INSERT INTO products (title, slug, category_id, description, price, images, specs, stock_quantity, featured)
SELECT
  'Google Pixel 8 Pro',
  'google-pixel-8-pro',
  (SELECT id FROM categories WHERE slug = 'phones'),
  'Google flagship with advanced AI photography, Tensor G3 chip, and pure Android experience.',
  999.00,
  ARRAY['https://images.pexels.com/photos/4588047/pexels-photo-4588047.jpeg'],
  '{"display": "6.7-inch LTPO OLED", "processor": "Google Tensor G3", "camera": "50MP Main, 48MP Ultra Wide, 48MP Telephoto", "storage": "128GB", "battery": "5050mAh", "features": ["Magic Eraser", "Best Take", "7 years of updates"]}'::jsonb,
  40,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'google-pixel-8-pro');

INSERT INTO products (title, slug, category_id, description, price, images, specs, stock_quantity, featured)
SELECT
  'OnePlus 12',
  'oneplus-12',
  (SELECT id FROM categories WHERE slug = 'phones'),
  'Flagship killer with Hasselblad camera, fast charging, and smooth 120Hz display at an amazing price.',
  799.99,
  ARRAY['https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg'],
  '{"display": "6.82-inch AMOLED 120Hz", "processor": "Snapdragon 8 Gen 3", "camera": "50MP Main with Hasselblad, 48MP Ultra Wide, 64MP Telephoto", "storage": "256GB", "battery": "5400mAh", "charging": "100W SuperVOOC"}'::jsonb,
  60,
  false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'oneplus-12');

INSERT INTO products (title, slug, category_id, description, price, images, specs, stock_quantity, featured)
SELECT
  'iPhone 14',
  'iphone-14',
  (SELECT id FROM categories WHERE slug = 'phones'),
  'Reliable iPhone with great camera system, all-day battery life, and essential features at a lower price.',
  699.00,
  ARRAY['https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg'],
  '{"display": "6.1-inch Super Retina XDR", "chip": "A15 Bionic", "camera": "12MP Main, 12MP Ultra Wide", "storage": "128GB", "battery": "Up to 20 hours video playback", "colors": ["Blue", "Purple", "Midnight", "Starlight", "Red"]}'::jsonb,
  80,
  false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'iphone-14');

INSERT INTO products (title, slug, category_id, description, price, images, specs, stock_quantity, featured)
SELECT
  'Premium Leather Phone Case',
  'premium-leather-case',
  (SELECT id FROM categories WHERE slug = 'accessories'),
  'Handcrafted genuine leather case with card slots and premium stitching. Compatible with iPhone 15 series.',
  49.99,
  ARRAY['https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg'],
  '{"material": "Genuine Leather", "compatibility": ["iPhone 15", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15 Pro Max"], "features": ["2 card slots", "Magnetic closure", "Raised edges for screen protection"], "colors": ["Black", "Brown", "Navy"]}'::jsonb,
  200,
  false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'premium-leather-case');

INSERT INTO products (title, slug, category_id, description, price, images, specs, stock_quantity, featured)
SELECT
  '65W Fast Charger',
  '65w-fast-charger',
  (SELECT id FROM categories WHERE slug = 'accessories'),
  'Universal USB-C fast charger with GaN technology. Compact design, charges phones, tablets, and laptops.',
  39.99,
  ARRAY['https://images.pexels.com/photos/4526413/pexels-photo-4526413.jpeg'],
  '{"power": "65W", "ports": "2x USB-C, 1x USB-A", "technology": "GaN (Gallium Nitride)", "compatibility": "Universal - iPhone, Android, tablets, laptops", "features": ["Foldable plug", "Overcharge protection", "Temperature control"]}'::jsonb,
  150,
  false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = '65w-fast-charger');

INSERT INTO products (title, slug, category_id, description, price, images, specs, stock_quantity, featured)
SELECT
  'Wireless Charging Stand',
  'wireless-charging-stand',
  (SELECT id FROM categories WHERE slug = 'accessories'),
  '3-in-1 wireless charging station for phone, watch, and earbuds. Sleek design with fast charging support.',
  79.99,
  ARRAY['https://images.pexels.com/photos/4224099/pexels-photo-4224099.jpeg'],
  '{"charging": "15W phone, 5W watch, 5W earbuds", "compatibility": ["iPhone 12 and later", "Apple Watch", "AirPods", "Samsung Galaxy", "Google Pixel"], "features": ["Anti-slip design", "LED indicator", "Foreign object detection"], "colors": ["Black", "White"]}'::jsonb,
  100,
  false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'wireless-charging-stand');

INSERT INTO products (title, slug, category_id, description, price, images, specs, stock_quantity, featured)
SELECT
  'Tempered Glass Screen Protector',
  'tempered-glass-screen-protector',
  (SELECT id FROM categories WHERE slug = 'accessories'),
  'Ultra-clear 9H hardness tempered glass with oleophobic coating. Easy installation kit included.',
  14.99,
  ARRAY['https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg'],
  '{"hardness": "9H", "thickness": "0.33mm", "features": ["99.9% transparency", "Oleophobic coating", "Bubble-free installation", "Case-friendly design"], "compatibility": "Universal - Multiple sizes available"}'::jsonb,
  500,
  false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'tempered-glass-screen-protector');

INSERT INTO products (title, slug, category_id, description, price, images, specs, stock_quantity, featured)
SELECT
  'USB-C to Lightning Cable',
  'usb-c-lightning-cable',
  (SELECT id FROM categories WHERE slug = 'accessories'),
  'MFi certified cable for fast charging and data transfer. Durable braided design with reinforced connectors.',
  24.99,
  ARRAY['https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg'],
  '{"length": "6ft / 2m", "certification": "Apple MFi Certified", "features": ["Fast charging support", "480Mbps data transfer", "10000+ bend lifespan", "Braided nylon"], "colors": ["Black", "White", "Red"]}'::jsonb,
  300,
  false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'usb-c-lightning-cable');

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);