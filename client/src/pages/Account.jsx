import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { User, LogOut, ShoppingBag, Package, Truck, Check, Clock, ChevronRight, X, Trash2 } from 'lucide-react';

const C = {
  pink: '#FF6B9D', purple: '#A855F7', blue: '#4ECDC4',
  green: '#06D6A0', orange: '#FF8C42',
  ink: '#1A1A2E', white: '#FFFFFF',
  blush: '#FFD6E7', lavender: '#E8D5FF', mint: '#D5F5EE', butter: '#FFF5CC',
};

const STATUS_COLORS = {
  pending:    { bg: '#FFF5CC', color: '#92610A', border: '#FFE135' },
  confirmed:  { bg: '#D5F5EE', color: '#06755A', border: '#06D6A0' },
  preparing:  { bg: '#FFD6E7', color: '#B5105A', border: '#FF6B9D' },
  shipped:    { bg: '#E8D5FF', color: '#6B21C4', border: '#A855F7' },
  delivered:  { bg: '#D5F5EE', color: '#06755A', border: '#06D6A0' },
  cancelled:  { bg: '#FFE5E5', color: '#C0392B', border: '#e74c3c' },
};

const STATUS_ICONS = {
  pending: Clock, confirmed: Check, preparing: Package,
  shipped: Truck, delivered: Check, cancelled: X,
};

const STEPS = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered'];

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
  const Icon = STATUS_ICONS[order.status] || Clock;
  const stepIndex = STEPS.indexOf(order.status);

  return (
    <div style={{
      background: C.white, borderRadius: 20, overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      border: '1.5px solid rgba(0,0,0,0.06)',
    }}>
      <div onClick={() => setExpanded(!expanded)} style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '1.25rem 1.5rem', cursor: 'pointer',
        borderBottom: expanded ? '1.5px solid #f5f0ff' : 'none',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: s.bg, border: '1.5px solid ' + s.border,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={18} color={s.color} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: C.ink }}>
              Order #{order._id.slice(-6).toUpperCase()}
            </span>
            <span style={{
              background: s.bg, color: s.color, border: '1.5px solid ' + s.border,
              fontFamily: 'DM Sans', fontWeight: 600, fontSize: 11,
              padding: '2px 10px', borderRadius: 999, textTransform: 'capitalize',
            }}>
              {order.status}
            </span>
          </div>
          <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#aaa', margin: '4px 0 0' }}>
            {order.items?.length} item{order.items?.length !== 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.1rem', color: C.ink, margin: 0 }}>₹{order.totalPrice}</p>
          <ChevronRight size={16} color="#bbb" style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', marginTop: 4 }} />
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '1.25rem 1.5rem' }}>

          {/* Progress */}
          {order.status !== 'cancelled' && stepIndex >= 0 && (
            <div style={{ marginBottom: '1.75rem' }}>
              <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Order Progress</p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {STEPS.map((step, i) => {
                  const done = i <= stepIndex;
                  const active = i === stepIndex;
                  return (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                          background: done ? 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')' : '#f0f0f0',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: active ? '0 0 0 4px rgba(255,107,157,0.2)' : 'none',
                        }}>
                          {done && <Check size={12} color={C.white} />}
                        </div>
                        <span style={{ fontFamily: 'DM Sans', fontSize: 9, color: done ? C.pink : '#ccc', fontWeight: 600, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                          {step}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div style={{ flex: 1, height: 3, borderRadius: 999, marginBottom: 18, background: i < stepIndex ? 'linear-gradient(90deg, ' + C.pink + ', ' + C.purple + ')' : '#f0f0f0' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Items */}
          <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Items</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.25rem' }}>
            {order.items?.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: '#fafafa', borderRadius: 12 }}>
                {item.image && <img src={item.image} alt={item.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />}
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: C.ink, margin: 0 }}>{item.name}</p>
                  <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#aaa', margin: '2px 0 0' }}>Qty: {item.qty}</p>
                </div>
                <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: C.ink }}>₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>

          {/* Total + Address */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: C.blush, borderRadius: 14, padding: '1rem' }}>
              <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: C.pink, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Shipping To</p>
              <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: C.ink, margin: 0, lineHeight: 1.6 }}>
                {order.shippingAddress?.name}<br />
                {order.shippingAddress?.address}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.pincode}
              </p>
            </div>
            <div style={{ background: C.lavender, borderRadius: 14, padding: '1rem' }}>
              <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: C.purple, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Order Total</p>
              <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', color: C.ink, margin: 0 }}>₹{order.totalPrice}</p>
              <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#888', margin: '4px 0 0' }}>Incl. all taxes</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Account() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      api.get('/orders/myorders')
        .then(r => setOrders(r.data))
        .catch(console.error)
        .finally(() => setOrdersLoading(false));
    }
  }, [user]);

  if (loading || !user) return null;

  const handleLogout = () => { logout(); navigate('/'); };
  const totalSpent = orders.reduce((s, o) => s + o.totalPrice, 0);
  const delivered  = orders.filter(o => o.status === 'delivered').length;

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', background: 'linear-gradient(135deg, #FFF5F8 0%, #F5F0FF 100%)' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')', padding: '3rem 2rem 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                <User size={28} color={C.white} />
              </div>
              <div>
                <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: C.white, margin: 0 }}>
                  Hi, {user.name?.split(' ')[0]}! 👋
                </h1>
                <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: '4px 0 0' }}>{user.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', border: '1.5px solid rgba(255,255,255,0.3)',
              borderRadius: 12, background: 'rgba(255,255,255,0.15)',
              color: C.white, fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
              cursor: 'pointer',
            }}>
              <LogOut size={15} /> Sign Out
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 16, marginTop: '2rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Total Orders', value: orders.length,                     emoji: '📦' },
              { label: 'Total Spent',  value: '₹' + totalSpent.toLocaleString(), emoji: '💸' },
              { label: 'Delivered',    value: delivered,                          emoji: '✅' },
            ].map(stat => (
              <div key={stat.label} style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 16, padding: '1rem 1.5rem', border: '1.5px solid rgba(255,255,255,0.25)' }}>
                <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '0 0 4px' }}>{stat.emoji} {stat.label}</p>
                <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', color: C.white, margin: 0 }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 40, overflow: 'hidden' }}>
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d="M0,40 C300,0 900,40 1200,10 L1200,40 Z" fill="#FFF5F8" />
          </svg>
        </div>
      </div>

      {/* Orders */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.2rem', color: C.ink, margin: 0 }}>Your Orders</h2>
          <Link to="/shop" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 20px', borderRadius: 12,
            background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
            color: C.white, fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
            textDecoration: 'none', boxShadow: '0 4px 16px rgba(255,107,157,0.35)',
          }}>
            <ShoppingBag size={14} /> Shop More
          </Link>
        </div>

        {ordersLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <div style={{ width: 40, height: 40, border: '3px solid ' + C.blush, borderTop: '3px solid ' + C.pink, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <p style={{ fontSize: 64, marginBottom: 16 }}>🛍️</p>
            <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.2rem', color: C.ink, marginBottom: 8 }}>No orders yet!</p>
            <p style={{ fontFamily: 'DM Sans', fontSize: 14, color: '#aaa', marginBottom: '2rem' }}>Your order history will appear here once you place your first order.</p>
            <Link to="/shop" style={{
              padding: '12px 28px', borderRadius: 14,
              background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
              color: C.white, fontFamily: 'Syne', fontWeight: 700, fontSize: 14,
              textDecoration: 'none', boxShadow: '0 8px 24px rgba(255,107,157,0.35)',
            }}>
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {orders.map(order => <OrderCard key={order._id} order={order} />)}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}