"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Graphics, useTick } from '@pixi/react';
import Matter from 'matter-js';

export default function GameEngine({ viewportRef, onZoneEnter }) {
  const engineRef = useRef(null);
  const playerRef = useRef(null);
  
  // Track position for rendering
  const [playerPos, setPlayerPos] = useState({ x: 1500, y: 1500 });
  const [zones, setZones] = useState([]);

  // Input states
  const keys = useRef({ w: false, a: false, s: false, d: false });

  useEffect(() => {
    // Initialize Physics Engine
    const { Engine, World, Bodies, Events } = Matter;

    const engine = Engine.create();
    engine.gravity.y = 0; // Top-down, no gravity
    engineRef.current = engine;

    // Create the player body
    const player = Bodies.circle(1500, 1500, 20, { 
      frictionAir: 0.1, 
      restitution: 0 
    });
    playerRef.current = player;

    // Create trigger zones (sensors)
    const triggerZone1 = Bodies.rectangle(1700, 1500, 150, 150, { 
      isStatic: true, 
      isSensor: true, 
      label: 'Scrapbook Editor' 
    });
    
    const triggerZone2 = Bodies.rectangle(1300, 1600, 150, 150, { 
      isStatic: true, 
      isSensor: true, 
      label: 'Memory Vault' 
    });

    World.add(engine.world, [player, triggerZone1, triggerZone2]);
    
    // Save zones for rendering debug graphics
    setZones([
      { x: 1700, y: 1500, w: 150, h: 150, label: 'Scrapbook Editor' }, 
      { x: 1300, y: 1600, w: 150, h: 150, label: 'Memory Vault' }
    ]);

    // Handle Collisions (Zone Triggers)
    Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        if (bodyA === player && bodyB.isSensor) {
          onZoneEnter(bodyB.label);
        } else if (bodyB === player && bodyA.isSensor) {
          onZoneEnter(bodyA.label);
        }
      });
    });

    // Handle Keyboard Inputs
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (keys.current.hasOwnProperty(key)) keys.current[key] = true;
    };
    
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (keys.current.hasOwnProperty(key)) keys.current[key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      Engine.clear(engine);
    };
  }, [onZoneEnter]);

  // Main Game Loop (Synced with PixiJS ticker)
  useTick((delta) => {
    if (!engineRef.current || !playerRef.current) return;
    const player = playerRef.current;

    // Movement logic (apply forces based on input)
    const forceMagnitude = 0.002;
    if (keys.current.w) Matter.Body.applyForce(player, player.position, { x: 0, y: -forceMagnitude });
    if (keys.current.s) Matter.Body.applyForce(player, player.position, { x: 0, y: forceMagnitude });
    if (keys.current.a) Matter.Body.applyForce(player, player.position, { x: -forceMagnitude, y: 0 });
    if (keys.current.d) Matter.Body.applyForce(player, player.position, { x: forceMagnitude, y: 0 });

    // Step physics engine
    // PixiJS useTick delta is generally ~1 for 60fps, meaning time passed is ~16.66ms
    Matter.Engine.update(engineRef.current, delta * 16.66);

    // Update React state for rendering
    setPlayerPos({ x: player.position.x, y: player.position.y });

    // Track camera
    if (viewportRef && viewportRef.current) {
      viewportRef.current.moveCenter(player.position.x, player.position.y);
    }
  });

  return (
    <>
      {/* Render Zones (for debugging/visuals) */}
      {zones.map((zone, i) => (
        <Graphics
          key={i}
          draw={(g) => {
            g.clear();
            g.beginFill(0x00ff00, 0.3); // Semi-transparent green
            g.drawRect(zone.x - zone.w/2, zone.y - zone.h/2, zone.w, zone.h);
            g.endFill();
          }}
        />
      ))}
      
      {/* Render Player */}
      <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(0xff3366); // Redish player
          g.drawCircle(playerPos.x, playerPos.y, 20);
          g.endFill();
        }}
      />
    </>
  );
}
