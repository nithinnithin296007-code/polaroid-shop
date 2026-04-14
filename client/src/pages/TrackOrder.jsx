import { useState } from 'react';
import api from '../utils/api';
import { Search, Package, Truck, Check, Clock, Sparkles } from 'lucide-react';

const C = {
  pink: '#FF6B9D', yellow: '#FFE135', blue: '#4ECDC4',
  purple: '#A855F7', orange: '#FF8C42', green: '#06D6A0',
  ink: '#1A1A2E', white: '#FFFFFF', cream: '#FAFAF7',
  blush: '#FFD6E7', lavender: '#E8D5FF', mint: '#D5F5EE', butter: '#FFF5CC',
};

const STEPS = [
  { key: 'pending',    label: 'Order Placed',   icon: Clock,   color: C.yellow, bg: '#FFF5CC' },
  { key: 'processing', label: 'Being Prepared', icon: Package, color: C.blue,   bg: '#D5F5EE' },
  { key: 'shipped',    label: 'Shipped',         icon: Truck,   color: C.purple, bg: '#E8D5FF' },
  { key: 'delivered',  label: 'Delivered! 🎉',  icon: Check,   color: C.green,  bg: '#D5F5EE' },
];

const STATUS_INDEX = { pending: 0, processing: 1, shipped: 2, delivered: 3 };

const STATUS_MESSAGES = {
  pending:    'Your order has been received! ✅',
  processing: "We're preparing your prints with love! 🎨",
  shipped:    'Your order is on its way! 🚀',
  delivered:  'Delivered! Enjoy your prints! 🎉',
};

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [email,   setEmail]   = useState('');
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleTrack = async () => {
    if (!orderId.trim() && !email.trim()) {
      setError('Please enter your Order ID or Email');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/orders');
      const found = res.data.find(o =>
        o._id === orderId.trim() ||
        o.shippingAddress?.email?.toLowerCase() === email.trim().toLowerCase()
      );
      if (found) {
        setOrder(found);
      } else {
        setError('Order not found. Please check your Order ID or Email.');
      }
    } catch {
      setError('Something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? STATUS_INDEX[order.status] ?? 0 : 0;

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

        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 999, padding: '6px 18px', marginBottom: 16,
          }}>
            <Sparkles size={14} color={C.white} />
            <span style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13, color: C.white }}>
              Order Tracking
            </span>
          </div>
          <h1 style={{
            fontFamily: 'Syne', fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            color: C.white, margin: '0 0 10px', lineHeight: 1.1,
          }}>
            Track Your Order 📦
          </h1>
          <p style={{ fontFamily: 'DM Sans', color: 'rgba(255,255,255,0.75)', fontSize: 14, margin: 0 }}>
            Enter your Order ID or Email to check your order status
          </p>
        </div>

        {/* Wave */}
        <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 40, overflow: 'hidden' }}>
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d="M0,40 C300,0 900,40 1200,10 L1200,40 Z" fill="#FFF5F8" />
          </svg>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Search box */}
        <div style={{
          background: C.white, borderRadius: 24,
          padding: '2rem',
          boxShadow: '0 8px 40px rgba(255,107,157,0.10)',
          border: '1.5px solid rgba(255,107,157,0.15)',
          marginBottom: '2rem',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            <div>
              <label style={{
                fontFamily: 'Syne', fontWeight: 700, fontSize: 11,
                color: '#aaa', display: 'block', marginBottom: 6,
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                Order ID
              </label>
              <input
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                placeholder="e.g. 507f1f77bcf86cd799439011"
                style={{
                  width: '100%', padding: '13px 16px',
                  border: '2px solid #f0f0f0', borderRadius: 14,
                  fontFamily: 'DM Sans', fontSize: 14, outline: 'none',
                  boxSizing: 'border-box', transition: 'all 0.2s',
                  background: '#fafafa',
                }}
                onFocus={e => { e.target.style.borderColor = C.pink; e.target.style.background = C.white; e.target.style.boxShadow = '0 0 0 4px rgba(255,107,157,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#f0f0f0'; e.target.style.background = '#fafafa'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ textAlign: 'center', color: '#ccc', fontFamily: 'DM Sans', fontSize: 13 }}>— or —</div>

            <div>
              <label style={{
                fontFamily: 'Syne', fontWeight: 700, fontSize: 11,
                color: '#aaa', display: 'block', marginBottom: 6,
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                Email Address
              </label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email you used to order"
                type="email"
                style={{
                  width: '100%', padding: '13px 16px',
                  border: '2px solid #f0f0f0', borderRadius: 14,
                  fontFamily: 'DM Sans', fontSize: 14, outline: 'none',
                  boxSizing: 'border-box', transition: 'all 0.2s',
                  background: '#fafafa',
                }}
                onFocus={e => { e.target.style.borderColor = C.pink; e.target.style.background = C.white; e.target.style.boxShadow = '0 0 0 4px rgba(255,107,157,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#f0f0f0'; e.target.style.background = '#fafafa'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {error && (
              <div style={{
                background: '#FFF5F0', border: '1.5px solid #FFB347',
                borderRadius: 12, padding: '10px 14px',
                fontFamily: 'DM Sans', fontSize: 13, color: '#8B4513',
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleTrack}
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                background: loading
                  ? '#e0e0e0'
                  : 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
                color: loading ? '#aaa' : C.white,
                border: 'none',
                fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem',
                padding: '14px', borderRadius: 14,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 32px rgba(255,107,157,0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,107,157,0.45)'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = loading ? 'none' : '0 8px 32px rgba(255,107,157,0.35)'; }}
            >
              <Search size={18} />
              {loading ? 'Searching...' : 'Track My Order'}
            </button>
          </div>
        </div>

        {/* Order result */}
        {order && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Status tracker */}
            <div style={{
              background: C.white, borderRadius: 24,
              padding: '2rem',
              boxShadow: '0 8px 40px rgba(255,107,157,0.10)',
              border: '1.5px solid rgba(255,107,157,0.15)',
            }}>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.1rem', color: C.ink, margin: '0 0 2rem' }}>
                Order Status
              </h2>

              {/* Progress steps */}
              <div style={{ position: 'relative' }}>
                {/* Background line */}
                <div style={{
                  position: 'absolute', top: 20, left: 20, right: 20, height: 3,
                  background: '#f0f0f0', borderRadius: 3, zIndex: 0,
                }} />
                {/* Progress line */}
                <div style={{
                  position: 'absolute', top: 20, left: 20, height: 3,
                  width: (currentStep / (STEPS.length - 1) * 85) + '%',
                  background: 'linear-gradient(90deg, ' + C.pink + ', ' + C.purple + ')',
                  borderRadius: 3, zIndex: 1,
                  transition: 'width 0.8s ease',
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                  {STEPS.map((step, i) => {
                    const done    = i <= currentStep;
                    const current = i === currentStep;
                    return (
                      <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: 1 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: '50%',
                          background: done
                            ? 'linear-gradient(135deg, ' + step.color + ', ' + step.color + 'cc)'
                            : '#f5f5f5',
                          border: '2px solid ' + (done ? step.color : '#eee'),
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: current ? '0 0 0 6px ' + step.color + '25' : 'none',
                          transition: 'all 0.4s',
                        }}>
                          <step.icon size={17} color={done ? C.white : '#ccc'} />
                        </div>
                        <p style={{
                          fontFamily: 'Syne', fontWeight: current ? 700 : 500,
                          fontSize: 11, color: done ? C.ink : '#ccc',
                          textAlign: 'center', margin: 0, lineHeight: 1.3,
                        }}>
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current status message */}
              <div style={{
                marginTop: '2rem', padding: '1rem 1.25rem',
                background: STEPS[currentStep].bg,
                border: '1.5px solid ' + STEPS[currentStep].color + '40',
                borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12,
                  background: 'linear-gradient(135deg, ' + STEPS[currentStep].color + ', ' + STEPS[currentStep].color + 'aa)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px ' + STEPS[currentStep].color + '40',
                  flexShrink: 0,
                }}>
                  {(() => { const Icon = STEPS[currentStep].icon; return <Icon size={18} color={C.white} />; })()}
                </div>
                <div>
                  <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: C.ink, margin: 0 }}>
                    {STATUS_MESSAGES[order.status]}
                  </p>
                  <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#888', margin: '4px 0 0' }}>
                    Last updated: {new Date(order.updatedAt || order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Order details */}
            <div style={{
              background: C.white, borderRadius: 24,
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              border: '1.5px solid rgba(0,0,0,0.06)',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #FFF5F8, #F5F0FF)',
                padding: '1rem 1.5rem',
                borderBottom: '1.5px solid rgba(255,107,157,0.1)',
              }}>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem', color: C.ink, margin: 0 }}>
                  Order Details 🛍️
                </h3>
              </div>
              <div style={{ padding: '1.25rem' }}>
                {order.items?.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: i < order.items.length - 1 ? '1px solid #f5f0ff' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: 12,
                        background: C.blush,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20, flexShrink: 0,
                      }}>
                        📸
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: C.ink, margin: 0 }}>
                          {item.name}
                        </p>
                        <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#bbb', margin: '2px 0 0' }}>
                          Qty: {item.qty}
                        </p>
                      </div>
                    </div>
                    <span style={{
                      fontFamily: 'Syne', fontWeight: 700, fontSize: 14,
                      background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                ))}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginTop: 12, paddingTop: 12,
                  borderTop: '2px dashed #f5f0ff',
                }}>
                  <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1rem', color: C.ink }}>Total</span>
                  <span style={{
                    fontFamily: 'Syne', fontWeight: 800, fontSize: '1.2rem',
                    background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>
                    ₹{order.totalPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div style={{
              background: 'linear-gradient(135deg, ' + C.ink + ', #2D1B4E)',
              borderRadius: 22, padding: '1.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 12,
              boxShadow: '0 8px 32px rgba(26,26,46,0.2)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: C.pink + '15', borderRadius: '50%', filter: 'blur(20px)' }} />
              <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', color: C.white, margin: 0, position: 'relative', zIndex: 1 }}>
                Need help with your order? 🙋
              </p>
              <div style={{ display: 'flex', gap: 10, position: 'relative', zIndex: 1 }}>
                <a href="https://wa.me/919710194144" target="_blank" rel="noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#25D366', color: C.white,
                  fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
                  padding: '10px 18px', borderRadius: 12, textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(37,211,102,0.3)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                  📱 WhatsApp
                </a>
                <a href="https://instagram.com/frameonyx" target="_blank" rel="noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'linear-gradient(135deg, #f09433, #dc2743, #bc1888)',
                  color: C.white, fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
                  padding: '10px 18px', borderRadius: 12, textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(220,39,67,0.3)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                  📸 Instagram
                </a>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}