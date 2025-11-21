import React, { useState } from 'react';
import { OrderProvider, useOrders } from './context/OrderContext';
import { MenuProvider } from './context/MenuContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import CustomerView from './components/CustomerView';
import AdminView from './components/AdminView';
import AdminLogin from './components/AdminLogin';
import { LayoutDashboard, Store } from 'lucide-react';

const Navigation: React.FC<{ 
  currentView: 'customer' | 'admin'; 
  setView: (v: 'customer' | 'admin') => void 
}> = ({ currentView, setView }) => {
  const { pendingCount } = useOrders();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-6 py-4 pointer-events-none">
      <div className="pointer-events-auto">
        {/* Left side is empty, allowing clicks through to underlying elements */}
      </div>
      
      <div className="pointer-events-auto bg-white/80 dark:bg-neutral-900/90 backdrop-blur-md border border-gray-200 dark:border-neutral-800 rounded-full p-1 flex gap-1 shadow-2xl transition-colors duration-300">
        <button
          onClick={() => setView('customer')}
          className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all ${
            currentView === 'customer' 
              ? 'bg-orange-500 text-white shadow-lg' 
              : 'text-gray-500 dark:text-neutral-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Store size={16} />
          Menu
        </button>
        <button
          onClick={() => setView('admin')}
          className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all relative ${
            currentView === 'admin' 
              ? 'bg-gray-100 dark:bg-white text-black shadow-lg' 
              : 'text-gray-500 dark:text-neutral-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <LayoutDashboard size={16} />
          Admin
          {pendingCount > 0 && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white dark:border-neutral-900" />
          )}
        </button>
      </div>
    </nav>
  );
};

const AppContent: React.FC = () => {
  const [view, setView] = useState<'customer' | 'admin'>('customer');
  const { isAuthenticated } = useAuth();

  const renderAdminContent = () => {
    if (isAuthenticated) {
      return <AdminView />;
    }
    return <AdminLogin />;
  };

  return (
    <>
      <Navigation currentView={view} setView={setView} />
      <main>
        {view === 'customer' ? <CustomerView /> : renderAdminContent()}
      </main>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MenuProvider>
          <OrderProvider>
            <AppContent />
          </OrderProvider>
        </MenuProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;