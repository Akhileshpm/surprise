import React, { useEffect, useRef } from 'react';

const INITIAL_VOLUME = 1;
const FADE_INTERVAL_MS = 500;
const FADE_DURATION_MS = 10000;
const FADE_STEPS = FADE_DURATION_MS / FADE_INTERVAL_MS;
const VOLUME_STEP = INITIAL_VOLUME / FADE_STEPS;

function AudioPlayer({ audioSrc, isAuthenticated }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isAuthenticated) {
      audio.pause();
      return;
    }

    audio.volume = INITIAL_VOLUME;
    audio.play().catch((error) => {
      console.log('Audio playback failed:', error);
    });

    let step = 0;
    const fadeTimer = setInterval(() => {
      step += 1;
      const nextVolume = Math.max(0, INITIAL_VOLUME - VOLUME_STEP * step);

      if (nextVolume <= 0) {
        audio.volume = 0;
        audio.pause();
        clearInterval(fadeTimer);
        return;
      }

      audio.volume = nextVolume;
    }, FADE_INTERVAL_MS);

    return () => clearInterval(fadeTimer);
  }, [isAuthenticated]);

  return <audio ref={audioRef} src={audioSrc} loop />;
}

export default AudioPlayer;
