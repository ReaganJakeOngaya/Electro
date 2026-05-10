// src/Components/common/OrderDetailsModal.jsx
import React from 'react';
import { RiCloseLine, RiTruckLine, RiSecurePaymentLine, RiUserLine } from 'react-icons/ri';
import { API } from '../common/constants';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl rounded-sm">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black tracking-tight text-black">Order Details</h2>
              <p className="text-[10px] font-mono text-gray-400 mt-0.5 tracking-wide">#{order.order_number}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-sm border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-all"
            >
              <RiCloseLine size={16} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Customer & Shipping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-sm">
                <div className="flex items-center gap-2 mb-3">
                  <RiUserLine size={14} className="text-gray-400" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-500">Customer</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500">Name:</span> <span className="font-medium text-black">{order.customer?.firstName} {order.customer?.lastName}</span></p>
                  <p><span className="text-gray-500">Email:</span> <span className="font-medium text-black">{order.customer?.email}</span></p>
                  <p><span className="text-gray-500">Phone:</span> <span className="font-medium text-black">{order.customer?.phone || '—'}</span></p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-4 rounded-sm">
                <div className="flex items-center gap-2 mb-3">
                  <RiTruckLine size={14} className="text-gray-400" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-500">Shipping Address</h3>
                </div>
                <div className="text-sm text-black">
                  <p>{order.shipping?.address || '—'}</p>
                  <p>{order.shipping?.city}{order.shipping?.postalCode ? `, ${order.shipping.postalCode}` : ''}</p>
                  <p>{order.shipping?.country || 'Kenya'}</p>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-gray-50 border border-gray-100 p-4 rounded-sm">
              <div className="flex items-center gap-2 mb-3">
                <RiSecurePaymentLine size={14} className="text-gray-400" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-500">Payment Method</h3>
              </div>
              <div className="text-sm capitalize font-medium text-black">{order.paymentMethod?.replace('_', ' ') || '—'}</div>
            </div>

            {/* Order items */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-500 mb-3">Items ({totalItems})</h3>
              <div className="border border-gray-100 rounded-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.1em] text-gray-500">Product</th>
                        <th className="px-4 py-3 text-center text-[10px] font-black uppercase tracking-[0.1em] text-gray-500">Qty</th>
                        <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-[0.1em] text-gray-500">Price</th>
                        <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-[0.1em] text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, idx) => {
                        const hasItemDiscount = item.discount && item.discount > 0;
                        return (
                          <tr key={idx} className="border-t border-gray-100">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {item.image && (
                                  <img
                                    src={`${API}/uploads/${item.image}`}
                                    alt=""
                                    className="w-10 h-10 rounded-sm object-cover border border-gray-100"
                                    onError={(e) => (e.target.style.display = 'none')}
                                  />
                                )}
                                <div>
                                  <span className="font-black text-black">{item.name}</span>
                                  {hasItemDiscount && (
                                    <p className="text-[9px] font-black text-orange-500">-{item.discount}% off</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center text-black">{item.quantity}</td>
                            <td className="px-4 py-3 text-right">
                              {hasItemDiscount ? (
                                <div>
                                  <span className="font-black text-black">KSh {Number(item.price).toLocaleString()}</span>
                                  <span className="text-[10px] text-gray-400 line-through ml-1">KSh {Number(item.originalPrice || item.price).toLocaleString()}</span>
                                </div>
                              ) : (
                                <span className="font-black text-black">KSh {Number(item.price).toLocaleString()}</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right font-black text-black">
                              KSh {(item.price * item.quantity).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t border-gray-100">
                      <tr>
                        <td colSpan="3" className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-[0.1em] text-black">Total</td>
                        <td className="px-4 py-3 text-right font-black text-black">KSh {Number(order.total).toLocaleString()}</td>
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