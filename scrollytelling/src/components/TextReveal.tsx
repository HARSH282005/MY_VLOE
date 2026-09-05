"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface TextRevealProps {
  text: string;
}

export default function TextReveal({ text }: TextRevealProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;
    
    const words = containerRef.current.querySelectorAll('.reveal-word');
    
    const ctx = gsap.context(() => {
      gsap.fromTo(words, 
        { 
          y: '110%', // Start below the mask
          opacity: 0,
          rotateZ: 5
        },
        {
          y: '0%',
          opacity: 1,
          rotateZ: 0,
          duration: 1.2,
          stagger: 0.04,
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%", 
            toggleActions: "play none none reverse"
          }
        }
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, [text]);

  return (
    <h2 ref={containerRef} className="text-4xl md:text-6xl font-bold tracking-tight text-white flex flex-wrap gap-x-3 gap-y-2">
      {text.split(' ').map((word, i) => (
        // The outer span acts as the overflow mask
        <span key={i} className="overflow-hidden inline-block pb-2">
          {/* The inner span is what actually animates up */}
          <span className="reveal-word inline-block origin-bottom-left leading-tight">
            {word}
          </span>
        </span>
      ))}
    </h2>
  );
}
