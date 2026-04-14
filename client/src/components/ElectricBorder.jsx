import { useEffect, useRef } from 'react';

export default function ElectricBorder({
  children, color = '#FF6B9D', speed = 1,
  chaos = 0.12, thickness = 2,
  style = {}, className = '',
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const resize = () => {
      canvas.width  = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const lerp = (a, b, n) => a + (b - a) * n;

    const drawEdge = (points) => {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const mx = (prev.x + curr.x) / 2;
        const my = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    };

    const buildPerimeter = (w, h, segments) => {
      const total = 2 * (w + h);
      const step  = total / segments;
      const pts   = [];
      for (let i = 0; i < segments; i++) {
        const d = i * step;
        let x, y;
        if (d < w)                  { x = d;         y = 0; }
        else if (d < w + h)         { x = w;         y = d - w; }
        else if (d < 2 * w + h)     { x = w - (d - w - h); y = h; }
        else                        { x = 0;         y = h - (d - 2 * w - h); }
        pts.push({ x, y });
      }
      return pts;
    };

    const animate = () => {
      const W = canvas.width;
      const H = canvas.height;
      const r = parseFloat(style.borderRadius || 0);

      ctx.clearRect(0, 0, W, H);

      const segments = 120;
      const base = buildPerimeter(W, H, segments);

      // Add noise/chaos
      const noisy = base.map((p, i) => {
        const angle = t * speed * 2 + i * 0.3;
        const nx = Math.sin(angle * 1.7 + i * 0.5) * chaos * 18;
        const ny = Math.cos(angle * 2.1 + i * 0.7) * chaos * 18;
        return { x: p.x + nx, y: p.y + ny };
      });

      // Glow layers
      const glowLayers = [
        { blur: 18, alpha: 0.25, width: thickness * 4 },
        { blur: 10, alpha: 0.45, width: thickness * 2.5 },
        { blur: 4,  alpha: 0.7,  width: thickness * 1.5 },
        { blur: 0,  alpha: 1.0,  width: thickness },
      ];

      glowLayers.forEach(layer => {
        ctx.save();
        ctx.shadowColor  = color;
        ctx.shadowBlur   = layer.blur;
        ctx.strokeStyle  = color;
        ctx.lineWidth    = layer.width;
        ctx.globalAlpha  = layer.alpha;
        ctx.lineCap      = 'round';
        ctx.lineJoin     = 'round';
        drawEdge([...noisy, noisy[0]]);
        ctx.stroke();
        ctx.restore();
      });

      // Sparks
      if (Math.random() < 0.15) {
        const si = Math.floor(Math.random() * noisy.length);
        const sp = noisy[si];
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur  = 20;
        ctx.fillStyle   = '#fff';
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, thickness * 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      t += 0.016;
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [color, speed, chaos, thickness]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', ...style }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none', zIndex: 2,
          borderRadius: style.borderRadius || 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}