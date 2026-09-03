"use client";
import React, { useState } from 'react';
import { TilingSprite, useTick } from '@pixi/react';
import * as PIXI from 'pixi.js';

export default function ParallaxBackground({ viewportRef }) {
  // Use a generic placeholder texture since we don't have assets yet
  const [bgTexture] = useState(() => {
    // Creating a simple checkerboard pattern procedurally for testing
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillRect(32, 32, 32, 32);
    return PIXI.Texture.from(canvas);
  });

  const [positions, setPositions] = useState({
    layer1: { x: 0, y: 0 },
    layer2: { x: 0, y: 0 },
  });

  useTick(() => {
    if (viewportRef && viewportRef.current) {
      // The viewport center represents the camera position
      const cameraX = viewportRef.current.center.x;
      const cameraY = viewportRef.current.center.y;
      
      setPositions({
        // Foreground layer moves slightly slower than the camera 
        // to create a feeling of depth
        layer1: { 
          x: -cameraX * 0.2, 
          y: -cameraY * 0.2 
        },
        // Background layer moves even slower, feeling further away
        layer2: { 
          x: -cameraX * 0.5, 
          y: -cameraY * 0.5 
        }
      });
    }
  });

  return (
    <>
      {/* Background layer (furthest) */}
      <TilingSprite
        texture={bgTexture}
        width={3000} // Matches world width
        height={3000} // Matches world height
        tilePosition={positions.layer2}
        alpha={0.3}
        tint={0x555555}
      />
      
      {/* Foreground layer (closer) */}
      <TilingSprite
        texture={bgTexture}
        width={3000}
        height={3000}
        tilePosition={positions.layer1}
        alpha={0.5}
        tint={0x888888}
      />
    </>
  );
}
