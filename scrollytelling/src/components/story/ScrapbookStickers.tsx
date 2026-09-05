"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

// ─── SVG Sticker Designs ──────────────────────────────────────

const BowRibbon = ({ color = '#c4637a' }: { color?: string }) => (
  <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
    <ellipse cx="20" cy="30" rx="18" ry="12" fill={color} opacity="0.9" transform="rotate(-15 20 30)" />
    <ellipse cx="60" cy="30" rx="18" ry="12" fill={color} opacity="0.9" transform="rotate(15 60 30)" />
    <ellipse cx="20" cy="30" rx="10" ry="6" fill="rgba(255,255,255,0.3)" transform="rotate(-15 20 30)" />
    <ellipse cx="60" cy="30" rx="10" ry="6" fill="rgba(255,255,255,0.3)" transform="rotate(15 60 30)" />
    <circle cx="40" cy="30" r="9" fill={color} />
    <circle cx="40" cy="30" r="5" fill="rgba(255,255,255,0.4)" />
    <path d="M30 38 Q40 50 50 38" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M28 36 Q40 52 52 36" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
  </svg>
);

const PolaroidSticker = ({ rotate = -5 }: { rotate?: number }) => (
  <div style={{
    transform: `rotate(${rotate}deg)`,
    background: 'white',
    padding: '8px 8px 24px 8px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.1)',
    borderRadius: '2px',
    width: '90px',
    display: 'inline-block',
  }}>
    <div style={{
      width: '74px', height: '62px',
      background: 'linear-gradient(135deg, #ffd6e7, #ffb3c6, #c4637a)',
      borderRadius: '1px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '2rem',
    }}>♥</div>
    <div style={{
      textAlign: 'center', marginTop: '6px',
      fontFamily: "'Dancing Script', cursive",
      fontSize: '0.65rem', color: '#5a3d2b',
    }}>us ♥</div>
    {/* Washi tape on top */}
    <div style={{
      position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)',
      width: '30px', height: '16px',
      background: 'rgba(255,182,193,0.7)',
      borderRadius: '2px',
    }} />
  </div>
);

const HeartStamp = ({ size = 60, color = '#c4637a' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
    <circle cx="30" cy="30" r="28" stroke={color} strokeWidth="2.5" strokeDasharray="4 3" fill="rgba(255,77,109,0.08)" />
    <path d="M30 42 C30 42 14 32 14 22 C14 17 17.5 13 22 13 C25 13 28 15 30 18 C32 15 35 13 38 13 C42.5 13 46 17 46 22 C46 32 30 42 30 42Z" fill={color} opacity="0.9" />
    <text x="30" y="53" textAnchor="middle" fontSize="7" fill={color} fontFamily="serif" letterSpacing="1">LOVE</text>
  </svg>
);

const StarCluster = ({ color = '#d4a853' }: { color?: string }) => (
  <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
    {[
      { x: 35, y: 35, r: 12, op: 1 },
      { x: 15, y: 20, r: 7, op: 0.8 },
      { x: 55, y: 15, r: 5, op: 0.7 },
      { x: 58, y: 50, r: 6, op: 0.75 },
      { x: 10, y: 55, r: 4, op: 0.6 },
    ].map((s, i) => (
      <g key={i} transform={`translate(${s.x}, ${s.y})`}>
        <polygon
          points={Array.from({ length: 5 }, (_, k) => {
            const a = (k * 72 - 90) * Math.PI / 180;
            const b = (k * 72 - 90 + 36) * Math.PI / 180;
            return `${Math.cos(a) * s.r},${Math.sin(a) * s.r} ${Math.cos(b) * s.r * 0.4},${Math.sin(b) * s.r * 0.4}`;
          }).join(' ')}
          fill={color}
          opacity={s.op}
        />
      </g>
    ))}
  </svg>
);

const WashiTape = ({ color = 'rgba(255,182,193,0.7)', rotate = -45, width = 100 }: { color?: string; rotate?: number; width?: number }) => (
  <div style={{
    width: `${width}px`, height: '22px',
    background: color,
    transform: `rotate(${rotate}deg)`,
    borderRadius: '2px',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Texture dots */}
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} style={{
        position: 'absolute', top: '50%', left: `${i * 14}%`,
        transform: 'translateY(-50%)',
        width: '4px', height: '4px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.4)',
      }} />
    ))}
  </div>
);

const LoveLetterSticker = () => (
  <svg width="72" height="60" viewBox="0 0 72 60" fill="none">
    <rect x="4" y="4" width="64" height="52" rx="4" fill="#fff5f7" stroke="#c4637a" strokeWidth="1.5" />
    <path d="M4 4 L36 30 L68 4" stroke="#c4637a" strokeWidth="1.5" fill="none" />
    <path d="M36 32 C36 32 22 48 8 50" stroke="#c4637a" strokeWidth="1" fill="none" strokeDasharray="3 2" opacity="0.4" />
    <path d="M36 32 C36 32 50 48 64 50" stroke="#c4637a" strokeWidth="1" fill="none" strokeDasharray="3 2" opacity="0.4" />
    <path d="M36 38 C36 38 28 33 28 28 C28 25 30 23 32 23 C34 23 35 24 36 26 C37 24 38 23 40 23 C42 23 44 25 44 28 C44 33 36 38 36 38Z" fill="#ff4d6d" opacity="0.9" />
  </svg>
);

const FlowerSticker = ({ color = '#c4637a' }: { color?: string }) => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
      <ellipse
        key={i}
        cx={30 + Math.cos((angle * Math.PI) / 180) * 14}
        cy={30 + Math.sin((angle * Math.PI) / 180) * 14}
        rx="8"
        ry="12"
        fill={color}
        opacity="0.85"
        transform={`rotate(${angle} ${30 + Math.cos((angle * Math.PI) / 180) * 14} ${30 + Math.sin((angle * Math.PI) / 180) * 14})`}
      />
    ))}
    <circle cx="30" cy="30" r="10" fill="#ffd6e7" />
    <circle cx="30" cy="30" r="6" fill="#ffb3c6" />
    <circle cx="28" cy="28" r="2" fill="rgba(255,255,255,0.6)" />
  </svg>
);

const XOXOBadge = () => (
  <div style={{
    background: 'linear-gradient(135deg, #ff4d6d, #c4637a)',
    borderRadius: '50px',
    padding: '6px 16px',
    fontFamily: "'Dancing Script', cursive",
    fontSize: '1.1rem',
    color: 'white',
    boxShadow: '0 4px 15px rgba(196,99,122,0.4)',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
  }}>
    xoxo ♥
  </div>
);

const PaperclipSticker = ({ color = '#d4a853' }: { color?: string }) => (
  <svg width="20" height="70" viewBox="0 0 20 70" fill="none">
    <path d="M10 65 C3 65 3 55 3 55 L3 15 C3 8 10 8 10 8 C17 8 17 15 17 15 L17 55 C17 62 10 62 10 62 L10 52 C13 52 13 55 13 55 L13 18 C13 13 7 13 7 13 L7 52 C7 58 10 58 10 58" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
);

const SparkleSticker = ({ color = '#d4a853' }: { color?: string }) => (
  <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
      <line
        key={i}
        x1="25" y1="25"
        x2={25 + Math.cos((a * Math.PI) / 180) * (i % 2 === 0 ? 22 : 12)}
        y2={25 + Math.sin((a * Math.PI) / 180) * (i % 2 === 0 ? 22 : 12)}
        stroke={color}
        strokeWidth={i % 2 === 0 ? 2 : 1}
        strokeLinecap="round"
        opacity={i % 2 === 0 ? 1 : 0.6}
      />
    ))}
    <circle cx="25" cy="25" r="4" fill={color} />
  </svg>
);

// ─── Sticker Overlay System ───────────────────────────────────

interface Sticker {
  id: string;
  chapter: string;
  side: 'left' | 'right';
  top: string;
  component: React.ReactNode;
  animation: string;
  delay?: number;
}

const stickers: Sticker[] = [
  // Chapter 1 - Rose gold / gold
  { id: 's1a', chapter: 'chapter-1', side: 'left', top: '20%', component: <BowRibbon color="#c4637a" />, animation: 'wiggle', delay: 0 },
  { id: 's1b', chapter: 'chapter-1', side: 'right', top: '40%', component: <HeartStamp size={64} color="#d4a853" />, animation: 'heartbeat', delay: 0.2 },
  { id: 's1c', chapter: 'chapter-1', side: 'left', top: '65%', component: <WashiTape color="rgba(212,168,83,0.6)" rotate={-8} width={110} />, animation: 'fadeSlide', delay: 0.4 },
  { id: 's1d', chapter: 'chapter-1', side: 'right', top: '75%', component: <SparkleSticker color="#d4a853" />, animation: 'spin', delay: 0.3 },

  // Chapter 3 - Purple/blue insta vibes
  { id: 's3a', chapter: 'chapter-3', side: 'right', top: '15%', component: <LoveLetterSticker />, animation: 'float', delay: 0 },
  { id: 's3b', chapter: 'chapter-3', side: 'left', top: '35%', component: <PolaroidSticker rotate={-8} />, animation: 'wiggle', delay: 0.2 },
  { id: 's3c', chapter: 'chapter-3', side: 'right', top: '60%', component: <FlowerSticker color="#a78bfa" />, animation: 'spin', delay: 0.1 },
  { id: 's3d', chapter: 'chapter-3', side: 'left', top: '70%', component: <WashiTape color="rgba(167,139,250,0.6)" rotate={12} width={90} />, animation: 'fadeSlide', delay: 0.3 },

  // Chapter 5 - Warm gold
  { id: 's5a', chapter: 'chapter-5', side: 'left', top: '20%', component: <StarCluster color="#d4a853" />, animation: 'heartbeat', delay: 0 },
  { id: 's5b', chapter: 'chapter-5', side: 'right', top: '45%', component: <XOXOBadge />, animation: 'float', delay: 0.2 },
  { id: 's5c', chapter: 'chapter-5', side: 'left', top: '70%', component: <PaperclipSticker color="#d4a853" />, animation: 'wiggle', delay: 0.1 },
  { id: 's5d', chapter: 'chapter-5', side: 'right', top: '25%', component: <SparkleSticker color="#ffb3c6" />, animation: 'spin', delay: 0.3 },

  // Chapter 7 - Promise / rosy
  { id: 's7a', chapter: 'chapter-7', side: 'right', top: '20%', component: <BowRibbon color="#8b2252" />, animation: 'wiggle', delay: 0 },
  { id: 's7b', chapter: 'chapter-7', side: 'left', top: '50%', component: <PolaroidSticker rotate={6} />, animation: 'float', delay: 0.2 },
  { id: 's7c', chapter: 'chapter-7', side: 'right', top: '65%', component: <FlowerSticker color="#c4637a" />, animation: 'heartbeat', delay: 0.3 },

  // Chapter 9 - Dreams
  { id: 's9a', chapter: 'chapter-9', side: 'left', top: '15%', component: <HeartStamp size={56} color="#8b2252" />, animation: 'heartbeat', delay: 0 },
  { id: 's9b', chapter: 'chapter-9', side: 'right', top: '35%', component: <StarCluster color="#c4637a" />, animation: 'spin', delay: 0.1 },
  { id: 's9c', chapter: 'chapter-9', side: 'left', top: '60%', component: <WashiTape color="rgba(139,34,82,0.5)" rotate={-5} width={100} />, animation: 'fadeSlide', delay: 0.2 },
  { id: 's9d', chapter: 'chapter-9', side: 'right', top: '75%', component: <LoveLetterSticker />, animation: 'float', delay: 0.3 },
  { id: 's9e', chapter: 'chapter-9', side: 'left', top: '35%', component: <XOXOBadge />, animation: 'float', delay: 0.4 },
];

function StickerItem({ sticker }: { sticker: Sticker }) {
  const ref = useRef<HTMLDivElement>(null);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = document.getElementById(sticker.chapter);
    if (!el) return;

    const offset = sticker.side === 'left' ? -120 : 120;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => {
        gsap.fromTo(ref.current,
          { x: offset, opacity: 0, rotate: sticker.side === 'left' ? -20 : 20 },
          { x: 0, opacity: 1, rotate: 0, duration: 0.8, delay: sticker.delay ?? 0, ease: 'back.out(1.4)' }
        );
      },
      onLeave: () => {
        gsap.to(ref.current, { x: offset, opacity: 0, duration: 0.4, ease: 'power2.in' });
      },
      onLeaveBack: () => {
        gsap.to(ref.current, { x: offset, opacity: 0, duration: 0.4, ease: 'power2.in' });
      },
      onEnterBack: () => {
        gsap.fromTo(ref.current,
          { x: offset, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, delay: sticker.delay ?? 0, ease: 'back.out(1.4)' }
        );
      },
    });
  }, [sticker]);

  const handleClick = () => {
    setClicked(true);
    if (ref.current) {
      gsap.fromTo(ref.current,
        { scale: 1 },
        { scale: 1.3, yoyo: true, repeat: 1, duration: 0.2, ease: 'power2.out',
          onComplete: () => setClicked(false) }
      );
    }
  };

  const animStyle: React.CSSProperties =
    sticker.animation === 'wiggle' ? { animation: `stickerWiggle ${2.5 + Math.random()}s ease-in-out infinite` }
    : sticker.animation === 'heartbeat' ? { animation: `stickerHeartbeat ${1.5 + Math.random() * 0.5}s ease-in-out infinite` }
    : sticker.animation === 'spin' ? { animation: `stickerSpin ${6 + Math.random() * 4}s linear infinite` }
    : sticker.animation === 'float' ? { animation: `stickerFloat ${3 + Math.random()}s ease-in-out infinite alternate` }
    : {};

  return (
    <div
      ref={ref}
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: sticker.top,
        [sticker.side]: sticker.side === 'left' ? '16px' : '16px',
        zIndex: 8000,
        opacity: 0,
        transform: `translateX(${sticker.side === 'left' ? '-120px' : '120px'})`,
        cursor: 'pointer',
        userSelect: 'none',
        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))',
        transition: 'filter 0.2s',
        ...animStyle,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.filter = 'drop-shadow(0 6px 20px rgba(196,99,122,0.5))';
        gsap.to(e.currentTarget, { scale: 1.12, duration: 0.2, ease: 'back.out(1.7)' });
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))';
        gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: 'power2.out' });
      }}
    >
      {sticker.component}
      {clicked && (
        <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '1.2rem', animation: 'popUp 0.6s ease forwards', pointerEvents: 'none' }}>
          ♥
        </div>
      )}
    </div>
  );
}

export default function ScrapbookStickers() {
  return (
    <>
      {stickers.map(s => <StickerItem key={s.id} sticker={s} />)}
      <style>{`
        @keyframes stickerWiggle {
          0%, 100% { transform: rotate(-3deg); }
          25% { transform: rotate(4deg); }
          75% { transform: rotate(-2deg); }
        }
        @keyframes stickerHeartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.1); }
          28% { transform: scale(1); }
          42% { transform: scale(1.08); }
          56% { transform: scale(1); }
        }
        @keyframes stickerSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes stickerFloat {
          from { transform: translateY(0px) rotate(-2deg); }
          to { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes popUp {
          0% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-30px) scale(1.5); }
        }
      `}</style>
    </>
  );
}
