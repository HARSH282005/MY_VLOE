"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

// A cute chibi character made entirely of SVG
function ChibiCharacter({ mood }: { mood: 'walk' | 'wave' | 'dance' | 'peek' }) {
  return (
    <svg width="64" height="80" viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="32" cy="55" rx="12" ry="14" fill="#c4637a" opacity="0.95"/>
      {/* Dress detail */}
      <path d="M20 58C20 58 22 70 32 70C42 70 44 58 44 58" fill="#8b2252" opacity="0.7"/>
      {/* Head */}
      <circle cx="32" cy="30" r="16" fill="#ffd4b8"/>
      {/* Hair */}
      <path d="M16 28C16 18 22 14 32 14C42 14 48 18 48 28" fill="#3d2218"/>
      <path d="M16 28C14 22 18 16 24 18" fill="#3d2218"/>
      <path d="M48 28C50 22 46 16 40 18" fill="#3d2218"/>
      {/* Eyes */}
      <ellipse cx="25" cy="29" rx="4" ry="4.5" fill="white"/>
      <ellipse cx="39" cy="29" rx="4" ry="4.5" fill="white"/>
      <circle cx="26" cy="30" r="2.5" fill="#3d2218"/>
      <circle cx="40" cy="30" r="2.5" fill="#3d2218"/>
      <circle cx="27" cy="29" r="1" fill="white"/>
      <circle cx="41" cy="29" r="1" fill="white"/>
      {/* Blush */}
      <ellipse cx="22" cy="34" rx="4" ry="2.5" fill="#ff9999" opacity="0.5"/>
      <ellipse cx="42" cy="34" rx="4" ry="2.5" fill="#ff9999" opacity="0.5"/>
      {/* Smile */}
      <path d="M27 37C29 40 35 40 37 37" stroke="#8b2252" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Arms */}
      {mood === 'wave' ? (
        <>
          <path d="M20 52C14 44 10 40 12 36" stroke="#ffd4b8" strokeWidth="5" strokeLinecap="round" fill="none"
            style={{ transformOrigin: '20px 52px', animation: 'wave 0.6s ease-in-out infinite alternate' }}/>
          <path d="M44 52C50 50 52 54 50 58" stroke="#ffd4b8" strokeWidth="5" strokeLinecap="round" fill="none"/>
        </>
      ) : mood === 'dance' ? (
        <>
          <path d="M20 52C12 48 10 42 14 38" stroke="#ffd4b8" strokeWidth="5" strokeLinecap="round" fill="none"/>
          <path d="M44 52C52 48 54 42 50 38" stroke="#ffd4b8" strokeWidth="5" strokeLinecap="round" fill="none"/>
        </>
      ) : (
        <>
          <path d="M20 52C16 56 14 60 16 64" stroke="#ffd4b8" strokeWidth="5" strokeLinecap="round" fill="none"/>
          <path d="M44 52C48 56 50 60 48 64" stroke="#ffd4b8" strokeWidth="5" strokeLinecap="round" fill="none"/>
        </>
      )}
      {/* Legs */}
      {mood === 'walk' ? (
        <>
          <rect x="26" y="68" width="6" height="10" rx="3" fill="#ffd4b8"
            style={{ transformOrigin: '29px 68px', animation: 'legL 0.5s ease-in-out infinite alternate' }}/>
          <rect x="32" y="68" width="6" height="10" rx="3" fill="#ffd4b8"
            style={{ transformOrigin: '35px 68px', animation: 'legR 0.5s ease-in-out infinite alternate' }}/>
        </>
      ) : (
        <>
          <rect x="26" y="68" width="6" height="10" rx="3" fill="#ffd4b8"/>
          <rect x="32" y="68" width="6" height="10" rx="3" fill="#ffd4b8"/>
        </>
      )}
      {/* Shoes */}
      <ellipse cx="29" cy="78" rx="5" ry="3" fill="#8b2252" opacity="0.8"/>
      <ellipse cx="35" cy="78" rx="5" ry="3" fill="#8b2252" opacity="0.8"/>
      {/* Heart accent */}
      {mood === 'dance' && (
        <path d="M32 10C32 10 28 6 25 8C22 10 22 14 32 18C42 14 42 10 39 8C36 6 32 10 32 10Z" fill="#c4637a" opacity="0.8"
          style={{ animation: 'heartPulse 1s ease-in-out infinite' }}/>
      )}
    </svg>
  );
}

export default function AnimatedMascot() {
  const mascotRef = useRef<HTMLDivElement>(null);
  const [mood, setMood] = useState<'walk' | 'wave' | 'dance' | 'peek'>('peek');
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const messages: Record<string, { mood: 'walk' | 'wave' | 'dance' | 'peek'; text: string }> = {
    'chapter-1': { mood: 'wave', text: 'A random match... fate!' },
    'chapter-3': { mood: 'peek', text: 'Share your Insta? 📲' },
    'chapter-5': { mood: 'walk', text: 'Letters & late nights 🌙' },
    'chapter-7': { mood: 'dance', text: 'A promise kept! 💕' },
    'chapter-9': { mood: 'dance', text: 'Our dream comes true! 💍' },
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    Object.entries(messages).forEach(([id, data]) => {
      const el = document.getElementById(id);
      if (!el) return;

      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          setMood(data.mood);
          setMessage(data.text);
          setVisible(true);
          if (mascotRef.current) {
            gsap.fromTo(mascotRef.current,
              { x: 120, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.4)' }
            );
          }
        },
        onLeave: () => {
          if (mascotRef.current) {
            gsap.to(mascotRef.current, {
              x: 120, opacity: 0, duration: 0.5, ease: 'power2.in',
              onComplete: () => setVisible(false),
            });
          }
        },
        onLeaveBack: () => {
          if (mascotRef.current) {
            gsap.to(mascotRef.current, {
              x: 120, opacity: 0, duration: 0.5, ease: 'power2.in',
              onComplete: () => setVisible(false),
            });
          }
        },
      });
    });
  }, []);

  if (!visible) return null;

  return (
    <>
      <div
        ref={mascotRef}
        style={{
          position: 'fixed',
          bottom: '4rem',
          right: '2rem',
          zIndex: 9000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: 0,
          transform: 'translateX(120px)',
        }}
      >
        {/* Speech bubble */}
        {message && (
          <div style={{
            background: 'white',
            borderRadius: '16px 16px 4px 16px',
            padding: '0.5rem 0.9rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            fontSize: '0.75rem',
            color: '#3d2218',
            fontFamily: "'Lato', sans-serif",
            fontWeight: 600,
            whiteSpace: 'nowrap',
            maxWidth: '180px',
            textAlign: 'center',
            animation: 'bubblePop 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            {message}
          </div>
        )}
        {/* Character */}
        <div style={{ animation: mood === 'dance' ? 'mascotDance 0.8s ease-in-out infinite alternate' : 'mascotBounce 2s ease-in-out infinite', cursor: 'pointer' }}
          onClick={() => {
            if (mascotRef.current) {
              gsap.fromTo(mascotRef.current,
                { rotate: -10 },
                { rotate: 10, yoyo: true, repeat: 5, duration: 0.1, ease: 'none', onComplete: () => { if (mascotRef.current) gsap.set(mascotRef.current, { rotate: 0 }); } }
              );
            }
          }}>
          <ChibiCharacter mood={mood} />
        </div>
      </div>

      <style>{`
        @keyframes wave {
          from { transform: rotate(-20deg); }
          to { transform: rotate(30deg); }
        }
        @keyframes legL {
          from { transform: rotate(-20deg); }
          to { transform: rotate(20deg); }
        }
        @keyframes legR {
          from { transform: rotate(20deg); }
          to { transform: rotate(-20deg); }
        }
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes mascotBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes mascotDance {
          0% { transform: translateY(0) rotate(-5deg); }
          100% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes bubblePop {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
