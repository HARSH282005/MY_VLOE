"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedIcon from './AnimatedIcon';
import type { ComponentProps } from 'react';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

type IconName = ComponentProps<typeof AnimatedIcon>['name'];

const memories: { icon: IconName; text: string; secret: string; color: string }[] = [
  { icon: 'phone', text: 'Talked every single day', secret: '...even on days one of them was upset. Neither could sleep without saying goodnight.', color: '#c4637a' },
  { icon: 'clock', text: 'Waited for each other — always', secret: 'Hours would pass. The other always came back. Always.', color: '#d4a853' },
  { icon: 'camera', text: 'Shared Instagram IDs', secret: 'That was their first step from the game world into the real one.', color: '#a855f7' },
  { icon: 'moon', text: 'Late nights turned into mornings', secret: '3AM talks. 4AM laughs. Sunrise caught them still talking.', color: '#6366f1' },
  { icon: 'sparkle', text: 'Fell more and more, every day', secret: 'Neither said it out loud yet. But both already knew.', color: '#c4637a' },
];

export default function FallingWithoutKnowing() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const instaBubbleRef = useRef<HTMLDivElement>(null);
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [cameraClicked, setCameraClicked] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } }
      );

      // 3D flip stagger entrance for cards
      gsap.fromTo('.memory-card',
        { opacity: 0, rotateY: -90, scale: 0.9 },
        {
          opacity: 1, rotateY: 0, scale: 1,
          duration: 0.9, stagger: 0.15, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 75%' },
        }
      );

      gsap.fromTo(instaBubbleRef.current,
        { opacity: 0, x: 60, scale: 0.9 },
        { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'expo.out', delay: 0.6,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleCameraClick = () => {
    setCameraClicked(true);
    setTimeout(() => setCameraClicked(false), 1200);
  };

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
      {/* Aurora glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '10%',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(139,34,82,0.2) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
        animation: 'auroraFloat 6s ease-in-out infinite alternate',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '10%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(212,168,83,0.1) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
        animation: 'auroraFloat 8s ease-in-out infinite alternate-reverse',
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
          <p style={{ color: '#7a8090', fontSize: '0.8rem', marginTop: '1rem', fontFamily: "'Lato', sans-serif", letterSpacing: '0.1em' }}>
            ✦ Click each card to reveal the secret ✦
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          {/* Memory cards */}
          <div ref={cardsRef} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', perspective: '1000px' }}>
            {memories.map((m, i) => (
              <div key={i} style={{ perspective: '1000px' }}>
                <div
                  className="memory-card"
                  onClick={() => setOpenCard(openCard === i ? null : i)}
                  style={{
                    background: openCard === i ? `rgba(${m.color === '#c4637a' ? '196,99,122' : m.color === '#d4a853' ? '212,168,83' : '100,100,200'},0.15)` : 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${openCard === i ? m.color + '66' : 'rgba(212,168,83,0.2)'}`,
                    borderRadius: '12px',
                    padding: '1rem 1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                    transform: openCard === i ? 'translateX(8px) scale(1.02)' : 'translateX(0) scale(1)',
                    boxShadow: openCard === i ? `0 8px 30px ${m.color}33` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flexShrink: 0 }}>
                      <AnimatedIcon name={m.icon} size={36} color={m.color} />
                    </div>
                    <span className="chapter-body" style={{ color: '#d4c5b0', fontSize: '1rem', flex: 1 }}>{m.text}</span>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem',
                      transition: 'transform 0.3s',
                      transform: openCard === i ? 'rotate(180deg)' : 'rotate(0deg)',
                      flexShrink: 0,
                    }}>▾</div>
                  </div>
                  {/* Expandable secret */}
                  <div style={{
                    overflow: 'hidden',
                    maxHeight: openCard === i ? '80px' : '0px',
                    transition: 'max-height 0.4s ease, opacity 0.3s ease',
                    opacity: openCard === i ? 1 : 0,
                  }}>
                    <p style={{
                      marginTop: '0.75rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      color: '#9ba8c0',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      fontStyle: 'italic',
                    }}>{m.secret}</p>
                  </div>
                </div>
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
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              boxShadow: cameraClicked ? '0 0 40px rgba(253,29,29,0.4)' : '0 8px 30px rgba(131,58,180,0.3)',
              transform: cameraClicked ? 'scale(1.05)' : 'scale(1)',
            }}
              onClick={handleCameraClick}
            >
              <div style={{
                background: '#1a2035',
                borderRadius: '18px',
                padding: '2rem',
                textAlign: 'center',
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  <AnimatedIcon name="camera" size={56} color="#fd1d1d" />
                </div>
                {cameraClicked && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} style={{
                        position: 'absolute',
                        width: '8px', height: '8px',
                        borderRadius: '50%',
                        background: ['#833ab4', '#fd1d1d', '#fcb045', '#833ab4', '#fd1d1d', '#fcb045'][i],
                        animation: 'burstPop 0.8s ease-out forwards',
                        // @ts-ignore
                        '--tx': `${Math.cos((i / 6) * Math.PI * 2) * 50}px`,
                        '--ty': `${Math.sin((i / 6) * Math.PI * 2) * 50}px`,
                      }} />
                    ))}
                  </div>
                )}
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

      <style>{`
        @keyframes auroraFloat {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, -20px) scale(1.1); }
        }
        @keyframes burstPop {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
