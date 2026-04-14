import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Sparkles, Heart } from 'lucide-react';

const C = {
  pink: '#FF6B9D', yellow: '#FFE135', blue: '#4ECDC4',
  purple: '#A855F7', orange: '#FF8C42', green: '#06D6A0',
  ink: '#1A1A2E', white: '#FFFFFF', cream: '#FAFAF7',
  blush: '#FFD6E7', lavender: '#E8D5FF', mint: '#D5F5EE', butter: '#FFF5CC',
};

const tagColors = [C.pink, '#FFB800', C.blue, C.purple, C.orange, C.green];

export default function Cart() {
  const { cart, removeItem, updateQty, total } = useCart();

  const polaroidQty = cart.items.filter(i => i.category === 'Polaroids').reduce((s, i) => s + i.qty, 0);
  const posterQty   = cart.items.filter(i => i.category === 'Posters').reduce((s, i) => s + i.qty, 0);
  const polaroidError = polaroidQty > 0 && polaroidQty < 10;
  const posterError   = posterQty > 0 && posterQty < 5;
  const hasError      = polaroidError || posterError;

  if (cart.items.length === 0) {
    return (
      <div style={{
        paddingTop: 64, minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFF5F8 0%, #FFF0FA 40%, #F5F0FF 70%, #F0FAFF 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 20,
      }}>
        <div style={{
          width: 120, height: 120,
          background: C.blush,
          border: '2px dashed ' + C.pink,
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 52,
        }}>🛒</div>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: C.ink, margin: 0 }}>
          Your cart is empty!
        </h2>
        <p style={{ fontFamily: 'DM Sans', color: '#999', fontSize: 15, margin: 0 }}>
          Looks like you haven't added anything yet 🎨
        </p>
        <Link to="/shop" style={{
          marginTop: 8,
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
          color: C.white,
          fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem',
          padding: '14px 32px', borderRadius: 16, textDecoration: 'none',
          boxShadow: '0 8px 32px rgba(255,107,157,0.35)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,107,157,0.45)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,107,157,0.35)'; }}>
          Browse Shop <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      paddingTop: 64, minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF5F8 0%, #FFF0FA 40%, #F5F0FF 70%, #F0FAFF 100%)',
    }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
        padding: '3rem 2rem 4rem',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: 120, width: 160, height: 160, background: 'rgba(255,255,255,0.08)', borderRadius: '50%', filter: 'blur(30px)' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Link to="/shop" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'rgba(255,255,255,0.7)', fontFamily: 'DM Sans', fontSize: 13,
            textDecoration: 'none', marginBottom: 16,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.white}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
            <ArrowLeft size={14} /> Continue Shopping
          </Link>
          <h1 style={{
            fontFamily: 'Syne', fontWeight: 800,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            color: C.white, margin: '0 0 8px', lineHeight: 1.1,
          }}>
            Your Cart 🛒
          </h1>
          <p style={{ fontFamily: 'DM Sans', color: 'rgba(255,255,255,0.75)', fontSize: 14, margin: 0 }}>
            {cart.items.length} item{cart.items.length > 1 ? 's' : ''} · Ready to order
          </p>
        </div>

        {/* Wave */}
        <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 40, overflow: 'hidden' }}>
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d="M0,40 C300,0 900,40 1200,10 L1200,40 Z" fill="#FFF5F8" />
          </svg>
        </div>
      </div>

      <div className="cart-layout" style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '2.5rem 2rem',
        display: 'grid', gridTemplateColumns: '1fr 380px',
        gap: '2rem', alignItems: 'start',
      }}>

        {/* LEFT — Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Min order warnings */}
          {polaroidError && (
            <div style={{
              background: '#FFF5F0', border: '2px solid #FFB347',
              borderRadius: 16, padding: '12px 18px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 22 }}>⚠️</span>
              <p style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13, color: '#8B4513', margin: 0 }}>
                Polaroids need minimum <strong>10 pieces</strong> — you have {polaroidQty}. Add {10 - polaroidQty} more!
              </p>
            </div>
          )}
          {posterError && (
            <div style={{
              background: '#FFF5F0', border: '2px solid #FFB347',
              borderRadius: 16, padding: '12px 18px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 22 }}>⚠️</span>
              <p style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13, color: '#8B4513', margin: 0 }}>
                Posters need minimum <strong>5 pieces</strong> — you have {posterQty}. Add {5 - posterQty} more!
              </p>
            </div>
          )}

          {/* Cart items */}
          {cart.items.map((item, idx) => {
            const accent = tagColors[idx % tagColors.length];
            return (
              <div key={item._id + '-' + item.variant} className="cart-item-grid" style={{
                background: C.white,
                borderRadius: 22,
                padding: '1.25rem',
                boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                border: '1.5px solid rgba(0,0,0,0.06)',
                display: 'grid',
                gridTemplateColumns: '80px 1fr auto',
                gap: '1rem', alignItems: 'center',
                transition: 'transform 0.25s, box-shadow 0.25s',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.10)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.07)'; }}>

                {/* Accent strip */}
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: 4, background: 'linear-gradient(180deg, ' + accent + ', ' + accent + '80)',
                  borderRadius: '22px 0 0 22px',
                }} />

                {/* Image */}
                <div style={{
                  width: 80, height: 80, borderRadius: 14,
                  overflow: 'hidden',
                  border: '2px solid rgba(0,0,0,0.06)',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}>
                  <img
                    src={item.image || 'https://images.pexels.com/photos/4340786/pexels-photo-4340786.jpeg?auto=compress&cs=tinysrgb&w=200'}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Info */}
                <div>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem', color: C.ink, margin: '0 0 4px' }}>
                    {item.name}
                  </h3>
                  <span style={{
                    display: 'inline-block',
                    background: accent + '20', color: accent,
                    fontFamily: 'DM Sans', fontWeight: 600, fontSize: 10,
                    padding: '2px 10px', borderRadius: 999, marginBottom: 12,
                    border: '1px solid ' + accent + '40',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    {item.category || 'Print'}
                  </span>

                  {/* Qty controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => updateQty(item._id, item.variant, item.qty - 1)}
                      style={{
                        width: 30, height: 30, borderRadius: 10,
                        border: '1.5px solid #f0f0f0',
                        background: '#fafafa',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = C.ink; e.currentTarget.style.borderColor = C.ink; e.currentTarget.style.color = C.white; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.color = C.ink; }}
                    >
                      <Minus size={11} />
                    </button>
                    <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, minWidth: 28, textAlign: 'center' }}>
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item._id, item.variant, item.qty + 1)}
                      style={{
                        width: 30, height: 30, borderRadius: 10,
                        border: '1.5px solid #f0f0f0',
                        background: '#fafafa',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = C.ink; e.currentTarget.style.borderColor = C.ink; e.currentTarget.style.color = C.white; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.color = C.ink; }}
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>

                {/* Price + remove */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14 }}>
                  <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.25rem', color: C.ink }}>
                    ₹{item.price * item.qty}
                  </span>
                  <button
                    onClick={() => removeItem(item._id, item.variant)}
                    style={{
                      width: 32, height: 32, borderRadius: 10,
                      border: '1.5px solid #ffe0e0', background: '#fff8f8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#ffe0e0'; e.currentTarget.style.borderColor = '#ff4444'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff8f8'; e.currentTarget.style.borderColor = '#ffe0e0'; e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    <Trash2 size={13} color="#e74c3c" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT — Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Order summary card */}
          <div style={{
            background: C.white, borderRadius: 24,
            boxShadow: '0 8px 40px rgba(255,107,157,0.12)',
            border: '1.5px solid rgba(255,107,157,0.15)',
            overflow: 'hidden',
          }}>
            {/* Card header */}
            <div style={{
              background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
              padding: '1.25rem 1.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1rem', color: C.white, margin: 0 }}>
                Order Summary
              </h3>
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                color: C.white, fontFamily: 'Syne', fontWeight: 700, fontSize: 12,
                padding: '3px 12px', borderRadius: 999,
              }}>
                {cart.items.length} items
              </span>
            </div>

            <div style={{ padding: '1.5rem' }}>

              {/* Line items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.25rem' }}>
                {cart.items.map((item, idx) => (
                  <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: tagColors[idx % tagColors.length], flexShrink: 0 }} />
                      <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </span>
                      <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#bbb', flexShrink: 0 }}>×{item.qty}</span>
                    </div>
                    <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: C.ink, flexShrink: 0 }}>
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ borderTop: '2px dashed #f5f0ff', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#888' }}>Subtotal</span>
                  <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: C.ink }}>₹{total}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#888' }}>Shipping</span>
                  <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: C.green }}>FREE 🎉</span>
                </div>
              </div>

              {/* Total */}
              <div style={{
                marginTop: '1rem',
                background: 'linear-gradient(135deg, #FFF5F8, #F5F0FF)',
                border: '1.5px solid rgba(255,107,157,0.2)',
                borderRadius: 16, padding: '1rem 1.25rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1rem', color: C.ink }}>Total</span>
                <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  ₹{total}
                </span>
              </div>

              {/* Checkout button */}
              {hasError ? (
                <div style={{
                  marginTop: '1rem', padding: '15px',
                  background: '#f5f5f5', borderRadius: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem', color: '#aaa',
                  cursor: 'not-allowed',
                }}>
                  <ShoppingBag size={17} /> Fix Min Order to Checkout
                </div>
              ) : (
                <Link to="/checkout" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  marginTop: '1rem',
                  background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
                  color: C.white, fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem',
                  padding: '15px', borderRadius: 16, textDecoration: 'none',
                  boxShadow: '0 8px 32px rgba(255,107,157,0.35)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,107,157,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,107,157,0.35)'; }}>
                  <ShoppingBag size={17} /> Proceed to Checkout <ArrowRight size={15} />
                </Link>
              )}

              {/* Payment badges */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#F5F0FF', borderRadius: 14 }}>
                <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 12, color: C.ink, margin: '0 0 8px' }}>
                  💳 We Accept
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['UPI', 'GPay', 'PhonePe', 'Paytm', 'Card'].map(p => (
                    <span key={p} style={{
                      fontFamily: 'DM Sans', fontWeight: 600, fontSize: 11,
                      background: C.white, border: '1px solid rgba(168,85,247,0.2)',
                      padding: '3px 12px', borderRadius: 999, color: C.purple,
                    }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div style={{
            background: C.blush,
            border: '1.5px solid rgba(255,107,157,0.2)',
            borderRadius: 20, padding: '1.25rem',
            boxShadow: '0 4px 16px rgba(255,107,157,0.08)',
          }}>
            {[
              { icon: '🔒', text: 'Secure UPI payment' },
              { icon: '🎨', text: 'Premium print quality' },
              { icon: '📸', text: 'Custom polaroids & posters' },
              { icon: '💖', text: 'Made with love in Chennai' },
            ].map((b, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0',
                borderBottom: i < 3 ? '1px solid rgba(255,107,157,0.15)' : 'none',
              }}>
                <span style={{ fontSize: 18 }}>{b.icon}</span>
                <span style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13, color: C.ink }}>
                  {b.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}