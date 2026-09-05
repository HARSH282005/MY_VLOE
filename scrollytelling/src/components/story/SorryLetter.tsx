"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const letterLines = [
  "Sohneo,",
  "",
  "I don't know where to start except at the truth:",
  "I was wrong. In so many ways, for so long.",
  "",
  "You did everything. The letters. The gifts. The chocolates.",
  "The calls. The waiting. The loving — even when I made it hard.",
  "",
  "My jealousy was my mistake. Not yours.",
  "You never gave me a reason. I just didn't know",
  "how to hold something this precious without squeezing too tight.",
  "",
  "You cried because of me. That thought alone",
  "is something I carry every single day.",
  "",
  "I'm sorry. Not just as words on a screen.",
  "From somewhere deeper than I've ever reached.",
  "",
  "You're not just my person, Jai.",
  "You're the reason I want to be better.",
  "",
  "— Always yours,",
  "Sohneo 🌹",
];

export default function SorryLetter() {
  const sectionRef = useRef<HTMLElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      gsap.fromTo(letterRef.current,
        { opacity: 0, y: 60, rotate: 1 },
        {
          opacity: 1, y: 0, rotate: 0, duration: 1.4, ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            onEnter: () => setStarted(true),
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= letterLines.length) clearInterval(interval);
    }, 200);
    return () => clearInterval(interval);
  }, [started]);

  return (
    <section
      ref={sectionRef}
      id="chapter-8"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(170deg, #f2e8d5 0%, #ede0cc 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Rose petal accents */}
      {['10%', '85%', '50%'].map((left, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${20 + i * 30}%`,
          left,
          fontSize: '1.5rem',
          opacity: 0.15,
          transform: `rotate(${-20 + i * 25}deg)`,
          pointerEvents: 'none',
        }}>🌹</div>
      ))}

      <div style={{ maxWidth: '700px', width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Chapter label */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="chapter-label" style={{ color: '#8b2252', marginBottom: '0.75rem' }}>Chapter Eight</p>
          <h2 className="chapter-title" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#3d2b1f' }}>
            I&apos;m Sorry,{' '}
            <em style={{ color: '#8b2252' }}>Sohneo.</em>
          </h2>
        </div>

        {/* Letter */}
        <div
          ref={letterRef}
          style={{
            background: '#fdf8f0',
            border: '1px solid rgba(139,34,82,0.1)',
            borderRadius: '4px',
            padding: '3rem',
            boxShadow: '4px 8px 40px rgba(61,43,31,0.2), 0 0 0 8px #f5ede0, 0 0 0 9px rgba(139,34,82,0.1)',
            position: 'relative',
            minHeight: '400px',
          }}
        >
          {/* Red line guide like real letter paper */}
          <div style={{
            position: 'absolute',
            left: '3.5rem',
            top: 0,
            bottom: 0,
            width: '1px',
            background: 'rgba(196,99,122,0.2)',
          }} />

          {/* Lines */}
          <div style={{ fontFamily: "'IM Fell English', serif", lineHeight: 2.2, color: '#3d2b1f' }}>
            {letterLines.slice(0, visibleLines).map((line, i) => (
              <p
                key={i}
                style={{
                  fontSize: line === 'Sohneo,' ? '1.3rem' : '1.05rem',
                  fontWeight: line === 'Sohneo,' ? 600 : 400,
                  fontStyle: line.startsWith('—') ? 'italic' : 'normal',
                  color: line.startsWith('—') || line === 'Sohneo,' ? '#8b2252' : '#3d2b1f',
                  minHeight: line === '' ? '1.2rem' : 'auto',
                  animation: 'fadeInLine 0.4s ease-out',
                }}
              >
                {line}
                {i === visibleLines - 1 && visibleLines < letterLines.length && (
                  <span style={{ animation: 'blink 1s infinite', opacity: 1 }}>|</span>
                )}
              </p>
            ))}
          </div>

          {/* Paper fold crease */}
          <div style={{
            position: 'absolute', bottom: '30px', left: 0, right: 0,
            height: '1px', background: 'rgba(61,43,31,0.06)',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes fadeInLine {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
