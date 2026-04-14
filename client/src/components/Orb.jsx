import { useEffect, useRef } from "react";
import { Renderer, Camera, Geometry, Program, Mesh } from "ogl";

const vertexShader = `
attribute vec2 uv;
attribute vec3 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;
uniform float uTime;
uniform float uHue;
uniform float uHoverIntensity;
uniform bool uHovered;
varying vec2 vUv;

vec3 hsl2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float dist = length(uv);

  if (dist > 1.0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float intensity = uHovered ? uHoverIntensity : 1.0;
  float t = uTime * 0.4;

  // Swirling noise
  float angle = atan(uv.y, uv.x);
  float swirl = sin(angle * 4.0 + t * 2.0) * 0.5 + 0.5;
  float ripple = sin(dist * 10.0 - t * 3.0) * 0.5 + 0.5;

  float hue = uHue / 360.0 + swirl * 0.06 + ripple * 0.02;

  float sat = 0.75 + ripple * 0.2 * intensity;
  float lit = 0.45 + swirl * 0.2 * intensity;

  // Edge fade
  float edge = 1.0 - smoothstep(0.75, 1.0, dist);
  // Inner glow
  float inner = smoothstep(0.5, 0.0, dist) * 0.6 * intensity;

  vec3 col = hsl2rgb(vec3(hue, sat, lit + inner));

  // Specular highlight
  vec2 light = vec2(-0.4, 0.5);
  float spec = pow(max(0.0, dot(normalize(vec3(uv, sqrt(max(0.0, 1.0 - dot(uv,uv))))), normalize(vec3(light, 0.8)))), 12.0);
  col += vec3(spec * 0.5 * intensity);

  gl_FragColor = vec4(col * edge, edge * 0.97);
}
`;

export default function Orb({
  hue = 0,
  hoverIntensity = 2,
  rotateOnHover = true,
  forceHoverState = false,
}) {
  const containerRef = useRef(null);
  const hoveredRef   = useRef(forceHoverState);
  const rotRef       = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;

    const renderer = new Renderer({ alpha: true, antialias: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);

    const camera = new Camera(gl);
    camera.position.z = 1;

    const resize = () => {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    };
    resize();
    window.addEventListener("resize", resize);

    // Full-screen triangle
    const geometry = new Geometry(gl, {
      position: { size: 3, data: new Float32Array([-1,-1,0, 3,-1,0, -1,3,0]) },
      uv:       { size: 2, data: new Float32Array([0,0, 2,0, 0,2]) },
    });

    const program = new Program(gl, {
      vertex:   vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime:           { value: 0 },
        uHue:            { value: hue },
        uHoverIntensity: { value: hoverIntensity },
        uHovered:        { value: forceHoverState },
      },
      transparent: true,
      depthTest:   false,
    });

    const mesh = new Mesh(gl, { geometry, program });

    // Mouse events
    const onMouseEnter = () => {
      hoveredRef.current = true;
      program.uniforms.uHovered.value = true;
    };
    const onMouseLeave = () => {
      hoveredRef.current = false;
      program.uniforms.uHovered.value = false;
      rotRef.current = { x: 0, y: 0 };
    };
    const onMouseMove = (e) => {
      if (!rotateOnHover || !hoveredRef.current) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
      rotRef.current = { x: y * 0.4, y: x * 0.4 };
    };

    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);
    container.addEventListener("mousemove",  onMouseMove);

    let animId;
    let t = 0;
    const loop = () => {
      animId = requestAnimationFrame(loop);
      t += 0.016;
      program.uniforms.uTime.value = t;

      if (forceHoverState) {
        program.uniforms.uHovered.value = true;
      }

      // Smooth rotation
      if (rotateOnHover && hoveredRef.current) {
        gl.canvas.style.transform = `rotateX(${rotRef.current.x * 15}deg) rotateY(${rotRef.current.y * 15}deg)`;
      } else {
        gl.canvas.style.transform = "rotateX(0deg) rotateY(0deg)";
      }

      renderer.render({ scene: mesh });
    };
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("mousemove",  onMouseMove);
      renderer.gl.canvas.remove();
    };
  }, [hue, hoverIntensity, rotateOnHover, forceHoverState]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%", height: "100%",
        position: "relative",
        perspective: "600px",
      }}
    />
  );
}
