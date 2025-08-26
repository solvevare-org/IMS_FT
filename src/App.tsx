import React, { useState } from 'react';
import { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import KPICard from './components/KPICard';
import InventoryChart from './components/InventoryChart';
import SupplierChart from './components/SupplierChart';
import DataTable from './components/DataTable';
import SuppliersPage from './components/suppliers/SuppliersPage';
import ProductsPage from './components/products/ProductsPage';
import InventoryPage from './components/inventory/InventoryPage';
import OrdersPage from './components/orders/OrdersPage';
import PricingRulesPage from './components/pricing/PricingRulesPage';
import UnifiedAPIPage from './components/api/UnifiedAPIPage';
import AnalyticsPage from './components/analytics/AnalyticsPage';
import SettingsPage from './components/settings/SettingsPage';
import { Package, Users, DollarSign, Zap, Bell } from 'lucide-react';
import { systemOrchestrator } from './services/systemOrchestrator';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [systemInitialized, setSystemInitialized] = useState(false);

  useEffect(() => {
    // Initialize the complete system dataflow
    const initializeSystem = async () => {
      try {
        await systemOrchestrator.initializeSystem();
        setSystemInitialized(true);
      } catch (error) {
        console.error('Failed to initialize system:', error);
      }
    };

    initializeSystem();

    // Cleanup on unmount
    return () => {
      systemOrchestrator.shutdown();
    };
  }, []);

  const renderContent = () => {
    if (!systemInitialized) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Initializing IMS Platform</h2>
            <p className="text-gray-600">Setting up supplier integrations and data synchronization...</p>
          </div>
        </div>
      );
    }

    switch (activeItem) {
      case 'suppliers':
        return <SuppliersPage />;
      case 'products':
        return <ProductsPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'orders':
        return <OrdersPage />;
      case 'pricing':
        return <PricingRulesPage />;
      case 'api':
        return <UnifiedAPIPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <>
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-600">Welcome back! Here's what's happening with your inventory.</p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  </button>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">AD</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <div className="p-6 space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                  title="Total Products Synced"
                  value="12,847"
                  change="+2.3% from last week"
                  changeType="positive"
                  icon={Package}
                  iconColor="text-blue-600"
                />
                <KPICard
                  title="Active Suppliers"
                  value="24"
                  change="+1 new this month"
                  changeType="positive"
                  icon={Users}
                  iconColor="text-green-600"
                />
                <KPICard
                  title="Stock Value"
                  value="$2.4M"
                  change="-1.2% from last month"
                  changeType="negative"
                  icon={DollarSign}
                  iconColor="text-purple-600"
                />
                <KPICard
                  title="API Calls (24h)"
                  value="45,692"
                  change="Normal activity"
                  changeType="neutral"
                  icon={Zap}
                  iconColor="text-orange-600"
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <InventoryChart />
                </div>
                <div>
                  <SupplierChart />
                </div>
              </div>

              {/* Tables Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DataTable title="Recent API Sync Logs" type="sync-logs" />
                <DataTable title="Low Stock Alerts" type="low-stock" />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeItem={activeItem}
        onItemClick={setActiveItem}
      />
      
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;