"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// ── Heart geometry (bumps up, point down) ──────────────────────
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

function HeartMesh() {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => makeHeartGeo(2.0), []);
  useFrame(state => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.35;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
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

// ── Falling petal ─────────────────────────────────────────────
function Petal({ left, top, size, color, anim }: {
  left: string; top: string; size: number; color: string; anim: string;
}) {
  return (
    <div style={{ position: 'absolute', left, top, width: size, height: size * 0.8,
      pointerEvents: 'none', animation: anim }}>
      <svg viewBox="0 0 20 16" width="100%" height="100%">
        <ellipse cx="10" cy="8" rx="9" ry="7" fill={color} opacity="0.88"/>
        <ellipse cx="9" cy="7" rx="5" ry="3.5" fill="white" opacity="0.22"/>
      </svg>
    </div>
  );
}

type Phase = 'scene' | 'burst' | 'heart' | 'ready';

export default function AnniversaryIntro() {
  const [phase, setPhase] = useState<Phase>('scene');
  const [showButton, setShowButton] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);

  // Normal petals (scene phase)
  const scenePetals = useMemo(() =>
    Array.from({ length: 38 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 102 - 1}%`,
      size: 12 + Math.random() * 14,
      color: ['#ffb3c6','#ff85a1','#ffd6e7','#ffccd5','#f9a8c9'][i % 5],
      duration: 4 + Math.random() * 5,
      delay: Math.random() * 9,
      sway: (-20 + Math.random() * 40).toFixed(0),
    })), []);

  // Burst petals (on click)
  const burstPetals = useMemo(() =>
    Array.from({ length: 65 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 102 - 1}%`,
      size: 14 + Math.random() * 18,
      color: ['#ffb3c6','#ff85a1','#ffd6e7','#ff4d6d','#ffccd5','#f472b6'][i % 6],
      delay: Math.random() * 1.0,
      tx: (-40 + Math.random() * 80).toFixed(0),
    })), []);

  const handleLetterClick = () => {
    if (phase !== 'scene') return;
    setLetterOpen(true);
    setPhase('burst');
    setTimeout(() => setPhase('heart'), 2200);
    setTimeout(() => setShowButton(true), 3800);
  };

  const handleBeginStory = () => {
    const el = document.getElementById('chapter-1');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="anniversary-intro" style={{
      width: '100%', height: '100vh',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* ════════════════════════════════════════════════
          SCENE — Cherry blossom anniversary
      ════════════════════════════════════════════════ */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        opacity: phase === 'scene' ? 1 : phase === 'burst' ? 0.5 : 0,
        transition: phase !== 'scene' ? 'opacity 2s ease' : 'none',
        pointerEvents: phase === 'scene' ? 'auto' : 'none',
      }}>
        {/* Deep purple-mauve sky */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, #0e0618 0%, #1a0c2e 30%, #251245 55%, #38185a 80%, #4a1e60 100%)',
        }} />

        {/* Ground mist */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
          background: 'linear-gradient(0deg, rgba(100,50,140,0.45) 0%, transparent 100%)',
        }} />

        {/* Cherry blossom tree silhouettes */}
        <svg style={{ position:'absolute', top:0, left:0, width:'100%', height:'65%', pointerEvents:'none' }}
          viewBox="0 0 1280 420" preserveAspectRatio="xMidYMax slice">
          {/* LEFT big tree */}
          <rect x="15" y="210" width="22" height="210" fill="#150820"/>
          <path d="M26 210 Q-10 190 0 140 Q10 100 26 80 Q42 100 52 140 Q62 190 26 210Z" fill="#230d38"/>
          <ellipse cx="26" cy="150" rx="80" ry="95" fill="#1e0a30" opacity="0.88"/>
          <ellipse cx="0"  cy="120" rx="55" ry="65" fill="#2a0e40" opacity="0.7"/>
          <ellipse cx="55" cy="130" rx="50" ry="60" fill="#2a0e40" opacity="0.7"/>
          {[{x:10,y:115},{x:50,y:125},{x:80,y:140},{x:0,y:140},{x:30,y:100},{x:65,y:110},{x:-10,y:155},{x:42,y:150}].map((p,i)=>(
            <ellipse key={i} cx={p.x} cy={p.y} rx="20" ry="15" fill="#ff85a1" opacity={0.6+i*0.03}/>
          ))}
          {/* LEFT secondary tree */}
          <rect x="180" y="280" width="14" height="140" fill="#150820" opacity="0.8"/>
          <ellipse cx="187" cy="270" rx="50" ry="60" fill="#1e0a30" opacity="0.75"/>
          {[{x:165,y:258},{x:200,y:248},{x:220,y:265},{x:168,y:275}].map((p,i)=>(
            <ellipse key={i} cx={p.x} cy={p.y} rx="16" ry="12" fill="#ffb3c6" opacity="0.65"/>
          ))}

          {/* RIGHT big tree */}
          <rect x="1243" y="220" width="22" height="200" fill="#150820"/>
          <ellipse cx="1254" cy="170" rx="80" ry="95" fill="#1e0a30" opacity="0.88"/>
          <ellipse cx="1280" cy="130" rx="60" ry="70" fill="#2a0e40" opacity="0.7"/>
          <ellipse cx="1220" cy="145" rx="55" ry="65" fill="#2a0e40" opacity="0.7"/>
          {[{x:1270,y:115},{x:1240,y:130},{x:1210,y:148},{x:1280,y:145},{x:1255,y:100},{x:1225,y:120},{x:1265,y:160}].map((p,i)=>(
            <ellipse key={i} cx={p.x} cy={p.y} rx="20" ry="15" fill="#ff85a1" opacity={0.6+i*0.03}/>
          ))}
          {/* RIGHT secondary tree */}
          <rect x="1086" y="285" width="14" height="135" fill="#150820" opacity="0.8"/>
          <ellipse cx="1093" cy="272" rx="52" ry="62" fill="#1e0a30" opacity="0.75"/>
          {[{x:1070,y:260},{x:1105,y:252},{x:1122,y:268},{x:1075,y:278}].map((p,i)=>(
            <ellipse key={i} cx={p.x} cy={p.y} rx="16" ry="12" fill="#ffb3c6" opacity="0.65"/>
          ))}

          {/* Top branch arches from both sides */}
          <path d="M-20 0 Q200 80 640 60 Q1080 40 1300 0" fill="none" stroke="#2a0e40" strokeWidth="40" opacity="0.4"/>
          {/* Blossom clusters on top arch */}
          {[50,150,260,380,500,640,780,900,1030,1150,1240].map((x,i)=>(
            <ellipse key={i} cx={x} cy={45+Math.sin(i)*15} rx="28" ry="18" fill="#ff85a1" opacity="0.55"/>
          ))}
        </svg>

        {/* Continuously falling petals */}
        {scenePetals.map(p => (
          <Petal key={p.id}
            left={p.left} top="-40px" size={p.size} color={p.color}
            anim={`scenePetalFall ${p.duration}s ease-in-out ${p.delay}s infinite`}
          />
        ))}

        {/* Anniversary text */}
        <div style={{
          position: 'absolute', top: '20%', width: '100%', textAlign: 'center',
          padding: '0 1rem', zIndex: 5,
        }}>
          <h1 style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
            color: 'white',
            textShadow: '0 0 40px rgba(255,140,180,0.8), 0 2px 12px rgba(0,0,0,0.9)',
            marginBottom: '0.6rem',
            animation: 'textGlow 3.5s ease-in-out infinite alternate',
          }}>
            Happy Anniversary, My Love!
          </h1>
          <p style={{
            fontFamily: "'Lato', sans-serif", fontWeight: 300,
            fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
            color: 'rgba(255,210,228,0.85)',
            letterSpacing: '0.12em',
          }}>
            You are my rarest treasure.
          </p>
        </div>

        {/* Letter envelope — clickable */}
        <div
          onClick={handleLetterClick}
          style={{
            position: 'absolute',
            bottom: '14%', left: '50%',
            transform: `translateX(-50%) ${letterOpen ? 'scale(1.15) translateY(-20px)' : 'scale(1)'}`,
            cursor: 'pointer', zIndex: 10,
            transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
            animation: letterOpen ? 'none' : 'letterFloat 3s ease-in-out infinite',
            filter: 'drop-shadow(0 0 18px rgba(255,180,100,0.65))',
          }}
        >
          <svg viewBox="0 0 220 165" width="200" height="150">
            {/* Envelope shadow */}
            <rect x="12" y="38" width="196" height="122" rx="8" fill="rgba(0,0,0,0.25)" transform="translate(4,6)"/>
            {/* Envelope body - parchment */}
            <rect x="12" y="38" width="196" height="122" rx="8" fill="#e8d5a0" stroke="#c8a860" strokeWidth="2.5"/>
            {/* Paper texture lines */}
            <line x1="35" y1="90"  x2="185" y2="90"  stroke="#c8a860" strokeWidth="0.5" opacity="0.3"/>
            <line x1="35" y1="105" x2="185" y2="105" stroke="#c8a860" strokeWidth="0.5" opacity="0.3"/>
            <line x1="35" y1="120" x2="185" y2="120" stroke="#c8a860" strokeWidth="0.5" opacity="0.3"/>
            {/* Bottom triangle folds */}
            <path d="M12 160 L70 108" stroke="#c8a860" strokeWidth="1.5" opacity="0.4"/>
            <path d="M208 160 L150 108" stroke="#c8a860" strokeWidth="1.5" opacity="0.4"/>
            {/* Flap */}
            <path d="M12 38 L110 95 L208 38 Z" fill="#d4b878" stroke="#c8a860" strokeWidth="1.5"/>
            {/* Flap highlight */}
            <path d="M12 38 L55 62 L70 52" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none"/>
            {/* Wax seal */}
            <circle cx="110" cy="130" r="22" fill="#700010" stroke="#500008" strokeWidth="1.5"/>
            <circle cx="110" cy="130" r="18" fill="#8b0018"/>
            <circle cx="110" cy="130" r="13" fill="#a00020" opacity="0.8"/>
            {/* Heart in seal */}
            <path d="M110 122 C110 122 104 116 104 111 C104 108.5 105.8 106 108 106 C109.2 106 110 107.5 110 107.5 C110 107.5 110.8 106 112 106 C114.2 106 116 108.5 116 111 C116 116 110 122 110 122Z" fill="#ffd0d0" opacity="0.9"/>
            <text x="110" y="145" textAnchor="middle" fontSize="7" fill="rgba(255,200,200,0.7)" fontFamily="serif" letterSpacing="2">LOVE</text>
          </svg>

          {/* Click hint */}
          <p style={{
            textAlign: 'center',
            fontFamily: "'Lato', sans-serif", fontSize: '0.72rem',
            letterSpacing: '0.22em', color: 'rgba(255,210,170,0.8)',
            marginTop: '0.6rem',
            animation: 'blinkHint 2.2s ease-in-out infinite',
          }}>
            CLICK TO OPEN
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          BURST — Extra petals rain after letter click
      ════════════════════════════════════════════════ */}
      {phase !== 'scene' && burstPetals.map(p => (
        <Petal key={`b${p.id}`}
          left={p.left} top="-30px" size={p.size} color={p.color}
          anim={`burstFall 2.8s ease-in ${p.delay}s 1 forwards`}
        />
      ))}

      {/* ════════════════════════════════════════════════
          HEART REVEAL — The reward slide
      ════════════════════════════════════════════════ */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        opacity: phase === 'heart' || phase === 'ready' ? 1 : 0,
        transition: 'opacity 2s ease',
        pointerEvents: phase === 'heart' || phase === 'ready' ? 'auto' : 'none',
        background: 'radial-gradient(ellipse at 50% 30%, #3a0a1c 0%, #1e0610 50%, #0a0208 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Glow rings */}
        {[1.0, 1.8, 2.7].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: `${340 * s}px`, height: `${340 * s}px`, borderRadius: '50%',
            border: `1px solid rgba(255,45,85,${0.18 - i * 0.05})`,
            transform: `translate(-50%, -50%)`,
            animation: `glowRing ${3.5 + i * 1.2}s ease-in-out ${i * 0.6}s infinite alternate`,
            pointerEvents: 'none',
          }} />
        ))}

        {/* 3D Canvas */}
        {(phase === 'heart' || phase === 'ready') && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <Canvas dpr={[1, 2]}>
              <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={48} />
              <ambientLight intensity={0.35} />
              <directionalLight position={[8, 10, 5]}  intensity={2.5} color="#ffccd5" />
              <directionalLight position={[-8, -6, -4]} intensity={0.8} color="#ff2d55" />
              <pointLight position={[0, 0, 4]} intensity={2.2} color="#ff85a1" distance={10} />
              <Environment preset="night" />
              <HeartMesh />
            </Canvas>
          </div>
        )}

        {/* Text overlay */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', pointerEvents: 'none' }}>
          <p style={{
            fontFamily: "'Lato', sans-serif", letterSpacing: '0.45em',
            textTransform: 'uppercase', fontSize: '0.68rem',
            color: 'rgba(255,192,203,0.75)', marginBottom: '1rem',
          }}>
            ♥ &nbsp; A Love Story &nbsp; ♥
          </p>
          <h1 style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(3.2rem, 8vw, 7rem)',
            color: '#fff', lineHeight: 1.1,
            textShadow: '0 0 60px rgba(255,45,85,0.55), 0 2px 20px rgba(0,0,0,0.6)',
          }}>
            Our Story
          </h1>
          <p style={{
            fontFamily: "'Lato', sans-serif", fontWeight: 300,
            fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
            color: 'rgba(255,210,220,0.8)',
            marginTop: '0.8rem', letterSpacing: '0.04em',
          }}>
            A love story, written across screens &amp; miles.
          </p>
        </div>

        {/* Button — appears after heart */}
        {showButton && (
          <button
            onClick={handleBeginStory}
            style={{
              position: 'relative', zIndex: 10,
              marginTop: '2.5rem',
              padding: '0.9rem 3rem',
              border: '1px solid rgba(255,130,170,0.55)',
              borderRadius: '50px',
              fontFamily: "'Lato', sans-serif",
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontSize: '0.78rem',
              color: 'white',
              background: 'rgba(255,45,85,0.18)',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
              boxShadow: '0 4px 20px rgba(255,45,85,0.22)',
              animation: 'fadeUpBtn 1s ease forwards',
            }}
            onMouseEnter={e => {
              const t = e.currentTarget;
              t.style.background = 'rgba(255,45,85,0.38)';
              t.style.transform = 'scale(1.06)';
              t.style.boxShadow = '0 8px 32px rgba(255,45,85,0.45)';
            }}
            onMouseLeave={e => {
              const t = e.currentTarget;
              t.style.background = 'rgba(255,45,85,0.18)';
              t.style.transform = 'scale(1)';
              t.style.boxShadow = '0 4px 20px rgba(255,45,85,0.22)';
            }}
          >
            ♥ &nbsp; Begin Our Story
          </button>
        )}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes scenePetalFall {
          0%   { transform: translateY(-40px) translateX(0) rotate(0deg);   opacity: 0; }
          8%   { opacity: 0.85; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(108vh) translateX(30px) rotate(380deg); opacity: 0; }
        }
        @keyframes burstFall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(106vh) rotate(540deg); opacity: 0; }
        }
        @keyframes textGlow {
          0%   { text-shadow: 0 0 25px rgba(255,140,180,0.55), 0 2px 12px rgba(0,0,0,0.9); }
          100% { text-shadow: 0 0 50px rgba(255,140,180,1),    0 0 80px rgba(255,100,150,0.5), 0 2px 12px rgba(0,0,0,0.9); }
        }
        @keyframes letterFloat {
          0%, 100% { transform: translateX(-50%) translateY(0) rotate(-1deg); }
          50%       { transform: translateX(-50%) translateY(-10px) rotate(1deg); }
        }
        @keyframes blinkHint {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
        @keyframes glowRing {
          0%   { opacity: 0.5; transform: translate(-50%,-50%) scale(0.97); }
          100% { opacity: 1;   transform: translate(-50%,-50%) scale(1.04); }
        }
        @keyframes fadeUpBtn {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
