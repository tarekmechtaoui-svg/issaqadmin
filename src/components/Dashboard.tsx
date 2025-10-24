import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Orders from './Orders';
import Products from './Products';
import Categories from './Categories';
import DashboardHome from './DashboardHome';
import '../styles/Dashboard.css';

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