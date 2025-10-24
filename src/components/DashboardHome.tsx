import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Package, ShoppingBag, FolderOpen, DollarSign } from 'lucide-react';
import '../styles/DashboardHome.css';

interface OrderData {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

const DashboardHome: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, productsRes, categoriesRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(3),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true })
      ]);

      if (ordersRes.data) setOrders(ordersRes.data);
      if (productsRes.count !== null) setTotalProducts(productsRes.count);
      if (categoriesRes.count !== null) setTotalCategories(categoriesRes.count);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalOrders: number = orders.length;
  const totalRevenue: number = orders.reduce((sum: number, order: OrderData) => sum + parseFloat(order.total.toString()), 0);

  const getStatusClass = (status: string): string => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  if (loading) {
    return <div className="dashboard-home"><p>Loading...</p></div>;
  }

  return (
    <div className="dashboard-home">
      <h1>Dashboard Overview</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Package size={24} />
          </div>
          <div className="stat-info">
            <h3>{totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <ShoppingBag size={24} />
          </div>
          <div className="stat-info">
            <h3>{totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <FolderOpen size={24} />
          </div>
          <div className="stat-info">
            <h3>{totalCategories}</h3>
            <p>Total Categories</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon emerald">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <h3>${totalRevenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Orders</h2>
        <div className="activity-list">
          {orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            orders.map((order: OrderData) => (
              <div key={order.id} className="activity-item">
                <div className="activity-info">
                  <strong>{order.customer_name}</strong>
                  <span>{order.order_number}</span>
                </div>
                <div className="activity-status">
                  <span className={getStatusClass(order.status)}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;