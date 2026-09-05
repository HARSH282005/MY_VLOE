"use client";

import { useEffect, useRef } from 'react';

interface Petal {
  el: HTMLDivElement;
  x: number;
  speed: number;
  delay: number;
  size: number;
  sway: number;
}

export default function FloatingPetals() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const PETAL_COUNT = 18;
    const petals: Petal[] = [];

    for (let i = 0; i < PETAL_COUNT; i++) {
      const el = document.createElement('div');
      const size = 8 + Math.random() * 16;
      const x = Math.random() * 100;
      const delay = Math.random() * 12;
      const speed = 8 + Math.random() * 10;
      const sway = 20 + Math.random() * 40;

      el.style.cssText = `
        position: fixed;
        left: ${x}vw;
        top: -30px;
        width: ${size}px;
        height: ${size * 1.2}px;
        background: radial-gradient(ellipse at 30% 30%, #f0d6da, #c4637a88);
        border-radius: 50% 0 50% 0;
        transform-origin: center;
        animation: petalFall ${speed}s ${delay}s linear infinite,
                   petalSway ${speed * 0.4}s ${delay}s ease-in-out infinite alternate;
        pointer-events: none;
        z-index: 9990;
        opacity: 0.7;
      `;
      container.appendChild(el);
      petals.push({ el, x, speed, delay, size, sway });
    }

    return () => {
      petals.forEach(p => p.el.remove());
    };
  }, []);

  return <div ref={containerRef} className="petal-container" aria-hidden="true" />;
}
