import InvoiceGenerator from '../components/InvoiceGenerator';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  ShoppingBag, Package, Users, TrendingUp,
  Eye, Check, Truck, X, LogOut, BarChart2,
  Clock, AlertCircle, RefreshCw, Plus, Trash2,
  Search, Filter, Sparkles, ChevronDown,
} from 'lucide-react';

const C = {
  pink: '#FF6B9D', yellow: '#FFE135', blue: '#4ECDC4',
  purple: '#A855F7', orange: '#FF8C42', green: '#06D6A0',
  ink: '#1A1A2E', white: '#FFFFFF', cream: '#FAFAF7',
  blush: '#FFD6E7', lavender: '#E8D5FF', mint: '#D5F5EE', butter: '#FFF5CC',
};

const ADMIN_PASSWORD = 'frameonyx2024';

const STATUS_COLORS = {
  pending:    { bg: '#FFF5CC', color: '#92610A', border: '#FFE135' },
  processing: { bg: '#D5F5EE', color: '#06755A', border: '#06D6A0' },
  shipped:    { bg: '#E8D5FF', color: '#6B21C4', border: '#A855F7' },
  delivered:  { bg: '#FFD6E7', color: '#B5105A', border: '#FF6B9D' },
};

const STATUS_ICONS = {
  pending:    Clock,
  processing: Package,
  shipped:    Truck,
  delivered:  Check,
};

function StatCard({ icon: Icon, label, value, color, bg, sub }) {
  return (
    <div style={{
      background: C.white, borderRadius: 22, padding: '1.5rem',
      boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      border: '1.5px solid rgba(0,0,0,0.06)',
      position: 'relative', overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.10)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.07)'; }}>
      <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: color + '18', filter: 'blur(20px)' }} />
      <div style={{
        width: 46, height: 46, borderRadius: 14,
        background: 'linear-gradient(135deg, ' + color + ', ' + color + 'cc)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1rem', boxShadow: '0 4px 16px ' + color + '40',
      }}>
        <Icon size={20} color={C.white} />
      </div>
      <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#aaa', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
      <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: C.ink, margin: 0, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#bbb', margin: '6px 0 0' }}>{sub}</p>}
    </div>
  );
}

const EMPTY_PRODUCT = { name: '', price: '', category: 'Polaroids', description: '', image: '', badge: '' };

export default function Admin() {
  const [authed, setAuthed]       = useState(false);
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [tab, setTab]             = useState('dashboard');
  const [orders, setOrders]       = useState([]);
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);
  const [addingProduct, setAddingProduct] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { if (authed) fetchData(); }, [authed]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [oRes, pRes] = await Promise.all([api.get('/orders'), api.get('/products')]);
      setOrders(oRes.data);
      setProducts(pRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const refresh = async () => { setRefreshing(true); await fetchData(); setRefreshing(false); };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put('/orders/' + orderId + '/status', { status });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      if (selectedOrder?._id === orderId) setSelectedOrder(prev => ({ ...prev, status }));
    } catch (e) { console.error(e); }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;
    setAddingProduct(true);
    try {
      const res = await api.post('/products', { ...newProduct, price: Number(newProduct.price) });
      setProducts(prev => [res.data, ...prev]);
      setNewProduct(EMPTY_PRODUCT);
      setShowAddProduct(false);
    } catch (e) { console.error(e); }
    finally { setAddingProduct(false); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    setDeletingId(id);
    try {
      await api.delete('/products/' + id);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (e) { console.error(e); }
    finally { setDeletingId(null); }
  };

  const totalRevenue    = orders.reduce((s, o) => s + o.totalPrice, 0);
  const pendingOrders   = orders.filter(o => o.status === 'pending').length;
  const shippedOrders   = orders.filter(o => o.status === 'shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const recentOrders    = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const categoryStats   = products.reduce((acc, p) => { acc[p.category] = (acc[p.category] || 0) + 1; return acc; }, {});

  const filteredOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter(o => {
      const matchStatus = orderFilter === 'all' || o.status === orderFilter;
      const matchSearch = !orderSearch ||
        o.shippingAddress?.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.shippingAddress?.email?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o._id.includes(orderSearch);
      return matchStatus && matchSearch;
    });

  // ── LOGIN ──
  if (!authed) return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF5F8 0%, #F5F0FF 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
    }}>
      <div style={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, background: C.pink + '18', borderRadius: '50%', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: -100, right: -100, width: 300, height: 300, background: C.purple + '18', borderRadius: '50%', filter: 'blur(80px)' }} />

      <div style={{
        background: C.white, borderRadius: 28,
        padding: '3rem 2.5rem', width: '100%', maxWidth: 420, textAlign: 'center',
        boxShadow: '0 40px 80px rgba(255,107,157,0.15)',
        border: '1.5px solid rgba(255,107,157,0.2)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{
          width: 72, height: 72,
          background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
          borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem', boxShadow: '0 8px 32px rgba(255,107,157,0.4)',
        }}>
          <span style={{ fontSize: 32 }}>🔐</span>
        </div>
        <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.8rem', color: C.ink, margin: '0 0 6px' }}>Admin Panel</h1>
        <p style={{ fontFamily: 'DM Sans', color: '#aaa', fontSize: 14, marginBottom: '2rem' }}>FrameOnyx · Restricted Access</p>

        <input
          type="password" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (password === ADMIN_PASSWORD ? (setAuthed(true), setError('')) : setError('Wrong password!'))}
          placeholder="Enter admin password"
          style={{
            width: '100%', padding: '14px 18px',
            border: '2px solid ' + (error ? C.pink : '#f0f0f0'),
            borderRadius: 14, background: '#fafafa',
            color: C.ink, fontFamily: 'DM Sans', fontSize: 15,
            outline: 'none', marginBottom: 12, boxSizing: 'border-box', transition: 'all 0.2s',
          }}
          onFocus={e => { e.target.style.borderColor = C.pink; e.target.style.background = '#FFF5F8'; e.target.style.boxShadow = '0 0 0 4px rgba(255,107,157,0.1)'; }}
          onBlur={e => { e.target.style.borderColor = error ? C.pink : '#f0f0f0'; e.target.style.background = '#fafafa'; e.target.style.boxShadow = 'none'; }}
        />
        {error && <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: C.pink, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><AlertCircle size={14} />{error}</p>}
        <button
          onClick={() => password === ADMIN_PASSWORD ? (setAuthed(true), setError('')) : setError('Wrong password!')}
          style={{
            width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
            border: 'none', borderRadius: 14, color: C.white,
            fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem',
            cursor: 'pointer', boxShadow: '0 8px 32px rgba(255,107,157,0.35)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,107,157,0.45)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,107,157,0.35)'; }}
        >
          Enter Admin Panel
        </button>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard',  icon: BarChart2   },
    { id: 'orders',    label: 'Orders',     icon: ShoppingBag },
    { id: 'products',  label: 'Products',   icon: Package     },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F4F4F8', display: 'flex' }}>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: 240,
        background: C.white,
        borderRight: '1.5px solid rgba(255,107,157,0.15)',
        boxShadow: '4px 0 24px rgba(255,107,157,0.08)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1.5px solid rgba(255,107,157,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255,107,157,0.35)',
            }}>
              <Sparkles size={16} color={C.white} />
            </div>
            <div>
              <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1rem', color: C.ink, margin: 0 }}>
                Frame<span style={{ color: C.pink }}>Onyx</span>
              </p>
              <p style={{ fontFamily: 'DM Sans', fontSize: 10, color: '#bbb', margin: 0, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '1rem', flex: 1 }}>
          <p style={{ fontFamily: 'DM Sans', fontSize: 10, color: '#ccc', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8, paddingLeft: 8 }}>Menu</p>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 14, marginBottom: 4,
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: tab === t.id
                ? 'linear-gradient(135deg, ' + C.pink + '18, ' + C.purple + '18)'
                : 'transparent',
              color: tab === t.id ? C.pink : '#888',
              fontFamily: 'Syne', fontWeight: 700, fontSize: 14,
              borderLeft: tab === t.id ? '3px solid ' + C.pink : '3px solid transparent',
            }}>
              <t.icon size={17} />
              {t.label}
              {t.id === 'orders' && pendingOrders > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
                  color: C.white, fontFamily: 'Syne', fontWeight: 700, fontSize: 10,
                  padding: '2px 8px', borderRadius: 999,
                }}>
                  {pendingOrders}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '1rem', borderTop: '1.5px solid rgba(255,107,157,0.1)' }}>
          <button onClick={() => setAuthed(false)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 12, border: 'none',
            background: C.blush, color: C.pink,
            fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
            cursor: 'pointer', transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#ffbdd4'}
          onMouseLeave={e => e.currentTarget.style.background = C.blush}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ marginLeft: 240, flex: 1, padding: '2rem' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: C.ink, margin: 0 }}>
              {tab === 'dashboard' ? '👋 Welcome back!' : tab === 'orders' ? '📦 Orders' : '🛍️ Products'}
            </h1>
            <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#aaa', margin: '4px 0 0' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button onClick={refresh} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', border: '1.5px solid rgba(255,107,157,0.2)',
            borderRadius: 12, background: C.white, color: C.ink,
            fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
            cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            transition: 'box-shadow 0.2s',
          }}>
            <RefreshCw size={14} color={C.pink} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
            <div style={{ width: 40, height: 40, border: '3px solid ' + C.blush, borderTop: '3px solid ' + C.pink, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : (
          <>
            {/* ── DASHBOARD ── */}
            {tab === 'dashboard' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: '2rem' }}>
                  <StatCard icon={TrendingUp}  label="Total Revenue" value={'₹' + totalRevenue.toLocaleString()} color={C.green}  sub={orders.length + ' orders total'} />
                  <StatCard icon={ShoppingBag} label="Total Orders"  value={orders.length}   color={C.pink}   sub={pendingOrders + ' pending'} />
                  <StatCard icon={Package}     label="Products"      value={products.length} color={C.blue}   sub={Object.keys(categoryStats).length + ' categories'} />
                  <StatCard icon={Truck}       label="Shipped"       value={shippedOrders}   color={C.purple} sub={deliveredOrders + ' delivered'} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                  {/* Recent orders */}
                  <div style={{ background: C.white, borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1.5px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem', color: C.white, margin: 0 }}>Recent Orders</h3>
                      <button onClick={() => setTab('orders')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: C.white, fontFamily: 'Syne', fontWeight: 600, fontSize: 11, cursor: 'pointer', padding: '4px 12px', borderRadius: 999 }}>View all →</button>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      {recentOrders.length === 0
                        ? <p style={{ fontFamily: 'DM Sans', color: '#bbb', fontSize: 13, textAlign: 'center', padding: '2rem 0' }}>No orders yet</p>
                        : recentOrders.map(o => {
                          const s = STATUS_COLORS[o.status] || STATUS_COLORS.pending;
                          return (
                            <div key={o._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f0ff' }}>
                              <div>
                                <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: C.ink, margin: 0 }}>{o.shippingAddress?.name || 'Customer'}</p>
                                <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#bbb', margin: '2px 0 0' }}>{o.items?.length} item{o.items?.length > 1 ? 's' : ''}</p>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: C.ink }}>₹{o.totalPrice}</span>
                                <span style={{ background: s.bg, color: s.color, border: '1.5px solid ' + s.border, fontFamily: 'DM Sans', fontWeight: 600, fontSize: 10, padding: '3px 10px', borderRadius: 999, textTransform: 'capitalize' }}>{o.status}</span>
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>

                  {/* Category breakdown */}
                  <div style={{ background: C.white, borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1.5px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ background: 'linear-gradient(135deg, ' + C.blue + ', ' + C.purple + ')', padding: '1rem 1.5rem' }}>
                      <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem', color: C.white, margin: 0 }}>Products by Category</h3>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      {Object.keys(categoryStats).length === 0
                        ? <p style={{ fontFamily: 'DM Sans', color: '#bbb', fontSize: 13, textAlign: 'center', padding: '2rem 0' }}>No products yet</p>
                        : Object.entries(categoryStats).map(([cat, count], i) => {
                          const colors = [C.pink, C.blue, C.yellow, C.purple, C.orange];
                          const color = colors[i % colors.length];
                          const pct = Math.round((count / products.length) * 100);
                          return (
                            <div key={cat} style={{ marginBottom: 18 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: C.ink }}>{cat}</span>
                                <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#aaa' }}>{count} products ({pct}%)</span>
                              </div>
                              <div style={{ height: 8, background: '#f5f0ff', borderRadius: 999, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: pct + '%', background: 'linear-gradient(90deg, ' + color + ', ' + color + 'aa)', borderRadius: 999, transition: 'width 0.6s ease' }} />
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>

                  {/* Order status overview */}
                  <div style={{ background: C.white, borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1.5px solid rgba(0,0,0,0.06)', gridColumn: 'span 2' }}>
                    <div style={{ background: 'linear-gradient(135deg, ' + C.orange + ', ' + C.pink + ')', padding: '1rem 1.5rem' }}>
                      <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem', color: C.white, margin: 0 }}>Order Status Overview</h3>
                    </div>
                    <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                      {['pending','processing','shipped','delivered'].map(status => {
                        const count = orders.filter(o => o.status === status).length;
                        const s = STATUS_COLORS[status];
                        const Icon = STATUS_ICONS[status];
                        return (
                          <div key={status} style={{ background: s.bg, border: '1.5px solid ' + s.border, borderRadius: 18, padding: '1.25rem', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
                          onClick={() => { setTab('orders'); setOrderFilter(status); }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                            <Icon size={22} color={s.color} style={{ marginBottom: 8 }} />
                            <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.8rem', color: s.color, margin: '0 0 4px' }}>{count}</p>
                            <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: s.color, margin: 0, textTransform: 'capitalize', fontWeight: 600 }}>{status}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── ORDERS ── */}
            {tab === 'orders' && (
              <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1fr 380px' : '1fr', gap: 16 }}>
                <div>
                  {/* Search + filter bar */}
                  <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                      <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#bbb' }} />
                      <input
                        value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
                        placeholder="Search by name, email or order ID..."
                        style={{
                          width: '100%', padding: '12px 14px 12px 40px',
                          border: '1.5px solid #f0f0f0', borderRadius: 14,
                          fontFamily: 'DM Sans', fontSize: 13, outline: 'none',
                          background: C.white, boxSizing: 'border-box',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = C.pink}
                        onBlur={e => e.target.style.borderColor = '#f0f0f0'}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {['all','pending','processing','shipped','delivered'].map(f => (
                        <button key={f} onClick={() => setOrderFilter(f)} style={{
                          padding: '10px 16px', borderRadius: 12, border: 'none',
                          background: orderFilter === f
                            ? 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')'
                            : C.white,
                          color: orderFilter === f ? C.white : '#888',
                          fontFamily: 'Syne', fontWeight: 700, fontSize: 12,
                          cursor: 'pointer', textTransform: 'capitalize',
                          boxShadow: orderFilter === f
                            ? '0 4px 16px rgba(255,107,157,0.3)'
                            : '0 2px 8px rgba(0,0,0,0.05)',
                          transition: 'all 0.2s',
                        }}>
                          {f === 'all' ? 'All (' + orders.length + ')' : f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orders table */}
                  <div style={{ background: C.white, borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1.5px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')', padding: '1rem 1.5rem' }}>
                      <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem', color: C.white, margin: 0 }}>
                        Orders ({filteredOrders.length})
                      </h3>
                    </div>
                    {filteredOrders.length === 0 ? (
                      <div style={{ padding: '4rem', textAlign: 'center' }}>
                        <p style={{ fontSize: 48, marginBottom: 12 }}>📦</p>
                        <p style={{ fontFamily: 'Syne', fontWeight: 700, color: C.ink }}>No orders found</p>
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid #f5f0ff' }}>
                              {['Customer','Items','Total','Status','Date','Actions'].map(h => (
                                <th key={h} style={{ padding: '12px 16px', fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: '#aaa', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {filteredOrders.map(o => {
                              const s = STATUS_COLORS[o.status] || STATUS_COLORS.pending;
                              return (
                                <tr key={o._id} style={{ borderBottom: '1px solid #fafafa', transition: 'background 0.15s' }}
                                  onMouseEnter={e => e.currentTarget.style.background = '#FFF5F8'}
                                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                  <td style={{ padding: '14px 16px' }}>
                                    <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: C.ink, margin: 0 }}>{o.shippingAddress?.name || '—'}</p>
                                    <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#bbb', margin: '2px 0 0' }}>{o.shippingAddress?.email}</p>
                                  </td>
                                  <td style={{ padding: '14px 16px', fontFamily: 'DM Sans', fontSize: 13, color: '#888' }}>{o.items?.length || 0} items</td>
                                  <td style={{ padding: '14px 16px', fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: C.ink }}>₹{o.totalPrice}</td>
                                  <td style={{ padding: '14px 16px' }}>
                                    <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)} style={{
                                      background: s.bg, color: s.color, border: '1.5px solid ' + s.border,
                                      borderRadius: 10, padding: '5px 10px',
                                      fontFamily: 'DM Sans', fontWeight: 600, fontSize: 12,
                                      cursor: 'pointer', outline: 'none',
                                    }}>
                                      {['pending','processing','shipped','delivered'].map(st => <option key={st} value={st}>{st}</option>)}
                                    </select>
                                  </td>
                                  <td style={{ padding: '14px 16px', fontFamily: 'DM Sans', fontSize: 12, color: '#bbb' }}>
                                    {new Date(o.createdAt).toLocaleDateString('en-IN')}
                                  </td>
                                  <td style={{ padding: '14px 16px' }}>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                      <button onClick={() => setSelectedOrder(selectedOrder?._id === o._id ? null : o)} style={{
                                        display: 'flex', alignItems: 'center', gap: 5,
                                        padding: '6px 12px', border: 'none', borderRadius: 9,
                                        background: selectedOrder?._id === o._id
                                          ? 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')'
                                          : C.blush,
                                        color: selectedOrder?._id === o._id ? C.white : C.pink,
                                        fontFamily: 'Syne', fontWeight: 600, fontSize: 12, cursor: 'pointer',
                                      }}>
                                        <Eye size={12} /> View
                                      </button>
                                      <button onClick={() => setInvoiceOrder(o)} style={{
                                        display: 'flex', alignItems: 'center', gap: 5,
                                        padding: '6px 12px', border: 'none', borderRadius: 9,
                                        background: C.butter, color: '#92610A',
                                        fontFamily: 'Syne', fontWeight: 600, fontSize: 12, cursor: 'pointer',
                                      }}>
                                        🧾
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order detail panel */}
                {selectedOrder && (
                  <div style={{ background: C.white, borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1.5px solid rgba(0,0,0,0.06)', height: 'fit-content', position: 'sticky', top: 20 }}>
                    <div style={{ background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem', color: C.white, margin: 0 }}>Order Details</h3>
                      <button onClick={() => setSelectedOrder(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: C.white, cursor: 'pointer', borderRadius: 8, padding: '4px 8px' }}>
                        <X size={16} />
                      </button>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      {/* Status buttons */}
                      <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Update Status</p>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                        {['pending','processing','shipped','delivered'].map(st => {
                          const s = STATUS_COLORS[st];
                          return (
                            <button key={st} onClick={() => updateStatus(selectedOrder._id, st)} style={{
                              padding: '6px 12px', borderRadius: 9,
                              border: '1.5px solid ' + (selectedOrder.status === st ? s.color : '#f0f0f0'),
                              background: selectedOrder.status === st ? s.bg : C.white,
                              color: selectedOrder.status === st ? s.color : '#aaa',
                              fontFamily: 'Syne', fontWeight: 700, fontSize: 11,
                              cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s',
                            }}>{st}</button>
                          );
                        })}
                      </div>

                      {/* WhatsApp notify */}
                      {selectedOrder.shippingAddress?.phone && (
                        <a href={'https://wa.me/91' + selectedOrder.shippingAddress.phone.replace(/\D/g,'') + '?text=' + encodeURIComponent('Hi ' + selectedOrder.shippingAddress.name + '! 👋 Your FrameOnyx order is now *' + selectedOrder.status + '*. 📦 Items: ' + selectedOrder.items?.map(i => i.name).join(', ') + '. Total: ₹' + selectedOrder.totalPrice + '. Thank you! 🎨 - Team FrameOnyx')}
                          target="_blank" rel="noreferrer" style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            background: '#25D366', borderRadius: 12, padding: '10px 16px',
                            color: C.white, fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
                            textDecoration: 'none', marginBottom: '1.25rem',
                            boxShadow: '0 4px 16px rgba(37,211,102,0.3)',
                          }}>
                          📱 Notify via WhatsApp
                        </a>
                      )}

                      {/* Customer info */}
                      <div style={{ background: C.blush, borderRadius: 14, padding: '1rem', marginBottom: '1.25rem' }}>
                        <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: C.pink, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>Customer</p>
                        {[
                          { label: 'Name',    value: selectedOrder.shippingAddress?.name },
                          { label: 'Email',   value: selectedOrder.shippingAddress?.email },
                          { label: 'Phone',   value: selectedOrder.shippingAddress?.phone },
                          { label: 'Address', value: selectedOrder.shippingAddress?.address },
                          { label: 'City',    value: selectedOrder.shippingAddress?.city },
                          { label: 'Pincode', value: selectedOrder.shippingAddress?.pincode },
                        ].map(f => f.value ? (
                          <div key={f.label} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                            <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#e0789a', minWidth: 52 }}>{f.label}:</span>
                            <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: C.ink, fontWeight: 500 }}>{f.value}</span>
                          </div>
                        ) : null)}
                      </div>

                      {/* Items */}
                      <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Items</p>
                      {selectedOrder.items?.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f5f0ff' }}>
                          <div>
                            <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 12, color: C.ink, margin: 0 }}>{item.name}</p>
                            <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#bbb', margin: '2px 0 0' }}>Qty: {item.qty}</p>
                          </div>
                          <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: C.ink }}>₹{item.price * item.qty}</span>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '2px dashed #f5f0ff' }}>
                        <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 14, color: C.ink }}>Total</span>
                        <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{selectedOrder.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── PRODUCTS ── */}
            {tab === 'products' && (
              <div>
                {/* Add product button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                  <button onClick={() => setShowAddProduct(!showAddProduct)} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '12px 22px', border: 'none', borderRadius: 14,
                    background: showAddProduct
                      ? '#f0f0f0'
                      : 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
                    color: showAddProduct ? '#888' : C.white,
                    fontFamily: 'Syne', fontWeight: 700, fontSize: 14,
                    cursor: 'pointer',
                    boxShadow: showAddProduct ? 'none' : '0 8px 24px rgba(255,107,157,0.35)',
                    transition: 'all 0.2s',
                  }}>
                    <Plus size={16} /> {showAddProduct ? 'Cancel' : 'Add Product'}
                  </button>
                </div>

                {/* Add product form */}
                {showAddProduct && (
                  <div style={{ background: C.white, borderRadius: 20, padding: '1.5rem', marginBottom: 16, boxShadow: '0 4px 24px rgba(255,107,157,0.1)', border: '1.5px solid rgba(255,107,157,0.2)' }}>
                    <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', color: C.ink, margin: '0 0 1.25rem' }}>New Product</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {[
                        { label: 'Product Name *', key: 'name', span: 2 },
                        { label: 'Price (₹) *',    key: 'price', type: 'number' },
                        { label: 'Badge (optional)', key: 'badge' },
                        { label: 'Image URL',      key: 'image', span: 2 },
                        { label: 'Description',    key: 'description', span: 2 },
                      ].map(f => (
                        <div key={f.key} style={{ gridColumn: f.span === 2 ? 'span 2' : 'span 1' }}>
                          <label style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>{f.label}</label>
                          <input
                            type={f.type || 'text'}
                            value={newProduct[f.key]}
                            onChange={e => setNewProduct(p => ({ ...p, [f.key]: e.target.value }))}
                            style={{
                              width: '100%', padding: '11px 14px', border: '1.5px solid #f0f0f0',
                              borderRadius: 12, fontFamily: 'DM Sans', fontSize: 13, outline: 'none',
                              background: '#fafafa', boxSizing: 'border-box', transition: 'all 0.2s',
                            }}
                            onFocus={e => { e.target.style.borderColor = C.pink; e.target.style.background = '#FFF5F8'; }}
                            onBlur={e => { e.target.style.borderColor = '#f0f0f0'; e.target.style.background = '#fafafa'; }}
                          />
                        </div>
                      ))}
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Category</label>
                        <select value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))} style={{
                          padding: '11px 14px', border: '1.5px solid #f0f0f0', borderRadius: 12,
                          fontFamily: 'DM Sans', fontSize: 13, outline: 'none', background: '#fafafa', cursor: 'pointer',
                        }}>
                          {['Polaroids','Posters','Frames','Collages','Custom'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <button onClick={handleAddProduct} disabled={addingProduct || !newProduct.name || !newProduct.price} style={{
                      marginTop: '1.25rem', width: '100%', padding: '13px', border: 'none', borderRadius: 14,
                      background: (!newProduct.name || !newProduct.price)
                        ? '#e0e0e0'
                        : 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
                      color: (!newProduct.name || !newProduct.price) ? '#aaa' : C.white,
                      fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem',
                      cursor: addingProduct || !newProduct.name || !newProduct.price ? 'not-allowed' : 'pointer',
                      boxShadow: (!newProduct.name || !newProduct.price) ? 'none' : '0 8px 24px rgba(255,107,157,0.3)',
                    }}>
                      {addingProduct ? 'Adding...' : '+ Add Product'}
                    </button>
                  </div>
                )}

                {/* Products grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                  {products.map(p => (
                    <div key={p._id} style={{
                      background: C.white, borderRadius: 18, overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                      border: '1.5px solid rgba(0,0,0,0.06)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'; }}>
                      <div style={{ position: 'relative' }}>
                        <img src={p.image || 'https://images.pexels.com/photos/4340786/pexels-photo-4340786.jpeg?auto=compress&cs=tinysrgb&w=300'}
                          alt={p.name} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                        <button onClick={() => handleDeleteProduct(p._id)} disabled={deletingId === p._id} style={{
                          position: 'absolute', top: 8, right: 8,
                          width: 30, height: 30, borderRadius: 9,
                          background: deletingId === p._id ? '#ccc' : '#ffe0e0',
                          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#ff4444'; e.currentTarget.querySelector('svg').style.color = C.white; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#ffe0e0'; }}>
                          <Trash2 size={13} color="#e74c3c" />
                        </button>
                      </div>
                      <div style={{ padding: '1rem' }}>
                        <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: C.ink, margin: '0 0 6px' }}>{p.name}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ background: C.blush, color: C.pink, fontFamily: 'DM Sans', fontWeight: 600, fontSize: 11, padding: '3px 10px', borderRadius: 999, border: '1px solid ' + C.pink + '30' }}>{p.category}</span>
                          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 14, color: C.ink }}>₹{p.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {invoiceOrder && <InvoiceGenerator order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}