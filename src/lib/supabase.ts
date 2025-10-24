import { createClient } from '@supabase/supabase-js';
import type { Product, Category, Order, ProductWithCategory } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function getProducts(params?: {
  categoryId?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'price' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}): Promise<Product[]> {
  let query = supabase.from('products').select('*');

  if (params?.categoryId) {
    query = query.eq('category_id', params.categoryId);
  }

  if (params?.featured !== undefined) {
    query = query.eq('featured', params.featured);
  }

  if (params?.sortBy) {
    query = query.order(params.sortBy, {
      ascending: params.sortOrder === 'asc'
    });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  if (params?.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function searchProducts(searchTerm: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createOrder(order: Omit<Order, 'id' | 'created_at'>): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ISQ-${timestamp}-${random}`;
}
