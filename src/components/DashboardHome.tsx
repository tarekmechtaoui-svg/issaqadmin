import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StatCard } from '../types';

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

  const stats: StatCard[] = [
    { label: 'Total Orders', value: totalOrders, icon: '📦' },
    { label: 'Total Products', value: totalProducts, icon: '🛍️' },
    { label: 'Total Categories', value: totalCategories, icon: '📑' },
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: '💰' }
  ];

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
        {stats.map((stat: StatCard, index: number) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
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