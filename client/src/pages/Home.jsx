import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, Star } from 'lucide-react';

const C = {
  pink: '#FF6B9D', yellow: '#FFE135', blue: '#4ECDC4',
  purple: '#A855F7', orange: '#FF8C42', green: '#06D6A0',
  ink: '#1A1A2E', white: '#FFFFFF', cream: '#FAFAF7',
  lavender: '#E8D5FF', peach: '#FFE4D6', mint: '#D5F5EE',
  blush: '#FFD6E7', butter: '#FFF5CC',
};

// ── Floating Polaroids Background ──
function FloatingPolaroids() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const imgColors = [
      ['#FFB3C6', '#FF6B9D'], ['#FFE135', '#FF8C42'],
      ['#4ECDC4', '#06D6A0'], ['#A855F7', '#4ECDC4'],
      ['#FFD6E7', '#FF6B9D'], ['#E8D5FF', '#A855F7'],
    ];

    const polaroids = Array.from({ length: 14 }, (_, i) => ({
      x: Math.random() * 1200,
      y: Math.random() * 800,
      w: 70 + Math.random() * 50,
      rot: (Math.random() - 0.5) * 40,
      rotSpeed: (Math.random() - 0.5) * 0.003,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -0.25 - Math.random() * 0.4,
      alpha: 0.1 + Math.random() * 0.15,
      colors: imgColors[i % imgColors.length],
      caption: ['✨ Memory', '💖 Vibes', '🎨 Art', '📸 Snap', '🌟 Moment', '🎁 Gift', '🌸 Love'][i % 7],
    }));

    const draw = () => {
      animId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      polaroids.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.rotSpeed;
        if (p.y < -200) { p.y = canvas.height + 100; p.x = Math.random() * canvas.width; }
        if (p.x < -150) p.x = canvas.width + 100;
        if (p.x > canvas.width + 150) p.x = -100;

        const w = p.w, h = w * 1.25, pad = w * 0.08, imgH = w - pad * 2;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = 'rgba(255,107,157,0.2)';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(-w/2, -h/2, w, h, 6);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = p.colors[0];
        ctx.lineWidth = 1.5;
        ctx.stroke();
        const grad = ctx.createLinearGradient(-w/2+pad, -h/2+pad, w/2-pad, -h/2+pad+imgH);
        grad.addColorStop(0, p.colors[0]);
        grad.addColorStop(1, p.colors[1]);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(-w/2+pad, -h/2+pad, w-pad*2, imgH, 3);
        ctx.fill();
        ctx.fillStyle = '#1A1A2E';
        ctx.font = 'bold ' + (w * 0.11) + 'px Syne, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.caption, 0, h/2 - pad * 1.2);
        ctx.restore();
      });
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0,
    }} />
  );
}

// ── Stats counter ──
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const start = Date.now();
      const duration = 1800;
      const tick = () => {
        const progress = Math.min((Date.now() - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.disconnect();
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

const categories = [
  {
    name: 'Polaroids', emoji: '📸', to: '/shop?category=polaroids',
    bg: 'linear-gradient(135deg, #FFD6E7, #FFB3C6)',
    border: C.pink, desc: 'Min 10 pcs · ₹179 each',
    tag: '🔥 Bestseller',
  },
  {
    name: 'Posters', emoji: '🎨', to: '/shop?category=posters',
    bg: 'linear-gradient(135deg, #FFF5CC, #FFE135)',
    border: '#FFD700', desc: 'Min 5 pcs · A4 · ₹59 each',
    tag: '💛 Popular',
  },
  {
    name: 'Stickers', emoji: '✨', to: '/shop?category=stickers',
    bg: 'linear-gradient(135deg, #D5F5EE, #4ECDC4)',
    border: C.blue, desc: 'Die-cut, holo & mini packs',
    tag: '🌟 New!',
  },
  {
    name: 'Frames', emoji: '🖼️', to: '/shop?category=frames',
    bg: 'linear-gradient(135deg, #E8D5FF, #A855F7)',
    border: C.purple, desc: 'Wood & metal frames',
    tag: '🖤 Premium',
  },
];

const testimonials = [
  { name: 'Priya S.', text: 'Omg the polaroids came out SO beautiful!! Gifted them to my bestie and she cried 😭💖', rating: 5, tag: 'Polaroids' },
  { name: 'Arun K.', text: 'Quality is insane for the price. The frames look so premium. Will definitely order again!', rating: 5, tag: 'Frames' },
  { name: 'Sneha M.', text: 'The holographic stickers are everything ✨ My water bottle looks aesthetic now lol', rating: 5, tag: 'Stickers' },
  { name: 'Rohit T.', text: 'Ordered wall posters for my room and they look like a Pinterest board 😍🔥', rating: 5, tag: 'Posters' },
];

const howItWorks = [
  { step: '01', title: 'Choose Your Product', desc: 'Pick from polaroids, posters, stickers or frames', emoji: '🛍️', color: C.blush },
  { step: '02', title: 'Upload Your Photos', desc: 'Send us your favorite memories via WhatsApp', emoji: '📸', color: C.lavender },
  { step: '03', title: 'We Print with Love', desc: 'Premium quality printing with care & attention', emoji: '🎨', color: C.mint },
  { step: '04', title: 'Delivered to You', desc: 'Packed beautifully and delivered to your door', emoji: '📦', color: C.butter },
];

export default function Home() {
  return (
    <div style={{ background: C.cream, paddingTop: 64 }}>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #FFF5F8 0%, #FFF0FA 40%, #F5F0FF 70%, #F0FAFF 100%)',
      }}>
        <FloatingPolaroids />

        {/* Soft blobs */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '5%', left: '5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,107,157,0.12) 0%, transparent 70%)', borderRadius: '50%', animation: 'blobFloat1 8s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: '0%', right: '10%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)', borderRadius: '50%', animation: 'blobFloat2 10s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '10%', left: '30%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(78,205,196,0.10) 0%, transparent 70%)', borderRadius: '50%', animation: 'blobFloat3 12s ease-in-out infinite' }} />
        </div>

        {/* Hero content */}
        <div className="hero-grid" style={{
          maxWidth: 1280, margin: '0 auto', padding: '6rem 2rem',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '4rem', alignItems: 'center', width: '100%',
          position: 'relative', zIndex: 2,
        }}>
          {/* Left */}
          <div>
            {/* Pill badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,107,157,0.12)',
              border: '2px solid rgba(255,107,157,0.3)',
              borderRadius: 999, padding: '6px 18px',
              marginBottom: '1.5rem',
            }}>
              <Sparkles size={14} color={C.pink} />
              <span style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13, color: C.pink }}>
                Custom Prints · Chennai 🌸
              </span>
            </div>

            <h1 className="hero-title" style={{
              fontFamily: 'Syne', fontWeight: 800,
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              color: C.ink, lineHeight: 1.05,
              margin: '0 0 1.25rem',
            }}>
              Turn Your
              <span style={{
                display: 'block',
                background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Memories
              </span>
              Into Art ✨
            </h1>

            <p style={{
              fontFamily: 'DM Sans', fontSize: '1.1rem',
              color: '#666', lineHeight: 1.8,
              margin: '0 0 2rem', maxWidth: 480,
            }}>
              Custom polaroids, wall posters, aesthetic stickers & premium frames.
              Made with love for your most precious moments. 💖
            </p>

            {/* Buttons */}
            <div className="hero-buttons" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <Link to="/shop" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
                color: C.white, border: 'none',
                fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem',
                padding: '14px 32px', borderRadius: 16, textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(255,107,157,0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,107,157,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,107,157,0.35)'; }}>
                Shop Now <ArrowRight size={18} />
              </Link>

              <Link to="/editor" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: C.white, color: C.ink,
                border: '2px solid rgba(0,0,0,0.12)',
                fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem',
                padding: '14px 28px', borderRadius: 16, textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}>
                📸 Try Editor
              </Link>
            </div>

            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex' }}>
                {['#FF6B9D', '#A855F7', '#4ECDC4', '#FFE135'].map((color, i) => (
                  <div key={i} style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: color, border: '2px solid ' + C.white,
                    marginLeft: i > 0 ? -8 : 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14,
                  }}>
                    {['😊', '🌸', '✨', '💖'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={C.yellow} color={C.yellow} />)}
                </div>
                <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#888', margin: '2px 0 0' }}>
                  Loved by 500+ happy customers 💖
                </p>
              </div>
            </div>
          </div>

          {/* Right — polaroid stack */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', height: 420 }}>

            {/* Back card */}
            <div style={{
              position: 'absolute',
              width: 220, background: C.white,
              borderRadius: 16, padding: '14px 14px 50px',
              boxShadow: '0 20px 60px rgba(168,85,247,0.2)',
              transform: 'rotate(-8deg) translate(-60px, 20px)',
              border: '1px solid rgba(168,85,247,0.2)',
            }}>
              <div style={{ height: 180, borderRadius: 8, background: 'linear-gradient(135deg, #E8D5FF, #A855F7)', marginBottom: 8 }} />
              <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 12, color: '#888', textAlign: 'center', margin: 0 }}>🌸 Aesthetic</p>
            </div>

            {/* Middle card */}
            <div style={{
              position: 'absolute',
              width: 220, background: C.white,
              borderRadius: 16, padding: '14px 14px 50px',
              boxShadow: '0 20px 60px rgba(78,205,196,0.2)',
              transform: 'rotate(5deg) translate(50px, -10px)',
              border: '1px solid rgba(78,205,196,0.2)',
            }}>
              <div style={{ height: 180, borderRadius: 8, background: 'linear-gradient(135deg, #D5F5EE, #4ECDC4)', marginBottom: 8 }} />
              <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 12, color: '#888', textAlign: 'center', margin: 0 }}>✨ Memories</p>
            </div>

            {/* Front card */}
            <div style={{
              position: 'relative',
              width: 240, background: C.white,
              borderRadius: 16, padding: '16px 16px 56px',
              boxShadow: '0 30px 80px rgba(255,107,157,0.25)',
              transform: 'rotate(-2deg)',
              border: '1px solid rgba(255,107,157,0.2)',
              zIndex: 3,
            }}>
              <div style={{ height: 200, borderRadius: 10, background: 'linear-gradient(135deg, #FFD6E7, #FF6B9D)', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>
                📸
              </div>
              <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: C.ink, textAlign: 'center', margin: 0 }}>
                Your Memory Here 💖
              </p>
            </div>

            {/* Floating elements */}
            <div style={{ position: 'absolute', top: 20, right: 20, fontSize: 28, animation: 'blobFloat1 3s ease-in-out infinite' }}>✨</div>
            <div style={{ position: 'absolute', bottom: 40, left: 20, fontSize: 24, animation: 'blobFloat2 4s ease-in-out infinite' }}>💖</div>
            <div style={{ position: 'absolute', top: 60, left: 10, fontSize: 22, animation: 'blobFloat3 5s ease-in-out infinite' }}>🌸</div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{
        background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
        padding: '3rem 2rem',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
          {[
            { label: 'Happy Customers', target: 500, suffix: '+' },
            { label: 'Orders Delivered', target: 1200, suffix: '+' },
            { label: 'Products',         target: 15,   suffix: ''  },
            { label: 'Cities Reached',   target: 20,   suffix: '+'  },
          ].map((s, i) => (
            <div key={i}>
              <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: C.white, margin: '0 0 4px' }}>
                <Counter target={s.target} suffix={s.suffix} />
              </p>
              <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: C.blush, border: '2px solid ' + C.pink + '40',
              borderRadius: 999, padding: '6px 18px', marginBottom: 16,
            }}>
              <Heart size={14} color={C.pink} fill={C.pink} />
              <span style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13, color: C.pink }}>
                Our Products
              </span>
            </div>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: C.ink, margin: '0 0 12px' }}>
              What We Make 🎨
            </h2>
            <p style={{ fontFamily: 'DM Sans', fontSize: '1rem', color: '#888', maxWidth: 500, margin: '0 auto' }}>
              Everything your walls, gifts and vibes need
            </p>
          </div>

          <div className="categories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {categories.map((cat, i) => (
              <Link key={cat.name} to={cat.to} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: cat.bg,
                  border: '2px solid ' + cat.border + '40',
                  borderRadius: 24, padding: '2rem 1.5rem',
                  textAlign: 'center',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  cursor: 'pointer', position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.06)'; }}>

                  {/* Tag */}
                  <div style={{
                    position: 'absolute', top: 14, right: 14,
                    background: 'rgba(255,255,255,0.8)',
                    borderRadius: 999, padding: '3px 10px',
                    fontFamily: 'DM Sans', fontWeight: 600, fontSize: 10,
                    color: C.ink,
                  }}>
                    {cat.tag}
                  </div>

                  <div style={{ fontSize: 52, marginBottom: '1rem' }}>{cat.emoji}</div>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.2rem', color: C.ink, margin: '0 0 8px' }}>
                    {cat.name}
                  </h3>
                  <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#666', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
                    {cat.desc}
                  </p>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(255,255,255,0.9)',
                    borderRadius: 999, padding: '6px 16px',
                    fontFamily: 'Syne', fontWeight: 700, fontSize: 12, color: C.ink,
                  }}>
                    Shop {cat.name} <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg, #FFF5F8, #F5F0FF)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: C.lavender, border: '2px solid ' + C.purple + '40',
              borderRadius: 999, padding: '6px 18px', marginBottom: 16,
            }}>
              <Sparkles size={14} color={C.purple} />
              <span style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13, color: C.purple }}>
                Super Simple
              </span>
            </div>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: C.ink, margin: '0 0 12px' }}>
              How It Works 🌟
            </h2>
            <p style={{ fontFamily: 'DM Sans', fontSize: '1rem', color: '#888', maxWidth: 450, margin: '0 auto' }}>
              Order your dream prints in just 4 easy steps
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {howItWorks.map((step, i) => (
              <div key={i} style={{
                background: step.color,
                borderRadius: 24, padding: '2rem 1.5rem',
                textAlign: 'center', position: 'relative',
                border: '2px solid rgba(255,255,255,0.8)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <div style={{
                  position: 'absolute', top: 16, left: 16,
                  fontFamily: 'Syne', fontWeight: 800, fontSize: 11,
                  color: 'rgba(0,0,0,0.2)', letterSpacing: '0.1em',
                }}>
                  {step.step}
                </div>
                <div style={{ fontSize: 44, marginBottom: '1rem' }}>{step.emoji}</div>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', color: C.ink, margin: '0 0 8px' }}>
                  {step.title}
                </h3>
                <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#666', margin: 0, lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: C.butter, border: '2px solid ' + C.yellow + '80',
              borderRadius: 999, padding: '6px 18px', marginBottom: 16,
            }}>
              <Star size={14} color="#FFB800" fill="#FFB800" />
              <span style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13, color: '#996600' }}>
                Happy Customers
              </span>
            </div>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: C.ink, margin: '0 0 12px' }}>
              What They Say 💬
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background: C.white,
                border: '2px solid rgba(0,0,0,0.06)',
                borderRadius: 24, padding: '1.75rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.06)'; }}>

                {/* Quote mark */}
                <div style={{
                  position: 'absolute', top: 16, right: 20,
                  fontFamily: 'Syne', fontWeight: 800, fontSize: 64,
                  color: C.pink + '15', lineHeight: 1,
                }}>
                  "
                </div>

                {/* Stars */}
                <div style={{ display: 'flex', gap: 3, marginBottom: 12 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={C.yellow} color={C.yellow} />)}
                </div>

                <p style={{ fontFamily: 'DM Sans', fontSize: 14, color: '#555', lineHeight: 1.7, margin: '0 0 1.25rem' }}>
                  "{t.text}"
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: C.white, fontFamily: 'Syne', fontWeight: 700, fontSize: 14,
                    }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: C.ink, margin: 0 }}>{t.name}</p>
                      <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#aaa', margin: 0 }}>Verified Customer</p>
                    </div>
                  </div>
                  <span style={{
                    background: C.blush, color: C.pink,
                    fontFamily: 'DM Sans', fontWeight: 600, fontSize: 11,
                    padding: '3px 12px', borderRadius: 50,
                  }}>
                    {t.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ── */}
      <section style={{ padding: '0 2rem 5rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="contact-cta-grid" style={{
            background: 'linear-gradient(135deg, ' + C.ink + ' 0%, #2D1B4E 100%)',
            borderRadius: 32, padding: '4rem 3rem',
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '3rem', alignItems: 'center',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(26,26,46,0.3)',
          }}>
            {/* Blobs */}
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: C.pink + '18', borderRadius: '50%', filter: 'blur(40px)' }} />
            <div style={{ position: 'absolute', bottom: -40, left: 200, width: 150, height: 150, background: C.purple + '18', borderRadius: '50%', filter: 'blur(30px)' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,107,157,0.15)',
                border: '1px solid rgba(255,107,157,0.3)',
                borderRadius: 999, padding: '6px 16px', marginBottom: 16,
              }}>
                <Heart size={13} color={C.pink} fill={C.pink} />
                <span style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 12, color: C.pink }}>Custom Orders</span>
              </div>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: C.white, margin: '0 0 16px', lineHeight: 1.1 }}>
                Want something totally unique? 🎨
              </h2>
              <p style={{ fontFamily: 'DM Sans', fontSize: '1rem', color: '#aaa', lineHeight: 1.7, margin: 0 }}>
                Bulk orders, custom designs, special packaging — we do it all. Just reach out and we'll make it happen!
              </p>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { href: 'https://wa.me/919710194144', bg: '#25D366', emoji: '📱', label: 'WhatsApp Us', sub: '+91 97101 94144', shadow: 'rgba(37,211,102,0.3)' },
                { href: 'https://instagram.com/frameonyx', bg: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', emoji: '📸', label: 'Instagram', sub: '@frameonyx', shadow: 'rgba(220,39,67,0.3)' },
                { href: 'mailto:frameonyx007@gmail.com', bg: 'rgba(255,255,255,0.08)', emoji: '📧', label: 'Email Us', sub: 'frameonyx007@gmail.com', shadow: 'none' },
              ].map((btn, i) => (
                <a key={i} href={btn.href} target="_blank" rel="noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: btn.bg,
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 18, padding: '1rem 1.25rem',
                  textDecoration: 'none',
                  boxShadow: btn.shadow !== 'none' ? '0 8px 24px ' + btn.shadow : 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
                  <span style={{ fontSize: 24 }}>{btn.emoji}</span>
                  <div>
                    <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: C.white, margin: 0 }}>{btn.label}</p>
                    <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{btn.sub}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}