import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const C = {
  pink: '#FF6B9D', ink: '#1A1A2E', white: '#FFFFFF', cream: '#FAFAF7',
};

const links = [
  { to: '/',        label: 'Home'       },
  { to: '/shop',    label: 'Shop'       },
  { to: '/editor',  label: '📸 Editor'  },
  { to: '/collage', label: '🎨 Collage' },
  { to: '/track',   label: '📦 Track'   },
];

export default function Navbar() {
  const { cart } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = cart.items.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: C.ink, borderBottom: '3px solid ' + C.pink,
        height: 64,
        display: 'flex', alignItems: 'center',
        padding: '0 1.5rem',
        justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34, background: C.pink,
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Camera size={18} color={C.white} />
          </div>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.3rem', color: C.white }}>
            Frame<span style={{ color: C.pink }}>Onyx</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
              color: location.pathname === l.to ? C.pink : '#aaa',
              textDecoration: 'none', padding: '6px 14px', borderRadius: 10,
              background: location.pathname === l.to ? C.pink + '20' : 'transparent',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (location.pathname !== l.to) e.currentTarget.style.color = C.white; }}
            onMouseLeave={e => { if (location.pathname !== l.to) e.currentTarget.style.color = '#aaa'; }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          {/* Account / Login button */}
          <Link to={user ? '/account' : '/login'} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '7px 14px', borderRadius: 12, textDecoration: 'none',
            background: user ? C.pink + '20' : 'rgba(255,255,255,0.08)',
            border: '1px solid ' + (user ? C.pink + '50' : 'rgba(255,255,255,0.12)'),
            fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
            color: user ? C.pink : '#aaa',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = C.pink + '30';
            e.currentTarget.style.color = C.pink;
            e.currentTarget.style.borderColor = C.pink + '80';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = user ? C.pink + '20' : 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = user ? C.pink : '#aaa';
            e.currentTarget.style.borderColor = user ? C.pink + '50' : 'rgba(255,255,255,0.12)';
          }}>
            <User size={15} />
            {user ? user.name.split(' ')[0] : 'Login'}
          </Link>

          {/* Cart */}
          <Link to="/cart" style={{
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            textDecoration: 'none', transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = C.pink + '30'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
            <ShoppingCart size={18} color={C.white} />
            {itemCount > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -6,
                background: C.pink, color: C.white,
                fontFamily: 'Syne', fontWeight: 700, fontSize: 10,
                width: 18, height: 18, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid ' + C.ink,
              }}>
                {itemCount}
              </span>
            )}
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="nav-mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {menuOpen ? <X size={20} color={C.white} /> : <Menu size={20} color={C.white} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, zIndex: 999,
          background: C.ink, borderBottom: '3px solid ' + C.pink,
          padding: '1rem',
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'Syne', fontWeight: 700, fontSize: 15,
                color: location.pathname === l.to ? C.pink : C.white,
                textDecoration: 'none',
                padding: '12px 16px', borderRadius: 12,
                background: location.pathname === l.to ? C.pink + '20' : 'transparent',
                display: 'block',
                borderLeft: location.pathname === l.to ? '3px solid ' + C.pink : '3px solid transparent',
              }}
            >
              {l.label}
            </Link>
          ))}

          {/* Account link in mobile menu */}
          <Link
            to={user ? '/account' : '/login'}
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: 'Syne', fontWeight: 700, fontSize: 15,
              color: user ? C.pink : C.white,
              textDecoration: 'none',
              padding: '12px 16px', borderRadius: 12,
              background: user ? C.pink + '20' : 'transparent',
              borderLeft: user ? '3px solid ' + C.pink : '3px solid transparent',
            }}
          >
            <User size={16} />
            {user ? user.name + ' (Account)' : 'Login / Register'}
          </Link>

          {/* Contact in mobile menu */}
          <div style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <a href="https://wa.me/919710194144" target="_blank" rel="noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13,
              color: '#aaa', textDecoration: 'none', padding: '8px 16px',
            }}>
              📱 +91 97101 94144
            </a>
            <a href="https://instagram.com/frameonyx" target="_blank" rel="noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13,
              color: '#aaa', textDecoration: 'none', padding: '8px 16px',
            }}>
              📸 @frameonyx
            </a>
          </div>
        </div>
      )}
    </>
  );
}