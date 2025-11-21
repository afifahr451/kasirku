import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MenuItem } from '../types';
import { INITIAL_MENU_ITEMS } from '../constants';

interface MenuContextType {
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('cumihitam_menu');
    const items = saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
    // Ensure compatibility with older saved data by adding isAvailable if missing
    return items.map((i: any) => ({ ...i, isAvailable: i.isAvailable ?? true }));
  });

  useEffect(() => {
    localStorage.setItem('cumihitam_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString(),
    };
    setMenuItems(prev => [...prev, newItem]);
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <MenuContext.Provider value={{ menuItems, addMenuItem, updateMenuItem, deleteMenuItem }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};