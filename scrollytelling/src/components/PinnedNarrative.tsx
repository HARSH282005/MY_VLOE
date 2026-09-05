"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import TextReveal from './TextReveal';

function FloatingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1.5, 0.4, 128, 32]} />
      <meshStandardMaterial color="#ec4899" roughness={0.1} metalness={0.9} />
    </mesh>
  );
}

export default function PinnedNarrative() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const ctx = gsap.context(() => {
      // Pin the left side while the entire section scrolls
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: leftRef.current,
        anticipatePin: 1, // Improves performance before pinning
      });
      
      // We can also animate the 3D canvas container opacity or scale based on scroll
      gsap.fromTo(leftRef.current, 
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 50%",
            end: "top top",
            scrub: true
          }
        }
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full bg-neutral-900 flex flex-col md:flex-row">
      {/* Left Pinned Area (3D Canvas) */}
      <div ref={leftRef} className="w-full md:w-1/2 h-screen flex-shrink-0 relative order-2 md:order-1 hidden md:block">
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <Environment preset="city" />
          <FloatingGeometry />
        </Canvas>
      </div>

      {/* Right Scrolling Narrative Area */}
      <div className="w-full md:w-1/2 py-[30vh] px-8 md:px-24 flex flex-col gap-[70vh] order-1 md:order-2">
        <div className="max-w-xl">
          <TextReveal text="The Beginning of the Journey" />
          <p className="mt-8 text-xl text-neutral-400 leading-relaxed font-light">
            As you scroll down, the geometric form on the left remains perfectly pinned in place. This creates a powerful visual anchor while the narrative continues to unfold on the right.
          </p>
        </div>
        
        <div className="max-w-xl">
          <TextReveal text="Momentum & Flow" />
          <p className="mt-8 text-xl text-neutral-400 leading-relaxed font-light">
            Lenis handles the smooth momentum scrolling engine, ensuring that the physical wheel inertia is preserved. Meanwhile, GSAP's ScrollTrigger accurately tracks the viewport to trigger these entrance animations flawlessly.
          </p>
        </div>
        
        <div className="max-w-xl">
          <TextReveal text="The Final Chapter" />
          <p className="mt-8 text-xl text-neutral-400 leading-relaxed font-light">
            This architectural pattern allows you to build highly engaging, interactive stories without sacrificing web performance. When you reach the bottom of this section, the pin automatically releases.
          </p>
        </div>
      </div>
    </section>
  );
}
