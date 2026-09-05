"use client";

import { Canvas, useFrame, extend } from '@react-three/fiber';
import { PerspectiveCamera, Float, MeshDistortMaterial, Sparkles, Environment } from '@react-three/drei';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

// ── Beautiful 3D Heart Geometry ──────────────────────────────
function createHeartShape() {
  const shape = new THREE.Shape();
  const x = 0, y = 0;
  shape.moveTo(x, y);
  shape.bezierCurveTo(x, y - 0.3, x - 0.6, y - 0.3, x - 0.6, y);
  shape.bezierCurveTo(x - 0.6, y + 0.3, x, y + 0.6, x, y + 0.9);
  shape.bezierCurveTo(x, y + 0.6, x + 0.6, y + 0.3, x + 0.6, y);
  shape.bezierCurveTo(x + 0.6, y - 0.3, x, y - 0.3, x, y);
  return shape;
}

function HeartMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const heartGeo = useMemo(() => {
    // Standard Three.js heart curve, scaled and centered
    const shape = new THREE.Shape();
    shape.moveTo(2.5, 2.5);
    shape.bezierCurveTo(2.5, 2.5, 2.0, 0, 0, 0);
    shape.bezierCurveTo(-3.0, 0, -3.0, 3.5, -3.0, 3.5);
    shape.bezierCurveTo(-3.0, 5.5, -1.5, 7.7, 2.5, 9.5);
    shape.bezierCurveTo(6.5, 7.7, 8.0, 5.5, 8.0, 3.5);
    shape.bezierCurveTo(8.0, 3.5, 8.0, 0, 5.0, 0);
    shape.bezierCurveTo(3.5, 0, 2.5, 2.5, 2.5, 2.5);

    const extrudeSettings = {
      depth: 1.5,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 2,
      bevelSize: 0.4,
      bevelThickness: 0.4,
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Center the geometry
    geo.center();
    // Scale down
    geo.scale(0.28, 0.28, 0.28);
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.4;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.2;
      innerRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 1.5) * 0.06;
      glowRef.current.scale.setScalar(scale);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.12 + Math.sin(t * 1.5) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      {/* Outer wireframe heart */}
      <mesh ref={meshRef} geometry={heartGeo}>
        <meshStandardMaterial
          color="#ff4d6d"
          roughness={0.05}
          metalness={0.9}
          emissive="#c4637a"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Inner glassy heart slightly offset */}
      <mesh ref={innerRef} geometry={heartGeo} scale={0.82}>
        <MeshDistortMaterial
          color="#ff85a1"
          distort={0.2}
          speed={2}
          roughness={0.0}
          metalness={0.4}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Pulsing glow sphere behind */}
      <mesh ref={glowRef} scale={1.6}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#ff4d6d" transparent opacity={0.12} />
      </mesh>

      {/* Sparkles around the heart */}
      <Sparkles
        count={60}
        scale={[6, 6, 4]}
        size={2}
        speed={0.6}
        color="#ffd6e7"
        opacity={0.8}
      />
    </Float>
  );
}

// ── Orbiting small hearts ──────────────────────────────────────
function OrbitingHearts() {
  const groupRef = useRef<THREE.Group>(null);

  const miniGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(2.5, 2.5);
    shape.bezierCurveTo(2.5, 2.5, 2.0, 0, 0, 0);
    shape.bezierCurveTo(-3.0, 0, -3.0, 3.5, -3.0, 3.5);
    shape.bezierCurveTo(-3.0, 5.5, -1.5, 7.7, 2.5, 9.5);
    shape.bezierCurveTo(6.5, 7.7, 8.0, 5.5, 8.0, 3.5);
    shape.bezierCurveTo(8.0, 3.5, 8.0, 0, 5.0, 0);
    shape.bezierCurveTo(3.5, 0, 2.5, 2.5, 2.5, 2.5);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.2, bevelThickness: 0.2 });
    geo.center();
    geo.scale(0.07, 0.07, 0.07);
    return geo;
  }, []);

  const orbits = useMemo(() => [
    { radius: 3.2, speed: 0.5, phase: 0, y: 0.3, color: '#ff85a1' },
    { radius: 3.8, speed: -0.3, phase: 2, y: -0.4, color: '#ffd6e7' },
    { radius: 2.8, speed: 0.7, phase: 4, y: 0.6, color: '#c4637a' },
    { radius: 4.2, speed: 0.4, phase: 1, y: 0.1, color: '#ff4d6d' },
    { radius: 3.0, speed: -0.6, phase: 3, y: -0.2, color: '#ffb3c6' },
    { radius: 4.5, speed: 0.35, phase: 5, y: 0.4, color: '#ff4d6d' },
  ], []);

  const refs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    orbits.forEach((orbit, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      const angle = t * orbit.speed + orbit.phase;
      mesh.position.x = Math.cos(angle) * orbit.radius;
      mesh.position.z = Math.sin(angle) * orbit.radius;
      mesh.position.y = orbit.y + Math.sin(t * 1.5 + orbit.phase) * 0.2;
      mesh.rotation.y = angle * 2;
      mesh.rotation.x = Math.sin(t + orbit.phase) * 0.3;
    });
  });

  return (
    <group ref={groupRef}>
      {orbits.map((orbit, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) refs.current[i] = el; }}
          geometry={miniGeo}
        >
          <meshStandardMaterial color={orbit.color} roughness={0.1} metalness={0.8} emissive={orbit.color} emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// ── Main Component ─────────────────────────────────────────────
export default function HeroCanvas() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Animate subtitle letter by letter
    if (subTextRef.current) {
      const text = 'A love story, written across screens & miles.';
      subTextRef.current.innerHTML = text.split('').map(c =>
        c === ' ' ? ' ' : `<span style="opacity:0;display:inline-block;transform:translateY(12px)">${c}</span>`
      ).join('');
      gsap.to(subTextRef.current.querySelectorAll('span'), {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.03, ease: 'expo.out', delay: 0.8,
      });
    }

    const ctx = gsap.context(() => {
      gsap.to(textRef.current, {
        y: -150, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to(canvasRef.current, {
        y: 100, scale: 0.85, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        width: '100%', height: '100vh', position: 'relative',
        background: 'radial-gradient(ellipse at 50% 40%, #2d0a1a 0%, #1a0510 40%, #0d0208 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glow rings */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[1, 1.8, 2.6].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: `translate(-50%, -50%) scale(${s})`,
            width: '400px', height: '400px', borderRadius: '50%',
            border: `1px solid rgba(255,77,109,${0.15 - i * 0.04})`,
            animation: `ringPulse ${3 + i}s ease-in-out ${i * 0.5}s infinite alternate`,
          }} />
        ))}
      </div>

      {/* 3D Canvas */}
      <div ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={3} color="#ffd6e7" />
          <directionalLight position={[-10, -5, -5]} intensity={1} color="#ff4d6d" />
          <pointLight position={[0, 0, 3]} intensity={2} color="#ff85a1" distance={8} />
          <Environment preset="night" />
          <HeartMesh />
          <OrbitingHearts />
        </Canvas>
      </div>

      {/* Overlay text */}
      <div
        ref={textRef}
        style={{
          position: 'relative', zIndex: 10, textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        {/* Decorative label */}
        <p style={{
          fontFamily: "'Lato', sans-serif", letterSpacing: '0.4em',
          textTransform: 'uppercase', fontSize: '0.7rem', color: 'rgba(255,182,193,0.7)',
          marginBottom: '1.2rem', animation: 'fadeInUp 1s ease forwards',
        }}>
          ♥ &nbsp; A Love Story &nbsp; ♥
        </p>

        {/* Main title */}
        <h1 style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: 'clamp(3rem, 8vw, 7rem)',
          color: 'white',
          lineHeight: 1.1,
          marginBottom: '0.5rem',
          textShadow: '0 0 60px rgba(255,77,109,0.5), 0 2px 20px rgba(0,0,0,0.5)',
          animation: 'fadeInDown 1s cubic-bezier(0.34,1.56,0.64,1) forwards',
        }}>
          Our Story
        </h1>

        {/* Subtitle */}
        <p
          ref={subTextRef}
          style={{
            fontFamily: "'Lato', sans-serif", fontWeight: 300,
            fontSize: 'clamp(0.9rem, 2vw, 1.15rem)',
            color: 'rgba(255,214,231,0.8)',
            marginTop: '1rem', letterSpacing: '0.05em', lineHeight: 1.7,
          }}
        />

        {/* Scroll indicator */}
        <div style={{
          marginTop: '3rem', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '0.5rem',
          animation: 'bounceDown 2s ease-in-out infinite',
        }}>
          <p style={{ color: 'rgba(255,182,193,0.6)', fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            Scroll to begin
          </p>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,182,193,0.6)" strokeWidth="1.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes ringPulse {
          0% { opacity: 0.6; transform: translate(-50%, -50%) scale(var(--s, 1)); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(calc(var(--s, 1) * 1.04)); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
      `}</style>
    </div>
  );
}
