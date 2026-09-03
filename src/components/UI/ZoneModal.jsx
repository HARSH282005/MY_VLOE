"use client";
import React, { useEffect, useState } from 'react';

export default function ZoneModal({ activeZone, onClose }) {
  const [show, setShow] = useState(false);

  // Handle smooth fade-in transitions
  useEffect(() => {
    if (activeZone) {
      // Small delay to allow display:block to apply before animating opacity
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [activeZone]);

  // If there's no zone and it's fully faded out, don't render the DOM
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (activeZone) setMounted(true);
    else if (!show) {
      const timer = setTimeout(() => setMounted(false), 500); // match transition duration
      return () => clearTimeout(timer);
    }
  }, [activeZone, show]);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Overlay backdrop
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: show ? 1 : 0,
        pointerEvents: show ? 'auto' : 'none',
        transition: 'opacity 0.5s ease-in-out',
        zIndex: 100, // Make sure it sits on top of the Pixi canvas
      }}
    >
      <div
        style={{
          background: '#ffffff',
          padding: '3rem',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          textAlign: 'center',
          transform: show ? 'translateY(0)' : 'translateY(20px)',
          transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // subtle bounce
          maxWidth: '500px',
          width: '90%'
        }}
      >
        <h2 style={{ margin: '0 0 1rem 0', fontFamily: 'sans-serif' }}>{activeZone}</h2>
        <p style={{ margin: '0 0 2rem 0', color: '#555', fontFamily: 'sans-serif' }}>
          You have entered the {activeZone} trigger zone. This React component overlay 
          is rendered on top of the PixiJS canvas, driven by Matter.js collision events!
        </p>
        <button
          onClick={() => {
            setShow(false);
            setTimeout(onClose, 500); // Allow fade out before unmounting
          }}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Close & Resume
        </button>
      </div>
    </div>
  );
}
