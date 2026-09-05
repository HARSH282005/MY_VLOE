"use client";

import dynamic from 'next/dynamic';

const FloatingPetals = dynamic(() => import('./FloatingPetals'), { ssr: false });

export default function FloatingPetalsClient() {
  return <FloatingPetals />;
}
