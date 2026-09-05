"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function TextThatChangedEverything() {
  const sectionRef = useRef<HTMLElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      gsap.fromTo(noteRef.current,
        { opacity: 0, rotate: -8, scale: 0.85, y: 60 },
        {
          opacity: 1, rotate: -2, scale: 1, y: 0, duration: 1.2, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );
      gsap.fromTo(textRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1, x: 0, duration: 1, ease: 'expo.out', delay: 0.4,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="chapter-2"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f2e8d5 0%, #f5f0e8 60%, #ede4d4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle floral bg pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.06,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='20' fill='none' stroke='%238b2252' stroke-width='1'/%3E%3Ccircle cx='30' cy='30' r='8' fill='%238b2252'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px',
      }} />

      <div style={{ maxWidth: '1100px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        
        {/* Note image */}
        <div ref={noteRef} style={{ position: 'relative' }}>
          <div style={{
            boxShadow: '4px 8px 40px rgba(61,43,31,0.25), 0 2px 8px rgba(61,43,31,0.1)',
            borderRadius: '4px',
            overflow: 'hidden',
            transform: 'rotate(-2deg)',
          }}>
            <Image src="/ch2.jpg" alt="The note that changed everything" width={600} height={338} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
          {/* Tape effect top */}
          <div style={{
            position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
            width: '60px', height: '24px',
            background: 'rgba(212,168,83,0.5)',
            borderRadius: '2px',
          }} />
        </div>

        {/* Text */}
        <div ref={textRef}>
          <p className="chapter-label" style={{ color: '#8b2252', marginBottom: '1rem' }}>Chapter Two</p>
          <h2 className="chapter-title" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#3d2b1f', marginBottom: '1.5rem' }}>
            One &quot;Sorry&quot;<br />
            <em style={{ color: '#8b2252' }}>Changed Everything.</em>
          </h2>
          <div style={{ width: '40px', height: '2px', background: '#8b2252', marginBottom: '1.5rem' }} />
          <p className="chapter-body" style={{ color: '#5a3d2b', fontSize: '1.1rem', lineHeight: 1.9 }}>
            He was with friends in a squad. She messaged him.
          </p>
          <p className="chapter-body" style={{ color: '#5a3d2b', fontSize: '1.1rem', lineHeight: 1.9, marginTop: '1rem' }}>
            He typed back: <em>&quot;Sorry, I&apos;m with friends right now.&quot;</em>
          </p>
          <p className="chapter-body" style={{ color: '#5a3d2b', fontSize: '1.1rem', lineHeight: 1.9, marginTop: '1rem' }}>
            That one reply — that small, polite apology — opened a door neither of them knew existed.
          </p>
          <blockquote className="chapter-quote" style={{
            fontSize: '1.5rem',
            color: '#8b2252',
            borderLeft: '3px solid #d4a853',
            paddingLeft: '1.5rem',
            marginTop: '2rem',
            fontStyle: 'italic',
          }}>
            &quot;The smallest words carry the heaviest destinies.&quot;
          </blockquote>
          <p className="chapter-body" style={{ color: '#7a5c48', fontSize: '1rem', marginTop: '1.5rem' }}>
            From that message, they started talking. Every day. Without fail.
          </p>
        </div>
      </div>
    </section>
  );
}
