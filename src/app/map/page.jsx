import dynamic from 'next/dynamic';
import React from 'react';

// Wrap the Pixi World Map route with next/dynamic to enable automatic code-splitting 
// and lazy load the heavy PixiJS + Matter.js assets only when this route is visited.
// ssr: false is required because PixiJS relies on browser APIs (window, document, etc.)
const InteractiveMapLazy = dynamic(
  () => import('../../components/WorldMap/InteractiveMap'),
  { 
    ssr: false,
    loading: () => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1a1a2e', color: 'white' }}>
        Loading interactive map assets...
      </div>
    )
  }
);

export default function MapPage() {
  return (
    <main>
      <InteractiveMapLazy />
    </main>
  );
}
