"use client";

import { useEffect } from 'react';

// ─── Pinterest Aesthetic Scrapbook Stickers ─────────────────────
// Kraft paper, torn edges, vintage botanical, cursive quotes

const STICKERS: Record<string, string> = {

  // ── Torn kraft paper — "I love you..." quote ────────────────
  torn_quote_main: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 170" width="260" height="170">
  <defs>
    <filter id="ps1"><feDropShadow dx="2" dy="4" stdDeviation="5" flood-opacity="0.28"/></filter>
    <filter id="ps1t"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feDisplacementMap in="SourceGraphic" scale="2"/></filter>
  </defs>
  <path d="M12,14 L22,8 L32,13 L42,6 L54,11 L64,7 L76,12 L86,7 L98,13 L110,7 L122,12 L134,7 L146,12 L158,7 L170,11 L182,7 L194,12 L206,7 L218,12 L230,7 L242,11 L250,9
           L250,148 L240,154 L228,149 L216,155 L204,150 L190,156 L178,151 L164,156 L150,151 L136,156 L122,151 L108,156 L94,151 L80,156 L66,151 L52,156 L38,151 L24,156 L12,151
           Z"
        fill="#c8a882" filter="url(#ps1)"/>
  <path d="M12,14 L22,8 L32,13 L42,6 L54,11 L64,7 L250,9 L250,148 L240,154 L12,151 Z" fill="rgba(160,120,80,0.08)"/>
  <text x="130" y="52" text-anchor="middle" font-family="'Dancing Script',cursive" font-size="15" fill="#4a2f1a" opacity="0.95">"I love you, and that's</text>
  <text x="130" y="74" text-anchor="middle" font-family="'Dancing Script',cursive" font-size="15" fill="#4a2f1a" opacity="0.95">the beginning and end</text>
  <text x="130" y="96" text-anchor="middle" font-family="'Dancing Script',cursive" font-size="15" fill="#4a2f1a" opacity="0.95">of everything."</text>
  <line x1="70" y1="112" x2="190" y2="112" stroke="#8b6c50" stroke-width="0.8" opacity="0.5"/>
  <text x="130" y="126" text-anchor="middle" font-family="'Lato',sans-serif" font-size="8" fill="#7a5c3a" letter-spacing="2" font-weight="300">— F. SCOTT FITZGERALD</text>
  </svg>`,

  // ── Vintage botanical rose ──────────────────────────────────
  vintage_rose: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 200" width="140" height="200">
  <defs><filter id="rsh"><feDropShadow dx="1" dy="3" stdDeviation="4" flood-opacity="0.2"/></filter></defs>
  <g filter="url(#rsh)">
  <!-- stem -->
  <path d="M70 200 Q68 170 70 145" stroke="#4a6741" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- leaves -->
  <path d="M70 175 Q50 160 44 145 Q58 148 70 162" fill="#5a7a51" opacity="0.9"/>
  <path d="M70 160 Q88 148 94 135 Q82 140 70 155" fill="#4a6741" opacity="0.85"/>
  <!-- outer petals -->
  <ellipse cx="70" cy="100" rx="32" ry="24" fill="#8b1a2a" opacity="0.5"/>
  <ellipse cx="70" cy="100" rx="28" ry="20" fill="#9b2232" opacity="0.6" transform="rotate(40 70 100)"/>
  <ellipse cx="70" cy="100" rx="28" ry="20" fill="#9b2232" opacity="0.6" transform="rotate(-40 70 100)"/>
  <ellipse cx="70" cy="100" rx="28" ry="20" fill="#8b1a2a" opacity="0.55" transform="rotate(80 70 100)"/>
  <!-- middle petals -->
  <ellipse cx="70" cy="98" rx="22" ry="17" fill="#a52834" opacity="0.75"/>
  <ellipse cx="70" cy="98" rx="20" ry="15" fill="#b83040" opacity="0.8" transform="rotate(30 70 98)"/>
  <ellipse cx="70" cy="98" rx="20" ry="15" fill="#b83040" opacity="0.8" transform="rotate(-30 70 98)"/>
  <!-- inner petals -->
  <ellipse cx="70" cy="96" rx="15" ry="12" fill="#c4404e" opacity="0.9"/>
  <ellipse cx="70" cy="96" rx="12" ry="9"  fill="#d04858" opacity="0.95" transform="rotate(20 70 96)"/>
  <!-- center -->
  <ellipse cx="70" cy="94" rx="9" ry="7" fill="#7a1020"/>
  <circle cx="68" cy="92" r="2.5" fill="rgba(255,200,200,0.3)"/>
  <!-- botanical lines -->
  <path d="M44 145 Q42 138 45 132" stroke="#4a6741" stroke-width="1.5" fill="none" opacity="0.6"/>
  <path d="M94 135 Q96 128 93 122" stroke="#4a6741" stroke-width="1.5" fill="none" opacity="0.6"/>
  </g>
  </svg>`,

  // ── Torn cream paper — "Darling, you're perfect." ──────────
  torn_darling: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 130" width="200" height="130">
  <defs><filter id="ds"><feDropShadow dx="2" dy="3" stdDeviation="4" flood-opacity="0.22"/></filter></defs>
  <path d="M8,10 L18,5 L28,9 L40,4 L52,8 L64,4 L76,8 L90,4 L102,8 L116,4 L128,8 L142,4 L154,8 L166,4 L178,8 L190,4 L198,7
           L198,112 L188,118 L176,113 L162,118 L148,113 L132,118 L116,113 L100,118 L84,113 L68,118 L52,113 L36,118 L20,113 L8,118
           Z"
        fill="#f0e6d2" filter="url(#ds)"/>
  <text x="100" y="42" text-anchor="middle" font-family="'Dancing Script',cursive" font-size="13" fill="#5a3d2b">"My darling,</text>
  <text x="100" y="61" text-anchor="middle" font-family="'Dancing Script',cursive" font-size="13" fill="#5a3d2b">all I want is to be</text>
  <text x="100" y="80" text-anchor="middle" font-family="'Dancing Script',cursive" font-size="13" fill="#5a3d2b">your moon and show you</text>
  <text x="100" y="99" text-anchor="middle" font-family="'Dancing Script',cursive" font-size="13" fill="#5a3d2b">all the little stars."</text>
  </svg>`,

  // ── "love of my life" cursive text sticker ─────────────────
  love_of_my_life: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 80" width="220" height="80">
  <defs><filter id="ls"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.2"/></filter></defs>
  <path d="M10,10 L20,6 L30,10 L210,10 L210,70 L200,74 L190,70 L10,70 Z" fill="#fff8f0" filter="url(#ls)" opacity="0"/>
  <text x="110" y="32" text-anchor="middle" font-family="'Dancing Script',cursive" font-size="20" fill="#8b2252" font-style="italic" filter="url(#ls)">love of my life</text>
  <path d="M18 44 Q110 38 202 44" stroke="#c4637a" stroke-width="1.2" fill="none" opacity="0.5" stroke-dasharray="4 3"/>
  <text x="110" y="60" text-anchor="middle" font-family="'Dancing Script',cursive" font-size="13" fill="#c4637a">♥ always &amp; forever ♥</text>
  </svg>`,

  // ── Watercolor pink flower ──────────────────────────────────
  watercolor_flower: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  <defs>
    <filter id="wf"><feGaussianBlur stdDeviation="1.5" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
    <filter id="wfs"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.18"/></filter>
    <radialGradient id="p1" cx="40%" cy="35%"><stop offset="0%" stop-color="#f5c6d0"/><stop offset="100%" stop-color="#c8607a" stop-opacity="0.7"/></radialGradient>
    <radialGradient id="p2" cx="40%" cy="35%"><stop offset="0%" stop-color="#f0b8c8"/><stop offset="100%" stop-color="#b8506a" stop-opacity="0.65"/></radialGradient>
  </defs>
  <g filter="url(#wfs)">
  <ellipse cx="80" cy="55"  rx="28" ry="40" fill="url(#p1)" opacity="0.85" filter="url(#wf)"/>
  <ellipse cx="80" cy="55"  rx="28" ry="40" fill="url(#p2)" opacity="0.7" transform="rotate(50 80 80)" filter="url(#wf)"/>
  <ellipse cx="80" cy="55"  rx="28" ry="40" fill="url(#p1)" opacity="0.7" transform="rotate(100 80 80)" filter="url(#wf)"/>
  <ellipse cx="80" cy="55"  rx="28" ry="40" fill="url(#p2)" opacity="0.75" transform="rotate(150 80 80)" filter="url(#wf)"/>
  <ellipse cx="80" cy="55"  rx="28" ry="40" fill="url(#p1)" opacity="0.7" transform="rotate(200 80 80)" filter="url(#wf)"/>
  <circle cx="80" cy="80" r="16" fill="#f0d060" opacity="0.9" filter="url(#wf)"/>
  <circle cx="80" cy="80" r="10" fill="#e8c040" opacity="0.95"/>
  <circle cx="76" cy="76" r="4"  fill="rgba(255,255,200,0.6)"/>
  </g>
  </svg>`,

  // ── Torn paper — "All mine? All yours." ────────────────────
  all_mine_yours: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 140" width="200" height="140">
  <defs><filter id="ams"><feDropShadow dx="2" dy="3" stdDeviation="5" flood-opacity="0.25"/></filter></defs>
  <path d="M6,8 L16,4 L26,8 L38,3 L50,7 L64,3 L78,7 L92,3 L106,7 L120,3 L134,7 L148,3 L162,7 L176,3 L190,7 L198,5
           L198,125 L188,131 L174,126 L158,132 L140,127 L122,132 L104,127 L86,132 L68,127 L50,132 L32,127 L16,132 L6,127
           Z"
        fill="#f5efe5" filter="url(#ams)"/>
  <!-- heart doodle -->
  <path d="M96 52 C96 52 88 46 88 40 C88 37 90 35 93 35 C94.5 35 96 36.5 96 38 C96 36.5 97.5 35 99 35 C102 35 104 37 104 40 C104 46 96 52 96 52Z" fill="none" stroke="#c4637a" stroke-width="2"/>
  <text x="100" y="74" text-anchor="middle" font-family="'Dancing Script',cursive" font-size="22" fill="#8b2252" font-weight="bold">"All mine?"</text>
  <text x="100" y="100" text-anchor="middle" font-family="'Dancing Script',cursive" font-size="22" fill="#8b2252" font-weight="bold">"All yours."</text>
  <text x="100" y="118" text-anchor="middle" font-family="'Lato',sans-serif" font-size="8" fill="#c4637a" letter-spacing="1" opacity="0.7">— always</text>
  </svg>`,

  // ── Small torn quote — botanical style ─────────────────────
  quote_small_burn: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 110" width="180" height="110">
  <defs>
    <filter id="bsh"><feDropShadow dx="2" dy="3" stdDeviation="4" flood-opacity="0.25"/></filter>
    <radialGradient id="bg1" cx="50%" cy="50%"><stop offset="60%" stop-color="#d4b896"/><stop offset="100%" stop-color="#8b6040" stop-opacity="0.4"/></radialGradient>
  </defs>
  <path d="M10,8 L20,4 L32,8 L44,4 L56,8 L70,4 L84,8 L98,4 L112,8 L126,4 L140,8 L154,4 L168,8 L176,5
           L176,95 L166,101 L152,96 L136,101 L118,96 L100,101 L82,96 L64,101 L46,96 L28,101 L12,96 L4,101 L4,8
           Z"
        fill="url(#bg1)" filter="url(#bsh)"/>
  <!-- burned corner effect -->
  <path d="M4,8 Q10,14 8,22 Q6,16 4,12Z" fill="#5a3520" opacity="0.5"/>
  <path d="M176,5 Q170,12 174,22 Q178,14 178,8Z" fill="#5a3520" opacity="0.4"/>
  <text x="90" y="40" text-anchor="middle" font-family="'Dancing Script',cursive" font-size="12.5" fill="#3d2414">"Our love is a kind of love</text>
  <text x="90" y="58" text-anchor="middle" font-family="'Dancing Script',cursive" font-size="12.5" fill="#3d2414">that I couldn't prepare for</text>
  <text x="90" y="76" text-anchor="middle" font-family="'Dancing Script',cursive" font-size="12.5" fill="#3d2414">in a hundred lifetimes."</text>
  </svg>`,

  // ── Botanical herb/lavender sprig ──────────────────────────
  botanical_sprig: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 180" width="100" height="180">
  <defs><filter id="bsp"><feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.2"/></filter></defs>
  <g filter="url(#bsp)">
  <!-- main stem -->
  <path d="M50 175 Q48 140 50 100 Q52 60 50 30" stroke="#5a7a4a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- lavender buds -->
  ${[30,42,54,66,78,90].map((y,i) => {
    const x = 50 + (i%2===0 ? -12 : 12);
    const mx = 50 + (i%2===0 ? -6 : 6);
    return `<path d="M50 ${y} Q${mx} ${y-4} ${x} ${y-2}" stroke="#6b7a9a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <ellipse cx="${x}" cy="${y-4}" rx="5" ry="8" fill="#8090b8" opacity="0.85" transform="rotate(${i%2===0?-20:20} ${x} ${y-4})"/>`;
  }).join('')}
  <!-- small leaves -->
  <path d="M50 110 Q36 104 32 96 Q44 100 50 110Z" fill="#5a7a4a" opacity="0.85"/>
  <path d="M50 130 Q64 124 68 116 Q56 120 50 130Z" fill="#4a6a3a" opacity="0.8"/>
  <!-- twine tie -->
  <ellipse cx="50" cy="160" rx="10" ry="4" fill="none" stroke="#c8a870" stroke-width="2"/>
  <path d="M42 158 Q50 165 58 158" stroke="#c8a870" stroke-width="1.8" fill="none"/>
  </g>
  </svg>`,

  // ── "You make me happy" torn beige card ────────────────────
  you_make_me: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="200" height="120">
  <defs><filter id="ymh"><feDropShadow dx="2" dy="3" stdDeviation="4" flood-opacity="0.22"/></filter></defs>
  <path d="M8,6 L20,2 L32,6 L46,2 L60,6 L76,2 L92,6 L108,2 L124,6 L140,2 L156,6 L172,2 L186,6 L196,3
           L196,106 L184,112 L168,107 L150,112 L130,107 L110,112 L90,107 L70,112 L50,107 L30,112 L12,107 L4,112 L4,6
           Z"
        fill="#faf3e8" filter="url(#ymh)"/>
  <text x="100" y="38" text-anchor="middle" font-family="'Dancing Script',cursive" font-size="13" fill="#6b4226">"You make me happy in a way</text>
  <text x="100" y="58" text-anchor="middle" font-family="'Dancing Script',cursive" font-size="13" fill="#6b4226">that no one else can."</text>
  <!-- small floral deco -->
  <circle cx="30"  cy="85" r="5"  fill="#c4637a" opacity="0.6"/>
  <circle cx="170" cy="85" r="5"  fill="#c4637a" opacity="0.6"/>
  <circle cx="26"  cy="82" r="3"  fill="#d4a853" opacity="0.5"/>
  <circle cx="174" cy="82" r="3"  fill="#d4a853" opacity="0.5"/>
  <path d="M40 85 Q100 78 160 85" stroke="#c4637a" stroke-width="0.8" fill="none" opacity="0.3" stroke-dasharray="3 4"/>
  <text x="100" y="96" text-anchor="middle" font-family="'Lato',sans-serif" font-size="7.5" fill="#a07050" letter-spacing="1.5">♥ &amp; I always will ♥</text>
  </svg>`,

  // ── Washi tape kraft paper strip ───────────────────────────
  washi_kraft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 26" width="140" height="26">
  <rect width="140" height="26" rx="3" fill="rgba(200,168,130,0.65)"/>
  ${Array.from({length:11},(_,i)=>`
    <path d="M${4+i*13} 5 Q${10+i*13} 13 ${4+i*13} 21" stroke="rgba(139,100,60,0.3)" stroke-width="1" fill="none"/>
    <path d="M${10+i*13} 5 Q${4+i*13} 13 ${10+i*13} 21" stroke="rgba(139,100,60,0.3)" stroke-width="1" fill="none"/>
  `).join('')}
  </svg>`,

  washi_pink_floral: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 24" width="130" height="24">
  <rect width="130" height="24" rx="3" fill="rgba(255,182,193,0.55)"/>
  ${Array.from({length:7},(_,i)=>`
    <circle cx="${10+i*18}" cy="12" r="5" fill="rgba(255,255,255,0.4)" stroke="rgba(196,99,122,0.3)" stroke-width="1"/>
    <circle cx="${10+i*18}" cy="12" r="2" fill="rgba(196,99,122,0.4)"/>
    <circle cx="${18+i*18}" cy="6"  r="2.5" fill="rgba(255,255,255,0.35)" stroke="rgba(196,99,122,0.25)" stroke-width="0.8"/>
  `).join('')}
  </svg>`,

  // ── "he's more myself than I am" quote ─────────────────────
  he_more_myself: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 130" width="190" height="130">
  <defs><filter id="hms"><feDropShadow dx="2" dy="3" stdDeviation="4" flood-opacity="0.2"/></filter></defs>
  <path d="M6,8 L18,3 L30,7 L44,3 L58,7 L74,3 L90,7 L106,3 L122,7 L138,3 L154,7 L170,3 L184,7 L190,5
           L190,115 L178,121 L162,116 L144,121 L124,116 L104,121 L84,116 L64,121 L44,116 L24,121 L8,116 L4,121 L4,8
           Z"
        fill="#ede4d4" filter="url(#hms)"/>
  <text x="96" y="36" text-anchor="middle" font-family="'Dancing Script',cursive" font-size="12" fill="#4a3420">"He's more myself than I am.</text>
  <text x="96" y="56" text-anchor="middle" font-family="'Dancing Script',cursive" font-size="12" fill="#4a3420">Whatever our souls are made of,</text>
  <text x="96" y="76" text-anchor="middle" font-family="'Dancing Script',cursive" font-size="12" fill="#4a3420">his and mine are the same."</text>
  <line x1="40" y1="90" x2="152" y2="90" stroke="#8b6a4a" stroke-width="0.7" opacity="0.4"/>
  <text x="96" y="104" text-anchor="middle" font-family="'Lato',sans-serif" font-size="7.5" fill="#8b6a4a" letter-spacing="1.5">— EMILY BRONTË</text>
  </svg>`,

};

// ─── Chapter → sticker layout ─────────────────────────────────

type SD = { key: string; top?: string; bottom?: string; left?: string; right?: string; rotate?: number };

const LAYOUT: Record<string, SD[]> = {
  'chapter-1': [
    { key: 'torn_quote_main',   top: '8%',    left: '2%',   rotate: -3  },
    { key: 'botanical_sprig',   top: '10%',   right: '3%',  rotate: 6   },
    { key: 'washi_pink_floral', top: '4%',    left: '28%',  rotate: -4  },
    { key: 'star4_g',           bottom: '8%', right: '4%',  rotate: 12  },
  ],
  'chapter-2': [
    { key: 'torn_darling',      top: '8%',    right: '2%',  rotate: 4   },
    { key: 'washi_kraft',       top: '5%',    left: '10%',  rotate: -6  },
    { key: 'love_of_my_life',   bottom: '10%',left: '3%',   rotate: -3  },
  ],
  'chapter-3': [
    { key: 'vintage_rose',      top: '6%',    right: '2%',  rotate: 5   },
    { key: 'all_mine_yours',    bottom: '6%', left: '2%',   rotate: -5  },
    { key: 'washi_kraft',       top: '4%',    left: '6%',   rotate: 4   },
    { key: 'washi_pink_floral', bottom: '18%',right: '4%',  rotate: -8  },
  ],
  'chapter-4': [
    { key: 'quote_small_burn',  top: '7%',    left: '2%',   rotate: -4  },
    { key: 'botanical_sprig',   bottom: '8%', right: '3%',  rotate: -6  },
    { key: 'washi_pink_floral', top: '4%',    right: '15%', rotate: 6   },
  ],
  'chapter-5': [
    { key: 'you_make_me',       top: '8%',    right: '2%',  rotate: 4   },
    { key: 'watercolor_flower', top: '5%',    left: '2%',   rotate: -8  },
    { key: 'washi_kraft',       bottom: '12%',left: '5%',   rotate: -4  },
    { key: 'love_of_my_life',   bottom: '7%', right: '4%',  rotate: 3   },
  ],
  'chapter-6': [
    { key: 'he_more_myself',    top: '8%',    left: '2%',   rotate: -3  },
    { key: 'vintage_rose',      top: '10%',   right: '2%',  rotate: 8   },
    { key: 'washi_pink_floral', bottom: '10%',left: '10%',  rotate: 5   },
  ],
  'chapter-7': [
    { key: 'torn_quote_main',   top: '6%',    right: '2%',  rotate: 4   },
    { key: 'botanical_sprig',   bottom: '6%', left: '2%',   rotate: -5  },
    { key: 'washi_kraft',       top: '4%',    left: '5%',   rotate: -6  },
    { key: 'watercolor_flower', bottom: '8%', right: '4%',  rotate: 10  },
  ],
  'chapter-8': [
    { key: 'torn_darling',      top: '7%',    left: '2%',   rotate: -4  },
    { key: 'quote_small_burn',  bottom: '8%', right: '2%',  rotate: 5   },
    { key: 'washi_pink_floral', top: '3%',    right: '12%', rotate: -5  },
  ],
  'chapter-9': [
    { key: 'all_mine_yours',    top: '6%',    left: '2%',   rotate: -5  },
    { key: 'vintage_rose',      top: '8%',    right: '2%',  rotate: 6   },
    { key: 'love_of_my_life',   bottom: '14%',left: '4%',   rotate: -3  },
    { key: 'washi_kraft',       top: '3%',    left: '18%',  rotate: 4   },
    { key: 'watercolor_flower', bottom: '7%', right: '3%',  rotate: -8  },
  ],
};

export default function ScrapbookStickers() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const inserted: HTMLElement[] = [];

    Object.entries(LAYOUT).forEach(([chapterId, stickers]) => {
      const section = document.getElementById(chapterId);
      if (!section) return;

      const pos = getComputedStyle(section).position;
      if (pos === 'static') section.style.position = 'relative';

      stickers.forEach(s => {
        const svg = STICKERS[s.key];
        if (!svg) return;

        const el = document.createElement('div');
        el.style.cssText = [
          'position:absolute',
          'z-index:50',
          'pointer-events:none',
          s.top    ? `top:${s.top}`       : '',
          s.bottom ? `bottom:${s.bottom}` : '',
          s.left   ? `left:${s.left}`     : '',
          s.right  ? `right:${s.right}`   : '',
          `transform:rotate(${s.rotate ?? 0}deg)`,
        ].filter(Boolean).join(';');

        el.innerHTML = svg;

        const svgEl = el.querySelector('svg');
        if (svgEl) {
          svgEl.style.display = 'block';
          svgEl.style.maxWidth = '100%';
        }

        section.appendChild(el);
        inserted.push(el);
      });
    });

    return () => inserted.forEach(el => el.remove());
  }, []);

  return null;
}
