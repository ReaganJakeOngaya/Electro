// src/components/common/CartDrawer.jsx
import React from 'react';
import { RiCloseLine, RiAddLine, RiSubtractLine, RiDeleteBinLine, RiShoppingBagLine, RiShoppingCartLine } from 'react-icons/ri';
import { API } from './constants';

const CartDrawer = ({ open, onClose, cart, onUpdateQty, onRemove, onCheckout }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col transition-transform duration-300 ease-out`}
        style={{ transform: open ? 'translateX(0)' : 'translateX(100%)', boxShadow: '-20px 0 60px rgba(0,0,0,0.12)' }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <div>
            <h2 className="text-lg font-black tracking-tight text-black">Cart</h2>
            <p className="text-xs text-zinc-400 font-medium">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-black hover:border-zinc-400 transition-all">
            <RiCloseLine size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                <RiShoppingCartLine className="text-2xl text-zinc-300" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">Your cart is empty</p>
                <p className="text-xs text-zinc-400 mt-1">Add some products to get started</p>
              </div>
            </div>
          ) : (
            cart.map((item) => {
              const hasDiscount = item.discount && item.discount > 0;
              return (
                <div key={item.id} className="flex gap-4 p-3 rounded-2xl border border-zinc-100 bg-zinc-50/50">
                  <div className="w-16 h-16 rounded-xl bg-zinc-100 overflow-hidden flex-shrink-0">
                    {item.images?.[0] ? (
                      <img src={`${API}/uploads/${item.images[0]}`} alt={item.name} className="w-full h-full object-cover" onError={(e) => (e.target.style.display = 'none')} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><RiShoppingBagLine className="text-zinc-300" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-black truncate">{item.name}</p>
                    <div className="mt-0.5">
                      {hasDiscount ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-black">KSh {Number(item.price).toLocaleString()}</span>
                          <span className="text-[10px] text-zinc-400 line-through">KSh {Number(item.originalPrice).toLocaleString()}</span>
                          <span className="text-[9px] font-bold text-red-600">-{item.discount}%</span>
                        </div>
                      ) : (
                        <p className="text-xs font-black text-black">KSh {Number(item.price).toLocaleString()}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => onUpdateQty(item.id, item.qty - 1)} className="w-6 h-6 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-500 hover:border-black hover:text-black">
                        <RiSubtractLine size={11} />
                      </button>
                      <span className="text-xs font-bold text-black w-4 text-center">{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.id, item.qty + 1)} className="w-6 h-6 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-500 hover:border-black hover:text-black">
                        <RiAddLine size={11} />
                      </button>
                      <button onClick={() => onRemove(item.id)} className="ml-auto w-6 h-6 rounded-lg flex items-center justify-center text-zinc-300 hover:text-black">
                        <RiDeleteBinLine size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-zinc-100 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-400">Total</span>
              <span className="text-xl font-black text-black tracking-tight">KSh {total.toLocaleString()}</span>
            </div>
            <button onClick={onCheckout} className="w-full bg-black text-white font-bold text-sm py-3.5 rounded-xl hover:bg-zinc-800 transition-colors active:scale-[0.99]">
              Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;

