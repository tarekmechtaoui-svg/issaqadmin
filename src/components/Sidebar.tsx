import React from 'react';
import { LayoutDashboard, Package, ShoppingBag, FolderOpen } from 'lucide-react';
import '../styles/Sidebar.css';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: 'dashboard' | 'orders' | 'products' | 'categories') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'orders', label: 'Orders', icon: Package },
    { key: 'products', label: 'Products', icon: ShoppingBag },
    { key: 'categories', label: 'Categories', icon: FolderOpen }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              className={`nav-item ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => setActiveTab(item.key as any)}
            >
              <Icon className="nav-icon" size={20} />
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;