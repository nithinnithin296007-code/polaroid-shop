import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowLeft, Star } from 'lucide-react';
import api from '../utils/api';
import Reviews from '../components/Reviews';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [variant, setVariant] = useState('default');

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="pt-24 min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-candy-pink border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return null;

  return (
    <div className="pt-24 pb-20 max-w-5xl mx-auto px-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-body mb-8 hover:text-candy-pink transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="bg-white border-2 border-ink rounded-3xl overflow-hidden shadow-[6px_6px_0px_#1A1A2E]">
          <img
            src={product.image || `https://picsum.photos/seed/${product._id}/600/500`}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div>
          {product.badge && (
            <span className="inline-block bg-candy-yellow border-2 border-ink text-ink text-xs font-display font-700 px-3 py-1 rounded-full mb-4 shadow-[2px_2px_0px_#1A1A2E]">
              {product.badge}
            </span>
          )}
          <h1 className="text-4xl font-display font-800 mb-3">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="text-amber-400" fill="currentColor" />
            ))}
            <span className="text-sm font-body text-gray-500">{product.rating} rating</span>
          </div>
          <p className="text-gray-600 font-body leading-relaxed mb-6">{product.description}</p>
          <div className="text-4xl font-display font-800 mb-8">₹{product.price}</div>

          <button
            onClick={() => addItem({ ...product, variant })}
            className="w-full flex items-center justify-center gap-3 bg-candy-pink border-2 border-ink text-white font-display font-700 py-4 rounded-2xl shadow-[4px_4px_0px_#1A1A2E] hover:shadow-[6px_6px_0px_#1A1A2E] hover:-translate-y-0.5 transition-all text-lg"
          >
            <ShoppingBag size={22} /> Add to Cart
          </button>

          <div className="mt-6 p-4 bg-candy-yellow/30 border-2 border-ink rounded-2xl">
            <p className="text-sm font-body">🚚 <strong>Free delivery</strong> across India</p>
            <p className="text-sm font-body mt-1">🎨 <strong>Custom prints</strong> available on request</p>
            <p className="text-sm font-body mt-1">📦 <strong>2–4 days</strong> dispatch time</p>
          </div>
        </div>
    </div>

      {/* Reviews */}
      <Reviews productId={product._id} />

    </div>
  );
}