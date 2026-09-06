"use client";

import { useEffect, useRef, useState } from 'react';

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Use the requested song
    const audio = new Audio(
      '/Last%20Leaves%20of%20Autumn%20-%20Zleepyfred%20(Official%20Lyric%20Video)%20-%20Zleepyfred.mp3'
    );
    audio.loop = true;
    audio.volume = 0.25;
    audioRef.current = audio;
    setLoaded(true);

    // Attempt autoplay immediately
    const attemptPlay = () => {
      audio.play().then(() => {
        setPlaying(true);
        // Remove listeners once it successfully plays
        document.removeEventListener('click', attemptPlay);
        document.removeEventListener('scroll', attemptPlay);
        document.removeEventListener('touchstart', attemptPlay);
      }).catch(() => {
        // Autoplay was prevented by browser, wait for interaction
        setPlaying(false);
      });
    };

    attemptPlay();

    // Add fallback listeners for browsers that block autoplay until interaction
    document.addEventListener('click', attemptPlay);
    document.addEventListener('scroll', attemptPlay);
    document.addEventListener('touchstart', attemptPlay);

    return () => {
      document.removeEventListener('click', attemptPlay);
      document.removeEventListener('scroll', attemptPlay);
      document.removeEventListener('touchstart', attemptPlay);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  if (!loaded) return null;

  return (
    <button onClick={toggle} className="music-btn" aria-label={playing ? 'Pause music' : 'Play music'}>
      {playing ? (
        <>
          <span style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '16px' }}>
            <span className="sound-bar" style={{ height: '8px' }} />
            <span className="sound-bar" style={{ height: '14px' }} />
            <span className="sound-bar" style={{ height: '10px' }} />
            <span className="sound-bar" style={{ height: '6px' }} />
          </span>
          <span>♪ Playing</span>
        </>
      ) : (
        <span>♪ Music</span>
      )}
    </button>
  );
}
