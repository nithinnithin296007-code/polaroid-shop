import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import TiltedCard from '../components/TiltedCard';
import api from '../utils/api';
import { Search, ShoppingBag, Star, Sparkles, Heart } from 'lucide-react';

const C = {
  pink: '#FF6B9D', yellow: '#FFE135', blue: '#4ECDC4',
  purple: '#A855F7', orange: '#FF8C42', green: '#06D6A0',
  ink: '#1A1A2E', white: '#FFFFFF', cream: '#FAFAF7',
  lavender: '#E8D5FF', peach: '#FFE4D6', mint: '#D5F5EE',
  blush: '#FFD6E7', butter: '#FFF5CC',
};

const CATEGORIES = ['All', 'Polaroids', 'Posters', 'Frames', 'Stickers', 'Bundles'];

const CAT_STYLES = {
  All:      { bg: C.ink,     color: C.white,  pill: '#333'    },
  Polaroids:{ bg: C.pink,    color: C.white,  pill: C.blush   },
  Posters:  { bg: '#FFB800', color: C.ink,    pill: C.butter  },
  Frames:   { bg: C.purple,  color: C.white,  pill: C.lavender},
  Stickers: { bg: C.blue,    color: C.ink,    pill: C.mint    },
  Bundles:  { bg: C.orange,  color: C.white,  pill: C.peach   },
};

const CAT_EMOJIS = {
  All: '🛍️', Polaroids: '📸', Posters: '🎨',
  Frames: '🖼️', Stickers: '✨', Bundles: '🎁',
};

const tagColors = [C.pink, '#FFB800', C.blue, C.purple, C.orange, C.green];

const PRODUCT_IMAGES = {
  Polaroids: 'https://images.pexels.com/photos/4340786/pexels-photo-4340786.jpeg?auto=compress&cs=tinysrgb&w=400',
  Posters:   'https://images.pexels.com/photos/28450852/pexels-photo-28450852.jpeg?auto=compress&cs=tinysrgb&w=400',
  Frames:    'https://images.pexels.com/photos/10252177/pexels-photo-10252177.jpeg?auto=compress&cs=tinysrgb&w=400',
  Stickers:  'https://images.pexels.com/photos/6686455/pexels-photo-6686455.jpeg?auto=compress&cs=tinysrgb&w=400',
  Bundles:   'https://images.pexels.com/photos/4340786/pexels-photo-4340786.jpeg?auto=compress&cs=tinysrgb&w=400',
};

const getImage = (product) => {
  if (product.image) return product.image;
  return PRODUCT_IMAGES[product.category] ||
    'https://images.pexels.com/photos/4340786/pexels-photo-4340786.jpeg?auto=compress&cs=tinysrgb&w=400';
};

function ProductCard({ product, index }) {
  const { addItem } = useCart();
  const [added, setAdded]       = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const accent = tagColors[index % tagColors.length];
  const imgSrc = getImage(product);

  const handleAdd = () => {
    addItem({ ...product, variant: 'default' });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div style={{
      background: C.white,
      borderRadius: 24,
      overflow: 'visible',
      boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      border: '1.5px solid rgba(0,0,0,0.06)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.12)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.07)'; }}>

      {/* Badge */}
      {product.badge && (
        <div style={{
          position: 'absolute', top: 14, left: 14, zIndex: 10,
          background: accent, borderRadius: 999,
          padding: '4px 12px',
          fontFamily: 'DM Sans', fontWeight: 700, fontSize: 10,
          color: accent === '#FFB800' ? C.ink : C.white,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          letterSpacing: '0.03em',
        }}>
          {product.badge}
        </div>
      )}

      {/* Wishlist */}
      <button
        onClick={() => setWishlist(!wishlist)}
        style={{
          position: 'absolute', top: 14, right: 14, zIndex: 10,
          width: 34, height: 34, borderRadius: '50%',
          background: 'rgba(255,255,255,0.9)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Heart
          size={16}
          color={wishlist ? C.pink : '#aaa'}
          fill={wishlist ? C.pink : 'none'}
        />
      </button>

     {/* TiltedCard image */}
      <div style={{ padding: '12px 12px 0', borderRadius: '24px 24px 0 0', overflow: 'clip' }}>
        <TiltedCard
          imageSrc={imgSrc}
          altText={product.name}
          captionText={product.name}
          containerHeight="200px"
          containerWidth="100%"
          imageHeight="200px"
          imageWidth="100%"
          rotateAmplitude={10}
          scaleOnHover={1.04}
          showTooltip={false}
          displayOverlayContent={true}
          overlayContent={
            <p style={{ color: C.white, fontFamily: 'Syne', fontWeight: 700, fontSize: 12 }}>
              {product.name}
            </p>
          }
        />
      </div>

      {/* Info */}
      <div style={{ padding: '16px 18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Category pill */}
        <span style={{
          display: 'inline-block', alignSelf: 'flex-start',
          background: CAT_STYLES[product.category]?.pill || C.blush,
          color: C.ink, fontFamily: 'DM Sans', fontWeight: 600, fontSize: 10,
          padding: '3px 12px', borderRadius: 999,
          letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>
          {CAT_EMOJIS[product.category]} {product.category}
        </span>

        {/* Name */}
        <h3 style={{
          fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem',
          lineHeight: 1.3, color: C.ink, margin: 0,
        }}>
          {product.name}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily: 'DM Sans', fontSize: 12, color: '#888',
          lineHeight: 1.6, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {product.description}
        </p>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={12}
                fill={s <= Math.round(product.rating) ? C.yellow : 'none'}
                color={s <= Math.round(product.rating) ? C.yellow : '#ddd'}
              />
            ))}
          </div>
          <span style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 11, color: '#aaa' }}>
            {product.rating}
          </span>
        </div>

        {/* Price + Add */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginTop: 'auto', paddingTop: 8,
        }}>
          <div>
            <span style={{
              fontFamily: 'Syne', fontWeight: 800,
              fontSize: '1.3rem', color: C.ink,
            }}>
              ₹{product.price}
            </span>
            {product.category === 'Polaroids' && (
              <p style={{ fontFamily: 'DM Sans', fontSize: 10, color: '#aaa', margin: '2px 0 0' }}>
                min 10 pcs
              </p>
            )}
            {product.category === 'Posters' && (
              <p style={{ fontFamily: 'DM Sans', fontSize: 10, color: '#aaa', margin: '2px 0 0' }}>
                min 5 pcs
              </p>
            )}
          </div>

          <button
            onClick={handleAdd}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: added
                ? 'linear-gradient(135deg, ' + C.green + ', #04a97a)'
                : 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
              color: C.white, border: 'none',
              fontFamily: 'Syne', fontWeight: 700, fontSize: 12,
              padding: '9px 18px', borderRadius: 12,
              cursor: 'pointer',
              boxShadow: added
                ? '0 4px 16px rgba(6,214,160,0.35)'
                : '0 4px 16px rgba(255,107,157,0.35)',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <ShoppingBag size={13} />
            {added ? '✓ Added!' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [searchParams]          = useSearchParams();
  const [active, setActive]     = useState(
    searchParams.get('category')
      ? searchParams.get('category').charAt(0).toUpperCase() + searchParams.get('category').slice(1)
      : 'All'
  );

  useEffect(() => {
    api.get('/products')
      .then(r => setProducts(r.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    const matchCat    = active === 'All' || p.category === active;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', background: 'linear-gradient(135deg, #FFF5F8 0%, #FFF0FA 40%, #F5F0FF 70%, #F0FAFF 100%)' }}>

      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
        padding: '3.5rem 2rem 4rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 250, height: 250, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: 100, width: 180, height: 180, background: 'rgba(255,255,255,0.08)', borderRadius: '50%', filter: 'blur(30px)' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 999, padding: '6px 18px', marginBottom: 16,
          }}>
            <Sparkles size={14} color={C.white} />
            <span style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13, color: C.white }}>
              Browse & Shop
            </span>
          </div>
          <h1 style={{
            fontFamily: 'Syne', fontWeight: 800,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: C.white, margin: '0 0 10px', lineHeight: 1.1,
          }}>
            The Shop 🛍️
          </h1>
          <p style={{ fontFamily: 'DM Sans', fontSize: '1rem', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
            Everything your walls have been dreaming of ✨
          </p>
        </div>

        {/* Wave bottom */}
        <div style={{
          position: 'absolute', bottom: -2, left: 0, right: 0,
          height: 40, overflow: 'hidden',
        }}>
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d="M0,40 C300,0 900,40 1200,10 L1200,40 Z" fill="#FFF5F8" />
          </svg>
        </div>
      </div>

      <div className="shop-layout" style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem' }}>

        {/* ── Search + Filters ── */}
        <div style={{
          background: C.white, borderRadius: 24,
          padding: '1.5rem', marginBottom: '2rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          border: '1.5px solid rgba(0,0,0,0.06)',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{
              position: 'absolute', left: 16, top: '50%',
              transform: 'translateY(-50%)', color: '#bbb',
            }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              style={{
                width: '100%', paddingLeft: 44, paddingRight: 16,
                paddingTop: 13, paddingBottom: 13,
                border: '2px solid #f0f0f0', borderRadius: 14,
                fontFamily: 'DM Sans', fontSize: 14,
                background: '#fafafa', outline: 'none',
                transition: 'border-color 0.2s, background 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={e => { e.target.style.borderColor = C.pink; e.target.style.background = C.white; }}
              onBlur={e => { e.target.style.borderColor = '#f0f0f0'; e.target.style.background = '#fafafa'; }}
            />
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => {
              const isActive = active === cat;
              const style    = CAT_STYLES[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '9px 20px', borderRadius: 999,
                    border: 'none',
                    fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
                    cursor: 'pointer', transition: 'all 0.2s',
                    background: isActive ? style.bg : '#f5f5f5',
                    color: isActive ? style.color : '#888',
                    boxShadow: isActive ? '0 4px 16px rgba(0,0,0,0.15)' : 'none',
                    transform: isActive ? 'translateY(-2px)' : 'none',
                  }}
                >
                  {CAT_EMOJIS[cat]} {cat}
                  {isActive && <Sparkles size={11} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#999', marginBottom: '1.5rem' }}>
            Showing <strong style={{ color: C.ink }}>{filtered.length}</strong> products
            {active !== 'All' && (
              <span> in <span style={{ color: C.pink, fontWeight: 600 }}>{active}</span></span>
            )}
            {search && (
              <span> for <span style={{ color: C.purple, fontWeight: 600 }}>"{search}"</span></span>
            )}
          </p>
        )}

        {/* ── Grid ── */}
        {loading ? (
          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{
                background: C.white, borderRadius: 24,
                border: '1.5px solid rgba(0,0,0,0.06)',
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              }}>
                <div style={{
                  height: 200,
                  background: 'linear-gradient(90deg, #f5f0f8 25%, #ede5f5 50%, #f5f0f8 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                }} />
                <div style={{ padding: '16px 18px 20px' }}>
                  <div style={{ height: 20, width: '40%', borderRadius: 999, marginBottom: 12, background: 'linear-gradient(90deg, #f5f0f8 25%, #ede5f5 50%, #f5f0f8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  <div style={{ height: 16, width: '80%', borderRadius: 8, marginBottom: 8, background: 'linear-gradient(90deg, #f5f0f8 25%, #ede5f5 50%, #f5f0f8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  <div style={{ height: 12, width: '100%', borderRadius: 8, marginBottom: 6, background: 'linear-gradient(90deg, #f5f0f8 25%, #ede5f5 50%, #f5f0f8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  <div style={{ height: 12, width: '60%', borderRadius: 8, marginBottom: 20, background: 'linear-gradient(90deg, #f5f0f8 25%, #ede5f5 50%, #f5f0f8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ height: 28, width: '30%', borderRadius: 8, background: 'linear-gradient(90deg, #f5f0f8 25%, #ede5f5 50%, #f5f0f8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                    <div style={{ height: 36, width: '28%', borderRadius: 12, background: 'linear-gradient(90deg, #f5f0f8 25%, #ede5f5 50%, #f5f0f8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem', color: C.ink, marginBottom: 8 }}>
              Nothing found
            </h3>
            <p style={{ fontFamily: 'DM Sans', color: '#aaa', fontSize: 14 }}>
              Try a different category or search term
            </p>
            <button
              onClick={() => { setActive('All'); setSearch(''); }}
              style={{
                marginTop: 16, background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
                color: C.white, border: 'none',
                fontFamily: 'Syne', fontWeight: 700, fontSize: 14,
                padding: '12px 28px', borderRadius: 14, cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(255,107,157,0.3)',
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {filtered.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        )}

        {/* ── Contact strip ── */}
        <div style={{
          marginTop: '4rem',
          background: 'linear-gradient(135deg, ' + C.ink + ', #2D1B4E)',
          borderRadius: 28, padding: '2.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 20,
          boxShadow: '0 24px 64px rgba(26,26,46,0.25)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, background: C.pink + '15', borderRadius: '50%', filter: 'blur(30px)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.3rem', color: C.white, margin: '0 0 6px' }}>
              Need a custom order? 🎨
            </p>
            <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
              Bulk orders, custom designs — just reach out!
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <a href="https://instagram.com/frameonyx" target="_blank" rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #f09433, #dc2743, #bc1888)',
                color: C.white, fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
                padding: '11px 22px', borderRadius: 14, textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(220,39,67,0.3)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              📸 @frameonyx
            </a>
            <a href="https://wa.me/919710194144" target="_blank" rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#25D366', color: C.white,
                fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
                padding: '11px 22px', borderRadius: 14, textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(37,211,102,0.3)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              📱 WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}