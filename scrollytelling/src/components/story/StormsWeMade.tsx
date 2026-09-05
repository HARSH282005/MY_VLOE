"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function StormsWeMade() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const rainContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Create rain drops
    const rainEl = rainContainerRef.current;
    if (rainEl) {
      for (let i = 0; i < 60; i++) {
        const drop = document.createElement('div');
        const left = Math.random() * 100;
        const dur = 0.4 + Math.random() * 0.5;
        const delay = Math.random() * 3;
        drop.style.cssText = `
          position: absolute;
          left: ${left}%;
          top: 0;
          width: 1px;
          height: ${12 + Math.random() * 20}px;
          background: linear-gradient(to bottom, transparent, rgba(180,200,220,0.4));
          animation: rainFall ${dur}s ${delay}s linear infinite;
          pointer-events: none;
        `;
        rainEl.appendChild(drop);
      }
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(imgRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' } }
      );
      gsap.fromTo(textRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 1, ease: 'expo.out', delay: 0.3,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' } }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      if (rainEl) rainEl.innerHTML = '';
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="chapter-6"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(170deg, #0d1117 0%, #131a24 50%, #1a1220 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Rain container */}
      <div
        ref={rainContainerRef}
        style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}
      />

      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'radial-gradient(ellipse at 40% 60%, rgba(139,34,82,0.08) 0%, transparent 60%)',
      }} />

      <div style={{ maxWidth: '1100px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        {/* Image */}
        <div ref={imgRef}>
          <div style={{
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 20px 70px rgba(0,0,0,0.7)',
            filter: 'brightness(0.85) saturate(0.9)',
          }}>
            <Image
              src="/ch6.jpg"
              alt="The storms we made"
              width={600}
              height={338}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>

        {/* Text */}
        <div ref={textRef}>
          <p className="chapter-label" style={{ color: '#6b7a9a', marginBottom: '1rem' }}>Chapter Six</p>
          <h2 className="chapter-title" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)', color: '#e8dfd0', marginBottom: '1.5rem' }}>
            The Storms<br />
            <em style={{ color: '#c4637a' }}>We Made.</em>
          </h2>
          <div style={{ width: '40px', height: '2px', background: '#3d4a60', marginBottom: '1.5rem' }} />

          <p className="chapter-body" style={{ color: '#8a9ab5', fontSize: '1.05rem', lineHeight: 1.9 }}>
            They fought. More than most. His jealousy ran deep — 
            in the game, if she messaged any boy, showed any emote, 
            his heart would flinch and his words would hurt.
          </p>
          <p className="chapter-body" style={{ color: '#8a9ab5', fontSize: '1.05rem', lineHeight: 1.9, marginTop: '1rem' }}>
            Misunderstandings. Distance. Silence that lasted too long.
          </p>
          <p className="chapter-body" style={{ color: '#8a9ab5', fontSize: '1.05rem', lineHeight: 1.9, marginTop: '1rem' }}>
            And through it all — her health wasn&apos;t good. He couldn&apos;t be there.
            The distance made him feel helpless. That helplessness came out wrong.
          </p>
          <blockquote className="chapter-quote" style={{
            fontSize: '1.25rem',
            color: '#c4637a',
            borderLeft: '3px solid #3d4a60',
            paddingLeft: '1.25rem',
            marginTop: '1.5rem',
            lineHeight: 1.6,
          }}>
            &quot;Even through every storm,<br />they never truly let go.&quot;
          </blockquote>
          <p className="chapter-body" style={{
            color: '#6b7a9a',
            fontSize: '0.95rem',
            marginTop: '1.5rem',
            fontStyle: 'italic',
          }}>
            Together. No matter what. Still.
          </p>
        </div>
      </div>
    </section>
  );
}
