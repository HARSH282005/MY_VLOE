"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const dreams = [
  { emoji: '🤝', text: 'Hold her hand — finally, really, truly' },
  { emoji: '💰', text: 'Build a life. Be rich. Be free. Together.' },
  { emoji: '👧👦', text: 'Adopt one girl, one boy. Love them wildly.' },
  { emoji: '🤗', text: 'Cuddle all day. Just be.' },
  { emoji: '🌅', text: 'Wake up looking at her face every morning' },
  { emoji: '😴', text: 'Watch her sleep and whisper "finally"' },
  { emoji: '💍', text: 'Cry at our wedding — happy tears, earned ones' },
  { emoji: '👀', text: 'Just see her once. Just once.' },
];

export default function WhatIDreamOf() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

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
        { opacity: 0, x: 30 },
        {
          opacity: 1, x: 0, stagger: 0.08, duration: 0.7, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', delay: 0.8 }
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
      {/* Dawn light radial */}
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
                    : 'rgba(139,34,82,0.04)',
                  borderRadius: '8px',
                  border: i === dreams.length - 1
                    ? '1px solid rgba(139,34,82,0.3)'
                    : '1px solid transparent',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(139,34,82,0.1)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateX(6px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = i === dreams.length - 1
                    ? 'linear-gradient(135deg, rgba(139,34,82,0.1), rgba(212,168,83,0.08))'
                    : 'rgba(139,34,82,0.04)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)';
                }}
              >
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{d.emoji}</span>
                <p className="chapter-body" style={{
                  color: i === dreams.length - 1 ? '#8b2252' : '#5a3d2b',
                  fontSize: i === dreams.length - 1 ? '1.05rem' : '0.98rem',
                  fontWeight: i === dreams.length - 1 ? 600 : 400,
                }}>
                  {d.text}
                </p>
              </div>
            ))}
          </div>

          {/* Image */}
          <div ref={imgRef} style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(61,43,31,0.2), 0 0 0 6px white, 0 0 0 7px rgba(139,34,82,0.15)',
            }}>
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
            }}>
              <p className="chapter-quote" style={{ color: '#8b2252', fontSize: '1.1rem' }}>
                &quot;We did it.&quot; — on our wedding day 💍
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
