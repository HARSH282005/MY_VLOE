"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Float, MeshDistortMaterial } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

function HeroObject() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.5, 0]} />
        <MeshDistortMaterial 
          color="#8b5cf6" 
          distort={0.3} 
          speed={1.5} 
          roughness={0.2} 
          metalness={0.8}
          wireframe={true}
        />
      </mesh>
      {/* Inner solid core */}
      <mesh>
         <icosahedronGeometry args={[1.5, 1]} />
         <meshStandardMaterial color="#3b82f6" roughness={0.1} metalness={1} />
      </mesh>
    </Float>
  );
}

export default function HeroCanvas() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      gsap.to(textRef.current, {
        y: -150,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
      gsap.to(canvasRef.current, {
        y: 100,
        scale: 0.8,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="w-full h-screen relative bg-neutral-950 flex flex-col items-center justify-center overflow-hidden">
      <div ref={canvasRef} className="absolute inset-0 z-0">
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} />
          <Environment preset="city" />
          <HeroObject />
        </Canvas>
      </div>
      <div ref={textRef} className="relative z-10 pointer-events-none text-center mix-blend-difference">
        <h1 className="text-white text-7xl md:text-9xl font-bold tracking-tighter">
          SCROLLYTELLING
        </h1>
        <p className="text-white/60 mt-4 text-xl tracking-widest uppercase">Scroll to explore</p>
      </div>
    </div>
  );
}
