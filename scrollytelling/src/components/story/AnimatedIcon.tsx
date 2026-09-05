"use client";

import React, { useEffect, useRef } from 'react';


type IconName =
  | 'gamepad'
  | 'phone'
  | 'clock'
  | 'camera'
  | 'moon'
  | 'sparkle'
  | 'handshake'
  | 'money'
  | 'family'
  | 'hug'
  | 'sunrise'
  | 'sleep'
  | 'ring'
  | 'eyes';

interface AnimatedIconProps {
  name: IconName;
  size?: number;
  color?: string;
}

const icons: Record<IconName, (color: string, size: number) => React.ReactElement> = {
  gamepad: (color, size) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 2px 8px rgba(212,168,83,0.5))' }}>
      <rect x="6" y="16" width="36" height="22" rx="11" fill={color} opacity="0.9"/>
      <rect x="6" y="16" width="36" height="22" rx="11" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      <rect x="12" y="24" width="2" height="6" rx="1" fill="white"/>
      <rect x="10" y="26" width="6" height="2" rx="1" fill="white"/>
      <circle cx="33" cy="25" r="2" fill="#ff6b6b" opacity="0.9"/>
      <circle cx="38" cy="27" r="2" fill="#4ecdc4" opacity="0.9"/>
      <circle cx="33" cy="29" r="2" fill="#ffe66d" opacity="0.9"/>
      <circle cx="28" cy="27" r="2" fill="#a8e6cf" opacity="0.9"/>
      <rect x="19" y="19" width="4" height="1.5" rx="0.75" fill="white" opacity="0.5"/>
      <rect x="25" y="19" width="4" height="1.5" rx="0.75" fill="white" opacity="0.5"/>
    </svg>
  ),
  phone: (color, size) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="13" y="6" width="22" height="36" rx="5" fill={color} opacity="0.9"/>
      <rect x="13" y="6" width="22" height="36" rx="5" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      <rect x="17" y="12" width="14" height="20" rx="2" fill="rgba(255,255,255,0.15)"/>
      <circle cx="24" cy="37" r="2" fill="rgba(255,255,255,0.5)"/>
      <rect x="20" y="9" width="8" height="1.5" rx="0.75" fill="rgba(255,255,255,0.4)"/>
      <rect x="18" y="15" width="6" height="1" rx="0.5" fill="rgba(255,255,255,0.3)"/>
      <rect x="18" y="18" width="10" height="1" rx="0.5" fill="rgba(255,255,255,0.2)"/>
    </svg>
  ),
  clock: (color, size) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="26" r="18" fill={color} opacity="0.9"/>
      <circle cx="24" cy="26" r="18" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      <circle cx="24" cy="26" r="14" fill="rgba(255,255,255,0.1)"/>
      <line x1="24" y1="26" x2="24" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="24" y1="26" x2="32" y2="30" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="24" cy="26" r="2" fill="white"/>
      <rect x="21" y="4" width="6" height="4" rx="2" fill={color} opacity="0.8"/>
    </svg>
  ),
  camera: (color, size) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="16" width="36" height="26" rx="5" fill={color} opacity="0.9"/>
      <path d="M17 16L20 10h8l3 6" fill={color} opacity="0.7"/>
      <circle cx="24" cy="29" r="8" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
      <circle cx="24" cy="29" r="5" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
      <circle cx="24" cy="29" r="2.5" fill="rgba(255,255,255,0.4)"/>
      <circle cx="31" cy="21" r="2" fill="rgba(255,255,255,0.5)"/>
      <circle cx="21" cy="27" r="1" fill="rgba(255,255,255,0.6)"/>
    </svg>
  ),
  moon: (color, size) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 8C20 10 14 18 14 27C14 37 22 44 32 42C36 41 39 38 41 34C35 36 27 33 23 27C19 21 20 13 28 8Z" fill={color} opacity="0.9"/>
      <circle cx="36" cy="12" r="2" fill={color} opacity="0.5"/>
      <circle cx="40" cy="20" r="1.5" fill={color} opacity="0.3"/>
      <circle cx="38" cy="6" r="1" fill={color} opacity="0.4"/>
    </svg>
  ),
  sparkle: (color, size) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4L26 18L38 12L30 22L44 24L30 26L38 36L26 30L24 44L22 30L10 36L18 26L4 24L18 22L10 12L22 18Z" fill={color} opacity="0.9"/>
    </svg>
  ),
  handshake: (color, size) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 24C4 24 10 18 18 20L24 24L30 20C38 18 44 24 44 24" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9"/>
      <path d="M18 20L20 28C21 30 23 31 24 31C25 31 27 30 28 28L30 20" fill={color} opacity="0.7"/>
      <path d="M14 26C12 30 14 36 20 36" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
      <path d="M34 26C36 30 34 36 28 36" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
      <circle cx="24" cy="24" r="3" fill={color}/>
    </svg>
  ),
  money: (color, size) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="14" width="36" height="24" rx="4" fill={color} opacity="0.9"/>
      <rect x="8" y="16" width="32" height="20" rx="3" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none"/>
      <circle cx="24" cy="26" r="6" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
      <text x="24" y="30" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">$</text>
      <circle cx="10" cy="26" r="3" fill="rgba(255,255,255,0.15)"/>
      <circle cx="38" cy="26" r="3" fill="rgba(255,255,255,0.15)"/>
    </svg>
  ),
  family: (color, size) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="14" r="5" fill={color} opacity="0.9"/>
      <circle cx="32" cy="14" r="5" fill={color} opacity="0.7"/>
      <path d="M6 34C6 26 10 22 16 22C20 22 22 24 24 24C26 24 28 22 32 22C38 22 42 26 42 34" fill={color} opacity="0.5"/>
      <circle cx="24" cy="34" r="4" fill="rgba(255,255,255,0.6)"/>
      <path d="M14 34C14 30 18 28 24 28C30 28 34 30 34 34" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  hug: (color, size) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="14" r="7" fill={color} opacity="0.9"/>
      <path d="M10 44C10 36 16 30 24 30C32 30 38 36 38 44" fill={color} opacity="0.6"/>
      <path d="M8 28C4 24 4 18 10 16" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8"/>
      <path d="M40 28C44 24 44 18 38 16" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8"/>
      <path d="M8 28C12 32 16 30 24 30" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
      <path d="M40 28C36 32 32 30 24 30" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
    </svg>
  ),
  sunrise: (color, size) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 34H40" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <path d="M24 30C28.4 30 32 26.4 32 22" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8"/>
      <path d="M16 22C16 26.4 19.6 30 24 30" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8"/>
      <circle cx="24" cy="18" r="6" fill={color} opacity="0.9"/>
      <line x1="24" y1="8" x2="24" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
      <line x1="36" y1="12" x2="38" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <line x1="12" y1="12" x2="10" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <line x1="40" y1="18" x2="44" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <line x1="4" y1="18" x2="8" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),
  sleep: (color, size) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 8C20 10 14 18 14 27C14 37 22 44 32 42C36 41 39 38 41 34C35 36 27 33 23 27C19 21 20 13 28 8Z" fill={color} opacity="0.8"/>
      <text x="35" y="16" fill={color} fontSize="10" fontWeight="bold" opacity="0.9">z</text>
      <text x="39" y="10" fill={color} fontSize="7" fontWeight="bold" opacity="0.7">z</text>
      <text x="42" y="6" fill={color} fontSize="5" fontWeight="bold" opacity="0.5">z</text>
    </svg>
  ),
  ring: (color, size) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="28" r="12" stroke={color} strokeWidth="4" fill="none" opacity="0.9"/>
      <circle cx="24" cy="28" r="8" fill="rgba(255,255,255,0.1)"/>
      <polygon points="24,10 28,18 36,18 30,23 32,31 24,26 16,31 18,23 12,18 20,18" fill={color} opacity="0.9"/>
      <circle cx="24" cy="18" r="3" fill="rgba(255,255,255,0.5)"/>
    </svg>
  ),
  eyes: (color, size) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="14" cy="26" rx="8" ry="8" fill="white" stroke={color} strokeWidth="2" opacity="0.9"/>
      <ellipse cx="34" cy="26" rx="8" ry="8" fill="white" stroke={color} strokeWidth="2" opacity="0.9"/>
      <circle cx="16" cy="26" r="4" fill={color} opacity="0.9"/>
      <circle cx="36" cy="26" r="4" fill={color} opacity="0.9"/>
      <circle cx="17" cy="24" r="1.5" fill="white"/>
      <circle cx="37" cy="24" r="1.5" fill="white"/>
    </svg>
  ),
};

export default function AnimatedIcon({ name, size = 40, color = '#d4a853' }: AnimatedIconProps) {
  const ref = useRef<HTMLDivElement>(null);

  const animClass = `anim-icon-${name}`;

  return (
    <>
      <div
        ref={ref}
        className={animClass}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}
      >
        {icons[name]?.(color, size) ?? null}
      </div>
      <style>{`
        .${animClass} {
          animation: iconFloat 3s ease-in-out infinite;
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-6px) rotate(2deg); }
        }
      `}</style>
    </>
  );
}
