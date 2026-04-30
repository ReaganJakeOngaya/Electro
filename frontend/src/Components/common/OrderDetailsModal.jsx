// src/components/common/OrderDetailsModal.jsx
import React from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { API } from '../common/constants';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto pointer-events-auto">
          <div className="sticky top-0 bg-white border-b border-zinc-100 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-black tracking-tight">Order Details</h2>
              <p className="text-xs text-zinc-500">#{order.order_number}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl border border-zinc-200 flex items-center justify-center">
              <RiCloseLine size={15} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Customer info */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-zinc-400 mb-3">Customer</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-zinc-500">Name:</span> <span className="font-medium">{order.customer?.firstName} {order.customer?.lastName}</span></div>
                <div><span className="text-zinc-500">Email:</span> <span className="font-medium">{order.customer?.email}</span></div>
                <div><span className="text-zinc-500">Phone:</span> <span className="font-medium">{order.customer?.phone}</span></div>
              </div>
            </div>

            {/* Shipping info */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-zinc-400 mb-3">Shipping Address</h3>
              <div className="text-sm">
                <p>{order.shipping?.address}</p>
                <p>{order.shipping?.city}, {order.shipping?.postalCode}</p>
                <p>{order.shipping?.country}</p>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-zinc-400 mb-3">Payment</h3>
              <div className="text-sm capitalize">{order.paymentMethod?.replace('_', ' ')}</div>
            </div>

            {/* Order items */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-zinc-400 mb-3">Items ({totalItems})</h3>
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-center">Qty</th>
                      <th className="px-4 py-2 text-right">Price</th>
                      <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img src={`${API}/uploads/${item.image}`} alt="" className="w-8 h-8 rounded object-cover" />
                            )}
                            <span className="font-medium">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">KSh {Number(item.price).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-medium">KSh {(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-zinc-50 border-t">
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
    </>
  );
};

export default OrderDetailsModal;