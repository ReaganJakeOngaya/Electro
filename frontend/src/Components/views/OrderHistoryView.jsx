// src/components/OrderHistoryView.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../common/constants';
import { getToken, getUser } from '../common/utils/auth';
import { RiEyeLine } from 'react-icons/ri';
import OrderDetailsModal from '../common/OrderDetailsModal';

const OrderHistoryView = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const user = getUser();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = getToken();
      if (!user?.id) return;
      const res = await axios.get(`${API}/user/${user.id}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Your orders</p>
        <h2 className="text-2xl font-black tracking-tighter text-black">Order History</h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-zinc-100">
          <p className="text-zinc-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 border-b border-zinc-100">
                <tr>
                  <th className="px-6 py-3 text-xs font-black uppercase text-zinc-400">Order #</th>
                  <th className="px-6 py-3 text-xs font-black uppercase text-zinc-400">Date</th>
                  <th className="px-6 py-3 text-xs font-black uppercase text-zinc-400">Total</th>
                  <th className="px-6 py-3 text-xs font-black uppercase text-zinc-400">Status</th>
                  <th className="px-6 py-3 text-xs font-black uppercase text-zinc-400">Payment</th>
                  <th className="px-6 py-3 text-xs font-black uppercase text-zinc-400"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                    <td className="px-6 py-4 font-mono text-sm">#{order.order_number}</td>
                    <td className="px-6 py-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold">KSh {order.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm capitalize">{order.paymentMethod.replace('_', ' ')}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => viewDetails(order)}
                        className="flex items-center gap-1 text-xs font-bold text-zinc-600 hover:text-black"
                      >
                        <RiEyeLine size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default OrderHistoryView;