import React, { useEffect, useRef } from 'react';

function AudioPlayer({ audioSrc, isAuthenticated }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isAuthenticated) {
        audioRef.current.volume = 0.5; // 50% volume
        audioRef.current.play().catch((error) => {
          console.log('Audio playback failed:', error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isAuthenticated]);

  return <audio ref={audioRef} src={audioSrc} loop />;
}

export default AudioPlayer;
