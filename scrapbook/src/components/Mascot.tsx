"use client";

import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useEffect } from 'react';
import { useScrapbookStore } from '../store/useScrapbookStore';

export default function Mascot() {
  const mascotState = useScrapbookStore((state) => state.mascotState);
  
  // Using a community Rive asset (a character) as a fallback since a custom .riv wasn't provided.
  // This character has a "State Machine 1" with various inputs.
  const { rive, RiveComponent } = useRive({
    src: 'https://cdn.rive.app/animations/vehicles.riv', // Fallback placeholder
    stateMachines: 'bumpy', 
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    autoplay: true,
  });

  // We map the 'happy' state to a trigger in the placeholder state machine
  const bumpInput = useStateMachineInput(rive, 'bumpy', 'bump');

  useEffect(() => {
    if (mascotState === 'happy' && bumpInput) {
      // Fire the animation trigger when an image is successfully placed
      bumpInput.fire(); 
    }
  }, [mascotState, bumpInput]);

  return (
    <div className="fixed top-8 right-8 w-48 h-48 z-50 pointer-events-none drop-shadow-2xl transition-transform duration-500 hover:scale-110">
      <div className="absolute inset-0 bg-white/10 rounded-full blur-xl mix-blend-overlay"></div>
      <RiveComponent className="w-full h-full" />
    </div>
  );
}
