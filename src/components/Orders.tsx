import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  created_at: string;
  items: any;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };
  const getStatusClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'shipped': return 'status-shipped';
      case 'processing': return 'status-processing';
      default: return 'status-default';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const getItemsSummary = (items: any): string => {
    if (Array.isArray(items) && items.length > 0) {
      return items.map((item: any) => item.title || item.name).join(', ');
    }
    return 'N/A';
  };

  const handleEdit = (orderId: string): void => {
    console.log('Edit order:', orderId);
  };

  const handleDelete = async (orderId: string): Promise<void> => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        const { error } = await supabase.from('orders').delete().eq('id', orderId);
        if (error) throw error;
        await fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order');
      }
    }
  };

  if (loading) {
    return <div className="table-container"><p>Loading...</p></div>;
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h1>Orders Management</h1>
        <button className="btn-primary">Add New Order</button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Customer</th>
            <th>Email</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr><td colSpan={8}>No orders found</td></tr>
          ) : (
            orders.map((order: Order) => (
              <tr key={order.id}>
                <td>{order.order_number}</td>
                <td>{order.customer_name}</td>
                <td>{order.customer_email}</td>
                <td>{getItemsSummary(order.items)}</td>
                <td>${parseFloat(order.total.toString()).toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>{formatDate(order.created_at)}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(order.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(order.id)}
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

export default Orders;