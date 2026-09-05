"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function StoryHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.4, ease: 'expo.out', delay: 0.3 }
      );
      gsap.fromTo(imgRef.current,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 1.6, ease: 'expo.out', delay: 0.6 }
      );

      // Parallax on scroll
      gsap.to(imgRef.current, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
      gsap.to(textRef.current, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="chapter-1"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #1a0f08 0%, #2d1810 40%, #3d2218 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '4rem',
      }}
    >
      {/* Starfield BG */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              borderRadius: '50%',
              background: '#f5f0e8',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.2 + Math.random() * 0.5,
              animation: `starTwinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', width: '100%', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        {/* Text side */}
        <div ref={textRef}>
          <p className="chapter-label" style={{ color: '#d4a853', marginBottom: '1rem' }}>Chapter One</p>
          <h1 className="chapter-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#f5f0e8', marginBottom: '2rem' }}>
            A Random<br />
            <em style={{ color: '#c4637a' }}>Match.</em>
          </h1>
          <div style={{ width: '60px', height: '2px', background: '#d4a853', marginBottom: '2rem' }} />
          <p className="chapter-body" style={{ color: '#d4c5b0', fontSize: '1.15rem', lineHeight: 1.9 }}>
            It started in a game — MLBB. Two strangers, randomly matched. 
            No plan, no reason. Just two players on the same team.
          </p>
          <p className="chapter-body" style={{ color: '#d4c5b0', fontSize: '1.15rem', lineHeight: 1.9, marginTop: '1rem' }}>
            Neither of us knew it yet, but the universe had already decided.
          </p>
          <p className="chapter-quote" style={{ color: '#c4637a', fontSize: '1.6rem', marginTop: '2rem' }}>
            &quot;Not a coincidence. Destiny.&quot;
          </p>
        </div>

        {/* Image side */}
        <div ref={imgRef} style={{ position: 'relative' }}>
          <div style={{
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,168,83,0.3)',
            transform: 'rotate(-1.5deg)',
          }}>
            <Image
              src="/ch1.jpg"
              alt="A Random Match in MLBB"
              width={600}
              height={338}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              priority
            />
          </div>
          {/* Decorative corner */}
          <div style={{
            position: 'absolute', top: '-12px', right: '-12px',
            width: '80px', height: '80px',
            border: '1px solid rgba(212,168,83,0.4)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(26,15,8,0.8)',
          }}>
            <span style={{ fontSize: '2rem' }}>🎮</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
        color: '#d4a853', animation: 'bounceDown 2s ease-in-out infinite',
      }}>
        <p className="chapter-label" style={{ color: '#d4a853' }}>Scroll to continue</p>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="1.5">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>

      <style>{`
        @keyframes starTwinkle {
          from { opacity: 0.15; }
          to { opacity: 0.8; }
        }
        @keyframes bounceDown {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </section>
  );
}
