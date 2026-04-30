// src/Pages/AdminDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUser, getToken, logout } from '../Components/common/utils/auth';
import { API } from '../Components/common/constants';
import AdminSidebar from '../Components/admin/AdminSidebar';
import AdminProducts from '../Components/admin/AdminProducts';
import AdminOrders from '../Components/admin/AdminOrders';
import AdminUsers from '../Components/admin/AdminUsers';
import AdminSettings from '../Components/admin/AdminSettings';
import AdminStats from '../Components/admin/AdminStats';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalUsers: 0, revenue: 0 });

  const fetchAllData = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) throw new Error('No token');
      const headers = { Authorization: `Bearer ${token}` };
      const [productsRes, ordersRes, usersRes, statsRes] = await Promise.all([
        axios.get(`${API}/admin/products`, { headers }),
        axios.get(`${API}/admin/orders`, { headers }),
        axios.get(`${API}/admin/users`, { headers }),
        axios.get(`${API}/admin/stats`, { headers }),
      ]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout(); // clear invalid session
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleProductUpdate = () => fetchAllData();
  const handleOrderUpdate = () => fetchAllData();
  const handleUserUpdate = () => fetchAllData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-zinc-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6 lg:p-8">
          {activeTab === 'stats' && <AdminStats stats={stats} />}
          {activeTab === 'products' && (
            <AdminProducts products={products} onRefresh={handleProductUpdate} />
          )}
          {activeTab === 'orders' && (
            <AdminOrders orders={orders} onRefresh={handleOrderUpdate} />
          )}
          {activeTab === 'users' && (
            <AdminUsers users={users} currentUserId={user?.id} onRefresh={handleUserUpdate} />
          )}
          {activeTab === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;