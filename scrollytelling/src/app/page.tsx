'use client';
import HeroCanvas from '@/components/HeroCanvas';
import StoryHero from '@/components/story/StoryHero';
import TextThatChangedEverything from '@/components/story/TextThatChangedEverything';
import FallingWithoutKnowing from '@/components/story/FallingWithoutKnowing';
import AcrossTheScreen from '@/components/story/AcrossTheScreen';
import LettersAndLateNights from '@/components/story/LettersAndLateNights';
import StormsWeMade from '@/components/story/StormsWeMade';
import PromiseWeKept from '@/components/story/PromiseWeKept';
import SorryLetter from '@/components/story/SorryLetter';
import WhatIDreamOf from '@/components/story/WhatIDreamOf';
import FloatingPetals from '@/components/story/FloatingPetalsClient';
import dynamic from 'next/dynamic';

const ScrollProgress = dynamic(() => import('@/components/story/ScrollProgress'), { ssr: false });
const AnimatedMascot = dynamic(() => import('@/components/story/AnimatedMascot'), { ssr: false });

export default function Home() {
  return (
    <main style={{ background: '#f5f0e8', overflowX: 'hidden' }}>
      {/* Scroll progress bar + chapter dot nav */}
      <ScrollProgress />
      {/* Animated chibi mascot that reacts at key chapters */}
      <AnimatedMascot />
      {/* Global floating rose petals (client-only, DOM-dependent) */}
      <FloatingPetals />

      {/* ── Intro: Scrollytelling Hero ──────────────────────── */}
      <HeroCanvas />

      {/* ── Chapter 1: A Random Match ─────────────────────── */}
      <StoryHero />

      {/* ── Chapter 2: One Sorry Changed Everything ──────── */}
      <TextThatChangedEverything />

      {/* ── Chapter 3: Falling Without Knowing ──────────── */}
      <FallingWithoutKnowing />

      {/* ── Chapter 4: Across The Screen (First Video Call) ─ */}
      <AcrossTheScreen />

      {/* ── Chapter 5: Letters & Late Nights ────────────── */}
      <LettersAndLateNights />

      {/* ── Chapter 6: The Storms We Made ────────────────── */}
      <StormsWeMade />

      {/* ── Chapter 7: A Promise We Kept ─────────────────── */}
      <PromiseWeKept />

      {/* ── Chapter 8: I'm Sorry, Sohneo ─────────────────── */}
      <SorryLetter />

      {/* ── Chapter 9: What I Dream Of ───────────────────── */}
      <WhatIDreamOf />

      {/* ── Final Slide: Letters for Jai (transition) ────── */}
      <section
        style={{
          minHeight: '40vh',
          background: 'linear-gradient(180deg, #ede0cc 0%, #d4b896 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 2rem',
          textAlign: 'center',
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              color: '#8b2252',
              marginBottom: '2rem',
              lineHeight: 1.4,
            }}
          >
            &quot;I love you, and that is the beginning and end of everything.&quot;
          </p>
          <p
            style={{
              fontFamily: "'Lato', sans-serif",
              fontWeight: 300,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
              color: '#7a5c48',
              marginBottom: '2.5rem',
            }}
          >
            For Jai — My Sohneo ♥
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '1rem 3rem',
              border: '1px solid rgba(139,34,82,0.4)',
              borderRadius: '40px',
              fontFamily: "'Lato', sans-serif",
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              color: '#8b2252',
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(8px)',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(139,34,82,0.1)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(139,34,82,0.12)';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.05)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 30px rgba(139,34,82,0.25)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.6)';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(139,34,82,0.1)';
            }}
          >
            ♥ Go to Her Letters
          </a>
        </div>
      </section>
    </main>
  );
}
