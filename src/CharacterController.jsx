import React, { useEffect } from 'react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

export default function CharacterController() {
  const STATE_MACHINE_NAME = 'State Machine 1'; // Replace with actual state machine name

  const { rive, RiveComponent } = useRive({
    src: '/character.riv', // Replace with the actual path to the .riv file
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
  });

  // Boolean toggle for a 'wave' gesture
  const waveToggleInput = useStateMachineInput(rive, STATE_MACHINE_NAME, 'wave');
  
  // Tracking mouse coordinates for 'eye_tracking' axis inputs
  const eyeTrackingXInput = useStateMachineInput(rive, STATE_MACHINE_NAME, 'eye_tracking_x');
  const eyeTrackingYInput = useStateMachineInput(rive, STATE_MACHINE_NAME, 'eye_tracking_y');

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (eyeTrackingXInput && eyeTrackingYInput) {
        // Map mouse coordinates (e.g., 0 to 100 based on window size)
        const xPercent = (e.clientX / window.innerWidth) * 100;
        const yPercent = (e.clientY / window.innerHeight) * 100;
        
        eyeTrackingXInput.value = xPercent;
        eyeTrackingYInput.value = yPercent;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [eyeTrackingXInput, eyeTrackingYInput]);

  const handleCharacterClick = () => {
    if (waveToggleInput) {
      // Toggle the boolean input to trigger/stop the wave gesture
      waveToggleInput.value = !waveToggleInput.value;
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', cursor: 'pointer' }} onClick={handleCharacterClick}>
      {/* Bind the rive component to the layout canvas */}
      <RiveComponent style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
