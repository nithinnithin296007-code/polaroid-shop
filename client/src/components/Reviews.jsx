import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Star } from 'lucide-react';

const C = {
  pink: '#FF6B9D', yellow: '#FFE135', ink: '#1A1A2E',
  white: '#FFFFFF', cream: '#FAFAF7', green: '#06D6A0',
};

function StarRating({ value, onChange, size = 24 }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1,2,3,4,5].map(star => (
        <Star
          key={star}
          size={size}
          fill={(hovered || value) >= star ? C.yellow : 'none'}
          color={(hovered || value) >= star ? C.yellow : '#ddd'}
          style={{ cursor: onChange ? 'pointer' : 'default', transition: 'all 0.15s' }}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          onClick={() => onChange && onChange(star)}
        />
      ))}
    </div>
  );
}

export default function Reviews({ productId }) {
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [form, setForm] = useState({ name: '', rating: 0, comment: '' });

  useEffect(() => {
    api.get('/reviews/' + productId)
      .then(r => setReviews(r.data))
      .finally(() => setLoading(false));
  }, [productId]);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleSubmit = async () => {
    if (!form.name || !form.rating || !form.comment) return;
    setSubmitting(true);
    try {
      const res = await api.post('/reviews', { ...form, productId });
      setReviews(prev => [res.data, ...prev]);
      setSubmitted(true);
      setShowForm(false);
      setForm({ name: '', rating: 0, comment: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.3rem', color: C.ink, margin: '0 0 6px' }}>
            Reviews {reviews.length > 0 && `(${reviews.length})`}
          </h3>
          {reviews.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StarRating value={Math.round(avgRating)} size={18} />
              <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, color: C.ink }}>
                {avgRating} / 5
              </span>
            </div>
          )}
        </div>
        {!submitted && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: showForm ? C.ink : C.pink,
              color: C.white, border: '2px solid ' + C.ink,
              fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
              padding: '10px 20px', borderRadius: 12, cursor: 'pointer',
              boxShadow: '3px 3px 0 ' + C.ink,
            }}
          >
            {showForm ? '✕ Cancel' : '✍️ Write Review'}
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <div style={{
          background: C.white, border: '2px solid ' + C.ink,
          borderRadius: 20, padding: '1.5rem',
          boxShadow: '4px 4px 0 ' + C.ink, marginBottom: '1.5rem',
        }}>
          <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', color: C.ink, margin: '0 0 1rem' }}>
            Your Review
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input
              placeholder="Your name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={{
                padding: '11px 14px', border: '2px solid #e0e0e0',
                borderRadius: 12, fontFamily: 'DM Sans', fontSize: 14,
                outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = C.pink}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
            <div>
              <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: '#888', marginBottom: 8 }}>
                Rating
              </p>
              <StarRating value={form.rating} onChange={r => setForm({ ...form, rating: r })} size={28} />
            </div>
            <textarea
              placeholder="Share your experience..."
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
              rows={3}
              style={{
                padding: '11px 14px', border: '2px solid #e0e0e0',
                borderRadius: 12, fontFamily: 'DM Sans', fontSize: 14,
                outline: 'none', resize: 'vertical',
              }}
              onFocus={e => e.target.style.borderColor = C.pink}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
            <button
              onClick={handleSubmit}
              disabled={submitting || !form.name || !form.rating || !form.comment}
              style={{
                background: submitting ? '#ccc' : C.pink,
                color: C.white, border: '2px solid ' + C.ink,
                fontFamily: 'Syne', fontWeight: 700, fontSize: 14,
                padding: '12px', borderRadius: 12, cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '3px 3px 0 ' + C.ink,
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Review ⭐'}
            </button>
          </div>
        </div>
      )}

      {submitted && (
        <div style={{
          background: C.green + '20', border: '2px solid ' + C.green,
          borderRadius: 14, padding: '1rem 1.25rem', marginBottom: '1.5rem',
          fontFamily: 'Syne', fontWeight: 700, color: C.ink,
        }}>
          ✅ Thanks for your review!
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <p style={{ fontFamily: 'DM Sans', color: '#aaa', fontSize: 14 }}>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', border: '2px dashed #e0e0e0', borderRadius: 16 }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>⭐</p>
          <p style={{ fontFamily: 'Syne', fontWeight: 700, color: C.ink }}>No reviews yet</p>
          <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#aaa' }}>Be the first to review!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {reviews.map((r, i) => (
            <div key={r._id} style={{
              background: C.white, border: '2px solid ' + C.ink,
              borderRadius: 18, padding: '1.25rem',
              boxShadow: '3px 3px 0 ' + C.ink,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: C.ink, margin: '0 0 4px' }}>
                    {r.name}
                  </p>
                  <StarRating value={r.rating} size={16} />
                </div>
                <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#aaa' }}>
                  {new Date(r.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>
              <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#555', lineHeight: 1.6, margin: 0 }}>
                {r.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}