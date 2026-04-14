import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Star } from 'lucide-react';
import TiltedCard from './TiltedCard';

const tagColors = ['bg-candy-pink', 'bg-candy-yellow', 'bg-candy-blue', 'bg-candy-purple', 'bg-candy-orange', 'bg-candy-green'];

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const tagColor = tagColors[index % tagColors.length];

  return (
    <div
      className="polaroid-tilt bg-white border-2 border-ink rounded-2xl overflow-hidden shadow-[4px_4px_0px_#1A1A2E] hover:shadow-[8px_8px_0px_#1A1A2E] transition-all duration-300 cursor-pointer group"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image */}
      {/* Image with TiltedCard */}
<Link to={`/product/${product._id}`}>
  <div style={{ position: 'relative' }}>
    <TiltedCard
      imageSrc={product.image || `https://picsum.photos/seed/${product._id}/400/300`}
      altText={product.name}
      captionText={product.name}
      containerHeight="224px"
      containerWidth="100%"
      imageHeight="224px"
      imageWidth="100%"
      rotateAmplitude={12}
      scaleOnHover={1.05}
      showTooltip={false}
      displayOverlayContent={false}
    />
    {product.badge && (
      <span className={`absolute top-3 left-3 z-10 ${tagColor} text-ink text-xs font-display font-700 px-3 py-1 rounded-full border-2 border-ink`}>
        {product.badge}
      </span>
    )}
  </div>
</Link>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <Link to={`/product/${product._id}`}>
            <h3 className="font-display font-700 text-base leading-tight hover:text-candy-pink transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 text-xs text-amber-500 mt-0.5">
            <Star size={12} fill="currentColor" />
            <span className="font-body font-500">{product.rating || '4.8'}</span>
          </div>
        </div>
        <p className="text-xs font-body text-gray-500 mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-display font-800 text-lg">₹{product.price}</span>
          <button
            onClick={() => addItem({ ...product, variant: 'default' })}
            className={`${tagColor} border-2 border-ink text-ink text-sm font-display font-700 px-3 py-1.5 rounded-xl flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform shadow-[2px_2px_0px_#1A1A2E]`}
          >
            <ShoppingBag size={14} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}