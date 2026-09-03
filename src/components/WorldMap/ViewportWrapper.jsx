"use client";
import React, { forwardRef, useEffect } from 'react';
import { useApp } from '@pixi/react';
import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';

const ViewportWrapper = forwardRef((props, ref) => {
  const app = useApp();
  
  const viewport = React.useMemo(() => {
    const vp = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: 3000,
      worldHeight: 3000,
      events: app.renderer.events, // Requires pixi.js v7+ events
    });
    
    vp.drag().pinch().wheel().decelerate();
    return vp;
  }, [app]);

  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') ref(viewport);
      else ref.current = viewport;
    }
    
    return () => {
      viewport.destroy();
    };
  }, [viewport, ref]);

  return <primitive object={viewport}>{props.children}</primitive>;
});

export default ViewportWrapper;
