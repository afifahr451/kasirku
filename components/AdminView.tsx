import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { useMenu } from '../context/MenuContext';
import { useAuth } from '../context/AuthContext';
import { OrderStatus, MenuItem } from '../types';
import { CURRENCY_FORMAT } from '../constants';
import { 
  CheckCircle, Clock, XCircle, ChefHat, RefreshCw, 
  Filter, LogOut, UtensilsCrossed, Users, Plus, 
  Edit3, Trash2, Save, X, AlertTriangle, Eye, EyeOff, Archive
} from 'lucide-react';

type AdminTab = 'kitchen' | 'menu' | 'team';

const AdminView: React.FC = () => {
  const { logout, users, addUser, updatePassword, deleteUser, currentUser } = useAuth();
  const { orders, updateOrderStatus, clearOrders } = useOrders();
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu();
  
  const [activeTab, setActiveTab] = useState<AdminTab>('kitchen');
  
  // Kitchen State
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');

  // Menu State
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);

  // User State
  const [newUserUser, setNewUserUser] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [changingPassFor, setChangingPassFor] = useState<string | null>(null);
  const [newPassValue, setNewPassValue] = useState('');

  // --- KITCHEN HELPERS ---
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case OrderStatus.COOKING: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case OrderStatus.COMPLETED: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case OrderStatus.CANCELLED: return 'text-red-400 bg-red-400/10 border-red-400/20';
    }
  };

  const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);
  const sortedOrders = [...filteredOrders].sort((a, b) => b.timestamp - a.timestamp);

  const handleClearHistory = () => {
    if (confirm("WARNING: This will delete ALL order history permanently. This cannot be undone. Are you sure?")) {
      clearOrders();
    }
  };

  // --- MENU HELPERS ---
  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.name || !editingItem.price) return;

    if (editingItem.id) {
      updateMenuItem(editingItem as MenuItem);
    } else {
      addMenuItem(editingItem as MenuItem);
    }
    setIsEditingMenu(false);
    setEditingItem(null);
  };

  const handleDeleteFromModal = () => {
    if (editingItem?.id) {
      if (confirm(`Are you sure you want to delete "${editingItem.name}"?`)) {
        deleteMenuItem(editingItem.id);
        setIsEditingMenu(false);
        setEditingItem(null);
      }
    }
  };

  const openEditMenu = (item?: MenuItem) => {
    setEditingItem(item || {
      name: '', description: '', price: 0, image: 'https://via.placeholder.com/800', category: 'main', isPopular: false, isAvailable: true
    });
    setIsEditingMenu(true);
  };

  const toggleAvailability = (item: MenuItem) => {
    updateMenuItem({ ...item, isAvailable: !item.isAvailable });
  };

  // --- USER HELPERS ---
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserUser && newUserPass) {
      addUser(newUserUser, newUserPass);
      setNewUserUser('');
      setNewUserPass('');
    }
  };

  const handleChangePass = (username: string) => {
    if (newPassValue) {
      updatePassword(username, newPassValue);
      setChangingPassFor(null);
      setNewPassValue('');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 md:p-12 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <h2 className="text-4xl font-serif font-bold flex items-center gap-4 text-white">
              <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 text-orange-500">
                 <ChefHat size={32} />
              </div>
              Admin Dashboard
            </h2>
            <p className="text-neutral-400 mt-2 ml-1">Welcome back, <span className="text-white font-bold">{currentUser}</span>.</p>
          </div>
          
          <button 
             onClick={logout}
             className="px-6 py-3 bg-neutral-800 hover:bg-red-900/20 text-neutral-400 hover:text-red-400 rounded-xl border border-neutral-700 hover:border-red-900/50 transition-all flex items-center gap-2"
          >
             <LogOut size={18} />
             <span className="text-sm font-bold uppercase tracking-wider">Logout</span>
          </button>
        </header>

        {/* TABS */}
        <div className="flex border-b border-neutral-800 mb-8 gap-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('kitchen')}
            className={`pb-4 px-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${activeTab === 'kitchen' ? 'border-orange-500 text-orange-500' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            <ChefHat size={18} /> Kitchen
          </button>
          <button 
            onClick={() => setActiveTab('menu')}
            className={`pb-4 px-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${activeTab === 'menu' ? 'border-orange-500 text-orange-500' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            <UtensilsCrossed size={18} /> Menu Manager
          </button>
          <button 
            onClick={() => setActiveTab('team')}
            className={`pb-4 px-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${activeTab === 'team' ? 'border-orange-500 text-orange-500' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            <Users size={18} /> User Management
          </button>
        </div>

        {/* KITCHEN TAB */}
        {activeTab === 'kitchen' && (
          <div className="animate-fade-in">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
               <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 backdrop-blur-sm">
                  <span className="block text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">Pending Orders</span>
                  <span className="text-4xl font-bold text-yellow-500 font-mono">
                    {orders.filter(o => o.status === OrderStatus.PENDING).length}
                  </span>
               </div>
               <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 backdrop-blur-sm">
                  <span className="block text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">Today's Revenue</span>
                  <span className="text-4xl font-bold text-emerald-500 font-mono">
                    {CURRENCY_FORMAT.format(orders.filter(o => o.status !== OrderStatus.CANCELLED).reduce((acc, curr) => acc + curr.total, 0))}
                  </span>
               </div>
            </div>

            {/* Filters */}
            <div className="flex justify-between items-end mb-6 flex-wrap gap-4">
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                <button onClick={() => setFilter('ALL')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${filter === 'ALL' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400 hover:text-white'}`}>All</button>
                {Object.values(OrderStatus).map(status => (
                  <button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${filter === status ? 'bg-neutral-700 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'}`}>{status}</button>
                ))}
              </div>
              
              {orders.length > 0 && (
                <button 
                  onClick={handleClearHistory}
                  className="text-xs text-neutral-500 hover:text-red-400 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-900 transition-colors border border-transparent hover:border-neutral-800"
                >
                  <Archive size={14} /> Clear History
                </button>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/30 backdrop-blur-sm shadow-2xl">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-neutral-900 border-b border-neutral-800 text-neutral-500 text-xs uppercase tracking-wider">
                    <th className="p-6 font-bold">Time / ID</th>
                    <th className="p-6 font-bold">Customer</th>
                    <th className="p-6 font-bold">Order Details</th>
                    <th className="p-6 font-bold">Total</th>
                    <th className="p-6 font-bold">Status</th>
                    <th className="p-6 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50">
                  {sortedOrders.length === 0 ? (
                    <tr><td colSpan={6} className="p-20 text-center text-neutral-600">No orders found.</td></tr>
                  ) : (
                    sortedOrders.map(order => (
                      <tr key={order.id} className="hover:bg-neutral-800/30 transition-colors group">
                        <td className="p-6">
                          <div className="text-white font-mono text-sm">#{order.id}</div>
                          <div className="text-neutral-500 text-xs mt-1">{new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </td>
                        <td className="p-6"><div className="font-bold text-white">{order.customerName}</div></td>
                        <td className="p-6">
                          <ul className="space-y-1">
                            {order.items.map((item, idx) => (
                              <li key={idx} className="text-sm text-neutral-300 flex items-center gap-2">
                                <span className="bg-neutral-800 text-orange-400 px-1.5 py-0.5 rounded text-xs font-bold font-mono">{item.quantity}x</span>
                                <span>{item.name}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="p-6 font-mono text-orange-400 font-medium">{CURRENCY_FORMAT.format(order.total)}</td>
                        <td className="p-6">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center w-fit gap-2 ${getStatusColor(order.status)}`}>
                            {order.status === OrderStatus.PENDING && <Clock size={14} />}
                            {order.status === OrderStatus.COOKING && <RefreshCw size={14} className="animate-spin" />}
                            {order.status === OrderStatus.COMPLETED && <CheckCircle size={14} />}
                            {order.status === OrderStatus.CANCELLED && <XCircle size={14} />}
                            {order.status}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex justify-end gap-2">
                            {order.status === OrderStatus.PENDING && (
                              <>
                                <button onClick={() => updateOrderStatus(order.id, OrderStatus.COOKING)} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Cook</button>
                                <button onClick={() => updateOrderStatus(order.id, OrderStatus.CANCELLED)} className="bg-neutral-800 text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold">Reject</button>
                              </>
                            )}
                            {order.status === OrderStatus.COOKING && (
                              <button onClick={() => updateOrderStatus(order.id, OrderStatus.COMPLETED)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"><CheckCircle size={12} /> Done</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MENU MANAGER TAB */}
        {activeTab === 'menu' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div className="text-neutral-400 text-sm">
                Manage your restaurant menu items here.
              </div>
              <button onClick={() => openEditMenu()} className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-900/20">
                <Plus size={20} /> Add New Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map(item => (
                <div key={item.id} className={`bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 group hover:border-orange-500/30 transition-all ${!item.isAvailable ? 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100' : ''}`}>
                  <div className="h-48 overflow-hidden relative">
                     <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     
                     {!item.isAvailable && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                          <span className="bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                            <EyeOff size={12} /> CURRENTLY UNAVAILABLE
                          </span>
                        </div>
                     )}

                     {/* Buttons are now always visible with a semi-transparent background */}
                     <div className="absolute top-2 right-2 flex gap-2">
                        <button 
                          onClick={() => toggleAvailability(item)} 
                          className={`p-2 rounded-lg backdrop-blur-md transition-colors border border-white/10 ${item.isAvailable ? 'bg-black/60 hover:bg-red-500 text-white' : 'bg-red-500 text-white'}`}
                          title={item.isAvailable ? "Disable Item" : "Enable Item"}
                        >
                          {item.isAvailable ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                        <button 
                          onClick={() => openEditMenu(item)} 
                          className="bg-black/60 hover:bg-blue-600 text-white p-2 rounded-lg backdrop-blur-md transition-colors border border-white/10"
                          title="Edit Item"
                        >
                          <Edit3 size={18}/>
                        </button>
                        <button 
                          onClick={() => { if(confirm(`Are you sure you want to delete "${item.name}"?`)) deleteMenuItem(item.id) }} 
                          className="bg-black/60 hover:bg-red-600 text-white p-2 rounded-lg backdrop-blur-md transition-colors border border-white/10"
                          title="Delete Item"
                        >
                          <Trash2 size={18}/>
                        </button>
                     </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-white text-lg">{item.name}</h4>
                      <span className="text-orange-500 font-serif font-bold text-lg">{CURRENCY_FORMAT.format(item.price)}</span>
                    </div>
                    <p className="text-sm text-neutral-400 line-clamp-2 mb-3">{item.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-1 rounded uppercase font-bold tracking-wider">{item.category}</span>
                      {item.isPopular && <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded uppercase font-bold tracking-wider flex items-center gap-1"><AlertTriangle size={10} /> Popular</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Modal */}
            {isEditingMenu && editingItem && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white font-serif">{editingItem.id ? 'Edit Menu Item' : 'Add New Item'}</h3>
                    <button onClick={() => setIsEditingMenu(false)} className="text-neutral-400 hover:text-white transition-colors"><X size={24}/></button>
                  </div>
                  <form onSubmit={handleSaveMenu} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Item Name</label>
                      <input required type="text" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none focus:ring-1 focus:ring-orange-500 transition-all"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Price ($)</label>
                        <input required type="number" step="0.01" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none focus:ring-1 focus:ring-orange-500 transition-all"/>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Category</label>
                        <select 
                          value={editingItem.category} 
                          onChange={e => setEditingItem({...editingItem, category: e.target.value as any})}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                        >
                          <option value="main">Main Dish</option>
                          <option value="drink">Drink</option>
                          <option value="extra">Extra/Side</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Description</label>
                      <textarea required value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none focus:ring-1 focus:ring-orange-500 transition-all h-24"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Image URL</label>
                      <input type="text" value={editingItem.image} onChange={e => setEditingItem({...editingItem, image: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none focus:ring-1 focus:ring-orange-500 transition-all"/>
                    </div>
                    
                    <div className="flex items-center gap-6 py-2">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="isPopular"
                          checked={editingItem.isPopular || false}
                          onChange={e => setEditingItem({...editingItem, isPopular: e.target.checked})}
                          className="w-4 h-4 rounded bg-neutral-950 border-neutral-800 text-orange-600 focus:ring-orange-500"
                        />
                        <label htmlFor="isPopular" className="text-sm text-neutral-300 select-none">Mark as "Bestseller"</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="isAvailable"
                          checked={editingItem.isAvailable !== false} // Defaults to true if undefined
                          onChange={e => setEditingItem({...editingItem, isAvailable: e.target.checked})}
                          className="w-4 h-4 rounded bg-neutral-950 border-neutral-800 text-orange-600 focus:ring-orange-500"
                        />
                        <label htmlFor="isAvailable" className="text-sm text-neutral-300 select-none">Available for Order</label>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-neutral-800 mt-2">
                       {editingItem.id && (
                         <button 
                           type="button" 
                           onClick={handleDeleteFromModal} 
                           className="px-4 py-3 rounded-xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500 hover:text-white border border-red-500/20 transition-colors"
                           title="Delete this item"
                         >
                           <Trash2 size={20} />
                         </button>
                       )}
                       <button type="button" onClick={() => setIsEditingMenu(false)} className="flex-1 py-3 rounded-xl bg-neutral-800 text-white font-bold hover:bg-neutral-700 transition-colors">Cancel</button>
                       <button type="submit" className="flex-1 py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-500 shadow-lg shadow-orange-900/20 transition-colors">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TEAM TAB */}
        {activeTab === 'team' && (
          <div className="animate-fade-in grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* List Users */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Users size={20} /> Current Admins</h3>
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                {users.map(user => (
                   <div key={user.username} className="p-4 border-b border-neutral-800 last:border-0 flex items-center justify-between hover:bg-neutral-800/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center font-bold text-orange-500">{user.username.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className="font-bold text-white">{user.username}</div>
                          <div className="text-xs text-neutral-500">Admin Access</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {changingPassFor === user.username ? (
                           <div className="flex items-center gap-2 animate-fade-in">
                             <input 
                               type="text" 
                               placeholder="New Pass" 
                               value={newPassValue} 
                               onChange={e => setNewPassValue(e.target.value)}
                               className="bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-sm text-white w-32 focus:border-orange-500 outline-none"
                             />
                             <button onClick={() => handleChangePass(user.username)} className="text-emerald-500 hover:bg-emerald-500/20 p-1 rounded transition-colors"><Save size={16}/></button>
                             <button onClick={() => setChangingPassFor(null)} className="text-neutral-500 hover:bg-neutral-700/50 p-1 rounded transition-colors"><X size={16}/></button>
                           </div>
                        ) : (
                          <button onClick={() => setChangingPassFor(user.username)} className="text-xs bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded transition-colors">Change Password</button>
                        )}
                        {users.length > 1 && (
                          <button onClick={() => { if(confirm('Remove this admin?')) deleteUser(user.username) }} className="text-red-400 hover:bg-red-900/20 p-2 rounded transition-colors"><Trash2 size={16}/></button>
                        )}
                      </div>
                   </div>
                ))}
              </div>
            </div>

            {/* Add User */}
            <div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sticky top-24">
                <h3 className="text-lg font-bold text-white mb-4">Add New Admin</h3>
                <form onSubmit={handleAddUser} className="space-y-4">
                   <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Username</label>
                      <input required type="text" value={newUserUser} onChange={e => setNewUserUser(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none focus:ring-1 focus:ring-orange-500 transition-all"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Password</label>
                      <input required type="password" value={newUserPass} onChange={e => setNewUserPass(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none focus:ring-1 focus:ring-orange-500 transition-all"/>
                    </div>
                    <button type="submit" className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition-colors shadow-lg">Create Account</button>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminView;