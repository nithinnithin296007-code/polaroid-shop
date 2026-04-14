import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

const vert = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}`;

const frag = `
precision highp float;
varying vec2 vUv;
uniform vec2  uMouse;
uniform vec2  uResolution;
uniform float uTime;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform float uAngle;
uniform float uNoise;
uniform int   uBlindCount;
uniform float uBlindMinWidth;
uniform float uSpotlightRadius;
uniform float uSpotlightSoftness;
uniform float uSpotlightOpacity;
uniform float uDistort;

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = rand(i);
  float b = rand(i + vec2(1,0));
  float c = rand(i + vec2(0,1));
  float d = rand(i + vec2(1,1));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(a, b, u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
}

void main() {
  vec2 uv = vUv;
  vec2 mouse = uMouse;

  // Angle rotation
  float a = uAngle * 3.14159 / 180.0;
  vec2 dir = vec2(cos(a), sin(a));
  float proj = dot(uv - 0.5, dir) + 0.5;

  // Blind bands
  float blindW = 1.0 / float(uBlindCount);
  float band = floor(proj / blindW);
  float localT = fract(proj / blindW);

  // Noise per band
  float n = noise(vec2(band * 0.3, uTime * 0.1)) * uNoise;
  localT = clamp(localT + n, 0.0, 1.0);

  // Gradient along band
  vec3 color = mix(uColor1, uColor2, localT);

  // Spotlight from mouse
  vec2 mouseUv = vec2(mouse.x, 1.0 - mouse.y);
  float dist = length(uv - mouseUv);
  float spotlight = 1.0 - smoothstep(
    uSpotlightRadius - uSpotlightSoftness * 0.5,
    uSpotlightRadius + uSpotlightSoftness * 0.5,
    dist
  );
  color += spotlight * uSpotlightOpacity * 0.35 * vec3(1.0, 0.9, 1.0);

  gl_FragColor = vec4(color, 1.0);
}`;

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16)/255;
  const g = parseInt(hex.slice(3,5),16)/255;
  const b = parseInt(hex.slice(5,7),16)/255;
  return [r,g,b];
}

export default function GradientBlinds({
  gradientColors = ['#FF9FFC','#5227FF'],
  angle = 0,
  noise = 0.3,
  blindCount = 12,
  spotlightRadius = 0.5,
  spotlightSoftness = 1,
  spotlightOpacity = 1,
  mouseDampening = 0.15,
  distortAmount = 0,
}) {
  const canvasRef   = useRef(null);
  const mouseRef    = useRef({ x: 0.5, y: 0.5 });
  const targetRef   = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new Renderer({ canvas, alpha: false, antialias: true });
    const gl = renderer.gl;

    const resize = () => renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    resize();
    window.addEventListener('resize', resize);

    const geometry = new Triangle(gl);
    const program  = new Program(gl, {
      vertex: vert, fragment: frag,
      uniforms: {
        uMouse:           { value: [0.5, 0.5] },
        uResolution:      { value: [canvas.offsetWidth, canvas.offsetHeight] },
        uTime:            { value: 0 },
        uColor1:          { value: hexToRgb(gradientColors[0]) },
        uColor2:          { value: hexToRgb(gradientColors[1]) },
        uAngle:           { value: angle },
        uNoise:           { value: noise },
        uBlindCount:      { value: blindCount },
        uBlindMinWidth:   { value: 50 },
        uSpotlightRadius: { value: spotlightRadius },
        uSpotlightSoftness: { value: spotlightSoftness },
        uSpotlightOpacity:  { value: spotlightOpacity },
        uDistort:         { value: distortAmount },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      targetRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top)  / rect.height,
      };
    };
    window.addEventListener('mousemove', handleMouse);

    let animId;
    const loop = (t) => {
      animId = requestAnimationFrame(loop);
      // Smooth mouse
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * mouseDampening;
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * mouseDampening;
      program.uniforms.uMouse.value     = [mouseRef.current.x, mouseRef.current.y];
      program.uniforms.uTime.value      = t * 0.001;
      program.uniforms.uResolution.value = [canvas.offsetWidth, canvas.offsetHeight];
      renderer.render({ scene: mesh });
    };
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0,
      display: 'block',
    }} />
  );
}