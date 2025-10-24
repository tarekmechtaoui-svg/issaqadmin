import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories, searchProducts } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';
import { CategoryFilter } from '../components/CategoryFilter';
import type { Product } from '../types/database';
import { SlidersHorizontal } from 'lucide-react';

export function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'created_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const categoryParam = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const categoriesData = await getCategories();

        let productsData: Product[];

        if (searchQuery) {
          productsData = await searchProducts(searchQuery);
        } else {
          const categoryId = categoryParam
            ? categoriesData.find((c) => c.slug === categoryParam)?.id
            : undefined;

          productsData = await getProducts({
            categoryId,
            sortBy,
            sortOrder,
          });
        }

        setProducts(productsData);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [categoryParam, searchQuery, sortBy, sortOrder]);

  const handleCategoryChange = (categorySlug: string | null) => {
    const newParams = new URLSearchParams();
    if (categorySlug) {
      newParams.set('category', categorySlug);
    }
    window.location.href = `/products?${newParams.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${products.length} products found`}
          </p>
        </div>

        {!searchQuery && (
          <div className="mb-8">
            <CategoryFilter
              selectedCategory={categoryParam}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Sort by:</span>
          </div>
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'price' | 'created_at')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5a4] focus:border-transparent"
            >
              <option value="created_at">Newest</option>
              <option value="price">Price</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5a4] focus:border-transparent"
            >
              <option value="desc">{sortBy === 'price' ? 'High to Low' : 'Newest First'}</option>
              <option value="asc">{sortBy === 'price' ? 'Low to High' : 'Oldest First'}</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No products found</p>
            {(categoryParam || searchQuery) && (
              <button
                onClick={() => (window.location.href = '/products')}
                className="mt-4 text-[#0ea5a4] hover:text-[#0d9492] font-semibold"
              >
                View All Products
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
