// src/components/common/CartDrawer.jsx
import React from 'react';
import { RiCloseLine, RiAddLine, RiSubtractLine, RiDeleteBinLine, RiShoppingBagLine, RiShoppingCartLine } from 'react-icons/ri';
import { API } from './constants';

const CartDrawer = ({ open, onClose, cart, onUpdateQty, onRemove, onCheckout }) => {
  const subtotal = cart.reduce((sum, item) => sum + (item.originalPrice || item.price) * item.qty, 0);
  const discountTotal = cart.reduce((sum, item) => {
    const original = (item.originalPrice || item.price) * item.qty;
    const discounted = item.price * item.qty;
    return sum + (original - discounted);
  }, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col transition-transform duration-300 ease-out shadow-2xl`}
        style={{ transform: open ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-zinc-100">
          <div>
            <h2 className="text-xl font-black tracking-tight text-black">Your Cart</h2>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              {cart.length} {cart.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-black hover:border-zinc-400 transition-all"
          >
            <RiCloseLine size={18} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                <RiShoppingCartLine className="text-3xl text-zinc-300" />
              </div>
              <div>
                <p className="text-base font-bold text-black">Your cart is empty</p>
                <p className="text-sm text-zinc-400 mt-1">Add some products to get started</p>
              </div>
            </div>
          ) : (
            cart.map((item) => {
              const hasDiscount = item.discount && item.discount > 0;
              const itemOriginalTotal = (item.originalPrice || item.price) * item.qty;
              const itemDiscountedTotal = item.price * item.qty;
              return (
                <div key={item.id} className="flex gap-3 p-3 rounded-xl border border-zinc-100 bg-white hover:shadow-sm transition-shadow">
                  {/* Product image */}
                  <div className="w-16 h-16 rounded-lg bg-zinc-50 overflow-hidden flex-shrink-0 border border-zinc-100">
                    {item.images?.[0] ? (
                      <img
                        src={`${API}/uploads/${item.images[0]}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <RiShoppingBagLine className="text-zinc-300 text-xl" />
                      </div>
                    )}
                  </div>

                  {/* Product details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-black truncate">{item.name}</p>
                    <div className="mt-1">
                      {hasDiscount ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-black text-black">
                            KSh {itemDiscountedTotal.toLocaleString()}
                          </span>
                          <span className="text-xs text-zinc-400 line-through">
                            KSh {itemOriginalTotal.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                            -{item.discount}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-black text-black">
                          KSh {itemDiscountedTotal.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty - 1)}
                        className="w-7 h-7 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-500 hover:border-black hover:text-black transition-all"
                      >
                        <RiSubtractLine size={12} />
                      </button>
                      <span className="text-sm font-bold text-black min-w-[24px] text-center">{item.qty}</span>
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                        className="w-7 h-7 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-500 hover:border-black hover:text-black transition-all"
                      >
                        <RiAddLine size={12} />
                      </button>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-600 transition-colors"
                        title="Remove item"
                      >
                        <RiDeleteBinLine size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer – totals and checkout */}
        {cart.length > 0 && (
          <div className="px-5 py-5 border-t border-zinc-100 bg-white">
            {/* Price breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span className="font-medium">KSh {subtotal.toLocaleString()}</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>- KSh {discountTotal.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-zinc-100">
                <span>Total</span>
                <span>KSh {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout button */}
            <button
              onClick={onCheckout}
              className="w-full bg-black text-white font-bold text-sm py-3.5 rounded-xl hover:bg-zinc-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Proceed to Checkout →
            </button>
            <p className="text-[10px] text-zinc-400 text-center mt-3">
              Taxes and shipping calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;

