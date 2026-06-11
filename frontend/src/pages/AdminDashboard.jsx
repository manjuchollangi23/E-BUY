import React, { useContext, useEffect, useState } from 'react';
import {
  FaChartLine,
  FaBoxes,
  FaClipboardList,
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaShippingFast,
  FaCheckCircle,
  FaTimes,
  FaShieldAlt
} from 'react-icons/fa';
import { ShopContext } from '../context/ShopContext';
import API from '../services/api';

const AdminDashboard = () => {
  const { showToast } = useContext(ShopContext);

  // Tab control: 'analytics', 'products', 'orders', 'users'
  const [activeTab, setActiveTab] = useState('analytics');

  // Aggregated details
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  // Product modal control
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // If null, we are in 'create' mode

  // Form states
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodDiscount, setProdDiscount] = useState('');

  // Initial load
  useEffect(() => {
    fetchAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchAdminData = async () => {
    try {
      if (activeTab === 'analytics') {
        setLoadingAnalytics(true);
        const { data } = await API.get('/orders/analytics');
        setAnalytics(data);
        setLoadingAnalytics(false);
      } else if (activeTab === 'products') {
        const { data } = await API.get('/products?limit=100'); // Load all
        setProducts(data.products || []);
      } else if (activeTab === 'orders') {
        const { data } = await API.get('/orders');
        setOrders(data || []);
      } else if (activeTab === 'users') {
        const { data } = await API.get('/auth/users');
        setUsers(data || []);
      }
    } catch (error) {
      console.error(error);
      showToast('Error loading administrator logs', 'error');
    }
  };

  // CRUD Product Actions
  const handleOpenCreateModal = () => {
    setEditProduct(null);
    setProdName('');
    setProdPrice('');
    setProdDesc('');
    setProdImage('');
    setProdBrand('');
    setProdCategory('Electronics');
    setProdStock('');
    setProdDiscount('0');
    setShowModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditProduct(prod);
    setProdName(prod.name);
    setProdPrice(prod.price);
    setProdDesc(prod.description);
    setProdImage(prod.images[0]);
    setProdBrand(prod.brand);
    setProdCategory(prod.category);
    setProdStock(prod.countInStock);
    setProdDiscount(prod.discount);
    setShowModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    const productPayload = {
      name: prodName,
      price: Number(prodPrice),
      description: prodDesc,
      images: [prodImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'],
      brand: prodBrand,
      category: prodCategory,
      countInStock: Number(prodStock),
      discount: Number(prodDiscount) || 0
    };

    try {
      if (editProduct) {
        // Edit Mode
        await API.put(`/products/${editProduct._id}`, productPayload);
        showToast('Product modified successfully', 'success');
      } else {
        // Create Mode
        await API.post('/products', productPayload);
        showToast('New product created successfully', 'success');
      }
      setShowModal(false);
      fetchAdminData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await API.delete(`/products/${id}`);
      showToast('Product deleted', 'info');
      fetchAdminData();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  // Order status actions
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      showToast(`Order status updated to ${newStatus}`, 'success');
      fetchAdminData();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  // User Actions
  const handleToggleAdmin = async (userId, isAdminCurrent) => {
    try {
      await API.put(`/auth/users/${userId}/role`, { isAdmin: !isAdminCurrent });
      showToast('User roles toggled successfully', 'success');
      fetchAdminData();
    } catch (err) {
      showToast('Toggle role failed', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Remove this user profile?')) return;
    try {
      await API.delete(`/auth/users/${userId}`);
      showToast('User profile removed', 'info');
      fetchAdminData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-8 bg-amazon-grayBg dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <FaShieldAlt className="text-amber-500" /> Admin Control Dashboard
        </h2>
        
        {activeTab === 'products' && (
          <button
            onClick={handleOpenCreateModal}
            className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded flex items-center gap-1.5 shadow"
          >
            <FaPlus /> Add Store Product
          </button>
        )}
      </div>

      {/* Tabs list selector */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto whitespace-nowrap bg-white dark:bg-slate-900 rounded-lg p-1.5 shadow-sm">
        {[
          { id: 'analytics', label: 'Store Analytics', icon: FaChartLine },
          { id: 'products', label: 'Product Inventory', icon: FaBoxes },
          { id: 'orders', label: 'Store Orders', icon: FaClipboardList },
          { id: 'users', label: 'User Registry', icon: FaUsers }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-amazon-dark text-white dark:bg-amber-500 dark:text-slate-950 shadow'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* --- TAB VIEW: ANALYTICS --- */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {loadingAnalytics ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amazon-yellow mx-auto mb-3"></div>
              <p className="text-slate-500 text-xs">Loading analytics statistics...</p>
            </div>
          ) : analytics ? (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Revenue', value: `$${analytics.summary.totalSales.toFixed(2)}`, icon: FaChartLine, bg: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
                  { label: 'Total Orders', value: analytics.summary.totalOrders, icon: FaClipboardList, bg: 'text-sky-500 bg-sky-50 dark:bg-sky-950/20' },
                  { label: 'Registered Users', value: analytics.summary.totalUsers, icon: FaUsers, bg: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' },
                  { label: 'Store Products', value: analytics.summary.totalProducts, icon: FaBoxes, bg: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-center gap-4">
                      <div className={`p-3.5 rounded-full ${item.bg}`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">{item.label}</p>
                        <p className="text-lg md:text-xl font-bold text-slate-850 dark:text-white mt-1">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Graphical indicators (Category Breakdown Sales) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Category Sales Shares</h3>
                  <div className="space-y-4">
                    {analytics.categorySales.map((cat, idx) => (
                      <div key={idx} className="text-xs space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <span>{cat.category}</span>
                          <span>${cat.value.toFixed(2)}</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          {/* Mock percentage width based on value */}
                          <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, (cat.value / (analytics.summary.totalSales || 1)) * 100)}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Recent Daily Transactions</h3>
                    <div className="flex items-end justify-between h-40 gap-1.5 pt-4 px-2">
                      {analytics.dailySales.map((day, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                          {/* Tooltip */}
                          <span className="absolute bottom-full mb-1 scale-0 group-hover:scale-100 bg-slate-950 text-white text-[9px] px-1.5 py-0.5 rounded shadow z-10 whitespace-nowrap">
                            ${day.sales.toFixed(0)} ({day.date})
                          </span>
                          <div
                            className="w-full bg-sky-500 rounded-t group-hover:bg-amber-500 transition-colors"
                            style={{ height: `${Math.max(10, Math.min(100, (day.sales / Math.max(...analytics.dailySales.map(d=>d.sales), 1)) * 100))}%` }}
                          ></div>
                          <span className="text-[8px] text-slate-400 mt-1 uppercase select-none rotate-45">{day.date.substring(5)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center py-6 text-slate-500">No sales transactions data loaded.</p>
          )}
        </div>
      )}

      {/* --- TAB VIEW: PRODUCTS INVENTORY --- */}
      {activeTab === 'products' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-808 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase">
                  <th className="p-4">Thumbnail</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-805">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                    <td className="p-4">
                      <img src={prod.images[0]} alt={prod.name} className="h-10 w-10 object-contain rounded bg-slate-50 p-1" />
                    </td>
                    <td className="p-4 font-bold text-slate-850 dark:text-slate-200 truncate max-w-[200px]" title={prod.name}>
                      {prod.name}
                    </td>
                    <td className="p-4">{prod.category}</td>
                    <td className="p-4 font-semibold">${prod.price.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`font-bold ${prod.countInStock === 0 ? 'text-red-500' : 'text-slate-600 dark:text-slate-300'}`}>
                        {prod.countInStock}
                      </span>
                    </td>
                    <td className="p-4">{prod.discount}%</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-2 bg-sky-100 dark:bg-sky-950/40 text-sky-600 rounded hover:scale-105 transition-transform"
                          title="Edit Product"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id)}
                          className="p-2 bg-red-100 dark:bg-red-950/40 text-rose-500 rounded hover:scale-105 transition-transform"
                          title="Delete Product"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB VIEW: ORDERS MANAGEMENT --- */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-808 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Total Cost</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Shipment Status</th>
                  <th className="p-4 text-center">Toggle Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-805">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                    <td className="p-4 font-mono font-bold tracking-tight text-slate-600 dark:text-slate-400">{order._id}</td>
                    <td className="p-4 font-semibold">{order.user ? order.user.name : 'Unknown User'}</td>
                    <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-semibold">${order.totalPrice.toFixed(2)}</td>
                    <td className="p-4 truncate max-w-[150px]" title={`${order.shippingAddress.street}, ${order.shippingAddress.city}`}>{order.shippingAddress.street}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                        order.status === 'Shipped' ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-1.5">
                        {order.status === 'Pending' && (
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'Shipped')}
                            className="py-1 px-2.5 bg-sky-600 hover:bg-sky-750 text-white rounded text-[10px] font-bold flex items-center gap-1 shadow-sm"
                          >
                            <FaShippingFast /> Ship
                          </button>
                        )}
                        {order.status === 'Shipped' && (
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                            className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold flex items-center gap-1 shadow-sm"
                          >
                            <FaCheckCircle /> Deliver
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB VIEW: USER REGISTRY --- */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-808 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase">
                  <th className="p-4">User ID</th>
                  <th className="p-4">Full Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Member Since</th>
                  <th className="p-4 text-center">Admin Rights</th>
                  <th className="p-4 text-center">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-805">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                    <td className="p-4 font-mono text-slate-500">{user._id}</td>
                    <td className="p-4 font-semibold">{user.name}</td>
                    <td className="p-4 text-slate-650 dark:text-slate-300">{user.email}</td>
                    <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleToggleAdmin(user._id, user.isAdmin)}
                          className={`py-1 px-2.5 rounded text-[10px] font-bold transition-all border ${
                            user.isAdmin
                              ? 'bg-amber-100 border-amber-400 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                              : 'bg-slate-50 border-slate-300 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {user.isAdmin ? 'Admin ✓' : 'Promote'}
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <button
                          disabled={user.isAdmin}
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-1.5 bg-red-50 text-rose-500 rounded border border-red-200 hover:bg-red-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                          title="Delete User"
                        >
                          <FaTrash size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- ADD/EDIT PRODUCT MODAL POPUP --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 overflow-y-auto max-h-[90vh] animate-scaleUp">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 text-slate-900 dark:text-white">
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <FaBoxes className="text-amber-500" /> {editProduct ? 'Edit Store Product' : 'Create Store Product'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-red-500 focus:outline-none"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-500 font-bold mb-1">Product Title</label>
                <input
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="amazon-input"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={prodPrice}
                  onChange={(e) => setProdPrice(e.target.value)}
                  className="amazon-input"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Discount (%)</label>
                <input
                  type="number"
                  value={prodDiscount}
                  onChange={(e) => setProdDiscount(e.target.value)}
                  className="amazon-input"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Category</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  className="amazon-input font-bold"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Mobiles">Mobiles</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home Essentials">Home Essentials</option>
                  <option value="Gaming">Gaming</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Brand Name</label>
                <input
                  type="text"
                  value={prodBrand}
                  onChange={(e) => setProdBrand(e.target.value)}
                  className="amazon-input"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Count In Stock</label>
                <input
                  type="number"
                  value={prodStock}
                  onChange={(e) => setProdStock(e.target.value)}
                  className="amazon-input"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Image URL</label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="amazon-input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-500 font-bold mb-1">Product Description</label>
                <textarea
                  rows={4}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="amazon-input leading-relaxed"
                  required
                ></textarea>
              </div>

              {/* Actions footer */}
              <div className="sm:col-span-2 flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 rounded text-slate-700 dark:text-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-gradient-to-b from-yellow-400 to-amazon-yellow text-slate-900 rounded font-bold border border-yellow-500 shadow"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
