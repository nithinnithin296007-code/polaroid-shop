import { useState, useRef, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, RotateCcw, Plus, Trash2, Sparkles } from 'lucide-react';

const C = {
  pink: '#FF6B9D', yellow: '#FFE135', blue: '#4ECDC4',
  purple: '#A855F7', orange: '#FF8C42', green: '#06D6A0',
  ink: '#1A1A2E', white: '#FFFFFF', cream: '#FAFAF7',
  blush: '#FFD6E7', lavender: '#E8D5FF', mint: '#D5F5EE', butter: '#FFF5CC',
};

const LAYOUTS = [
  { id: '1x1',  label: '1 Photo',  emoji: '🖼️', grid: [[1]],           cols: 1 },
  { id: '1x2',  label: '2 Side',   emoji: '⬛⬛', grid: [[1,2]],         cols: 2 },
  { id: '2x1',  label: '2 Stack',  emoji: '🔲', grid: [[1],[2]],         cols: 1 },
  { id: '2x2',  label: '4 Grid',   emoji: '⊞',  grid: [[1,2],[3,4]],   cols: 2 },
  { id: '3x1',  label: '3 Row',    emoji: '▦',  grid: [[1,2,3]],        cols: 3 },
  { id: 'hero', label: 'Hero',     emoji: '🌟', grid: [[1,1,2],[1,1,3]], cols: 3 },
  { id: '2x3',  label: '6 Grid',   emoji: '⊟',  grid: [[1,2,3],[4,5,6]], cols: 3 },
  { id: 'mix',  label: 'Mix',      emoji: '🎨', grid: [[1,2],[3,3]],    cols: 2 },
];

const BG_COLORS = [
  { color: '#FFFFFF', label: 'White' },
  { color: '#1A1A2E', label: 'Ink' },
  { color: '#FFD6E7', label: 'Blush' },
  { color: '#FFE135', label: 'Yellow' },
  { color: '#D5F5EE', label: 'Mint' },
  { color: '#E8D5FF', label: 'Lavender' },
  { color: '#F3F0E8', label: 'Cream' },
  { color: '#2D2D2D', label: 'Dark' },
];

const GAP_OPTIONS = [0, 4, 8, 16];

export default function CollageBuilder() {
  const { addItem }            = useCart();
  const [layout, setLayout]    = useState(LAYOUTS[3]);
  const [photos, setPhotos]    = useState({});
  const [bgColor, setBgColor]  = useState('#FFFFFF');
  const [gap, setGap]          = useState(4);
  const [added, setAdded]      = useState(false);
  const [dragOver, setDragOver] = useState(null);
  const fileRefs               = useRef({});

  const slotIds = [...new Set(layout.grid.flat())];
  const filledCount = Object.keys(photos).length;

  const handleUpload = (slotId, file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = ev => setPhotos(prev => ({ ...prev, [slotId]: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e, slotId) => {
    e.preventDefault(); setDragOver(null);
    handleUpload(slotId, e.dataTransfer.files[0]);
  }, []);

  const removePhoto = (slotId) => setPhotos(prev => { const n = { ...prev }; delete n[slotId]; return n; });

  const reset = () => setPhotos({});

  const handleAddToCart = () => {
    addItem({
      _id: 'collage-' + Date.now(),
      name: 'Custom Collage Print — ' + layout.label,
      price: 299, category: 'Posters',
      description: layout.label + ' collage with ' + filledCount + ' photos',
      variant: 'collage',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const buildGridStyle = () => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(' + layout.cols + ', 1fr)',
    gridTemplateRows: 'repeat(' + layout.grid.length + ', 1fr)',
    gap, background: bgColor, width: '100%',
    aspectRatio: layout.cols + '/' + layout.grid.length,
    borderRadius: 12, overflow: 'hidden', padding: gap, boxSizing: 'border-box',
  });

  const getCellStyle = (slotId) => {
    let rowStart = null, rowEnd = null, colStart = null, colEnd = null;
    layout.grid.forEach((row, ri) => {
      row.forEach((cell, ci) => {
        if (cell === slotId) {
          if (rowStart === null) rowStart = ri + 1;
          rowEnd = ri + 2;
          if (colStart === null) colStart = ci + 1;
          colEnd = ci + 2;
        }
      });
    });
    return { gridRow: rowStart + ' / ' + rowEnd, gridColumn: colStart + ' / ' + colEnd, position: 'relative', borderRadius: gap > 0 ? 8 : 0, overflow: 'hidden', cursor: 'pointer', minHeight: 120 };
  };

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', background: 'linear-gradient(135deg, #FFF5F8 0%, #FFF0FA 40%, #F5F0FF 70%, #F0FAFF 100%)' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, ' + C.purple + ', ' + C.blue + ')', padding: '3rem 2rem 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: 120, width: 160, height: 160, background: 'rgba(255,255,255,0.08)', borderRadius: '50%', filter: 'blur(30px)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 999, padding: '5px 16px', marginBottom: 14 }}>
            <Sparkles size={13} color={C.white} />
            <span style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 12, color: C.white }}>Create</span>
          </div>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: C.white, margin: '0 0 8px' }}>
            Collage Builder 🎨
          </h1>
          <p style={{ fontFamily: 'DM Sans', color: 'rgba(255,255,255,0.75)', fontSize: 14, margin: 0 }}>
            Pick a layout, upload your photos, and order a beautiful collage print!
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 40, overflow: 'hidden' }}>
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d="M0,40 C300,0 900,40 1200,10 L1200,40 Z" fill="#FFF5F8" />
          </svg>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 2rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

        {/* LEFT — Preview */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.1rem', color: C.ink, margin: 0 }}>Preview — {layout.label}</h2>
              <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#bbb', margin: '4px 0 0' }}>{filledCount}/{slotIds.length} photos added</p>
            </div>
            <button onClick={reset} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', border: 'none', borderRadius: 12,
              background: C.blush, color: C.pink,
              fontFamily: 'Syne', fontWeight: 700, fontSize: 12, cursor: 'pointer',
            }}>
              <RotateCcw size={13} /> Reset
            </button>
          </div>

          {/* Collage Grid */}
          <div style={{ background: C.white, borderRadius: 24, padding: 20, boxShadow: '0 8px 40px rgba(168,85,247,0.12)', border: '1.5px solid rgba(168,85,247,0.15)' }}>
            <div style={buildGridStyle()}>
              {slotIds.map(slotId => (
                <div key={slotId}
                  style={{
                    ...getCellStyle(slotId),
                    background: dragOver === slotId
                      ? 'rgba(255,107,157,0.12)'
                      : photos[slotId] ? 'transparent' : C.blush,
                    border: dragOver === slotId
                      ? '2px dashed ' + C.pink
                      : photos[slotId] ? 'none' : '2px dashed rgba(255,107,157,0.4)',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => !photos[slotId] && fileRefs.current[slotId]?.click()}
                  onDrop={e => handleDrop(e, slotId)}
                  onDragOver={e => { e.preventDefault(); setDragOver(slotId); }}
                  onDragLeave={() => setDragOver(null)}
                >
                  {photos[slotId] ? (
                    <>
                      <img src={photos[slotId]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <button onClick={e => { e.stopPropagation(); removePhoto(slotId); }} style={{
                        position: 'absolute', top: 8, right: 8,
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'rgba(0,0,0,0.55)', border: 'none',
                        color: C.white, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s',
                      }}>
                        <Trash2 size={12} />
                      </button>
                      <button onClick={e => { e.stopPropagation(); fileRefs.current[slotId]?.click(); }} style={{
                        position: 'absolute', bottom: 8, right: 8,
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.85)', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Plus size={13} color={C.ink} />
                      </button>
                    </>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 6, padding: 12 }}>
                      <span style={{ fontSize: 26 }}>📷</span>
                      <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: C.pink, textAlign: 'center', margin: 0, fontWeight: 600 }}>Photo {slotId}</p>
                    </div>
                  )}
                  <input ref={el => fileRefs.current[slotId] = el} type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => handleUpload(slotId, e.target.files[0])} />
                </div>
              ))}
            </div>
          </div>

          {/* Add to cart */}
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <button onClick={handleAddToCart} disabled={filledCount === 0} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: added
                ? 'linear-gradient(135deg, ' + C.green + ', #04a97d)'
                : filledCount === 0
                  ? '#e0e0e0'
                  : 'linear-gradient(135deg, ' + C.purple + ', ' + C.blue + ')',
              border: 'none', color: filledCount === 0 ? '#aaa' : C.white,
              fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem',
              padding: '14px 36px', borderRadius: 16,
              cursor: filledCount === 0 ? 'not-allowed' : 'pointer',
              boxShadow: filledCount === 0 ? 'none' : added
                ? '0 8px 24px rgba(6,214,160,0.35)'
                : '0 8px 32px rgba(168,85,247,0.35)',
              transition: 'all 0.3s',
            }}>
              <ShoppingBag size={18} />
              {added ? '✓ Added to Cart!' : 'Order Collage Print — ₹299'}
            </button>
          </div>
        </div>

        {/* RIGHT — Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Layout picker */}
          <div style={{ background: C.white, borderRadius: 20, padding: '1.5rem', boxShadow: '0 4px 24px rgba(168,85,247,0.1)', border: '1.5px solid rgba(168,85,247,0.15)' }}>
            <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, marginBottom: '1rem', color: C.ink }}>🗂️ Layout</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {LAYOUTS.map(l => (
                <button key={l.id} onClick={() => { setLayout(l); setPhotos({}); }} style={{
                  padding: '10px 8px', borderRadius: 12,
                  border: '1.5px solid ' + (layout.id === l.id ? C.purple : '#f0f0f0'),
                  background: layout.id === l.id ? C.lavender : '#fafafa',
                  fontFamily: 'Syne', fontWeight: 700, fontSize: 12,
                  cursor: 'pointer', transition: 'all 0.2s',
                  color: layout.id === l.id ? C.purple : '#888',
                  boxShadow: layout.id === l.id ? '0 4px 12px rgba(168,85,247,0.2)' : 'none',
                }}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Background color */}
          <div style={{ background: C.white, borderRadius: 20, padding: '1.5rem', boxShadow: '0 4px 24px rgba(168,85,247,0.1)', border: '1.5px solid rgba(168,85,247,0.15)' }}>
            <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, marginBottom: '1rem', color: C.ink }}>🎨 Background</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {BG_COLORS.map(({ color, label }) => (
                <button key={color} onClick={() => setBgColor(color)} title={label} style={{
                  width: 36, height: 36, borderRadius: '50%', background: color,
                  cursor: 'pointer',
                  border: bgColor === color ? '3px solid ' + C.purple : '2px solid #e0e0e0',
                  boxShadow: bgColor === color ? '0 0 0 3px rgba(168,85,247,0.25)' : 'none',
                  transition: 'all 0.2s',
                }} />
              ))}
            </div>
          </div>

          {/* Gap */}
          <div style={{ background: C.white, borderRadius: 20, padding: '1.5rem', boxShadow: '0 4px 24px rgba(168,85,247,0.1)', border: '1.5px solid rgba(168,85,247,0.15)' }}>
            <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, marginBottom: '1rem', color: C.ink }}>↔️ Photo Gap</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {GAP_OPTIONS.map(g => (
                <button key={g} onClick={() => setGap(g)} style={{
                  flex: 1, padding: '9px 4px', borderRadius: 12,
                  border: '1.5px solid ' + (gap === g ? C.purple : '#f0f0f0'),
                  background: gap === g ? C.lavender : '#fafafa',
                  fontFamily: 'Syne', fontWeight: 700, fontSize: 12,
                  cursor: 'pointer', color: gap === g ? C.purple : '#888',
                  transition: 'all 0.2s',
                }}>
                  {g === 0 ? 'None' : g + 'px'}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div style={{ background: 'linear-gradient(135deg, ' + C.lavender + ', ' + C.mint + ')', borderRadius: 20, padding: '1.5rem', border: '1.5px solid rgba(168,85,247,0.2)' }}>
            <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1rem', color: C.ink, margin: '0 0 6px' }}>🖼️ Collage Print — ₹299</p>
            <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#555', margin: 0, lineHeight: 1.6 }}>
              A4 size · Premium matte paper · Free shipping on all orders!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}