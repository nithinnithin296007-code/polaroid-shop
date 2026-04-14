import { Camera, Mail, Heart, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#1A1A2E', color: '#fff', marginTop: '6rem', borderTop: '4px solid #FF6B9D' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '4rem 2rem' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3rem' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: '#FF6B9D', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera size={18} color="#fff" />
              </div>
              <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem' }}>
                Frame<span style={{ color: '#FF6B9D' }}>Onyx</span>
              </span>
            </div>
            <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#aaa', lineHeight: 1.8 }}>
              Turning your memories into beautiful custom polaroids, posters, stickers & frames. Every moment deserves to shine. ✨
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <a href="https://instagram.com/frameonyx" target="_blank" rel="noreferrer"
                style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#FF6B9D'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                <Share2 size={15} color="#fff" />
              </a>
              <a href="mailto:frameonyx007@gmail.com"
                style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#FF6B9D'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                <Mail size={15} color="#fff" />
              </a>
              <a href="#"
                style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#FF6B9D'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                <Heart size={15} color="#fff" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: 20 }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Home', to: '/' },
                { label: 'Shop', to: '/shop' },
                { label: 'Cart', to: '/cart' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.to} style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#aaa', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#FF6B9D'}
                    onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: 20 }}>Get in Touch</h4>
            <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#aaa', marginBottom: 10 }}>
              📧 <a href="mailto:frameonyx007@gmail.com" style={{ color: '#FF6B9D', textDecoration: 'none' }}>frameonyx007@gmail.com</a>
            </p>
            <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#aaa', marginBottom: 10 }}>
              📱 <a href="tel:+919710194144" style={{ color: '#FF6B9D', textDecoration: 'none' }}>+91 97101 94144</a>
            </p>
            <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#aaa', marginBottom: 10 }}>
              📸 <a href="https://instagram.com/frameonyx" target="_blank" rel="noreferrer" style={{ color: '#FF6B9D', textDecoration: 'none' }}>@frameonyx</a>
            </p>
            <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#aaa' }}>📍 Chennai, Tamil Nadu</p>
            <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#aaa', marginTop: 6 }}>⏰ Mon – Sat, 10am – 7pm</p>
          </div>
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', fontFamily: 'DM Sans', fontSize: 12, color: '#555' }}>
          © {new Date().getFullYear()} FrameOnyx. Made with 💖 in Chennai.
        </div>
      </div>
    </footer>
  );
}