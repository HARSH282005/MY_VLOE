"use client";
import React, { useRef, useState, useEffect } from 'react';
import { Stage } from '@pixi/react';
import { Cull } from 'pixi-cull';
import ViewportWrapper from './ViewportWrapper';
import GameEngine from './GameEngine';
import ParallaxBackground from './ParallaxBackground';
import ZoneModal from '../UI/ZoneModal';

export default function InteractiveMap() {
  const [activeZone, setActiveZone] = useState(null);
  const viewportRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const cullRef = useRef(null);

  // Handle window resizing to keep canvas full screen
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
      
      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Initialize and bind pixi-culling to viewport
  useEffect(() => {
    if (viewportRef.current) {
      const viewport = viewportRef.current;
      
      // Create Cull instance (SpatialHash is efficient for maps with many scattered objects)
      const cull = new Cull.SpatialHash();
      
      // Track all children added to the viewport
      cull.addContainer(viewport);
      
      // Perform initial cull based on visible bounds
      cull.cull(viewport.getVisibleBounds());

      // Bind cull update to viewport movement
      viewport.on('moved', () => {
        if (viewport.dirty) {
          cull.cull(viewport.getVisibleBounds());
          viewport.dirty = false;
        }
      });
      
      cullRef.current = cull;
    }
  }, [viewportRef.current]); // Re-run if viewport instance changes

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* PixiJS Canvas Layer */}
      <Stage 
        width={dimensions.width} 
        height={dimensions.height} 
        options={{ backgroundColor: 0x1a1a2e }}
      >
        <ViewportWrapper ref={viewportRef}>
          {/* Parallax elements */}
          <ParallaxBackground viewportRef={viewportRef} />
          
          {/* Game engine manages physics bodies, character, and triggers */}
          <GameEngine viewportRef={viewportRef} onZoneEnter={setActiveZone} />
        </ViewportWrapper>
      </Stage>

      {/* React UI Overlay Layer */}
      <ZoneModal 
        activeZone={activeZone} 
        onClose={() => setActiveZone(null)} 
      />
      
      {/* HUD Instructions */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        fontFamily: 'monospace',
        background: 'rgba(0,0,0,0.5)',
        padding: '10px',
        borderRadius: '5px',
        pointerEvents: 'none'
      }}>
        WASD to move.<br/>
        Find the green trigger zones.
      </div>
    </div>
  );
}
