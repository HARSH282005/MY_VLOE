"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const chaptersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Animate the progress bar width based on scroll
    gsap.to(barRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    });

    // Chapter labels highlight as user scrolls past them
    const chapters = ['chapter-1', 'chapter-2', 'chapter-3', 'chapter-4', 'chapter-5', 'chapter-6', 'chapter-7', 'chapter-8', 'chapter-9'];
    chapters.forEach((id) => {
      const el = document.getElementById(id);
      const dot = document.querySelector(`[data-chap="${id}"]`) as HTMLElement;
      if (!el || !dot) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => { dot.style.background = '#d4a853'; dot.style.transform = 'scale(1.5)'; },
        onLeave: () => { dot.style.background = 'rgba(255,255,255,0.3)'; dot.style.transform = 'scale(1)'; },
        onEnterBack: () => { dot.style.background = '#d4a853'; dot.style.transform = 'scale(1.5)'; },
        onLeaveBack: () => { dot.style.background = 'rgba(255,255,255,0.3)'; dot.style.transform = 'scale(1)'; },
      });
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  const chapters = [
    { id: 'chapter-1', label: 'I' },
    { id: 'chapter-2', label: 'II' },
    { id: 'chapter-3', label: 'III' },
    { id: 'chapter-4', label: 'IV' },
    { id: 'chapter-5', label: 'V' },
    { id: 'chapter-6', label: 'VI' },
    { id: 'chapter-7', label: 'VII' },
    { id: 'chapter-8', label: 'VIII' },
    { id: 'chapter-9', label: 'IX' },
  ];

  return (
    <>
      {/* Top Progress Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'rgba(0,0,0,0.2)',
        zIndex: 9999,
      }}>
        <div
          ref={barRef}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #c4637a, #d4a853, #c4637a)',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
            backgroundSize: '200% 100%',
            animation: 'progressShimmer 2s linear infinite',
            willChange: 'transform',
          }}
        />
      </div>

      {/* Chapter dots navigation */}
      <div
        ref={chaptersRef}
        style={{
          position: 'fixed',
          right: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          zIndex: 9998,
        }}
      >
        {chapters.map((ch) => (
          <button
            key={ch.id}
            data-chap={ch.id}
            onClick={() => {
              const el = document.getElementById(ch.id);
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            title={`Chapter ${ch.label}`}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.3)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.3s ease',
              outline: 'none',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = '#c4637a';
              el.style.transform = 'scale(1.4)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement;
              if (el.style.background !== 'rgb(212, 168, 83)') {
                el.style.background = 'rgba(255,255,255,0.3)';
                el.style.transform = 'scale(1)';
              }
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes progressShimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </>
  );
}
