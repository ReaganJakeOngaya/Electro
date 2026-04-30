// src/components/admin/AdminStats.jsx
import React from 'react';
import { RiShoppingBagLine, RiShoppingCartLine, RiUserLine, RiMoneyDollarCircleLine } from 'react-icons/ri';

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-400">{title}</p>
        <p className="text-3xl font-black text-black mt-2">{value}</p>
      </div>
      <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center">
        <Icon className="text-2xl text-black" />
      </div>
    </div>
  </div>
);

const AdminStats = ({ stats }) => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tighter text-black">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Overview of your store</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Products" value={stats.totalProducts} icon={RiShoppingBagLine} />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={RiShoppingCartLine} />
        <StatCard title="Total Users" value={stats.totalUsers} icon={RiUserLine} />
        <StatCard title="Revenue" value={`KSh ${stats.revenue?.toLocaleString() || 0}`} icon={RiMoneyDollarCircleLine} />
      </div>
    </div>
  );
};

export default AdminStats;