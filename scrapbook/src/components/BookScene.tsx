"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera, PresentationControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Page() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    // Subtle floating/breathing animation for the page
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} receiveShadow castShadow rotation={[-Math.PI / 2, 0, 0]}>
      {/* 8.5 x 11 aspect ratio roughly for a scrapbook page */}
      <planeGeometry args={[8.5, 11, 32, 32]} />
      <meshStandardMaterial 
        color="#f4f1ea" 
        roughness={0.9}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function BookScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 8, 8]} fov={50} />
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={2048}
        />
        
        {/* Subtle environment for physical lighting */}
        <Environment preset="city" />

        <PresentationControls 
          global 
          rotation={[0, 0, 0]} 
          polar={[-0.1, 0.1]} 
          azimuth={[-0.2, 0.2]} 
          config={{ mass: 2, tension: 400 }}
        >
          <group position={[0, -2, 0]}>
            {/* The book pages */}
            <Page />
          </group>
        </PresentationControls>
      </Canvas>
    </div>
  );
}
