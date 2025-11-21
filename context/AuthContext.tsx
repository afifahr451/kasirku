import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface AdminUser {
  username: string;
  password: string; // In a real app, this would be hashed
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: string | null;
  login: (u: string, p: string) => boolean;
  logout: () => void;
  users: AdminUser[];
  addUser: (u: string, p: string) => void;
  updatePassword: (u: string, newP: string) => void;
  deleteUser: (u: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ADMIN: AdminUser = { username: 'admin', password: '123' };

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load Users
  const [users, setUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('cumihitam_users');
    return saved ? JSON.parse(saved) : [DEFAULT_ADMIN];
  });

  // Load Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem('cumihitam_auth_state');
    if (savedAuth) {
      const { isAuth, user } = JSON.parse(savedAuth);
      if (isAuth) {
        setIsAuthenticated(true);
        setCurrentUser(user);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cumihitam_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('cumihitam_auth_state', JSON.stringify({ isAuth: isAuthenticated, user: currentUser }));
  }, [isAuthenticated, currentUser]);

  const login = (u: string, p: string) => {
    const userFound = users.find(user => user.username === u && user.password === p);
    if (userFound) {
      setIsAuthenticated(true);
      setCurrentUser(u);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const addUser = (u: string, p: string) => {
    if (users.some(user => user.username === u)) return; // Prevent duplicates
    setUsers(prev => [...prev, { username: u, password: p }]);
  };

  const updatePassword = (u: string, newP: string) => {
    setUsers(prev => prev.map(user => user.username === u ? { ...user, password: newP } : user));
  };

  const deleteUser = (u: string) => {
    if (users.length <= 1) return; // Prevent deleting last admin
    setUsers(prev => prev.filter(user => user.username !== u));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout, users, addUser, updatePassword, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};