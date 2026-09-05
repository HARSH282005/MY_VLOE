"use client";

import { useEffect } from 'react';

// ─── Cute Pinterest-style scrapbook sticker SVGs ───────────────

const STICKER_SVGS: Record<string, string> = {

  rose: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
    <defs><filter id="shadow-r"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.2"/></filter></defs>
    <g filter="url(#shadow-r)">
      <!-- petals -->
      <ellipse cx="40" cy="28" rx="10" ry="14" fill="#ff4d6d" opacity="0.9" transform="rotate(-30 40 40)"/>
      <ellipse cx="40" cy="28" rx="10" ry="14" fill="#ff4d6d" opacity="0.85" transform="rotate(30 40 40)"/>
      <ellipse cx="40" cy="28" rx="10" ry="14" fill="#ff6b81" opacity="0.8" transform="rotate(90 40 40)"/>
      <ellipse cx="40" cy="28" rx="10" ry="14" fill="#ff6b81" opacity="0.8" transform="rotate(-90 40 40)"/>
      <ellipse cx="40" cy="28" rx="10" ry="14" fill="#ff4d6d" opacity="0.9"/>
      <!-- center -->
      <circle cx="40" cy="38" r="10" fill="#c4004a"/>
      <circle cx="40" cy="38" r="7"  fill="#e8003a"/>
      <circle cx="37" cy="35" r="2.5" fill="rgba(255,255,255,0.35)"/>
      <!-- stem -->
      <path d="M40 48 Q38 58 36 64" stroke="#3d8b37" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M39 55 Q34 52 32 54" stroke="#3d8b37" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- white sticker border -->
      <ellipse cx="40" cy="38" rx="27" ry="29" fill="none" stroke="white" stroke-width="4" opacity="0.95"/>
    </g>
  </svg>`,

  star4: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
    <defs><filter id="shadow-s"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.2"/></filter></defs>
    <g filter="url(#shadow-s)">
      <path d="M40 8 L44 36 L72 40 L44 44 L40 72 L36 44 L8 40 L36 36 Z" fill="#FFD700" stroke="white" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M40 18 L43 36 L61 40 L43 44 L40 62 L37 44 L19 40 L37 36 Z" fill="#FFF0A0" opacity="0.5"/>
      <circle cx="36" cy="36" r="4" fill="rgba(255,255,255,0.5)"/>
    </g>
  </svg>`,

  heart_cute: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
    <defs><filter id="shadow-h"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.22"/></filter></defs>
    <g filter="url(#shadow-h)">
      <path d="M40 62 C40 62 14 46 14 30 C14 22 20 16 28 16 C33 16 37 19 40 23 C43 19 47 16 52 16 C60 16 66 22 66 30 C66 46 40 62 40 62Z" fill="#ff2d55" stroke="white" stroke-width="4" stroke-linejoin="round"/>
      <path d="M40 56 C40 56 20 43 20 30 C20 25 24 21 29 21" stroke="rgba(255,255,255,0.4)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- cute face -->
      <circle cx="34" cy="30" r="2" fill="white" opacity="0.9"/>
      <circle cx="46" cy="30" r="2" fill="white" opacity="0.9"/>
      <path d="M35 38 Q40 43 45 38" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.85"/>
    </g>
  </svg>`,

  rainbow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 60" width="90" height="60">
    <defs><filter id="shadow-rb"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.15"/></filter></defs>
    <g filter="url(#shadow-rb)">
      <path d="M10 52 A36 36 0 0 1 80 52" stroke="#FF4D4D" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M16 52 A30 30 0 0 1 74 52" stroke="#FF9A00" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M22 52 A24 24 0 0 1 68 52" stroke="#FFE500" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M28 52 A18 18 0 0 1 62 52" stroke="#4CAF50" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M34 52 A12 12 0 0 1 56 52" stroke="#2196F3" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M40 52 A6  6  0 0 1 50 52" stroke="#9C27B0" stroke-width="5" fill="none" stroke-linecap="round"/>
      <!-- clouds -->
      <circle cx="10" cy="52" r="7" fill="white"/>
      <circle cx="80" cy="52" r="7" fill="white"/>
      <circle cx="5"  cy="52" r="5" fill="white"/>
      <circle cx="85" cy="52" r="5" fill="white"/>
    </g>
  </svg>`,

  moon_stars: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
    <defs><filter id="shadow-m"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.18"/></filter></defs>
    <g filter="url(#shadow-m)">
      <path d="M50 18 C38 20 30 30 30 42 C30 54 38 64 50 66 C36 70 20 60 20 42 C20 24 36 14 50 18Z" fill="#FFF0A0" stroke="white" stroke-width="3.5" stroke-linejoin="round"/>
      <circle cx="56" cy="16" r="4" fill="#FFD700" stroke="white" stroke-width="2"/>
      <circle cx="62" cy="30" r="3" fill="#FFD700" stroke="white" stroke-width="1.5"/>
      <circle cx="64" cy="44" r="2.5" fill="#FFD700" stroke="white" stroke-width="1.5"/>
      <!-- sparkle mini -->
      <path d="M60 18 L61 21 L64 22 L61 23 L60 26 L59 23 L56 22 L59 21Z" fill="#FFD700" opacity="0.8"/>
    </g>
  </svg>`,

  butterfly: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 70" width="90" height="70">
    <defs><filter id="shadow-b"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.2"/></filter></defs>
    <g filter="url(#shadow-b)">
      <!-- left wings -->
      <ellipse cx="28" cy="30" rx="22" ry="17" fill="#ff85a1" opacity="0.9" transform="rotate(-20 28 30)"/>
      <ellipse cx="28" cy="45" rx="14" ry="10" fill="#c4637a" opacity="0.8" transform="rotate(10 28 45)"/>
      <!-- right wings -->
      <ellipse cx="62" cy="30" rx="22" ry="17" fill="#ff85a1" opacity="0.9" transform="rotate(20 62 30)"/>
      <ellipse cx="62" cy="45" rx="14" ry="10" fill="#c4637a" opacity="0.8" transform="rotate(-10 62 45)"/>
      <!-- wing patterns -->
      <circle cx="28" cy="28" r="5" fill="rgba(255,255,255,0.4)"/>
      <circle cx="62" cy="28" r="5" fill="rgba(255,255,255,0.4)"/>
      <!-- body -->
      <ellipse cx="45" cy="38" rx="4" ry="14" fill="#5d1f40" stroke="white" stroke-width="2"/>
      <!-- antennae -->
      <path d="M43 24 Q36 14 32 10" stroke="#5d1f40" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M47 24 Q54 14 58 10" stroke="#5d1f40" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="32" cy="10" r="3" fill="#ff85a1" stroke="white" stroke-width="1.5"/>
      <circle cx="58" cy="10" r="3" fill="#ff85a1" stroke="white" stroke-width="1.5"/>
      <!-- white border -->
      <rect x="4" y="4" width="82" height="62" rx="8" fill="none" stroke="white" stroke-width="3.5"/>
    </g>
  </svg>`,

  letter_love: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 70" width="90" height="70">
    <defs><filter id="shadow-l"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.18"/></filter></defs>
    <g filter="url(#shadow-l)">
      <rect x="8" y="14" width="74" height="50" rx="5" fill="#fff5f7" stroke="white" stroke-width="4"/>
      <!-- envelope flap -->
      <path d="M8 14 L45 40 L82 14Z" fill="#ffc2d1" stroke="white" stroke-width="2"/>
      <path d="M8 64 L35 42" stroke="#ffc2d1" stroke-width="2" fill="none"/>
      <path d="M82 64 L55 42" stroke="#ffc2d1" stroke-width="2" fill="none"/>
      <!-- heart seal -->
      <path d="M45 35 C45 35 38 29 38 24 C38 21 40 19 42 19 C43.5 19 44.5 20 45 22 C45.5 20 46.5 19 48 19 C50 19 52 21 52 24 C52 29 45 35 45 35Z" fill="#ff2d55"/>
    </g>
  </svg>`,

  bow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 60" width="90" height="60">
    <defs><filter id="shadow-bow"><feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-opacity="0.2"/></filter></defs>
    <g filter="url(#shadow-bow)">
      <!-- left loop -->
      <path d="M45 30 C40 20, 14 10, 10 20 C6 30, 30 40, 45 30Z" fill="#ff4d6d" stroke="white" stroke-width="3"/>
      <path d="M45 30 C40 20, 18 14, 16 22" fill="rgba(255,255,255,0.25)" stroke="none"/>
      <!-- right loop -->
      <path d="M45 30 C50 20, 76 10, 80 20 C84 30, 60 40, 45 30Z" fill="#ff4d6d" stroke="white" stroke-width="3"/>
      <path d="M45 30 C50 20, 72 14, 74 22" fill="rgba(255,255,255,0.25)" stroke="none"/>
      <!-- left tail -->
      <path d="M45 30 C40 38, 22 52, 18 48 C14 44, 32 32, 45 30Z" fill="#c4004a" stroke="white" stroke-width="2.5"/>
      <!-- right tail -->
      <path d="M45 30 C50 38, 68 52, 72 48 C76 44, 58 32, 45 30Z" fill="#c4004a" stroke="white" stroke-width="2.5"/>
      <!-- center knot -->
      <circle cx="45" cy="30" r="8" fill="#ff2d55" stroke="white" stroke-width="3"/>
      <circle cx="43" cy="28" r="2.5" fill="rgba(255,255,255,0.45)"/>
    </g>
  </svg>`,

  flower_daisy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
    <defs><filter id="shadow-f"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.18"/></filter></defs>
    <g filter="url(#shadow-f)">
      ${[0,45,90,135,180,225,270,315].map(a =>
        `<ellipse cx="${40 + Math.round(Math.cos(a*Math.PI/180)*17)}" cy="${40 + Math.round(Math.sin(a*Math.PI/180)*17)}"
          rx="8" ry="12" fill="#FFB6C1" stroke="white" stroke-width="2" opacity="0.92"
          transform="rotate(${a} ${40 + Math.round(Math.cos(a*Math.PI/180)*17)} ${40 + Math.round(Math.sin(a*Math.PI/180)*17)})"/>`
      ).join('')}
      <circle cx="40" cy="40" r="13" fill="#FFD700" stroke="white" stroke-width="3"/>
      <circle cx="36" cy="36" r="4" fill="rgba(255,255,255,0.5)"/>
    </g>
  </svg>`,

  stamp_love: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
    <defs><filter id="shadow-st"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.2"/></filter></defs>
    <g filter="url(#shadow-st)">
      <rect x="8" y="8" width="64" height="64" rx="4" fill="#fff5f7" stroke="#c4637a" stroke-width="3" stroke-dasharray="5 3"/>
      <rect x="14" y="14" width="52" height="52" rx="3" fill="none" stroke="#c4637a" stroke-width="1.5"/>
      <path d="M40 56 C40 56 24 46 24 35 C24 29 28 25 33 25 C36.5 25 39 27 40 30 C41 27 43.5 25 47 25 C52 25 56 29 56 35 C56 46 40 56 40 56Z" fill="#ff2d55"/>
      <text x="40" y="70" text-anchor="middle" font-size="7" fill="#c4637a" font-family="serif" letter-spacing="3" font-weight="bold">LOVE</text>
    </g>
  </svg>`,

  polaroid: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 90" width="80" height="90">
    <defs><filter id="shadow-p"><feDropShadow dx="2" dy="3" stdDeviation="3" flood-opacity="0.22"/></filter></defs>
    <g filter="url(#shadow-p)" transform="rotate(-6 40 45)">
      <rect x="5" y="5" width="70" height="80" rx="3" fill="white" stroke="none"/>
      <!-- photo area -->
      <rect x="10" y="10" width="60" height="52" rx="2" fill="url(#pg)"/>
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffd6e7"/>
          <stop offset="100%" stop-color="#c4637a"/>
        </linearGradient>
      </defs>
      <!-- small heart in photo -->
      <path d="M40 42 C40 42 30 35 30 29 C30 25 33 22 36 22 C38 22 39.5 23.5 40 25 C40.5 23.5 42 22 44 22 C47 22 50 25 50 29 C50 35 40 42 40 42Z" fill="white" opacity="0.7"/>
      <!-- caption line -->
      <line x1="15" y1="74" x2="65" y2="74" stroke="#ddd" stroke-width="1"/>
      <text x="40" y="82" text-anchor="middle" font-size="9" fill="#8b5e5e" font-family="cursive">us ♥</text>
      <!-- tape -->
      <rect x="30" y="2" width="20" height="10" rx="2" fill="rgba(255,182,193,0.7)" transform="rotate(0)"/>
    </g>
  </svg>`,

  sparkle_burst: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 70" width="70" height="70">
    ${[0,45,90,135,180,225,270,315].map((a,i) => {
      const long = i%2===0;
      const r = long ? 30 : 18;
      const x2 = 35 + Math.round(Math.cos(a*Math.PI/180)*r);
      const y2 = 35 + Math.round(Math.sin(a*Math.PI/180)*r);
      return `<line x1="35" y1="35" x2="${x2}" y2="${y2}" stroke="#d4a853" stroke-width="${long?2.5:1.5}" stroke-linecap="round" opacity="${long?1:0.6}"/>`;
    }).join('')}
    <circle cx="35" cy="35" r="6" fill="#d4a853"/>
    <circle cx="35" cy="35" r="3" fill="#fff0a0"/>
  </svg>`,

  washi_strip: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 24" width="120" height="24">
    <rect width="120" height="24" rx="3" fill="rgba(255,182,193,0.6)"/>
    ${Array.from({length:10},(_,i)=>`<circle cx="${6+i*12}" cy="12" r="2.5" fill="rgba(255,255,255,0.5)"/>`).join('')}
    <rect width="120" height="24" rx="3" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
  </svg>`,

  washi_gold: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 22" width="100" height="22">
    <rect width="100" height="22" rx="3" fill="rgba(212,168,83,0.55)"/>
    ${Array.from({length:8},(_,i)=>`<path d="M${8+i*12} 4 L${14+i*12} 18 M${14+i*12} 4 L${8+i*12} 18" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>`).join('')}
  </svg>`,
};

// ─── Sticker layout per chapter ───────────────────────────────

type StickerDef = {
  key: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  rotate?: number;
  width?: number;
  zIndex?: number;
};

const CHAPTER_STICKERS: Record<string, StickerDef[]> = {
  'chapter-1': [
    { key: 'bow',          top: '12%',    right: '3%',   rotate:  10, width: 90 },
    { key: 'star4',        top: '18%',    left:  '2%',   rotate: -8,  width: 70 },
    { key: 'washi_strip',  top: '8%',     left:  '15%',  rotate:  -5, width: 120 },
    { key: 'sparkle_burst',bottom: '15%', right: '4%',   rotate:  15, width: 65 },
    { key: 'polaroid',     bottom: '10%', left:  '3%',   rotate: -8,  width: 80 },
  ],
  'chapter-2': [
    { key: 'heart_cute',   top:    '10%', right: '3%',   rotate:  8,  width: 75 },
    { key: 'washi_gold',   bottom: '22%', left:  '2%',   rotate: -10, width: 100 },
    { key: 'sparkle_burst',top:    '20%', left:  '4%',   rotate: -12, width: 60 },
  ],
  'chapter-3': [
    { key: 'butterfly',    top:    '8%',  left:  '2%',   rotate: -5,  width: 88 },
    { key: 'letter_love',  top:    '15%', right: '2%',   rotate:  7,  width: 88 },
    { key: 'star4',        bottom: '18%', left:  '3%',   rotate: -10, width: 65 },
    { key: 'washi_strip',  bottom: '8%',  right: '10%',  rotate:  8,  width: 110 },
  ],
  'chapter-4': [
    { key: 'moon_stars',   top:    '10%', right: '2%',   rotate:  5,  width: 80 },
    { key: 'washi_gold',   top:    '6%',  left:  '5%',   rotate: -8,  width: 90 },
    { key: 'sparkle_burst',bottom: '12%', right: '4%',   rotate:  20, width: 60 },
  ],
  'chapter-5': [
    { key: 'flower_daisy', top:    '8%',  left:  '2%',   rotate: -12, width: 80 },
    { key: 'rainbow',      top:    '12%', right: '2%',   rotate:  5,  width: 90 },
    { key: 'polaroid',     bottom: '10%', right: '3%',   rotate:  9,  width: 78 },
    { key: 'washi_strip',  bottom: '20%', left:  '3%',   rotate: -5,  width: 110 },
  ],
  'chapter-6': [
    { key: 'stamp_love',   top:    '10%', right: '3%',   rotate:  6,  width: 78 },
    { key: 'star4',        bottom: '14%', left:  '2%',   rotate: -14, width: 68 },
    { key: 'washi_gold',   top:    '6%',  left:  '8%',   rotate:  4,  width: 95 },
  ],
  'chapter-7': [
    { key: 'bow',          top:    '8%',  left:  '2%',   rotate: -8,  width: 90 },
    { key: 'rose',         top:    '12%', right: '2%',   rotate:  10, width: 78 },
    { key: 'heart_cute',   bottom: '12%', right: '3%',   rotate:  6,  width: 72 },
    { key: 'washi_strip',  bottom: '6%',  left:  '4%',   rotate: -6,  width: 115 },
  ],
  'chapter-8': [
    { key: 'letter_love',  top:    '10%', left:  '2%',   rotate: -7,  width: 88 },
    { key: 'moon_stars',   bottom: '12%', right: '3%',   rotate:  5,  width: 76 },
    { key: 'sparkle_burst',top:    '20%', right: '5%',   rotate:  18, width: 60 },
  ],
  'chapter-9': [
    { key: 'rose',         top:    '8%',  left:  '2%',   rotate: -10, width: 80 },
    { key: 'flower_daisy', top:    '10%', right: '2%',   rotate:  8,  width: 78 },
    { key: 'rainbow',      bottom: '8%',  left:  '3%',   rotate: -4,  width: 88 },
    { key: 'stamp_love',   bottom: '14%', right: '2%',   rotate:  -6, width: 78 },
    { key: 'washi_gold',   top:    '5%',  right: '10%',  rotate: -10, width: 90 },
  ],
};

export default function ScrapbookStickers() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const inserted: HTMLElement[] = [];

    Object.entries(CHAPTER_STICKERS).forEach(([chapterId, stickers]) => {
      const section = document.getElementById(chapterId);
      if (!section) return;

      // Make sure section can hold absolutely positioned children
      const existing = getComputedStyle(section).position;
      if (existing === 'static') section.style.position = 'relative';
      section.style.overflow = 'visible'; // allow stickers to peek out slightly

      stickers.forEach(s => {
        const svg = STICKER_SVGS[s.key];
        if (!svg) return;

        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
          position: absolute;
          z-index: 50;
          pointer-events: none;
          width: ${s.width || 80}px;
          ${s.top    ? `top: ${s.top};`    : ''}
          ${s.bottom ? `bottom: ${s.bottom};` : ''}
          ${s.left   ? `left: ${s.left};`  : ''}
          ${s.right  ? `right: ${s.right}; ` : ''}
          transform: rotate(${s.rotate || 0}deg);
          filter: drop-shadow(2px 3px 8px rgba(0,0,0,0.18));
          transition: transform 0.3s ease;
        `;
        wrapper.innerHTML = svg;

        // Scale SVG to wrapper width
        const svgEl = wrapper.querySelector('svg');
        if (svgEl) {
          svgEl.style.width = '100%';
          svgEl.style.height = 'auto';
        }

        section.appendChild(wrapper);
        inserted.push(wrapper);
      });
    });

    return () => {
      inserted.forEach(el => el.remove());
    };
  }, []);

  return null;
}
