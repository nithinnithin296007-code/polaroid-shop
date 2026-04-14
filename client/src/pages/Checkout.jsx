import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { ArrowLeft, ShoppingBag, MapPin, User, Mail, Phone, Home, Building, Hash, CreditCard, Banknote, Globe } from 'lucide-react';

const C = {
  pink: '#FF6B9D', yellow: '#FFE135', blue: '#4ECDC4',
  purple: '#A855F7', orange: '#FF8C42', green: '#06D6A0',
  ink: '#1A1A2E', white: '#FFFFFF', cream: '#FAFAF7',
  blush: '#FFD6E7', lavender: '#E8D5FF', mint: '#D5F5EE', butter: '#FFF5CC',
};

const tagColors = [C.pink, '#FFB800', C.blue, C.purple, C.orange, C.green];

function InputField({ label, name, type = 'text', value, onChange, icon: Icon, required, colSpan }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ gridColumn: colSpan === 2 ? 'span 2' : 'span 1' }}>
      <label style={{
        display: 'block', fontFamily: 'Syne', fontWeight: 700,
        fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
        color: focused ? C.pink : '#aaa', marginBottom: 6,
        transition: 'color 0.2s',
      }}>
        {label} {required && <span style={{ color: C.pink }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon size={15} style={{
            position: 'absolute', left: 14, top: '50%',
            transform: 'translateY(-50%)',
            color: focused ? C.pink : '#ccc',
            transition: 'color 0.2s',
          }} />
        )}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: Icon ? '13px 14px 13px 40px' : '13px 14px',
            border: '2px solid ' + (focused ? C.pink : '#f0f0f0'),
            borderRadius: 14, fontFamily: 'DM Sans', fontSize: 14,
            background: focused ? '#FFF5F8' : C.white,
            outline: 'none', transition: 'all 0.2s',
            boxSizing: 'border-box',
            boxShadow: focused ? '0 0 0 4px rgba(255,107,157,0.1)' : 'none',
            color: C.ink,
          }}
        />
      </div>
    </div>
  );
}

// ── Provider metadata ──────────────────────────────────────────────────────
const PROVIDER_UI = {
  razorpay: { icon: CreditCard, label: 'Pay with Razorpay',  badge: '💳 Razorpay',  color: '#528FF0', hint: 'Secure card / UPI / NetBanking via Razorpay.' },
  stripe  : { icon: Globe,       label: 'Pay with Stripe',    badge: '🌍 Stripe',    color: '#635BFF', hint: 'Secure international card payment via Stripe.' },
  cod     : { icon: Banknote,    label: 'Place Order → Pay via UPI',  badge: '📱 UPI / WhatsApp', color: '#06D6A0', hint: 'After placing order, WhatsApp opens — share UPI ID to pay.' },
};

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading,  setLoading]  = useState(false);
  const [step,     setStep]     = useState(1);
  const [provider, setProvider] = useState('cod'); // active payment provider
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '',
  });

  // Fetch active payment provider from backend on mount
  useEffect(() => {
    api.get('/payment/provider')
      .then(r => setProvider(r.data.provider || 'cod'))
      .catch(() => setProvider('cod'));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleNext = () => {
    if (!form.name || !form.email || !form.address || !form.city || !form.pincode) {
      toast.error('Please fill all required fields');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Universal payment handler ───────────────────────────────────────────────
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. Create the DB order first
      const orderRes = await api.post('/orders', {
        items: cart.items,
        shippingAddress: form,
        totalPrice: total,
        paid: false,
      });
      const dbOrder = orderRes.data;

      // 2. Ask backend to create a payment order via the active adapter
      const payRes = await api.post('/payment/create-order', {
        orderId : dbOrder._id,
        amount  : total,
        currency: 'INR',
      });
      const payData = payRes.data;

      // 3. Handle each provider's client-side flow
      if (provider === 'razorpay') {
        await handleRazorpay(payData, dbOrder);
      } else if (provider === 'stripe') {
        await handleStripe(payData, dbOrder);
      } else {
        // COD / UPI — open WhatsApp, mark as manual
        await api.post('/payment/verify', { orderId: dbOrder._id });
        clearCart();
        localStorage.setItem('lastOrder', JSON.stringify(dbOrder));
        if (payData.whatsappUrl) window.open(payData.whatsappUrl, '_blank');
        navigate('/success');
      }
    } catch (err) {
      console.error(err);
      toast.error('Order failed. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  // ── Razorpay checkout popup ─────────────────────────────────────────────────
  const handleRazorpay = (payData, dbOrder) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      const rzp = new window.Razorpay({
        key              : payData.keyId,
        amount           : payData.amount,
        currency         : payData.currency,
        order_id         : payData.orderId,
        name             : 'FrameOnyx',
        description      : 'Polaroid prints & photo gifts',
        prefill          : { name: form.name, email: form.email, contact: form.phone },
        theme            : { color: '#FF6B9D' },
        handler: async (response) => {
          try {
            await api.post('/payment/verify', {
              orderId               : dbOrder._id,
              razorpay_order_id    : response.razorpay_order_id,
              razorpay_payment_id  : response.razorpay_payment_id,
              razorpay_signature   : response.razorpay_signature,
            });
            clearCart();
            localStorage.setItem('lastOrder', JSON.stringify(dbOrder));
            navigate('/success');
            resolve();
          } catch { reject(new Error('Verification failed')); }
        },
        modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
      });
      rzp.open();
    };
    script.onerror = () => reject(new Error('Razorpay SDK failed to load'));
    document.body.appendChild(script);
  });

  // ── Stripe — redirect to Stripe-hosted page (simplest integration) ──────────
  const handleStripe = async (payData, dbOrder) => {
    // For full Stripe Elements UI you'd load @stripe/react-stripe-js.
    // This minimal version stores intent ID and redirects to a /pay page.
    localStorage.setItem('stripeIntent', JSON.stringify({ ...payData, orderId: dbOrder._id, form }));
    localStorage.setItem('lastOrder', JSON.stringify(dbOrder));
    clearCart();
    navigate('/success');
    toast('💳 Stripe payment flow — complete integration coming soon!', { icon: '⚠️' });
  };

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

        <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Link to="/cart" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'rgba(255,255,255,0.7)', fontFamily: 'DM Sans', fontSize: 13,
            textDecoration: 'none', marginBottom: 16, transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.white}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
            <ArrowLeft size={14} /> Back to Cart
          </Link>

          <h1 style={{
            fontFamily: 'Syne', fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            color: C.white, margin: '0 0 16px', lineHeight: 1.1,
          }}>
            Checkout 📦
          </h1>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {[{ num: 1, label: 'Shipping' }, { num: 2, label: 'Review & Pay' }].map((s, i) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: step >= s.num ? C.white : 'rgba(255,255,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Syne', fontWeight: 800, fontSize: 13,
                    color: step >= s.num ? C.pink : 'rgba(255,255,255,0.5)',
                    transition: 'all 0.3s',
                    boxShadow: step >= s.num ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                  }}>
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span style={{
                    fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
                    color: step >= s.num ? C.white : 'rgba(255,255,255,0.5)',
                  }}>
                    {s.label}
                  </span>
                </div>
                {i < 1 && (
                  <div style={{
                    width: 48, height: 2, borderRadius: 2,
                    background: step > 1 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)',
                    transition: 'background 0.3s',
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 40, overflow: 'hidden' }}>
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d="M0,40 C300,0 900,40 1200,10 L1200,40 Z" fill="#FFF5F8" />
          </svg>
        </div>
      </div>

      <div className="checkout-layout" style={{
        maxWidth: 1000, margin: '0 auto',
        padding: '2.5rem 2rem',
        display: 'grid', gridTemplateColumns: '1fr 340px',
        gap: '2rem', alignItems: 'start',
      }}>

        {/* LEFT */}
        <div>
          {step === 1 ? (

            /* ── STEP 1: Shipping ── */
            <div style={{
              background: C.white, borderRadius: 24,
              boxShadow: '0 8px 40px rgba(255,107,157,0.10)',
              border: '1.5px solid rgba(255,107,157,0.15)',
              overflow: 'hidden',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #FFF5F8, #F5F0FF)',
                padding: '1.25rem 1.5rem',
                borderBottom: '1.5px solid rgba(255,107,157,0.1)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 36, height: 36,
                  background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(255,107,157,0.3)',
                }}>
                  <MapPin size={17} color={C.white} />
                </div>
                <div>
                  <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1rem', color: C.ink, margin: 0 }}>
                    Shipping Details
                  </h2>
                  <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#aaa', margin: 0 }}>
                    Where should we send your order?
                  </p>
                </div>
              </div>

              <div style={{ padding: '1.75rem' }}>
                <div className="checkout-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <InputField label="Full Name"  name="name"    value={form.name}    onChange={handleChange} icon={User}     required colSpan={2} />
                  <InputField label="Email"      name="email"   value={form.email}   onChange={handleChange} icon={Mail}     required type="email" />
                  <InputField label="Phone"      name="phone"   value={form.phone}   onChange={handleChange} icon={Phone}    type="tel" />
                  <InputField label="Address"    name="address" value={form.address} onChange={handleChange} icon={Home}     required colSpan={2} />
                  <InputField label="City"       name="city"    value={form.city}    onChange={handleChange} icon={Building} required />
                  <InputField label="State"      name="state"   value={form.state}   onChange={handleChange} />
                  <InputField label="Pincode"    name="pincode" value={form.pincode} onChange={handleChange} icon={Hash}     required />
                </div>

                <button
                  onClick={handleNext}
                  style={{
                    marginTop: '1.75rem', width: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
                    color: C.white, border: 'none',
                    fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem',
                    padding: '15px', borderRadius: 16, cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(255,107,157,0.35)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,107,157,0.45)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,107,157,0.35)'; }}
                >
                  Review Order →
                </button>
              </div>
            </div>

          ) : (

            /* ── STEP 2: Review ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Shipping review */}
              <div style={{
                background: C.white, borderRadius: 22,
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                border: '1.5px solid rgba(0,0,0,0.06)',
                overflow: 'hidden',
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #FFF5F8, #F5F0FF)',
                  padding: '1rem 1.25rem',
                  borderBottom: '1.5px solid rgba(255,107,157,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: C.green,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14,
                    }}>✓</div>
                    <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem', color: C.ink }}>
                      Shipping to
                    </span>
                  </div>
                  <button onClick={() => setStep(1)} style={{
                    background: C.lavender, border: 'none',
                    color: C.purple, fontFamily: 'Syne', fontWeight: 700, fontSize: 12,
                    padding: '5px 14px', borderRadius: 999, cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}>
                    Edit
                  </button>
                </div>
                <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { label: 'Name',    value: form.name    },
                    { label: 'Email',   value: form.email   },
                    { label: 'Phone',   value: form.phone   },
                    { label: 'City',    value: form.city    },
                    { label: 'State',   value: form.state   },
                    { label: 'Pincode', value: form.pincode },
                  ].map(f => f.value ? (
                    <div key={f.label}>
                      <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#bbb', display: 'block', marginBottom: 2 }}>{f.label}</span>
                      <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: C.ink }}>{f.value}</span>
                    </div>
                  ) : null)}
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#bbb', display: 'block', marginBottom: 2 }}>Address</span>
                    <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: C.ink }}>{form.address}</span>
                  </div>
                </div>
              </div>

              {/* Items review */}
              <div style={{
                background: C.white, borderRadius: 22,
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                border: '1.5px solid rgba(0,0,0,0.06)',
                overflow: 'hidden',
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #FFF5F8, #F5F0FF)',
                  padding: '1rem 1.25rem',
                  borderBottom: '1.5px solid rgba(255,107,157,0.1)',
                }}>
                  <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem', color: C.ink }}>
                    Your Items 🛍️
                  </span>
                </div>
                <div style={{ padding: '1rem' }}>
                  {cart.items.map((item, idx) => (
                    <div key={item._id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 0',
                      borderBottom: idx < cart.items.length - 1 ? '1px solid #f5f0ff' : 'none',
                    }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: 12,
                        overflow: 'hidden', flexShrink: 0,
                        border: '1.5px solid rgba(0,0,0,0.06)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      }}>
                        <img
                          src={item.image || 'https://images.pexels.com/photos/4340786/pexels-photo-4340786.jpeg?auto=compress&cs=tinysrgb&w=100'}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, margin: '0 0 2px', color: C.ink }}>
                          {item.name}
                        </p>
                        <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#bbb', margin: 0 }}>
                          Qty: {item.qty}
                        </p>
                      </div>
                      <span style={{
                        fontFamily: 'Syne', fontWeight: 800, fontSize: 14,
                        background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      }}>
                        ₹{item.price * item.qty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment provider info box */}
              {(() => {
                const p = PROVIDER_UI[provider] || PROVIDER_UI.cod;
                const ProvIcon = p.icon;
                return (
                  <div style={{
                    background: provider === 'cod' ? C.mint : provider === 'stripe' ? '#F0EEFF' : '#EEF3FF',
                    border: `1.5px solid ${p.color}33`,
                    borderRadius: 18, padding: '1.25rem',
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                      background: p.color + '22',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <ProvIcon size={20} color={p.color} />
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: C.ink, margin: '0 0 4px' }}>
                        {p.badge}
                      </p>
                      <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#555', margin: 0, lineHeight: 1.6 }}>
                        {p.hint}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Place order button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  background: loading
                    ? '#e0e0e0'
                    : 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
                  border: 'none', color: loading ? '#aaa' : C.white,
                  fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem',
                  padding: '17px', borderRadius: 18,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 8px 32px rgba(255,107,157,0.4)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,107,157,0.5)'; }}}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = loading ? 'none' : '0 8px 32px rgba(255,107,157,0.4)'; }}
              >
                <ShoppingBag size={20} />
                {loading ? 'Processing...' : (PROVIDER_UI[provider]?.label || 'Place Order') + ' — ₹' + total}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT — Summary */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div style={{
            background: C.white, borderRadius: 24,
            boxShadow: '0 8px 40px rgba(255,107,157,0.12)',
            border: '1.5px solid rgba(255,107,157,0.15)',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
              padding: '1.25rem 1.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1rem', color: C.white, margin: 0 }}>
                Order Summary
              </h3>
              <span style={{
                background: 'rgba(255,255,255,0.2)', color: C.white,
                fontFamily: 'Syne', fontWeight: 700, fontSize: 11,
                padding: '3px 12px', borderRadius: 999,
              }}>
                {cart.items.length} items
              </span>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {/* Line items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1rem' }}>
                {cart.items.map((item, idx) => (
                  <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: tagColors[idx % tagColors.length], flexShrink: 0 }} />
                      <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </span>
                      <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#bbb', flexShrink: 0 }}>×{item.qty}</span>
                    </div>
                    <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 12, color: C.ink, flexShrink: 0 }}>
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ borderTop: '2px dashed #f5f0ff', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#888' }}>Subtotal</span>
                  <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: C.ink }}>₹{total}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#888' }}>Shipping</span>
                  <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: C.green }}>FREE 🎉</span>
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
                <span style={{
                  fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem',
                  background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  ₹{total}
                </span>
              </div>

              {/* Trust badges */}
              <div style={{
                marginTop: '1rem', padding: '1rem',
                background: C.blush,
                border: '1.5px solid rgba(255,107,157,0.15)',
                borderRadius: 14,
              }}>
                {['🔒 Secure payment', '🚚 Free delivery', '🎨 Premium quality', '💖 Made with love'].map((t, i) => (
                  <p key={i} style={{
                    fontFamily: 'DM Sans', fontWeight: 600, fontSize: 12,
                    color: C.ink, margin: i === 0 ? 0 : '6px 0 0',
                  }}>
                    {t}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}