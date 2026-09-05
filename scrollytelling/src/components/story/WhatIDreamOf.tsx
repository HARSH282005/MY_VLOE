"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import AnimatedIcon from './AnimatedIcon';
import type { ComponentProps } from 'react';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

type IconName = ComponentProps<typeof AnimatedIcon>['name'];

const dreams: { emoji: IconName; text: string; special?: boolean; color: string }[] = [
  { emoji: 'handshake', text: 'Hold her hand — finally, really, truly', color: '#d4a853' },
  { emoji: 'money', text: 'Build a life. Be rich. Be free. Together.', color: '#4ade80' },
  { emoji: 'family', text: 'Adopt one girl, one boy. Love them wildly.', color: '#c4637a' },
  { emoji: 'hug', text: 'Cuddle all day. Just be.', color: '#a78bfa' },
  { emoji: 'sunrise', text: 'Wake up looking at her face every morning', color: '#fbbf24' },
  { emoji: 'sleep', text: 'Watch her sleep and whisper "finally"', color: '#818cf8' },
  { emoji: 'ring', text: 'Cry at our wedding — happy tears, earned ones', special: true, color: '#c4637a' },
  { emoji: 'eyes', text: 'Just see her once. Just once.', color: '#d4a853' },
];

function ConfettiBurst({ x, y, active }: { x: number; y: number; active: boolean }) {
  if (!active) return null;
  const pieces = Array.from({ length: 18 });
  const colors = ['#c4637a', '#d4a853', '#a78bfa', '#4ade80', '#fbbf24', '#f472b6'];
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 99999 }}>
      {pieces.map((_, i) => {
        const angle = (i / pieces.length) * 360;
        const dist = 60 + Math.random() * 80;
        const tx = Math.cos((angle * Math.PI) / 180) * dist;
        const ty = Math.sin((angle * Math.PI) / 180) * dist;
        const color = colors[i % colors.length];
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: `${4 + Math.random() * 6}px`,
              height: `${4 + Math.random() * 6}px`,
              borderRadius: Math.random() > 0.5 ? '50%' : '0%',
              background: color,
              animation: `confettiPiece 1s ease-out forwards`,
              animationDelay: `${i * 0.03}s`,
              // @ts-ignore
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              '--rot': `${Math.random() * 720}deg`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes confettiPiece {
          0% { transform: translate(-50%, -50%) scale(1) rotate(0); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0) rotate(var(--rot)); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function HeartBurst({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none', zIndex: 10 }}>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * 360;
        const dist = 50 + i * 5;
        const tx = Math.cos((angle * Math.PI) / 180) * dist;
        const ty = Math.sin((angle * Math.PI) / 180) * dist;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 0, left: 0,
              fontSize: `${0.8 + i * 0.1}rem`,
              color: '#c4637a',
              animation: 'heartFly 1s ease-out forwards',
              animationDelay: `${i * 0.05}s`,
              // @ts-ignore
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
            }}
          >♥</div>
        );
      })}
      <style>{`
        @keyframes heartFly {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function WhatIDreamOf() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [confetti, setConfetti] = useState<{ x: number; y: number } | null>(null);
  const [eyesHeart, setEyesHeart] = useState<number | null>(null);

  const triggerConfetti = useCallback((e: React.MouseEvent) => {
    setConfetti({ x: e.clientX, y: e.clientY });
    setTimeout(() => setConfetti(null), 1500);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      gsap.fromTo(imgRef.current,
        { opacity: 0, scale: 0.9, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 1.4, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } }
      );
      gsap.fromTo(textRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1.2, ease: 'expo.out', delay: 0.4,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } }
      );
      gsap.fromTo('.dream-item',
        { opacity: 0, x: 30, filter: 'blur(4px)' },
        {
          opacity: 1, x: 0, filter: 'blur(0px)',
          stagger: 0.08, duration: 0.8, ease: 'expo.out', delay: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="chapter-9"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #fdf4ec 0%, #f5e8d8 50%, #ede0cc 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {confetti && <ConfettiBurst x={confetti.x} y={confetti.y} active={true} />}

      {/* Dawn light */}
      <div style={{
        position: 'absolute', top: '0%', left: '50%', transform: 'translateX(-50%)',
        width: '800px', height: '400px',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(240,208,128,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Heading */}
        <div ref={textRef} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p className="chapter-label" style={{ color: '#8b2252', marginBottom: '0.75rem' }}>Chapter Nine</p>
          <h2 className="chapter-title" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', color: '#3d2b1f', marginBottom: '1rem' }}>
            What I <em style={{ color: '#8b2252' }}>Dream Of.</em>
          </h2>
          <p className="chapter-body" style={{ color: '#7a5c48', maxWidth: '500px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.8 }}>
            Not things. Not places. Just her. Just this.
          </p>
          <p style={{ color: '#a07060', fontSize: '0.8rem', marginTop: '0.75rem', fontFamily: "'Lato', sans-serif", letterSpacing: '0.1em' }}>
            ✦ Click each dream to feel it ✦
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          {/* Dream list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {dreams.map((d, i) => (
              <div
                key={i}
                className="dream-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1.25rem',
                  background: i === dreams.length - 1
                    ? 'linear-gradient(135deg, rgba(139,34,82,0.1), rgba(212,168,83,0.08))'
                    : d.special
                    ? 'rgba(212,168,83,0.06)'
                    : 'rgba(139,34,82,0.04)',
                  borderRadius: '8px',
                  border: i === dreams.length - 1
                    ? '1px solid rgba(139,34,82,0.3)'
                    : d.special
                    ? '1px solid rgba(212,168,83,0.3)'
                    : '1px solid transparent',
                  transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'visible',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(139,34,82,0.1)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateX(8px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px ${d.color}22`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = i === dreams.length - 1
                    ? 'linear-gradient(135deg, rgba(139,34,82,0.1), rgba(212,168,83,0.08))'
                    : d.special ? 'rgba(212,168,83,0.06)' : 'rgba(139,34,82,0.04)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
                onClick={(e) => {
                  if (d.special || i === dreams.length - 2) {
                    triggerConfetti(e);
                  }
                  if (i === dreams.length - 1) {
                    setEyesHeart(Date.now());
                    setTimeout(() => setEyesHeart(null), 1200);
                  }
                }}
              >
                <div style={{ flexShrink: 0, position: 'relative' }}>
                  <AnimatedIcon name={d.emoji} size={36} color={d.color} />
                  {eyesHeart !== null && i === dreams.length - 1 && <HeartBurst active={true} />}
                </div>
                <p className="chapter-body" style={{
                  color: i === dreams.length - 1 ? '#8b2252' : '#5a3d2b',
                  fontSize: i === dreams.length - 1 ? '1.05rem' : '0.98rem',
                  fontWeight: i === dreams.length - 1 ? 600 : 400,
                }}>
                  {d.text}
                </p>
                {(d.special || i === dreams.length - 1) && (
                  <span style={{ fontSize: '0.7rem', color: '#a07060', marginLeft: 'auto', flexShrink: 0, fontFamily: "'Lato', sans-serif" }}>
                    tap ✨
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Image */}
          <div ref={imgRef} style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(61,43,31,0.2), 0 0 0 6px white, 0 0 0 7px rgba(139,34,82,0.15)',
                transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02) rotate(0.5deg)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 30px 80px rgba(61,43,31,0.3), 0 0 0 6px white, 0 0 0 7px rgba(139,34,82,0.3)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'scale(1) rotate(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 60px rgba(61,43,31,0.2), 0 0 0 6px white, 0 0 0 7px rgba(139,34,82,0.15)';
              }}
            >
              <Image
                src="/ch9.jpg"
                alt="Dreams of our future"
                width={600}
                height={338}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            {/* Floating quote */}
            <div style={{
              position: 'absolute',
              bottom: '-24px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'white',
              border: '1px solid rgba(139,34,82,0.2)',
              borderRadius: '50px',
              padding: '0.6rem 1.5rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 20px rgba(61,43,31,0.12)',
              animation: 'floatBadge 3s ease-in-out infinite',
            }}>
              <p className="chapter-quote" style={{ color: '#8b2252', fontSize: '1.1rem' }}>
                &quot;We did it.&quot; — on our wedding day
              </p>
            </div>

            {/* Decorative ring icon */}
            <div style={{
              position: 'absolute',
              top: '-16px',
              left: '-16px',
              animation: 'iconFloat 3s ease-in-out infinite',
            }}>
              <AnimatedIcon name="ring" size={44} color="#8b2252" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatBadge {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-5px); }
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }
      `}</style>
    </section>
  );
}
