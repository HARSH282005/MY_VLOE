"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// ── Heart geometry ──────────────────────────────────────────────
function makeHeartGeo(s = 1) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.4 * s);
  shape.bezierCurveTo(-0.2 * s, 0.9 * s, -1.2 * s, 0.9 * s, -1.2 * s, 0.1 * s);
  shape.bezierCurveTo(-1.2 * s, -0.5 * s, -0.5 * s, -1.0 * s, 0, -1.4 * s);
  shape.bezierCurveTo(0.5 * s, -1.0 * s, 1.2 * s, -0.5 * s, 1.2 * s, 0.1 * s);
  shape.bezierCurveTo(1.2 * s, 0.9 * s, 0.2 * s, 0.9 * s, 0, 0.4 * s);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.35 * s, bevelEnabled: true, bevelSegments: 5,
    steps: 2, bevelSize: 0.1 * s, bevelThickness: 0.1 * s,
  });
  geo.center();
  return geo;
}

function HeartMesh3D() {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => makeHeartGeo(2.0), []);
  useFrame(s => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.35;
    ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.4) * 0.1;
  });
  return (
    <Float speed={1.2} floatIntensity={0.5} rotationIntensity={0}>
      <mesh ref={ref} geometry={geo}>
        <MeshDistortMaterial color="#ff2d55" distort={0.15} speed={1.5}
          roughness={0.05} metalness={0.85} emissive="#c4004a" emissiveIntensity={0.4} />
      </mesh>
      <mesh geometry={geo} scale={1.06}>
        <meshBasicMaterial color="#ff4d6d" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
      <Sparkles count={60} scale={[6, 6, 4]} size={1.8} speed={0.5} color="#ffc2d1" opacity={0.9} />
    </Float>
  );
}

// ── Falling petal ───────────────────────────────────────────────
function Petal({ left, size, color, anim }: { left: string; size: number; color: string; anim: string }) {
  return (
    <div style={{ position: 'absolute', left, top: '-40px', width: size, height: size * 0.8, pointerEvents: 'none', animation: anim }}>
      <svg viewBox="0 0 20 16" width="100%" height="100%">
        <ellipse cx="10" cy="8" rx="9" ry="7" fill={color} opacity="0.88" />
        <ellipse cx="9" cy="7" rx="5" ry="3.5" fill="white" opacity="0.22" />
      </svg>
    </div>
  );
}

type Phase = 'heart' | 'done';

// ══════════════════════════════════════════════════════════════
export default function IntroOverlay({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>('heart');
  const [showButton, setShowButton] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Show button after a short delay when arriving at the page
    const t = setTimeout(() => setShowButton(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const burstPetals = useMemo(() =>
    Array.from({ length: 65 }, (_, i) => ({
      id: i, left: `${Math.random() * 102 - 1}%`,
      size: 14 + Math.random() * 18,
      color: ['#ffb3c6', '#ff85a1', '#ffd6e7', '#ff4d6d', '#ffccd5'][i % 5],
      delay: Math.random() * 1.0,
    })), []);

  // Begin story
  const handleBegin = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 800);
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      opacity: exiting ? 0 : 1,
      transition: exiting ? 'opacity 0.8s ease' : 'none',
    }}>

      {/* ══════════ BURST PETALS ══════════ */}
      {burstPetals.map(p => (
        <Petal key={`b${p.id}`} left={p.left} size={p.size} color={p.color}
          anim={`burstFall 2.8s ease-in ${p.delay}s 1 forwards`} />
      ))}

      {/* ══════════ HEART REVEAL ══════════ */}
      <div style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'auto',
        background: 'radial-gradient(ellipse at 50% 30%, #3a0a1c 0%, #1e0610 50%, #0a0208 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        {[1.0, 1.8, 2.7].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: `${340 * s}px`, height: `${340 * s}px`, borderRadius: '50%',
            border: `1px solid rgba(255,45,85,${0.18 - i * 0.05})`,
            transform: 'translate(-50%, -50%)',
            animation: `glowRing ${3.5 + i * 1.2}s ease-in-out ${i * 0.6}s infinite alternate`,
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Canvas dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={48} />
            <ambientLight intensity={0.35} />
            <directionalLight position={[8, 10, 5]} intensity={2.5} color="#ffccd5" />
            <directionalLight position={[-8, -6, -4]} intensity={0.8} color="#ff2d55" />
            <pointLight position={[0, 0, 4]} intensity={2.2} color="#ff85a1" distance={10} />
            <Environment preset="night" />
            <HeartMesh3D />
          </Canvas>
        </div>

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', pointerEvents: 'none' }}>
          <p style={{ fontFamily: "'Lato',sans-serif", letterSpacing: '0.45em', textTransform: 'uppercase', fontSize: '0.68rem', color: 'rgba(255,192,203,0.75)', marginBottom: '1rem' }}>
            ♥ &nbsp; A Love Story &nbsp; ♥
          </p>
          <h1 style={{ fontFamily: "'Dancing Script',cursive", fontSize: 'clamp(3.2rem,8vw,7rem)', color: '#fff', lineHeight: 1.1, textShadow: '0 0 60px rgba(255,45,85,0.55), 0 2px 20px rgba(0,0,0,0.6)' }}>
            Our Story
          </h1>
          <p style={{ fontFamily: "'Lato',sans-serif", fontWeight: 300, fontSize: 'clamp(0.85rem,2vw,1.1rem)', color: 'rgba(255,210,220,0.8)', marginTop: '0.8rem', letterSpacing: '0.04em' }}>
            A love story, written across screens &amp; miles.
          </p>
        </div>

        {showButton && (
          <button onClick={handleBegin} style={{
            position: 'relative', zIndex: 10, marginTop: '2.5rem',
            padding: '0.9rem 3rem', border: '1px solid rgba(255,130,170,0.55)',
            borderRadius: '50px', fontFamily: "'Lato',sans-serif",
            letterSpacing: '0.22em', textTransform: 'uppercase', fontSize: '0.78rem',
            color: 'white', background: 'rgba(255,45,85,0.18)',
            backdropFilter: 'blur(10px)', cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
            boxShadow: '0 4px 20px rgba(255,45,85,0.22)',
            animation: 'fadeUpBtn 1s ease forwards',
          }}
            onMouseEnter={e => { const t = e.currentTarget; t.style.background = 'rgba(255,45,85,0.38)'; t.style.transform = 'scale(1.06)'; t.style.boxShadow = '0 8px 32px rgba(255,45,85,0.45)'; }}
            onMouseLeave={e => { const t = e.currentTarget; t.style.background = 'rgba(255,45,85,0.18)'; t.style.transform = 'scale(1)'; t.style.boxShadow = '0 4px 20px rgba(255,45,85,0.22)'; }}
          >
            ♥ &nbsp; Begin Our Story
          </button>
        )}
      </div>

      <style>{`
        @keyframes glowRing    { 0%{opacity:.5;transform:translate(-50%,-50%) scale(.97)} 100%{opacity:1;transform:translate(-50%,-50%) scale(1.04)} }
        @keyframes burstFall   { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(106vh) rotate(540deg);opacity:0} }
        @keyframes fadeUpBtn   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
