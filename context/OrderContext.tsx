import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Order, OrderStatus } from '../types';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  clearOrders: () => void;
  pendingCount: number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from localStorage initially to simulate persistence
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('cumihitam_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse orders from storage:", error);
      return [];
    }
  });

  // Save to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem('cumihitam_orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const clearOrders = () => {
    setOrders([]);
    localStorage.removeItem('cumihitam_orders');
  };

  const pendingCount = orders.filter(o => o.status === OrderStatus.PENDING).length;

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, clearOrders, pendingCount }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};