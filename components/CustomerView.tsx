import React, { useState } from 'react';
import { MenuItem, CartItem, Order, OrderStatus } from '../types';
import { CURRENCY_FORMAT } from '../constants';
import { useOrders } from '../context/OrderContext';
import { useMenu } from '../context/MenuContext';
import { useTheme } from '../context/ThemeContext';
import MenuCard from './MenuCard';
import { ShoppingBag, X, ChevronRight, Utensils, Star, Sun, Moon } from 'lucide-react';

const CustomerView: React.FC = () => {
  const { addOrder } = useOrders();
  const { menuItems } = useMenu();
  const { theme, toggleTheme } = useTheme();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Only show available items to customers
  const visibleMenuItems = menuItems.filter(item => item.isAvailable);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || cart.length === 0) return;

    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 8).toUpperCase(),
      customerName,
      items: [...cart],
      total: cartTotal,
      status: OrderStatus.PENDING,
      timestamp: Date.now(),
    };

    addOrder(newOrder);
    setCart([]);
    setCustomerName('');
    setIsCartOpen(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 pb-20 font-sans text-gray-900 dark:text-neutral-100 transition-colors duration-300">
      
      {/* Theme Toggle - Floating Top Left */}
      <div className="fixed top-6 left-6 z-[110]">
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md shadow-lg border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-yellow-400 hover:bg-orange-50 dark:hover:bg-neutral-700 transition-all"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Success Modal */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 border border-orange-500/30 p-8 rounded-2xl max-w-md text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-orange-500/5 opacity-20 animate-pulse"></div>
            <div className="w-20 h-20 bg-orange-500 text-white dark:text-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(249,115,22,0.4)]">
              <Utensils size={40} />
            </div>
            <h3 className="text-3xl font-serif text-gray-900 dark:text-white mb-3 font-bold">Pesanan Diterima!</h3>
            <p className="text-gray-600 dark:text-neutral-400 mb-6">Thank you, <strong>{customerName}</strong>! Your Nasi Cumi is being prepared by our chefs.</p>
            <button 
              onClick={() => setIsSuccess(false)}
              className="text-sm text-orange-600 hover:text-orange-500 font-bold uppercase tracking-wider"
            >
              Order More
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-[50vh] bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1606850780554-b55eaeb84599?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 dark:opacity-40"></div>
        {/* Gradient matches the page background (gray-50 in light mode, neutral-950 in dark mode) */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-neutral-950/60 to-transparent dark:from-neutral-950 dark:via-neutral-950/60 dark:to-transparent"></div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 pt-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
            <Star size={12} fill="currentColor" /> Premium Indonesian Street Food
          </div>
          <h1 className="text-5xl md:text-8xl text-white font-serif font-bold mb-4 tracking-tight drop-shadow-2xl">
            CUMI<span className="text-orange-500">HITAM</span>
          </h1>
          <p className="text-lg text-neutral-200 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
            Authentic Maduranese Black Squid Rice. Savory, spicy, and addictive.
          </p>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="flex items-end justify-between mb-8 px-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-serif drop-shadow-sm">Our Menu</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleMenuItems.length > 0 ? (
            visibleMenuItems.map(item => (
              <MenuCard key={item.id} item={item} onAdd={addToCart} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white/50 dark:bg-neutral-900/50 rounded-2xl border border-dashed border-gray-300 dark:border-neutral-800">
              <Utensils className="mx-auto h-12 w-12 text-gray-400 dark:text-neutral-700 mb-4" />
              <h3 className="text-xl font-bold text-gray-500 dark:text-neutral-500">Menu Currently Unavailable</h3>
              <p className="text-gray-500 dark:text-neutral-600">Please check back later for our delicious dishes.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart Button (Mobile) */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 md:hidden animate-bounce-in">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="bg-orange-600 text-white p-4 rounded-full shadow-2xl shadow-orange-500/30 flex items-center gap-2 font-bold border border-orange-400/50"
          >
            <ShoppingBag size={24} />
            <span className="bg-white text-orange-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">{cart.reduce((acc, i) => acc + i.quantity, 0)}</span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white dark:bg-neutral-900 border-l border-gray-200 dark:border-neutral-800 transform transition-transform duration-300 ease-in-out z-50 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between bg-gray-50 dark:bg-neutral-900">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-orange-600 dark:text-orange-500" />
              <h2 className="text-2xl font-serif text-gray-900 dark:text-white font-bold">Your Order</h2>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="text-gray-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors p-2 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white dark:bg-neutral-900">
            {cart.length === 0 ? (
              <div className="text-center text-gray-400 dark:text-neutral-600 py-20 flex flex-col items-center">
                <ShoppingBag size={64} className="mb-4 opacity-20" />
                <p className="text-lg">Your cart is empty.</p>
                <p className="text-sm mt-2">Add some delicious squid to start!</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-4 items-center bg-gray-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-gray-200 dark:border-neutral-800 hover:border-orange-200 dark:hover:border-neutral-700 transition-colors">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="text-gray-900 dark:text-white font-bold leading-tight mb-1">{item.name}</h4>
                    <p className="text-orange-600 dark:text-orange-500 font-mono">{CURRENCY_FORMAT.format(item.price)}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 bg-white dark:bg-neutral-950 rounded-lg p-1 border border-gray-200 dark:border-neutral-800 shadow-sm">
                    <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 p-1 rounded">+</button>
                    <span className="text-gray-900 dark:text-white w-6 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => item.quantity === 1 ? removeFromCart(item.id) : updateQuantity(item.id, -1)} className="text-gray-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 p-1 rounded">-</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-8 bg-gray-50 dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800">
              <div className="flex justify-between items-center mb-8">
                <span className="text-gray-500 dark:text-neutral-400">Total Amount</span>
                <span className="text-3xl font-serif font-bold text-gray-900 dark:text-white">{CURRENCY_FORMAT.format(cartTotal)}</span>
              </div>
              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-neutral-500 uppercase tracking-wider mb-2">Customer Name</label>
                  <input 
                    type="text" 
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-xl px-4 py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                    placeholder="Enter your name..."
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20 dark:shadow-orange-900/20 hover:translate-y-[-2px]"
                >
                  Place Order <ChevronRight size={20} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      
      {/* Backdrop for drawer */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}
    </div>
  );
};

export default CustomerView;