// src/components/admin/AdminOrders.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { API } from '../common/constants';
import { getToken } from '../common/utils/auth';
import OrderDetailsModal from './OrderDetailsModal';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = ({ orders, onRefresh }) => {
  const [updating, setUpdating] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await axios.put(`${API}/admin/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      onRefresh();
    } catch (err) {
      alert('Failed to update order status');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-zinc-100 text-zinc-800';
  };

  const viewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tighter text-black">Orders</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage customer orders</p>
      </div>
      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="px-6 py-3 text-xs font-black uppercase text-zinc-400">Order #</th>
                <th className="px-6 py-3 text-xs font-black uppercase text-zinc-400">Customer</th>
                <th className="px-6 py-3 text-xs font-black uppercase text-zinc-400">Date</th>
                <th className="px-6 py-3 text-xs font-black uppercase text-zinc-400">Total</th>
                <th className="px-6 py-3 text-xs font-black uppercase text-zinc-400">Status</th>
                <th className="px-6 py-3 text-xs font-black uppercase text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                  <td className="px-6 py-4 font-mono text-sm">#{order.order_number}</td>
                  <td className="px-6 py-4">{order.customer.firstName} {order.customer.lastName}</td>
                  <td className="px-6 py-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold">KSh {order.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 items-center">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className="text-xs border rounded-lg px-2 py-1 bg-white"
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => viewDetails(order)}
                        className="text-xs font-bold text-black border border-zinc-200 px-3 py-1 rounded-lg hover:bg-zinc-100"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default AdminOrders;