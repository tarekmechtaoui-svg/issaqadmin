import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Zap, Shield, Truck } from 'lucide-react';
import { getProducts } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../types/database';

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        const products = await getProducts({ featured: true, limit: 6 });
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Failed to load featured products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-[#0ea5a4] to-[#0d9492] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover the Latest in Mobile Technology
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Premium smartphones and accessories at unbeatable prices. Free shipping on orders over $50.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 bg-white text-[#0ea5a4] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/products?category=phones"
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
              >
                View Phones
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0ea5a4]/10 rounded-full mb-4">
                <Truck className="h-8 w-8 text-[#0ea5a4]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over $50</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0ea5a4]/10 rounded-full mb-4">
                <Shield className="h-8 w-8 text-[#0ea5a4]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-600">100% secure transactions</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0ea5a4]/10 rounded-full mb-4">
                <Smartphone className="h-8 w-8 text-[#0ea5a4]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Latest Models</h3>
              <p className="text-sm text-gray-600">Always in stock</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0ea5a4]/10 rounded-full mb-4">
                <Zap className="h-8 w-8 text-[#0ea5a4]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-600">2-3 business days</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600">Check out our most popular items</p>
            </div>
            <Link
              to="/products"
              className="hidden md:inline-flex items-center text-[#0ea5a4] font-semibold hover:text-[#0d9492] transition-colors"
            >
              View All
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured products available</p>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link
              to="/products"
              className="inline-flex items-center text-[#0ea5a4] font-semibold hover:text-[#0d9492] transition-colors"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Upgrade Your Mobile Experience?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Browse our extensive collection of smartphones and accessories
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-4 bg-[#0ea5a4] text-white rounded-lg font-semibold hover:bg-[#0d9492] transition-colors"
          >
            Start Shopping
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
