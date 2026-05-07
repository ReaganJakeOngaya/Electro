// src/components/common/OrderDetailsModal.jsx
import React from 'react';
import { RiCloseLine, RiTruckLine, RiSecurePaymentLine, RiUserLine } from 'react-icons/ri';
import { API } from '../common/constants';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const hasDiscount = order.items.some(item => item.discount && item.discount > 0);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-zinc-100 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black tracking-tight">Order Details</h2>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">#{order.order_number}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-black hover:border-zinc-400 transition-all"
            >
              <RiCloseLine size={16} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Customer & Shipping in grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer info */}
              <div className="bg-zinc-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <RiUserLine size={14} className="text-zinc-400" />
                  <h3 className="text-xs font-black uppercase tracking-wide text-zinc-500">Customer</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p><span className="text-zinc-500">Name:</span> <span className="font-medium">{order.customer?.firstName} {order.customer?.lastName}</span></p>
                  <p><span className="text-zinc-500">Email:</span> <span className="font-medium">{order.customer?.email}</span></p>
                  <p><span className="text-zinc-500">Phone:</span> <span className="font-medium">{order.customer?.phone}</span></p>
                </div>
              </div>

              {/* Shipping info */}
              <div className="bg-zinc-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <RiTruckLine size={14} className="text-zinc-400" />
                  <h3 className="text-xs font-black uppercase tracking-wide text-zinc-500">Shipping Address</h3>
                </div>
                <div className="text-sm">
                  <p>{order.shipping?.address}</p>
                  <p>{order.shipping?.city}{order.shipping?.postalCode ? `, ${order.shipping.postalCode}` : ''}</p>
                  <p>{order.shipping?.country}</p>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-zinc-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <RiSecurePaymentLine size={14} className="text-zinc-400" />
                <h3 className="text-xs font-black uppercase tracking-wide text-zinc-500">Payment Method</h3>
              </div>
              <div className="text-sm capitalize font-medium">{order.paymentMethod?.replace('_', ' ')}</div>
            </div>

            {/* Order items */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-zinc-500 mb-3">Items ({totalItems})</h3>
              <div className="border border-zinc-100 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-50">
                      <tr>
                        <th className="px-4 py-3 text-left">Product</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-4 py-3 text-right">Price</th>
                        <th className="px-4 py-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, idx) => {
                        const hasItemDiscount = item.discount && item.discount > 0;
                        return (
                          <tr key={idx} className="border-t border-zinc-100">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {item.image && (
                                  <img
                                    src={`${API}/uploads/${item.image}`}
                                    alt=""
                                    className="w-10 h-10 rounded-lg object-cover border border-zinc-100"
                                    onError={(e) => (e.target.style.display = 'none')}
                                  />
                                )}
                                <div>
                                  <span className="font-medium">{item.name}</span>
                                  {hasItemDiscount && (
                                    <p className="text-[10px] text-green-600 font-bold">-{item.discount}% off</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">{item.quantity}</td>
                            <td className="px-4 py-3 text-right">
                              {hasItemDiscount ? (
                                <div>
                                  <span className="font-medium">KSh {Number(item.price).toLocaleString()}</span>
                                  <span className="text-xs text-zinc-400 line-through ml-1">KSh {Number(item.originalPrice || item.price).toLocaleString()}</span>
                                </div>
                              ) : (
                                <span className="font-medium">KSh {Number(item.price).toLocaleString()}</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right font-medium">
                              KSh {(item.price * item.quantity).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-zinc-50 border-t border-zinc-100">
                      <tr>
                        <td colSpan="3" className="px-4 py-3 text-right font-black">Total</td>
                        <td className="px-4 py-3 text-right font-black">KSh {Number(order.total).toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsModal;