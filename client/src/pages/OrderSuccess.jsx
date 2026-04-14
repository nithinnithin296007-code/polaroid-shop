import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Truck, CheckCircle, Star, Sparkles } from 'lucide-react';

const C = {
  pink: '#FF6B9D', yellow: '#FFE135', blue: '#4ECDC4',
  purple: '#A855F7', orange: '#FF8C42', green: '#06D6A0',
  ink: '#1A1A2E', white: '#FFFFFF', cream: '#FAFAF7',
  blush: '#FFD6E7', lavender: '#E8D5FF', mint: '#D5F5EE', butter: '#FFF5CC',
};

function Confetti() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = [C.pink, C.yellow, C.blue, C.purple, C.orange, C.green, '#fff'];
    const particles = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: 6 + Math.random() * 10,
      h: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 6,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }));
    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.8;
        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
        p.y += p.vy; p.x += p.vx; p.rot += p.rotSpeed;
        if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    const stop = setTimeout(() => cancelAnimationFrame(animId), 4500);
    return () => { cancelAnimationFrame(animId); clearTimeout(stop); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999 }} />;
}

function Counter({ target, duration = 1500 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return <span>{count}</span>;
}

const steps = [
  { icon: CheckCircle, label: 'Order Confirmed',  desc: 'Just now',           color: C.green,  active: true  },
  { icon: Package,     label: 'Being Prepared',   desc: 'Within 24 hrs',      color: C.blue,   active: false },
  { icon: Truck,       label: 'Out for Delivery', desc: '2–4 business days',  color: C.pink,   active: false },
  { icon: Star,        label: 'Delivered! 🎉',    desc: 'Sit back & relax',   color: C.yellow, active: false },
];

export default function OrderSuccess() {
  const [visible, setVisible]     = useState(false);
  const [checkAnim, setCheckAnim] = useState(false);
  const order = JSON.parse(localStorage.getItem('lastOrder') || '{}');
  const itemCount = order.items?.length || 1;
  const orderId = order._id ? order._id.slice(-6).toUpperCase() : Math.floor(10000 + Math.random() * 90000);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    setTimeout(() => setCheckAnim(true), 400);
  }, []);

  return (
    <div style={{
      paddingTop: 64, minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF5F8 0%, #FFF0FA 40%, #F5F0FF 70%, #F0FAFF 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '4rem 2rem', position: 'relative', overflow: 'hidden',
    }}>
      <Confetti />

      {/* Background blobs */}
      <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, background: C.pink + '18', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, right: -100, width: 350, height: 350, background: C.purple + '18', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '40%', left: '10%', width: 200, height: 200, background: C.blue + '12', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

      {/* Main card */}
      <div style={{
        background: C.white,
        borderRadius: 32, padding: '3rem 2.5rem',
        maxWidth: 560, width: '100%',
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative', zIndex: 1,
        boxShadow: '0 40px 80px rgba(255,107,157,0.15)',
        border: '1.5px solid rgba(255,107,157,0.15)',
      }}>

        {/* Success icon */}
        <div style={{
          width: 100, height: 100, margin: '0 auto 1.5rem',
          background: 'linear-gradient(135deg, ' + C.green + ', ' + C.blue + ')',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 0 10px ' + C.green + '18, 0 0 0 20px ' + C.green + '08',
          transform: checkAnim ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-180deg)',
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          <span style={{ fontSize: 48 }}>✓</span>
        </div>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: C.blush, border: '1.5px solid rgba(255,107,157,0.3)',
          borderRadius: 999, padding: '5px 16px', marginBottom: 16,
        }}>
          <Sparkles size={13} color={C.pink} />
          <span style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 12, color: C.pink }}>
            Order Confirmed
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'Syne', fontWeight: 800,
          fontSize: 'clamp(2rem, 5vw, 2.8rem)',
          background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          margin: '0 0 8px', lineHeight: 1.1,
        }}>
          Order Placed! 🎉
        </h1>
        <p style={{ fontFamily: 'DM Sans', color: '#888', fontSize: 15, marginBottom: '2rem' }}>
          Your custom prints are being prepared with love 💖
        </p>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12, marginBottom: '2rem',
        }}>
          {[
            { label: 'Order ID',  value: 'FO-' + orderId, isStatic: true, bg: C.blush,   color: C.pink   },
            { label: 'Est. Days', target: 4,  suffix: ' days', bg: C.lavender, color: C.purple },
            { label: 'Items',     target: itemCount, suffix: ' item' + (itemCount > 1 ? 's' : ''), bg: C.mint, color: C.green },
          ].map((stat, i) => (
            <div key={i} style={{
              background: stat.bg,
              border: '1.5px solid rgba(0,0,0,0.06)',
              borderRadius: 16, padding: '1rem 0.5rem',
            }}>
              <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.1rem', color: C.ink, margin: '0 0 4px' }}>
                {stat.isStatic ? stat.value : <><Counter target={stat.target} /><span style={{ fontSize: '0.75rem' }}>{stat.suffix}</span></>}
              </p>
              <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#888', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Order journey */}
        <div style={{
          background: 'linear-gradient(135deg, #FFF5F8, #F5F0FF)',
          border: '1.5px solid rgba(255,107,157,0.15)',
          borderRadius: 20, padding: '1.5rem',
          marginBottom: '1.5rem', textAlign: 'left',
        }}>
          <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: '#aaa', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 1.25rem' }}>
            Order Journey
          </p>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative' }}>
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute', left: 17, top: 36,
                  width: 2, height: 32,
                  background: i === 0
                    ? 'linear-gradient(180deg, ' + step.color + ', transparent)'
                    : 'rgba(0,0,0,0.06)',
                  borderRadius: 2,
                }} />
              )}
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: i === 0
                  ? 'linear-gradient(135deg, ' + step.color + ', ' + step.color + 'aa)'
                  : '#f5f5f5',
                border: '1.5px solid ' + (i === 0 ? step.color : '#eee'),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: i === 0 ? '0 4px 16px ' + step.color + '40' : 'none',
                marginBottom: i < steps.length - 1 ? 24 : 0,
              }}>
                <step.icon size={16} color={i === 0 ? C.white : '#ccc'} />
              </div>
              <div style={{ paddingTop: 4 }}>
                <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: i === 0 ? C.ink : '#bbb', margin: '0 0 2px' }}>
                  {step.label}
                </p>
                <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: i === 0 ? '#888' : '#ddd', margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div style={{
          background: C.mint,
          border: '1.5px solid rgba(6,214,160,0.25)',
          borderRadius: 16, padding: '1rem 1.25rem',
          marginBottom: '2rem', textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 26 }}>📱</span>
          <div>
            <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: C.ink, margin: '0 0 2px' }}>
              Questions about your order?
            </p>
            <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#555', margin: 0 }}>
              WhatsApp{' '}
              <a href="https://wa.me/919710194144" style={{ color: C.pink, textDecoration: 'none', fontWeight: 600 }}>
                +91 97101 94144
              </a>
              {' '}or DM{' '}
              <a href="https://instagram.com/frameonyx" target="_blank" rel="noreferrer" style={{ color: C.pink, textDecoration: 'none', fontWeight: 600 }}>
                @frameonyx
              </a>
            </p>
          </div>
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/shop" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
            color: C.white, border: 'none',
            fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem',
            padding: '13px 28px', borderRadius: 14, textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(255,107,157,0.35)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(255,107,157,0.45)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,107,157,0.35)'; }}>
            Shop More <ArrowRight size={16} />
          </Link>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: C.white, color: C.ink,
            border: '1.5px solid rgba(0,0,0,0.1)',
            fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem',
            padding: '13px 28px', borderRadius: 14, textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}>
            Go Home
          </Link>
        </div>
      </div>

      {/* Tagline */}
      <p style={{
        fontFamily: 'DM Sans', fontSize: 13, color: '#aaa',
        marginTop: '2rem', textAlign: 'center',
        opacity: visible ? 1 : 0, transition: 'opacity 0.5s 0.8s',
        position: 'relative', zIndex: 1,
      }}>
        Made with 💖 in Chennai · FrameOnyx
      </p>
    </div>
  );
}