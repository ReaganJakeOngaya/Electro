// src/components/admin/AdminStats.jsx
import React from 'react';
import { RiShoppingBagLine, RiShoppingCartLine, RiUserLine, RiMoneyDollarCircleLine, RiTimerLine } from 'react-icons/ri';

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

const AdminStats = ({ stats, orders, users }) => {
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const recentOrders = orders.slice(0, 5);
  const recentUsers = users.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tighter text-black">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Overview of your store</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Products" value={stats.totalProducts} icon={RiShoppingBagLine} />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={RiShoppingCartLine} />
        <StatCard title="Total Users" value={stats.totalUsers} icon={RiUserLine} />
        <StatCard title="Revenue" value={`KSh ${stats.revenue?.toLocaleString() || 0}`} icon={RiMoneyDollarCircleLine} />
      </div>

      {/* Extra stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <RiTimerLine className="text-xl text-black" />
            <h3 className="font-black text-black">Pending Orders</h3>
          </div>
          <p className="text-3xl font-black">{pendingOrders}</p>
          <p className="text-sm text-zinc-500 mt-1">Awaiting processing</p>
        </div>
      </div>

      {/* Recent Orders & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-zinc-100">
            <h3 className="font-black text-black">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-4 py-2 text-left">Order #</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-right">Total</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-t border-zinc-100">
                    <td className="px-4 py-2 font-mono text-xs">#{order.order_number}</td>
                    <td className="px-4 py-2">{order.customer.firstName} {order.customer.lastName}</td>
                    <td className="px-4 py-2 text-right font-medium">KSh {order.total.toLocaleString()}</td>
                    <td className="px-4 py-2 text-center">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr><td colSpan="4" className="px-4 py-6 text-center text-zinc-400">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-zinc-100">
            <h3 className="font-black text-black">Recent Users</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(user => (
                  <tr key={user.id} className="border-t border-zinc-100">
                    <td className="px-4 py-2 font-medium">{user.first_name} {user.last_name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2 text-zinc-500">{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {recentUsers.length === 0 && (
                  <tr><td colSpan="3" className="px-4 py-6 text-center text-zinc-400">No users yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;