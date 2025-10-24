import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Orders from './components/Orders';
import Products from './components/Products';
import Categories from './components/Categories';
import DashboardHome from './components/DashboardHome';
import './styles/Dashboard.css';

type ActiveTab = 'dashboard' | 'orders' | 'products' | 'categories';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const renderContent = (): JSX.Element => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome />;
      case 'orders':
        return <Orders />;
      case 'products':
        return <Products />;
      case 'categories':
        return <Categories />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;