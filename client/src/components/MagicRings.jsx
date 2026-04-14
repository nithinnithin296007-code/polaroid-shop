import { useEffect, useRef } from 'react';

export default function MagicRings() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let mouse = { x: canvas.offsetWidth / 2, y: canvas.offsetHeight / 2 };

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', onMouseMove);

    const rings = [
      { radius: 120, speed: 0.004, angle: 0,           color: '#FF6B9D', width: 2.5, dash: [18, 10] },
      { radius: 190, speed: -0.003, angle: Math.PI/4,  color: '#4ECDC4', width: 2,   dash: [10, 14] },
      { radius: 260, speed: 0.002,  angle: Math.PI/3,  color: '#FFE135', width: 2,   dash: [24, 8]  },
      { radius: 330, speed: -0.0015,angle: Math.PI/6,  color: '#A855F7', width: 1.5, dash: [6, 18]  },
      { radius: 400, speed: 0.001,  angle: Math.PI/2,  color: '#FF8C42', width: 1.5, dash: [30, 12] },
    ];

    // Glowing orbs on rings
    const orbs = rings.map((r, i) => ({
      ringIndex: i,
      orbAngle: Math.random() * Math.PI * 2,
      size: 4 + i * 1.5,
    }));

    const cx = () => canvas.width  / 2;
    const cy = () => canvas.height / 2;

    const lerp = (a, b, t) => a + (b - a) * t;
    let targetX = cx(), targetY = cy();
    let currentX = cx(), currentY = cy();

    const onMouseMoveGlobal = (e) => {
      const rect = canvas.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', onMouseMoveGlobal);

    const draw = () => {
      animId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth follow
      currentX = lerp(currentX, targetX, 0.04);
      currentY = lerp(currentY, targetY, 0.04);

      const offsetX = (currentX - cx()) * 0.08;
      const offsetY = (currentY - cy()) * 0.08;
      const originX = cx() + offsetX;
      const originY = cy() + offsetY;

      rings.forEach((ring, i) => {
        ring.angle += ring.speed;

        ctx.save();
        ctx.translate(originX, originY);
        ctx.rotate(ring.angle);

        // Outer glow
        ctx.shadowColor = ring.color;
        ctx.shadowBlur  = 18;
        ctx.strokeStyle = ring.color;
        ctx.lineWidth   = ring.width;
        ctx.globalAlpha = 0.4;
        ctx.setLineDash(ring.dash);
        ctx.lineDashOffset = -ring.angle * ring.radius;

        ctx.beginPath();
        ctx.ellipse(0, 0, ring.radius, ring.radius * 0.38, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Inner solid arc (partial)
        ctx.globalAlpha  = 0.12;
        ctx.shadowBlur   = 0;
        ctx.setLineDash([]);
        ctx.lineWidth    = ring.width * 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, ring.radius, ring.radius * 0.38, 0, ring.angle, ring.angle + Math.PI * 0.6);
        ctx.stroke();

        ctx.restore();

        // Orb on ring
        const orb = orbs[i];
        orb.orbAngle += ring.speed * 2.5;
        const orbX = originX + Math.cos(orb.orbAngle) * ring.radius;
        const orbY = originY + Math.sin(orb.orbAngle) * ring.radius * 0.38;

        ctx.save();
        ctx.shadowColor = ring.color;
        ctx.shadowBlur  = 24;
        ctx.fillStyle   = ring.color;
        ctx.globalAlpha = 0.95;
        ctx.beginPath();
        ctx.arc(orbX, orbY, orb.size, 0, Math.PI * 2);
        ctx.fill();

        // Orb inner white dot
        ctx.fillStyle   = '#fff';
        ctx.globalAlpha = 0.7;
        ctx.shadowBlur  = 0;
        ctx.beginPath();
        ctx.arc(orbX, orbY, orb.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Center glow pulse
      const pulse = Math.sin(Date.now() * 0.002) * 0.3 + 0.7;
      const grad  = ctx.createRadialGradient(originX, originY, 0, originX, originY, 60);
      grad.addColorStop(0,   `rgba(255,107,157,${0.25 * pulse})`);
      grad.addColorStop(0.5, `rgba(78,205,196,${0.1 * pulse})`);
      grad.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle   = grad;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(originX, originY, 60, 0, Math.PI * 2);
      ctx.fill();
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousemove', onMouseMoveGlobal);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'all',
        zIndex: 1,
      }}
    />
  );
}