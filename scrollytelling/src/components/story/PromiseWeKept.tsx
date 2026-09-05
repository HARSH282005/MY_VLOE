"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function PromiseWeKept() {
  const sectionRef = useRef<HTMLElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      gsap.fromTo(sealRef.current,
        { opacity: 0, scale: 0.7, rotate: -10 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1.4, ease: 'elastic.out(1, 0.6)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } }
      );
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'expo.out', delay: 0.5,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } }
      );
      // Seal pulse animation via CSS - add it directly
      const sealEl = sealRef.current?.querySelector('.seal-badge');
      if (sealEl) {
        gsap.to(sealEl, {
          boxShadow: '0 0 40px 10px rgba(212,168,83,0.4)',
          duration: 1.5,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1,
          delay: 2,
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="chapter-7"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #2a1508 0%, #3d2010 40%, #1f1005 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gold glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1100px', width: '100%', display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '5rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {/* Wax seal image */}
        <div ref={sealRef} style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{
            borderRadius: '6px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(212,168,83,0.2), 0 0 0 1px rgba(212,168,83,0.2)',
          }}>
            <Image
              src="/ch7.jpg"
              alt="The promise we kept"
              width={500}
              height={281}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
          {/* Overlay seal badge */}
          <div className="seal-badge" style={{
            position: 'absolute',
            bottom: '-20px',
            right: '-20px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d4a853, #f0d080)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            boxShadow: '0 0 20px rgba(212,168,83,0.3)',
          }}>
            🤝
          </div>
        </div>

        {/* Text */}
        <div ref={textRef}>
          <p className="chapter-label" style={{ color: '#d4a853', marginBottom: '1rem' }}>Chapter Seven</p>
          <h2 className="chapter-title" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)', color: '#f5f0e8', marginBottom: '1.5rem' }}>
            A Promise<br />
            <em style={{ color: '#d4a853' }}>We Kept.</em>
          </h2>
          <div style={{ width: '40px', height: '2px', background: '#d4a853', marginBottom: '2rem' }} />

          <p className="chapter-body" style={{ color: '#c5b090', fontSize: '1.1rem', lineHeight: 1.9 }}>
            Through every fight. Every misunderstanding. Every moment 
            when it felt easier to walk away —
          </p>

          {/* The Promise box */}
          <div style={{
            margin: '2rem 0',
            padding: '2rem',
            background: 'rgba(212,168,83,0.08)',
            border: '1px solid rgba(212,168,83,0.3)',
            borderRadius: '8px',
            position: 'relative',
          }}>
            {/* Corner decorations */}
            <div style={{ position: 'absolute', top: '12px', left: '12px', width: '16px', height: '16px', borderTop: '1px solid #d4a853', borderLeft: '1px solid #d4a853' }} />
            <div style={{ position: 'absolute', top: '12px', right: '12px', width: '16px', height: '16px', borderTop: '1px solid #d4a853', borderRight: '1px solid #d4a853' }} />
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '16px', height: '16px', borderBottom: '1px solid #d4a853', borderLeft: '1px solid #d4a853' }} />
            <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '16px', height: '16px', borderBottom: '1px solid #d4a853', borderRight: '1px solid #d4a853' }} />

            <p className="chapter-label" style={{ color: '#d4a853', textAlign: 'center', marginBottom: '1rem' }}>The Promise</p>
            <p className="chapter-quote" style={{ color: '#f5f0e8', fontSize: '1.3rem', textAlign: 'center', lineHeight: 1.6 }}>
              &quot;No matter how hard it gets,<br />
              no matter how much it hurts —<br />
              we will not separate.<br />
              <span style={{ color: '#d4a853' }}>We stick. Together. Always.&quot;</span>
            </p>
          </div>

          <p className="chapter-body" style={{ color: '#c5b090', fontSize: '1rem', lineHeight: 1.9 }}>
            That is the vow they made. Not on a wedding day — 
            but in the quiet of a late night, across miles of distance, 
            through the glow of a phone screen.
          </p>
          <p className="chapter-body" style={{ color: '#c5b090', fontSize: '1rem', lineHeight: 1.9, marginTop: '0.75rem' }}>
            The most real vow two people can make.
          </p>
        </div>
      </div>
    </section>
  );
}
