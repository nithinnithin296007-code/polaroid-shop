import { useRef, useState } from 'react';

export default function TiltedCard({
  imageSrc, altText = '', captionText = '',
  containerHeight = '300px', containerWidth = '300px',
  imageHeight = '300px', imageWidth = '300px',
  rotateAmplitude = 12, scaleOnHover = 1.05,
  showTooltip = true, displayOverlayContent = false,
  overlayContent = null,
}) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -rotateAmplitude;
    const rotateY = ((x - cx) / cx) * rotateAmplitude;
    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scaleOnHover})`);
    setTooltipPos({ x: x + 12, y: y - 28 });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)');
    setIsHovered(false);
  };

  const handleMouseEnter = () => setIsHovered(true);

  return (
    <div style={{ width: containerWidth, height: containerHeight, position: 'relative', cursor: 'pointer' }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '100%', height: '100%',
          transform: transform || `perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)`,
          transition: isHovered ? 'transform 0.05s ease-out' : 'transform 0.4s ease-out',
          transformStyle: 'preserve-3d',
          borderRadius: 20,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: isHovered
            ? '0 30px 60px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.15)'
            : '0 10px 30px rgba(0,0,0,0.12)',
        }}
      >
        <img
          src={imageSrc}
          alt={altText}
          style={{ width: imageWidth, height: imageHeight, objectFit: 'cover', display: 'block' }}
        />

        {/* Shine effect */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
          pointerEvents: 'none',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s',
        }} />

        {/* Overlay content */}
        {displayOverlayContent && overlayContent && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
            padding: '2rem 1rem 1rem',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s',
          }}>
            {overlayContent}
          </div>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && isHovered && captionText && (
        <div style={{
          position: 'absolute',
          left: tooltipPos.x, top: tooltipPos.y,
          background: 'rgba(26,26,46,0.9)',
          color: '#fff', borderRadius: 8,
          padding: '4px 10px', fontSize: 12,
          fontFamily: 'DM Sans', fontWeight: 600,
          pointerEvents: 'none', zIndex: 100,
          whiteSpace: 'nowrap', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          {captionText}
        </div>
      )}
    </div>
  );
}