import { useState, useRef, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { Upload, ShoppingBag, RotateCcw, Image, Sparkles } from 'lucide-react';

const C = {
  pink: '#FF6B9D', yellow: '#FFE135', blue: '#4ECDC4',
  purple: '#A855F7', orange: '#FF8C42', green: '#06D6A0',
  ink: '#1A1A2E', white: '#FFFFFF', cream: '#FAFAF7',
  blush: '#FFD6E7', lavender: '#E8D5FF', mint: '#D5F5EE', butter: '#FFF5CC',
};

const FILTERS = [
  { name: 'Original',  filter: 'none' },
  { name: 'Vintage',   filter: 'sepia(0.8) contrast(1.1) brightness(1.05)' },
  { name: 'Faded',     filter: 'saturate(0.6) brightness(1.15) contrast(0.9)' },
  { name: 'Noir',      filter: 'grayscale(1) contrast(1.2)' },
  { name: 'Warm',      filter: 'saturate(1.4) sepia(0.3) brightness(1.05)' },
  { name: 'Cool',      filter: 'saturate(1.2) hue-rotate(20deg) brightness(1.05)' },
  { name: 'Drama',     filter: 'contrast(1.4) saturate(1.3) brightness(0.9)' },
  { name: 'Dreamy',    filter: 'brightness(1.1) saturate(0.8) blur(0.5px)' },
  { name: 'Retro',     filter: 'sepia(0.5) saturate(1.5) contrast(1.1)' },
  { name: 'Neon',      filter: 'saturate(2) brightness(1.1) contrast(1.2)' },
];

const BORDERS = [
  { name: 'Classic White', style: { padding: '16px 16px 48px', background: '#fff', borderRadius: 4 }},
  { name: 'Thick White',   style: { padding: '24px 24px 64px', background: '#fff', borderRadius: 4 }},
  { name: 'Black',         style: { padding: '16px 16px 48px', background: '#111', borderRadius: 4 }},
  { name: 'Pink',          style: { padding: '16px 16px 48px', background: C.pink, borderRadius: 4 }},
  { name: 'Yellow',        style: { padding: '16px 16px 48px', background: C.yellow, borderRadius: 4 }},
  { name: 'Rounded',       style: { padding: '16px 16px 48px', background: '#fff', borderRadius: 20 }},
  { name: 'No Border',     style: { padding: 0, background: 'transparent', borderRadius: 8 }},
];

const STICKER_LIST = ['✨','💖','🌟','🎉','🔥','🌈','💫','🎨','📸','🌸','🦋','💎','🎭','🌙','⭐'];
const CAPTION_FONTS = ['Syne', 'DM Sans', 'Georgia', 'Courier New', 'Arial'];

const FILTER_EMOJIS = {
  Original:'🖼️', Vintage:'🕰️', Faded:'🌫️', Noir:'🎭',
  Warm:'☀️', Cool:'❄️', Drama:'⚡', Dreamy:'💭', Retro:'📻', Neon:'🌈',
};

export default function PolaroidEditor() {
  const { addItem } = useCart();
  const [image, setImage]             = useState(null);
  const [filter, setFilter]           = useState(FILTERS[0]);
  const [border, setBorder]           = useState(BORDERS[0]);
  const [caption, setCaption]         = useState('My Memory ✨');
  const [captionFont, setCaptionFont] = useState('Syne');
  const [captionColor, setCaptionColor] = useState('#1A1A2E');
  const [stickers, setStickers]       = useState([]);
  const [activeTab, setActiveTab]     = useState('filters');
  const [added, setAdded]             = useState(false);
  const previewRef = useRef(null);
  const fileRef    = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = ev => setImage(ev.target.result);
    reader.readAsDataURL(file);
  }, []);

  const addSticker = (emoji) => setStickers(prev => [...prev, {
    id: Date.now(), emoji,
    x: 40 + Math.random() * 120,
    y: 40 + Math.random() * 120,
    size: 32,
  }]);

  const handleStickerDrag = (id, e) => {
    e.preventDefault();
    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) return;
    const move = (me) => setStickers(prev => prev.map(s =>
      s.id === id ? { ...s, x: me.clientX - rect.left - 16, y: me.clientY - rect.top - 16 } : s
    ));
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  const removeSticker = (id) => setStickers(prev => prev.filter(s => s.id !== id));

  const reset = () => {
    setImage(null); setFilter(FILTERS[0]); setBorder(BORDERS[0]);
    setCaption('My Memory ✨'); setStickers([]);
  };

  const handleAddToCart = () => {
    addItem({
      _id: 'custom-polaroid-' + Date.now(),
      name: 'Custom Polaroid — ' + caption,
      price: 179, category: 'Polaroids',
      description: 'Custom polaroid with ' + filter.name + ' filter, ' + border.name + ' border',
      variant: 'custom', image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const tabs = [
    { id: 'filters',  label: 'Filters',  emoji: '🎨' },
    { id: 'borders',  label: 'Borders',  emoji: '🖼️' },
    { id: 'stickers', label: 'Stickers', emoji: '✨' },
    { id: 'text',     label: 'Text',     emoji: '✍️' },
  ];

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', background: 'linear-gradient(135deg, #FFF5F8 0%, #FFF0FA 40%, #F5F0FF 70%, #F0FAFF 100%)' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')', padding: '3rem 2rem 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: 120, width: 160, height: 160, background: 'rgba(255,255,255,0.08)', borderRadius: '50%', filter: 'blur(30px)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 999, padding: '5px 16px', marginBottom: 14 }}>
            <Sparkles size={13} color={C.white} />
            <span style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 12, color: C.white }}>Create</span>
          </div>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: C.white, margin: '0 0 8px' }}>
            Polaroid Editor 📸
          </h1>
          <p style={{ fontFamily: 'DM Sans', color: 'rgba(255,255,255,0.75)', fontSize: 14, margin: 0 }}>
            Upload your photo, customize it, and order your custom polaroid!
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 40, overflow: 'hidden' }}>
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d="M0,40 C300,0 900,40 1200,10 L1200,40 Z" fill="#FFF5F8" />
          </svg>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 2rem', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>

        {/* LEFT — Preview */}
        <div>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.25rem', color: C.ink }}>Preview</h2>

          {!image ? (
            <div
              onDrop={handleDrop} onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              style={{
                border: '2.5px dashed ' + C.pink, borderRadius: 24,
                padding: '6rem 2rem', textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(255,107,157,0.04)',
                transition: 'all 0.2s',
                boxShadow: '0 4px 24px rgba(255,107,157,0.08)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,157,0.09)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,107,157,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,107,157,0.04)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(255,107,157,0.08)'; }}
            >
              <div style={{ fontSize: 64, marginBottom: 16 }}>📸</div>
              <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.2rem', color: C.ink, marginBottom: 8 }}>Drop your photo here</p>
              <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#aaa' }}>or click to browse — JPG, PNG, WEBP</p>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              {/* Polaroid */}
              <div style={{ background: C.white, borderRadius: 24, padding: '2rem', boxShadow: '0 20px 60px rgba(255,107,157,0.15)', border: '1.5px solid rgba(255,107,157,0.15)', display: 'flex', justifyContent: 'center' }}>
                <div ref={previewRef} style={{ ...border.style, position: 'relative', boxShadow: '0 12px 40px rgba(0,0,0,0.15)', display: 'inline-block', userSelect: 'none', maxWidth: 300 }}>
                  <img src={image} alt="polaroid" style={{ width: 260, height: 260, objectFit: 'cover', display: 'block', filter: filter.filter, borderRadius: border.style.borderRadius > 4 ? 12 : 2 }} />
                  {stickers.map(s => (
                    <div key={s.id} onMouseDown={e => handleStickerDrag(s.id, e)} onDoubleClick={() => removeSticker(s.id)}
                      title="Double-click to remove"
                      style={{ position: 'absolute', left: s.x, top: s.y, fontSize: s.size, cursor: 'grab', userSelect: 'none', zIndex: 10, lineHeight: 1 }}>
                      {s.emoji}
                    </div>
                  ))}
                  {caption && border.name !== 'No Border' && (
                    <div style={{ textAlign: 'center', paddingTop: 10, fontFamily: captionFont, fontWeight: 600, fontSize: 14, color: captionColor }}>
                      {caption}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button onClick={() => fileRef.current?.click()} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: C.white, border: '1.5px solid rgba(0,0,0,0.1)',
                  fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
                  padding: '10px 20px', borderRadius: 12, cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.07)', color: C.ink,
                  transition: 'box-shadow 0.2s',
                }}>
                  <Image size={15} color={C.pink} /> Change Photo
                </button>
                <button onClick={reset} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: C.blush, border: '1.5px solid rgba(255,107,157,0.2)',
                  fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
                  padding: '10px 20px', borderRadius: 12, cursor: 'pointer',
                  color: C.pink, transition: 'background 0.2s',
                }}>
                  <RotateCcw size={15} /> Reset
                </button>
                <button onClick={handleAddToCart} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: added
                    ? 'linear-gradient(135deg, ' + C.green + ', #04a97d)'
                    : 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
                  border: 'none', color: C.white,
                  fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
                  padding: '10px 24px', borderRadius: 12, cursor: 'pointer',
                  boxShadow: added ? '0 4px 16px rgba(6,214,160,0.35)' : '0 4px 16px rgba(255,107,157,0.35)',
                  transition: 'all 0.3s',
                }}>
                  <ShoppingBag size={15} />
                  {added ? '✓ Added to Cart!' : 'Add to Cart — ₹179'}
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </div>
          )}
        </div>

        {/* RIGHT — Controls */}
        <div style={{ background: C.white, borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 40px rgba(255,107,157,0.12)', border: '1.5px solid rgba(255,107,157,0.15)' }}>

          {/* Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1.5px solid rgba(255,107,157,0.15)' }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: '14px 4px', border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid ' + C.pink : '3px solid transparent',
                background: activeTab === tab.id ? C.blush : C.white,
                color: activeTab === tab.id ? C.pink : '#aaa',
                fontFamily: 'Syne', fontWeight: 700, fontSize: 11,
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
                <span style={{ fontSize: 16 }}>{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '1.5rem' }}>

            {/* FILTERS */}
            {activeTab === 'filters' && (
              <div>
                <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, marginBottom: '1rem', color: C.ink }}>Choose a Filter</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  {FILTERS.map(f => (
                    <button key={f.name} onClick={() => setFilter(f)} style={{
                      padding: '10px 8px', borderRadius: 14,
                      border: '1.5px solid ' + (filter.name === f.name ? C.pink : '#f0f0f0'),
                      background: filter.name === f.name
                        ? 'linear-gradient(135deg, ' + C.blush + ', ' + C.lavender + ')'
                        : '#fafafa',
                      fontFamily: 'Syne', fontWeight: 700, fontSize: 12,
                      cursor: 'pointer', transition: 'all 0.2s',
                      color: filter.name === f.name ? C.pink : '#888',
                      boxShadow: filter.name === f.name ? '0 4px 12px rgba(255,107,157,0.2)' : 'none',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    }}>
                      <span style={{ fontSize: 18 }}>{FILTER_EMOJIS[f.name]}</span>
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* BORDERS */}
            {activeTab === 'borders' && (
              <div>
                <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, marginBottom: '1rem', color: C.ink }}>Choose a Border</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {BORDERS.map(b => (
                    <button key={b.name} onClick={() => setBorder(b)} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px', borderRadius: 14,
                      border: '1.5px solid ' + (border.name === b.name ? C.pink : '#f0f0f0'),
                      background: border.name === b.name ? C.blush : '#fafafa',
                      cursor: 'pointer', transition: 'all 0.2s',
                      boxShadow: border.name === b.name ? '0 4px 12px rgba(255,107,157,0.15)' : 'none',
                    }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: b.style.background || '#fff', border: '1.5px solid #e0e0e0', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                      <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: border.name === b.name ? C.pink : '#888' }}>{b.name}</span>
                      {border.name === b.name && <span style={{ marginLeft: 'auto', fontSize: 16 }}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STICKERS */}
            {activeTab === 'stickers' && (
              <div>
                <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, marginBottom: 4, color: C.ink }}>Tap to Add Stickers</p>
                <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#bbb', marginBottom: '1rem' }}>Drag to reposition · Double-click to remove</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                  {STICKER_LIST.map(emoji => (
                    <button key={emoji} onClick={() => addSticker(emoji)} style={{
                      fontSize: 26, padding: '10px 6px', borderRadius: 14,
                      border: '1.5px solid #f0f0f0', background: C.blush,
                      cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s',
                      boxShadow: '0 2px 8px rgba(255,107,157,0.1)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,107,157,0.25)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,107,157,0.1)'; }}>
                      {emoji}
                    </button>
                  ))}
                </div>
                {stickers.length > 0 && (
                  <button onClick={() => setStickers([])} style={{
                    marginTop: '1rem', width: '100%', padding: '10px',
                    border: '1.5px solid #ffe0e0', borderRadius: 12,
                    background: '#fff8f8', fontFamily: 'Syne', fontWeight: 700,
                    fontSize: 12, cursor: 'pointer', color: '#e74c3c',
                    transition: 'background 0.2s',
                  }}>
                    🗑️ Clear All Stickers ({stickers.length})
                  </button>
                )}
              </div>
            )}

            {/* TEXT */}
            {activeTab === 'text' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Caption Text</label>
                  <input value={caption} onChange={e => setCaption(e.target.value)} maxLength={40} placeholder="Your caption..."
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #f0f0f0', borderRadius: 12, fontFamily: 'DM Sans', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#fafafa', transition: 'all 0.2s' }}
                    onFocus={e => { e.target.style.borderColor = C.pink; e.target.style.background = '#FFF5F8'; e.target.style.boxShadow = '0 0 0 4px rgba(255,107,157,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#f0f0f0'; e.target.style.background = '#fafafa'; e.target.style.boxShadow = 'none'; }}
                  />
                  <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#ccc', marginTop: 4 }}>{caption.length}/40</p>
                </div>

                <div>
                  <label style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Font</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {CAPTION_FONTS.map(f => (
                      <button key={f} onClick={() => setCaptionFont(f)} style={{
                        padding: '9px 14px', borderRadius: 12, textAlign: 'left',
                        border: '1.5px solid ' + (captionFont === f ? C.pink : '#f0f0f0'),
                        background: captionFont === f ? C.blush : '#fafafa',
                        fontFamily: f, fontSize: 14, cursor: 'pointer',
                        color: captionFont === f ? C.pink : '#888',
                        transition: 'all 0.2s',
                      }}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>Caption Color</label>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {[C.ink, C.white, C.pink, C.yellow, C.blue, C.purple].map(color => (
                      <button key={color} onClick={() => setCaptionColor(color)} style={{
                        width: 34, height: 34, borderRadius: '50%', background: color,
                        cursor: 'pointer',
                        border: captionColor === color ? '3px solid ' + C.pink : '2px solid #e0e0e0',
                        boxShadow: captionColor === color ? '0 0 0 3px rgba(255,107,157,0.3)' : 'none',
                        transition: 'all 0.2s',
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pricing strip */}
          <div style={{ margin: '0 1.5rem 1.5rem', background: 'linear-gradient(135deg, ' + C.blush + ', ' + C.lavender + ')', borderRadius: 16, padding: '1rem 1.25rem' }}>
            <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1rem', color: C.ink, margin: '0 0 4px' }}>📸 Custom Polaroid — ₹179</p>
            <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#666', margin: 0 }}>Premium glossy print · Free shipping</p>
          </div>
        </div>
      </div>
    </div>
  );
}