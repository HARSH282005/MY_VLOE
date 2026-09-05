"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const memories = [
  { icon: '📱', text: 'Talked every single day', delay: 0 },
  { icon: '⏰', text: 'Waited for each other — always', delay: 0.1 },
  { icon: '📷', text: 'Shared Instagram IDs', delay: 0.2 },
  { icon: '🌙', text: 'Late nights turned into mornings', delay: 0.3 },
  { icon: '💫', text: 'Fell more and more, every day', delay: 0.4 },
];

export default function FallingWithoutKnowing() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const instaBubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } }
      );

      // Stagger memory cards
      gsap.fromTo('.memory-card',
        { opacity: 0, scale: 0.8, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 75%' } }
      );

      gsap.fromTo(instaBubbleRef.current,
        { opacity: 0, x: 60, scale: 0.9 },
        { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'expo.out', delay: 0.6,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="chapter-3"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a2035 0%, #252d45 50%, #1e1830 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Aurora-like bg glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '10%',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(139,34,82,0.2) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '10%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(212,168,83,0.1) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Heading */}
        <div ref={headingRef} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p className="chapter-label" style={{ color: '#d4a853', marginBottom: '0.75rem' }}>Chapter Three</p>
          <h2 className="chapter-title" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#f5f0e8' }}>
            Falling Without <em style={{ color: '#c4637a' }}>Knowing.</em>
          </h2>
          <p className="chapter-body" style={{ color: '#9ba8c0', maxWidth: '600px', margin: '1.5rem auto 0', fontSize: '1.1rem', lineHeight: 1.8 }}>
            He had never talked to a girl this late into the night. This long. This honestly. 
            It wasn&apos;t a choice — it was a <em>pull.</em>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          {/* Memory cards */}
          <div ref={cardsRef} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {memories.map((m, i) => (
              <div
                key={i}
                className="memory-card"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(212,168,83,0.2)',
                  borderRadius: '12px',
                  padding: '1rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: 'default',
                  transition: 'transform 0.3s, background 0.3s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateX(8px)';
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(139,34,82,0.15)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)';
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)';
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
                <span className="chapter-body" style={{ color: '#d4c5b0', fontSize: '1rem' }}>{m.text}</span>
              </div>
            ))}
          </div>

          {/* Instagram reveal */}
          <div ref={instaBubbleRef} style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
              padding: '3px',
              borderRadius: '20px',
              marginBottom: '1.5rem',
            }}>
              <div style={{
                background: '#1a2035',
                borderRadius: '18px',
                padding: '2rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📸</div>
                <p className="chapter-label" style={{ color: '#9ba8c0', marginBottom: '0.5rem' }}>Then came the moment —</p>
                <p className="chapter-quote" style={{ color: '#f5f0e8', fontSize: '1.4rem' }}>
                  &quot;Share your Insta?&quot;
                </p>
              </div>
            </div>
            <p className="chapter-body" style={{ color: '#9ba8c0', fontSize: '1rem', lineHeight: 1.8 }}>
              That exchange of handles was their first step 
              from the game world into the real one.
            </p>
            <p className="chapter-quote" style={{ color: '#c4637a', fontSize: '1.4rem', marginTop: '1.5rem' }}>
              &quot;This much can&apos;t be coincidence.<br />It has to be destiny.&quot;
            </p>
            <p className="chapter-body" style={{ color: '#7a8c6e', fontSize: '0.9rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
              — and he still falls for her, every single day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
