import React, { useMemo } from 'react';
import {
  RiCloseLine, RiAddLine, RiSubtractLine, RiDeleteBinLine,
  RiShoppingBagLine, RiArrowRightLine, RiStarFill, RiHeartLine, RiHeartFill,
} from 'react-icons/ri';
import { API } from './constants';

/* ── Mini recommendation card ────────────────────────────────── */
const RecommendCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted }) => {
  const hasDiscount = product.discount > 0;
  const finalPrice  = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;
  const img         = product.images?.[0];
  const rating      = product.avg_rating || 0;

  return (
    <div className="group flex gap-3 p-2.5 rounded-sm border border-zinc-100 hover:border-zinc-200
                    bg-white transition-all duration-150">
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-sm bg-zinc-50 border border-zinc-100 overflow-hidden flex-shrink-0">
        {img ? (
          <img
            src={`${API}/uploads/${img}`}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <RiShoppingBagLine className="text-zinc-300 text-lg" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1.5 mb-0.5">
          <p className="text-[11px] font-black text-black line-clamp-2 leading-tight flex-1">
            {product.name}
          </p>
          <button
            onClick={() => onToggleWishlist(product.id)}
            className={`flex-shrink-0 mt-0.5 transition-colors ${
              isWishlisted ? 'text-orange-500' : 'text-zinc-300 hover:text-orange-400'
            }`}
          >
            {isWishlisted ? <RiHeartFill size={11} /> : <RiHeartLine size={11} />}
          </button>
        </div>

        {/* Stars */}
        {rating > 0 && (
          <div className="flex gap-0.5 mb-1.5">
            {[1,2,3,4,5].map(i => (
              <RiStarFill key={i} size={8}
                className={i <= Math.round(rating) ? 'text-orange-500' : 'text-zinc-200'} />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-xs font-black text-black">
              KSh {Math.round(finalPrice).toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-[9px] text-zinc-400 line-through ml-1.5">
                KSh {product.price.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-1 bg-orange-500 text-white text-[9px] font-black
                       uppercase tracking-[0.08em] px-2 py-1 rounded-sm hover:bg-orange-600
                       transition-colors active:scale-95 flex-shrink-0"
          >
            <RiAddLine size={10} /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main CartDrawer ─────────────────────────────────────────── */
const CartDrawer = ({
  open, onClose, cart, onUpdateQty, onRemove, onCheckout,
  allProducts = [], wishlist = [], onToggleWishlist = () => {},
}) => {
  const subtotal      = cart.reduce((s, i) => s + (i.originalPrice || i.price) * i.qty, 0);
  const discountTotal = cart.reduce((s, i) => {
    const orig = (i.originalPrice || i.price) * i.qty;
    return s + (orig - i.price * i.qty);
  }, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  /* 4 random products for empty-state recs, re-shuffled each time cart empties */
  const recommended = useMemo(() => {
    if (allProducts.length === 0) return [];
    return [...allProducts].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [allProducts, cart.length === 0]);

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      )}

      <div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col
                   transition-transform duration-300 ease-out"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.18)',
        }}
      >
        {/* Orange top strip */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-orange-500 z-10" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-zinc-100 mt-[3px]">
          <div>
            <h2 className="text-lg font-black tracking-tight text-black">Your Cart</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400 mt-0.5">
              {cart.length === 0 ? 'Empty' : `${cart.length} ${cart.length === 1 ? 'item' : 'items'}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-sm border border-zinc-200 flex items-center justify-center
                       text-zinc-500 hover:text-black hover:border-zinc-400 transition-all"
          >
            <RiCloseLine size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {cart.length === 0 ? (
            /* ── Empty + recommendations ──────────────────────── */
            <div className="space-y-6">
              {/* Empty message */}
              <div className="flex flex-col items-center py-8 gap-4 text-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 flex items-center justify-center rounded-sm">
                    <RiShoppingBagLine className="text-2xl text-zinc-300" />
                  </div>
                  <div className="absolute top-0 right-0 w-0 h-0
                                  border-t-[16px] border-t-orange-500
                                  border-l-[16px] border-l-transparent" />
                </div>
                <div>
                  <p className="text-sm font-black text-black">Your cart is empty</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Here are some things you might like
                  </p>
                </div>
              </div>

              {/* Recommended products */}
              {recommended.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-4 h-[2px] bg-orange-500" />
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500">
                      You might like
                    </p>
                  </div>
                  <div className="space-y-2">
                    {recommended.map(product => (
                      <RecommendCard
                        key={product.id}
                        product={product}
                        onAddToCart={onAddToCart => {}}
                        onToggleWishlist={onToggleWishlist}
                        isWishlisted={wishlist.includes(product.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {recommended.length === 0 && (
                <div className="flex justify-center">
                  <button
                    onClick={onClose}
                    className="flex items-center gap-2 bg-orange-500 text-white text-[10px]
                               font-black uppercase tracking-[0.14em] px-5 py-3 rounded-sm
                               hover:bg-orange-600 transition"
                  >
                    Browse products <RiArrowRightLine size={12} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Cart items ─────────────────────────────────────── */
            <div className="space-y-3">
              {cart.map(item => {
                const hasDiscount     = item.discount > 0;
                const origTotal       = (item.originalPrice || item.price) * item.qty;
                const discountedTotal = item.price * item.qty;
                return (
                  <div key={item.id}
                       className="flex gap-3 p-3.5 border border-zinc-100 rounded-sm hover:border-zinc-200 transition-all">
                    <div className="w-[60px] h-[60px] rounded-sm bg-zinc-50 overflow-hidden flex-shrink-0 border border-zinc-100">
                      {item.images?.[0] ? (
                        <img src={`${API}/uploads/${item.images[0]}`} alt={item.name}
                             className="w-full h-full object-cover"
                             onError={e => (e.target.style.display = 'none')} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <RiShoppingBagLine className="text-zinc-300 text-lg" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-black truncate leading-tight">{item.name}</p>

                      <div className="mt-1">
                        {hasDiscount ? (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-sm font-black text-black">KSh {discountedTotal.toLocaleString()}</span>
                            <span className="text-[10px] text-zinc-400 line-through">KSh {origTotal.toLocaleString()}</span>
                            <span className="text-[9px] font-black text-white bg-orange-500 px-1.5 py-0.5 rounded-sm">-{item.discount}%</span>
                          </div>
                        ) : (
                          <span className="text-sm font-black text-black">KSh {discountedTotal.toLocaleString()}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mt-2.5">
                        <button onClick={() => onUpdateQty(item.id, item.qty - 1)}
                                className="w-6 h-6 rounded-sm border border-zinc-200 flex items-center justify-center
                                           text-zinc-500 hover:border-orange-500 hover:text-orange-500 transition-all">
                          <RiSubtractLine size={11} />
                        </button>
                        <span className="text-xs font-black text-black min-w-[20px] text-center">{item.qty}</span>
                        <button onClick={() => onUpdateQty(item.id, item.qty + 1)}
                                className="w-6 h-6 rounded-sm border border-zinc-200 flex items-center justify-center
                                           text-zinc-500 hover:border-orange-500 hover:text-orange-500 transition-all">
                          <RiAddLine size={11} />
                        </button>
                        <button onClick={() => onRemove(item.id)}
                                className="ml-auto w-6 h-6 rounded-sm flex items-center justify-center
                                           text-zinc-300 hover:text-red-500 transition-colors" title="Remove">
                          <RiDeleteBinLine size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-5 py-5 border-t border-zinc-100 bg-white">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500 font-bold uppercase tracking-[0.08em]">Subtotal</span>
                <span className="font-black text-black">KSh {subtotal.toLocaleString()}</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-orange-500 font-bold uppercase tracking-[0.08em]">Discount</span>
                  <span className="font-black text-orange-500">− KSh {discountTotal.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-zinc-100">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-black">Total</span>
                <span className="text-lg font-black text-black" style={{ letterSpacing: '-0.02em' }}>
                  KSh {total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Free shipping nudge */}
            {total < 5000 && (
              <div className="mb-3 px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400">
                  Add <span className="text-orange-500">KSh {(5000 - total).toLocaleString()}</span> for{' '}
                  <span className="text-black">free shipping</span>
                </p>
              </div>
            )}

            <button
              onClick={onCheckout}
              className="w-full bg-orange-500 text-white font-black text-[10px] uppercase tracking-[0.14em]
                         py-4 rounded-sm hover:bg-orange-600 transition-all active:scale-[0.99]
                         flex items-center justify-center gap-2"
              style={{ boxShadow: '0 6px 24px rgba(240,90,26,0.30)' }}
            >
              Proceed to Checkout <RiArrowRightLine size={13} />
            </button>
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-zinc-400 text-center mt-3">
              Taxes & shipping calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;

