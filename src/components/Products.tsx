import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Product {
  id: string;
  title: string;
  category_id: string;
  price: number;
  stock_quantity: number;
}

interface Category {
  id: string;
  name: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('id, name')
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };
  const getStockStatus = (quantity: number): { text: string; class: string } => {
    if (quantity === 0) return { text: 'Out of Stock', class: 'status-out-of-stock' };
    if (quantity < 10) return { text: 'Low Stock', class: 'status-low-stock' };
    return { text: 'In Stock', class: 'status-in-stock' };
  };

  const handleEdit = (productId: string): void => {
    console.log('Edit product:', productId);
  };

  const handleDelete = async (productId: string): Promise<void> => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', productId);
        if (error) throw error;
        await fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  if (loading) {
    return <div className="table-container"><p>Loading...</p></div>;
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h1>Products Management</h1>
        <button className="btn-primary">Add New Product</button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr><td colSpan={6}>No products found</td></tr>
          ) : (
            products.map((product: Product) => {
              const stockStatus = getStockStatus(product.stock_quantity);
              return (
                <tr key={product.id}>
                  <td>{product.title}</td>
                  <td>{getCategoryName(product.category_id)}</td>
                  <td>${product.price}</td>
                  <td>{product.stock_quantity}</td>
                  <td>
                    <span className={`status-badge ${stockStatus.class}`}>
                      {stockStatus.text}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(product.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Products;