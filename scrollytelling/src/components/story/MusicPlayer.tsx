"use client";

import { useEffect, useRef, useState } from 'react';

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Use a royalty-free piano piece via CDN
    const audio = new Audio(
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3'
    );
    audio.loop = true;
    audio.volume = 0.25;
    audioRef.current = audio;
    setLoaded(true);

    return () => {
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
