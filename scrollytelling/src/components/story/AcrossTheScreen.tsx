"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function AcrossTheScreen() {
  const sectionRef = useRef<HTMLElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      // Film strip slides in from left
      gsap.fromTo(filmRef.current,
        { opacity: 0, x: -80 },
        { opacity: 1, x: 0, duration: 1.3, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } }
      );
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'expo.out', delay: 0.4,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } }
      );
      // Subtle parallax
      gsap.to(filmRef.current, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="chapter-4"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #f2e8d5 0%, #e8dcc8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Aged vignette edges */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(61,43,31,0.25) 100%)',
      }} />

      <div style={{ maxWidth: '1100px', width: '100%', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {/* Film strip image */}
        <div ref={filmRef}>
          <div style={{
            position: 'relative',
            boxShadow: '8px 12px 50px rgba(61,43,31,0.3)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <Image
              src="/ch4.jpg"
              alt="First video call across screens"
              width={680}
              height={383}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            {/* Film grain overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'grain\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23grain)\' opacity=\'0.08\'/%3E%3C/svg%3E")',
              pointerEvents: 'none', mixBlendMode: 'overlay',
            }} />
          </div>
        </div>

        {/* Text */}
        <div ref={textRef}>
          <p className="chapter-label" style={{ color: '#7a5c48', marginBottom: '1rem' }}>Chapter Four</p>
          <h2 className="chapter-title" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: '#3d2b1f', marginBottom: '1.5rem' }}>
            Across<br />
            <em style={{ color: '#8b2252' }}>The Screen.</em>
          </h2>
          <div style={{ width: '40px', height: '2px', background: '#7a5c48', marginBottom: '1.5rem' }} />

          <p className="chapter-body" style={{ color: '#5a3d2b', fontSize: '1.05rem', lineHeight: 1.9 }}>
            LDR. Long Distance. Two cities, two screens, one connection.
          </p>
          <p className="chapter-body" style={{ color: '#5a3d2b', fontSize: '1.05rem', lineHeight: 1.9, marginTop: '1rem' }}>
            Their first video call — both so unbearably shy. 
            Neither could look directly at the other&apos;s face. 
            They&apos;d look away, laugh nervously, hide their smiles.
          </p>
          <blockquote className="chapter-quote" style={{
            fontSize: '1.3rem',
            color: '#8b2252',
            borderLeft: '3px solid #d4a853',
            paddingLeft: '1.25rem',
            marginTop: '1.5rem',
            lineHeight: 1.5,
          }}>
            &quot;So funny. So sweet. So us.&quot;
          </blockquote>
          <p className="chapter-body" style={{ color: '#5a3d2b', fontSize: '1.05rem', lineHeight: 1.9, marginTop: '1.5rem' }}>
            They never met in person. But they celebrated every festival, 
            every birthday, every ordinary Tuesday — together.
          </p>
          <div style={{
            marginTop: '2rem',
            padding: '1rem 1.5rem',
            background: 'rgba(139,34,82,0.08)',
            borderRadius: '8px',
            border: '1px solid rgba(139,34,82,0.2)',
          }}>
            <p className="chapter-label" style={{ color: '#8b2252', marginBottom: '0.5rem' }}>Their LDR Life</p>
            <p className="chapter-body" style={{ color: '#5a3d2b', fontSize: '0.95rem' }}>
              📹 Sleeping on video call &nbsp;|&nbsp; 💌 Daily letters &nbsp;|&nbsp; 🍫 Surprise gifts &nbsp;|&nbsp; 🌙 Late nights
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
