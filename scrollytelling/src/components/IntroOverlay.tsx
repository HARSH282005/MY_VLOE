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
        <ellipse cx="10" cy="8" rx="9" ry="7" fill={color} opacity="0.88"/>
        <ellipse cx="9" cy="7" rx="5" ry="3.5" fill="white" opacity="0.22"/>
      </svg>
    </div>
  );
}

// ── Passcode ────────────────────────────────────────────────────
const PASSCODE = '2182024';

type Phase = 'lock' | 'unlocking' | 'anniversary' | 'burst' | 'heart' | 'ready' | 'done';

// ══════════════════════════════════════════════════════════════
export default function IntroOverlay({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase]           = useState<Phase>('lock');
  const [input, setInput]           = useState('');
  const [shake, setShake]           = useState(false);
  const [wrongMsg, setWrongMsg]     = useState('');
  const [lockUnlocked, setLockUnlocked] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [exiting, setExiting]       = useState(false);

  // Petal arrays
  const scenePetals = useMemo(() =>
    Array.from({ length: 36 }, (_, i) => ({
      id: i, left: `${Math.random() * 102 - 1}%`,
      size: 12 + Math.random() * 14,
      color: ['#ffb3c6','#ff85a1','#ffd6e7','#ffccd5','#f9a8c9'][i % 5],
      dur: 4 + Math.random() * 5, delay: Math.random() * 9,
    })), []);

  const burstPetals = useMemo(() =>
    Array.from({ length: 65 }, (_, i) => ({
      id: i, left: `${Math.random() * 102 - 1}%`,
      size: 14 + Math.random() * 18,
      color: ['#ffb3c6','#ff85a1','#ffd6e7','#ff4d6d','#ffccd5'][i % 5],
      delay: Math.random() * 1.0,
    })), []);

  // Numpad press
  const handleKey = useCallback((k: string) => {
    if (phase !== 'lock' || lockUnlocked) return;
    if (k === 'del') { setInput(p => p.slice(0, -1)); return; }
    const next = input + k;
    if (next.length > PASSCODE.length) return;
    setInput(next);

    if (next.length === PASSCODE.length) {
      if (next === PASSCODE) {
        // ✅ Correct
        setLockUnlocked(true);
        setWrongMsg('');
        setTimeout(() => setPhase('unlocking'), 800);
        setTimeout(() => setPhase('anniversary'), 2000);
      } else {
        // ❌ Wrong
        setShake(true);
        setWrongMsg('Wrong date, try again ♥');
        setTimeout(() => { setShake(false); setInput(''); setWrongMsg(''); }, 700);
      }
    }
  }, [input, phase, lockUnlocked]);

  // Anniversary → burst → heart
  const handleLetterClick = useCallback(() => {
    if (phase !== 'anniversary') return;
    setPhase('burst');
    setTimeout(() => setPhase('heart'), 2200);
    setTimeout(() => setShowButton(true), 3800);
  }, [phase]);

  // Begin story
  const handleBegin = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 800);
  }, [onComplete]);

  if (phase === 'done') return null;

  // ─── LOCK phase ────────────────────────────────────────────────
  const isLock        = phase === 'lock' || phase === 'unlocking';
  const isAnniversary = phase === 'anniversary' || phase === 'burst';
  const isHeart       = phase === 'heart' || phase === 'ready';

  const displayDots = Array.from({ length: PASSCODE.length }, (_, i) =>
    i < input.length ? (lockUnlocked ? '♥' : '●') : '○'
  );

  const numKeys = ['1','2','3','4','5','6','7','8','9','','0','del'];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      opacity: exiting ? 0 : 1,
      transition: exiting ? 'opacity 0.8s ease' : 'none',
    }}>

      {/* ══════════ LOCK SCREEN ══════════ */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 40%, #2a0818 0%, #18040e 55%, #0a0208 100%)',
        opacity: isLock ? 1 : 0,
        transition: 'opacity 1.2s ease',
        pointerEvents: isLock ? 'auto' : 'none',
      }}>
        {/* Ambient rings */}
        {[1, 1.6, 2.3].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: `${260 * s}px`, height: `${260 * s}px`, borderRadius: '50%',
            border: `1px solid rgba(255,45,85,${0.15 - i * 0.04})`,
            transform: 'translate(-50%, -50%)',
            animation: `glowRing ${3 + i}s ease-in-out ${i * 0.5}s infinite alternate`,
            pointerEvents: 'none',
          }} />
        ))}

        {/* Lock icon SVG */}
        <div style={{
          marginBottom: '1.5rem',
          animation: lockUnlocked ? 'unlockPop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards' : 'lockFloat 3s ease-in-out infinite',
          filter: lockUnlocked ? 'drop-shadow(0 0 30px rgba(255,45,85,0.9))' : 'drop-shadow(0 0 15px rgba(255,45,85,0.4))',
          transition: 'filter 0.4s ease',
        }}>
          <svg viewBox="0 0 80 90" width="80" height="90" fill="none">
            {/* lock body */}
            <rect x="10" y="38" width="60" height="46" rx="10" fill={lockUnlocked ? '#ff2d55' : '#3a0a1c'} stroke="rgba(255,45,85,0.6)" strokeWidth="2" style={{ transition: 'fill 0.5s ease' }} />
            {/* shackle */}
            <path d={lockUnlocked
              ? 'M24 38 Q24 16 40 16 Q56 16 56 38'
              : 'M24 38 L24 24 Q24 8 40 8 Q56 8 56 24 L56 38'}
              stroke="rgba(255,45,85,0.8)" strokeWidth="5" fill="none" strokeLinecap="round"
              style={{ transition: 'all 0.5s ease' }} />
            {/* keyhole */}
            {!lockUnlocked && (
              <>
                <circle cx="40" cy="60" r="8" fill="rgba(255,45,85,0.3)" />
                <rect x="37" y="60" width="6" height="10" rx="2" fill="rgba(255,45,85,0.3)" />
              </>
            )}
            {/* heart when unlocked */}
            {lockUnlocked && (
              <path d="M40 72 C40 72 28 63 28 55 C28 51 31 48 34.5 48 C36.5 48 38.5 49.5 40 52 C41.5 49.5 43.5 48 45.5 48 C49 48 52 51 52 55 C52 63 40 72 40 72Z" fill="white" />
            )}
          </svg>
        </div>

        {/* Hint text */}
        <p style={{
          fontFamily: "'Dancing Script', cursive", fontSize: '1.1rem',
          color: 'rgba(255,192,203,0.75)', marginBottom: '1.5rem',
          letterSpacing: '0.05em', textAlign: 'center',
        }}>
          {lockUnlocked ? '♥ Unlocked — Welcome, my love ♥' : 'Enter the date that changed everything…'}
        </p>

        {/* Digit display */}
        <div style={{
          display: 'flex', gap: '0.5rem', marginBottom: '0.6rem',
          animation: shake ? 'shake 0.5s ease' : 'none',
        }}>
          {displayDots.map((d, i) => (
            <div key={i} style={{
              width: '36px', height: '44px',
              background: 'rgba(255,45,85,0.12)',
              border: `1.5px solid rgba(255,45,85,${d !== '○' ? 0.7 : 0.25})`,
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: d === '♥' ? '1rem' : '1.3rem',
              color: d === '♥' ? '#ff2d55' : d !== '○' ? '#ffc2d1' : 'rgba(255,45,85,0.25)',
              transition: 'border-color 0.2s, color 0.2s',
              backdropFilter: 'blur(8px)',
            }}>{d}</div>
          ))}
        </div>

        {/* Wrong message */}
        <p style={{
          fontFamily: "'Lato', sans-serif", fontSize: '0.78rem',
          color: '#ff6b6b', height: '1.2rem', marginBottom: '1.2rem',
          letterSpacing: '0.05em',
        }}>{wrongMsg}</p>

        {/* Numpad */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.6rem',
        }}>
          {numKeys.map((k, i) => {
            if (k === '') return <div key={i} />;
            return (
              <button key={i} onClick={() => handleKey(k)}
                disabled={lockUnlocked}
                style={{
                  width: '64px', height: '56px',
                  background: k === 'del'
                    ? 'rgba(255,45,85,0.08)'
                    : 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,45,85,0.25)',
                  borderRadius: '12px',
                  color: k === 'del' ? 'rgba(255,130,150,0.8)' : 'rgba(255,220,230,0.9)',
                  fontSize: k === 'del' ? '1rem' : '1.4rem',
                  fontFamily: k === 'del' ? "'Lato',sans-serif" : 'inherit',
                  cursor: lockUnlocked ? 'default' : 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.15s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  letterSpacing: '0',
                }}
                onMouseDown={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,45,85,0.25)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.93)';
                }}
                onMouseUp={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = k === 'del' ? 'rgba(255,45,85,0.08)' : 'rgba(255,255,255,0.06)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                }}
              >
                {k === 'del' ? '⌫' : k}
              </button>
            );
          })}
        </div>

        {/* Hint about date format */}
        <p style={{
          fontFamily: "'Lato', sans-serif", fontSize: '0.65rem',
          color: 'rgba(255,130,150,0.35)', marginTop: '1.4rem',
          letterSpacing: '0.15em', textTransform: 'uppercase',
        }}>
          Hint: a date you'll never forget ♥
        </p>
      </div>

      {/* ══════════ ANNIVERSARY SCENE ══════════ */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: (isAnniversary) ? 1 : 0,
        transition: 'opacity 1.8s ease',
        pointerEvents: isAnniversary ? 'auto' : 'none',
        overflow: 'hidden',
      }}>
        {/* Purple sky */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #0e0618 0%, #1a0c2e 30%, #251245 55%, #38185a 80%, #4a1e60 100%)' }} />

        {/* Ground mist */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(0deg, rgba(100,50,140,0.45) 0%, transparent 100%)' }} />

        {/* Tree silhouettes */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '65%', pointerEvents: 'none' }}
          viewBox="0 0 1280 420" preserveAspectRatio="xMidYMax slice">
          <rect x="15" y="210" width="22" height="210" fill="#150820"/>
          <ellipse cx="26" cy="150" rx="80" ry="95" fill="#1e0a30" opacity="0.88"/>
          <ellipse cx="0"  cy="120" rx="55" ry="65" fill="#2a0e40" opacity="0.7"/>
          <ellipse cx="55" cy="130" rx="50" ry="60" fill="#2a0e40" opacity="0.7"/>
          {[{x:10,y:115},{x:50,y:125},{x:80,y:140},{x:0,y:140},{x:30,y:100},{x:65,y:110},{x:-10,y:155},{x:42,y:150}].map((p,i)=>(
            <ellipse key={i} cx={p.x} cy={p.y} rx="20" ry="15" fill="#ff85a1" opacity={0.6+i*0.03}/>
          ))}
          <rect x="1243" y="220" width="22" height="200" fill="#150820"/>
          <ellipse cx="1254" cy="170" rx="80" ry="95" fill="#1e0a30" opacity="0.88"/>
          <ellipse cx="1280" cy="130" rx="60" ry="70" fill="#2a0e40" opacity="0.7"/>
          <ellipse cx="1220" cy="145" rx="55" ry="65" fill="#2a0e40" opacity="0.7"/>
          {[{x:1270,y:115},{x:1240,y:130},{x:1210,y:148},{x:1280,y:145},{x:1255,y:100},{x:1225,y:120},{x:1265,y:160}].map((p,i)=>(
            <ellipse key={i} cx={p.x} cy={p.y} rx="20" ry="15" fill="#ff85a1" opacity={0.6+i*0.03}/>
          ))}
          {[50,150,260,380,500,640,780,900,1030,1150,1240].map((x,i)=>(
            <ellipse key={i} cx={x} cy={45+Math.sin(i)*15} rx="28" ry="18" fill="#ff85a1" opacity="0.55"/>
          ))}
        </svg>

        {/* Continuously falling petals */}
        {scenePetals.map(p => (
          <Petal key={p.id} left={p.left} size={p.size} color={p.color}
            anim={`scenePetalFall ${p.dur}s ease-in-out ${p.delay}s infinite`} />
        ))}

        {/* Anniversary text */}
        <div style={{ position: 'absolute', top: '22%', width: '100%', textAlign: 'center', padding: '0 1rem', zIndex: 5 }}>
          <h1 style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', color: 'white',
            textShadow: '0 0 40px rgba(255,140,180,0.8), 0 2px 12px rgba(0,0,0,0.9)',
            marginBottom: '0.6rem', animation: 'textGlow 3.5s ease-in-out infinite alternate',
          }}>
            Happy Anniversary, My Love!
          </h1>
          <p style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300, fontSize: 'clamp(0.85rem,2vw,1.1rem)', color: 'rgba(255,210,228,0.85)', letterSpacing: '0.12em' }}>
            You are my rarest treasure.
          </p>
        </div>

        {/* Letter envelope */}
        <div onClick={handleLetterClick} style={{
          position: 'absolute', bottom: '14%', left: '50%',
          transform: 'translateX(-50%)', cursor: 'pointer', zIndex: 10,
          animation: 'letterFloat 3s ease-in-out infinite',
          filter: 'drop-shadow(0 0 18px rgba(255,180,100,0.65))',
        }}>
          <svg viewBox="0 0 220 165" width="200" height="150">
            <rect x="12" y="38" width="196" height="122" rx="8" fill="#e8d5a0" stroke="#c8a860" strokeWidth="2.5"/>
            <line x1="35" y1="90"  x2="185" y2="90"  stroke="#c8a860" strokeWidth="0.5" opacity="0.3"/>
            <line x1="35" y1="105" x2="185" y2="105" stroke="#c8a860" strokeWidth="0.5" opacity="0.3"/>
            <path d="M12 38 L110 95 L208 38 Z" fill="#d4b878" stroke="#c8a860" strokeWidth="1.5"/>
            <path d="M12 160 L70 108" stroke="#c8a860" strokeWidth="1.5" opacity="0.4"/>
            <path d="M208 160 L150 108" stroke="#c8a860" strokeWidth="1.5" opacity="0.4"/>
            <circle cx="110" cy="130" r="22" fill="#700010" stroke="#500008" strokeWidth="1.5"/>
            <circle cx="110" cy="130" r="18" fill="#8b0018"/>
            <path d="M110 122 C110 122 104 116 104 111 C104 108.5 105.8 106 108 106 C109.2 106 110 107.5 110 107.5 C110 107.5 110.8 106 112 106 C114.2 106 116 108.5 116 111 C116 116 110 122 110 122Z" fill="#ffd0d0" opacity="0.9"/>
          </svg>
          <p style={{ textAlign: 'center', fontFamily: "'Lato',sans-serif", fontSize: '0.72rem', letterSpacing: '0.22em', color: 'rgba(255,210,170,0.8)', marginTop: '0.6rem', animation: 'blinkHint 2.2s ease-in-out infinite' }}>
            CLICK TO OPEN
          </p>
        </div>
      </div>

      {/* ══════════ BURST PETALS ══════════ */}
      {(phase === 'burst' || isHeart) && burstPetals.map(p => (
        <Petal key={`b${p.id}`} left={p.left} size={p.size} color={p.color}
          anim={`burstFall 2.8s ease-in ${p.delay}s 1 forwards`} />
      ))}

      {/* ══════════ HEART REVEAL ══════════ */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: isHeart ? 1 : 0,
        transition: 'opacity 2s ease',
        pointerEvents: isHeart ? 'auto' : 'none',
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

        {isHeart && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <Canvas dpr={[1, 2]}>
              <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={48} />
              <ambientLight intensity={0.35} />
              <directionalLight position={[8, 10, 5]}  intensity={2.5} color="#ffccd5" />
              <directionalLight position={[-8, -6, -4]} intensity={0.8} color="#ff2d55" />
              <pointLight position={[0, 0, 4]} intensity={2.2} color="#ff85a1" distance={10} />
              <Environment preset="night" />
              <HeartMesh3D />
            </Canvas>
          </div>
        )}

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
        @keyframes lockFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes unlockPop   { 0%{transform:scale(1)} 50%{transform:scale(1.3)} 100%{transform:scale(1.1)} }
        @keyframes shake       { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px)} 40%{transform:translateX(10px)} 60%{transform:translateX(-8px)} 80%{transform:translateX(8px)} }
        @keyframes scenePetalFall { 0%{transform:translateY(-40px) rotate(0deg);opacity:0} 8%{opacity:.85} 90%{opacity:.6} 100%{transform:translateY(108vh) translateX(30px) rotate(380deg);opacity:0} }
        @keyframes burstFall   { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(106vh) rotate(540deg);opacity:0} }
        @keyframes textGlow    { 0%{text-shadow:0 0 25px rgba(255,140,180,.55),0 2px 12px rgba(0,0,0,.9)} 100%{text-shadow:0 0 50px rgba(255,140,180,1),0 0 80px rgba(255,100,150,.5),0 2px 12px rgba(0,0,0,.9)} }
        @keyframes letterFloat { 0%,100%{transform:translateX(-50%) translateY(0) rotate(-1deg)} 50%{transform:translateX(-50%) translateY(-10px) rotate(1deg)} }
        @keyframes blinkHint   { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes fadeUpBtn   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
