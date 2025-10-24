import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Category {
  id: string;
  name: string;
  description: string | null;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data: categoriesData, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      if (categoriesData) {
        setCategories(categoriesData);

        const counts: Record<string, number> = {};
        for (const category of categoriesData) {
          const { count } = await supabase
            .from('products')
            .select('id', { count: 'exact', head: true })
            .eq('category_id', category.id);
          counts[category.id] = count || 0;
        }
        setProductCounts(counts);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (categoryId: string): void => {
    console.log('Edit category:', categoryId);
  };

  const handleDelete = async (categoryId: string): Promise<void> => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const { error } = await supabase.from('categories').delete().eq('id', categoryId);
        if (error) throw error;
        await fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
      }
    }
  };

  if (loading) {
    return <div className="table-container"><p>Loading...</p></div>;
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h1>Categories Management</h1>
        <button className="btn-primary">Add New Category</button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Product Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr><td colSpan={4}>No categories found</td></tr>
          ) : (
            categories.map((category: Category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description || 'No description'}</td>
                <td>{productCounts[category.id] || 0}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(category.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(category.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;