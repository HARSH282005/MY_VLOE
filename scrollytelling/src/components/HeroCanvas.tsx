"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Float, Sparkles, Environment, MeshDistortMaterial } from '@react-three/drei';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

// ── Correct heart shape: bumps at TOP, point at BOTTOM ────────
function makeHeartGeo(scale = 1) {
  const shape = new THREE.Shape();
  // Start at the top-center dip between bumps
  shape.moveTo(0, 0.4 * scale);
  // Left bump — arc UP then back across
  shape.bezierCurveTo(
    -0.2 * scale,  0.9 * scale,
    -1.2 * scale,  0.9 * scale,
    -1.2 * scale,  0.1 * scale
  );
  // Left side sweeping DOWN to point
  shape.bezierCurveTo(
    -1.2 * scale, -0.5 * scale,
    -0.5 * scale, -1.0 * scale,
     0,           -1.4 * scale   // bottom point
  );
  // Right side sweeping UP
  shape.bezierCurveTo(
     0.5 * scale, -1.0 * scale,
     1.2 * scale, -0.5 * scale,
     1.2 * scale,  0.1 * scale
  );
  // Right bump — arc UP back to top-center dip
  shape.bezierCurveTo(
     1.2 * scale,  0.9 * scale,
     0.2 * scale,  0.9 * scale,
     0,            0.4 * scale
  );

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.35 * scale,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 2,
    bevelSize: 0.1 * scale,
    bevelThickness: 0.1 * scale,
  });
  geo.center();
  return geo;
}

function HeartMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geo = useMemo(() => makeHeartGeo(2.2), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!meshRef.current) return;
    // Slow Y rotation only — keeps heart always right-side up
    meshRef.current.rotation.y = t * 0.35;
    // Gentle tilt
    meshRef.current.rotation.x = Math.sin(t * 0.4) * 0.1;
  });

  return (
    <Float speed={1.2} rotationIntensity={0} floatIntensity={0.6}>
      <mesh ref={meshRef} geometry={geo} castShadow>
        <MeshDistortMaterial
          color="#ff2d55"
          distort={0.15}
          speed={1.5}
          roughness={0.05}
          metalness={0.85}
          emissive="#c4004a"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Pulsing outer glow */}
      <mesh geometry={geo} scale={1.07}>
        <meshBasicMaterial color="#ff4d6d" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>

      <Sparkles count={70} scale={[7, 7, 4]} size={1.8} speed={0.5} color="#ffc2d1" opacity={0.9} />
    </Float>
  );
}

// ── Orbiting mini-hearts — always right-side up ──────────────
function OrbitingHearts() {
  const geoSmall = useMemo(() => makeHeartGeo(0.18), []);
  const geoTiny  = useMemo(() => makeHeartGeo(0.11), []);

  const orbits = useMemo(() => [
    { radius: 3.0, speed: 0.55,  phase: 0,   y:  0.3, geo: 'small', color: '#ff85a1' },
    { radius: 3.6, speed: -0.38, phase: 2.1, y: -0.4, geo: 'tiny',  color: '#ffc2d1' },
    { radius: 2.6, speed: 0.72,  phase: 4.2, y:  0.5, geo: 'tiny',  color: '#c4637a' },
    { radius: 4.0, speed: 0.42,  phase: 1.0, y:  0.1, geo: 'small', color: '#ff4d6d' },
    { radius: 2.9, speed: -0.60, phase: 3.3, y: -0.2, geo: 'tiny',  color: '#ffb3c6' },
  ], []);

  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    orbits.forEach((o, i) => {
      const m = refs.current[i];
      if (!m) return;
      const angle = t * o.speed + o.phase;
      m.position.x = Math.cos(angle) * o.radius;
      m.position.z = Math.sin(angle) * o.radius;
      m.position.y = o.y + Math.sin(t * 1.8 + o.phase) * 0.18;
      // Only rotate on Y so they stay right-side up
      m.rotation.y = angle * 1.5;
    });
  });

  return (
    <>
      {orbits.map((o, i) => (
        <mesh
          key={i}
          ref={el => { refs.current[i] = el; }}
          geometry={o.geo === 'small' ? geoSmall : geoTiny}
        >
          <meshStandardMaterial
            color={o.color}
            roughness={0.15}
            metalness={0.75}
            emissive={o.color}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </>
  );
}

export default function HeroCanvas() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLDivElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (subRef.current) {
      const text = 'A love story, written across screens & miles.';
      subRef.current.innerHTML = text.split('').map(c =>
        c === ' ' ? '&nbsp;' : `<span style="opacity:0;display:inline-block;transform:translateY(10px)">${c}</span>`
      ).join('');
      gsap.to(subRef.current.querySelectorAll('span'), {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.025, ease: 'expo.out', delay: 0.9,
      });
    }

    const ctx = gsap.context(() => {
      gsap.to(textRef.current, {
        y: -160, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to(canvasRef.current, {
        scale: 0.85, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        width: '100%', height: '100vh', position: 'relative', overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 30%, #3a0a1c 0%, #1e0610 50%, #0a0208 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Glow rings */}
      {[1.0, 1.8, 2.7].map((s, i) => (
        <div key={i} style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: `translate(-50%, -50%)`,
          width: `${350 * s}px`, height: `${350 * s}px`,
          borderRadius: '50%',
          border: `1px solid rgba(255,45,85,${0.18 - i * 0.05})`,
          animation: `glowRing ${3.5 + i * 1.2}s ease-in-out ${i * 0.6}s infinite alternate`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* 3D Canvas */}
      <div ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={48} />
          <ambientLight intensity={0.35} />
          <directionalLight position={[8, 10, 5]}  intensity={2.5} color="#ffccd5" />
          <directionalLight position={[-8, -6, -4]} intensity={0.8} color="#ff2d55" />
          <pointLight position={[0, 0, 4]} intensity={2.2} color="#ff85a1" distance={10} />
          <Environment preset="night" />
          <HeartMesh />
          <OrbitingHearts />
        </Canvas>
      </div>

      {/* Text overlay */}
      <div ref={textRef} style={{ position: 'relative', zIndex: 10, textAlign: 'center', pointerEvents: 'none' }}>
        <p style={{
          fontFamily: "'Lato', sans-serif", letterSpacing: '0.45em',
          textTransform: 'uppercase', fontSize: '0.68rem',
          color: 'rgba(255,192,203,0.7)', marginBottom: '1rem',
          animation: 'fadeUp 1s ease forwards',
        }}>
          ♥ &nbsp; A Love Story &nbsp; ♥
        </p>
        <h1 style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: 'clamp(3.2rem, 8vw, 7rem)',
          color: '#fff', lineHeight: 1.1, marginBottom: '0.4rem',
          textShadow: '0 0 60px rgba(255,45,85,0.55), 0 2px 20px rgba(0,0,0,0.6)',
          animation: 'fadeDown 1s cubic-bezier(0.34,1.56,0.64,1) forwards',
        }}>
          Our Story
        </h1>
        <p ref={subRef} style={{
          fontFamily: "'Lato', sans-serif", fontWeight: 300,
          fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
          color: 'rgba(255,210,220,0.8)', marginTop: '0.8rem',
          letterSpacing: '0.04em', lineHeight: 1.7,
        }} />
        <div style={{
          marginTop: '2.8rem', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '0.4rem',
          animation: 'bounce 2.2s ease-in-out infinite',
        }}>
          <p style={{ color: 'rgba(255,182,193,0.55)', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            Scroll to begin
          </p>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,182,193,0.55)" strokeWidth="1.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes glowRing { 0% { opacity: 0.5; transform: translate(-50%,-50%) scale(0.97); } 100% { opacity: 1; transform: translate(-50%,-50%) scale(1.03); } }
        @keyframes fadeUp   { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
        @keyframes fadeDown { from { opacity:0; transform: translateY(-24px); } to { opacity:1; transform: translateY(0); } }
        @keyframes bounce   { 0%,100% { transform: translateY(0); } 50% { transform: translateY(7px); } }
      `}</style>
    </div>
  );
}
