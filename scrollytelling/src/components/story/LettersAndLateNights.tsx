"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const pinned = [
  { emoji: '💌', label: 'Letters written every day' },
  { emoji: '🍫', label: 'Chocolates & surprise gifts from her' },
  { emoji: '📞', label: 'Saying "I love you" every sentence' },
  { emoji: '🌙', label: 'Falling asleep on video call' },
  { emoji: '🎮', label: 'Late night gaming sessions together' },
  { emoji: '🎂', label: 'Celebrating every special occasion' },
];

export default function LettersAndLateNights() {
  const sectionRef = useRef<HTMLElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } }
      );
      gsap.fromTo(boardRef.current,
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'expo.out', delay: 0.3,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } }
      );
      gsap.fromTo('.pinned-item',
        { opacity: 0, y: 20, rotate: -5 },
        { opacity: 1, y: 0, rotate: 0, stagger: 0.08, duration: 0.6, ease: 'back.out(1.2)',
          scrollTrigger: { trigger: boardRef.current, start: 'top 75%' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="chapter-5"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #1a0f08 0%, #2a1a10 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Warm amber glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '300px',
        background: 'radial-gradient(ellipse, rgba(212,168,83,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Heading */}
        <div ref={textRef} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="chapter-label" style={{ color: '#d4a853', marginBottom: '0.75rem' }}>Chapter Five</p>
          <h2 className="chapter-title" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', color: '#f5f0e8' }}>
            Letters & <em style={{ color: '#d4a853' }}>Late Nights.</em>
          </h2>
          <p className="chapter-body" style={{ color: '#9b8870', maxWidth: '550px', margin: '1.5rem auto 0', fontSize: '1.05rem', lineHeight: 1.8 }}>
            In a long distance relationship, the small things become everything. 
            And they made the small things extraordinary.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
          {/* Cork board image */}
          <div ref={boardRef} style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}>
              <Image
                src="/ch5.jpg"
                alt="Letters and late night memories"
                width={600}
                height={338}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>

          {/* Pinned items grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {pinned.map((item, i) => (
              <div
                key={i}
                className="pinned-item"
                style={{
                  background: i % 3 === 0 ? 'rgba(245,240,232,0.07)' :
                    i % 3 === 1 ? 'rgba(139,34,82,0.12)' : 'rgba(212,168,83,0.08)',
                  border: '1px solid rgba(212,168,83,0.15)',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  textAlign: 'center',
                  transform: `rotate(${(i % 2 === 0 ? 1 : -1) * (i * 0.3)}deg)`,
                  cursor: 'default',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'rotate(0deg) scale(1.05)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = `rotate(${(i % 2 === 0 ? 1 : -1) * (i * 0.3)}deg) scale(1)`;
                }}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{item.emoji}</div>
                <p className="chapter-body" style={{ color: '#d4c5b0', fontSize: '0.85rem', lineHeight: 1.5 }}>{item.label}</p>
              </div>
            ))}

            {/* Special "she did the most" card */}
            <div className="pinned-item" style={{
              gridColumn: '1 / -1',
              background: 'rgba(139,34,82,0.2)',
              border: '1px solid rgba(196,99,122,0.4)',
              borderRadius: '8px',
              padding: '1.25rem 1.5rem',
              textAlign: 'center',
            }}>
              <p className="chapter-quote" style={{ color: '#f0d6da', fontSize: '1.2rem' }}>
                &quot;She did the most. Chocolates. Gifts. Letters. Love. Always.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
