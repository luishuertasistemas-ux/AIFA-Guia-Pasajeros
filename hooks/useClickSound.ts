'use client';

import { useCallback, useRef } from 'react';

export function useClickSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playClickSound = useCallback(() => {
    if (typeof window === 'undefined') return;

    const audio = audioRef.current ?? new Audio('/sounds/click.mp3');
    audioRef.current = audio;
    audio.preload = 'auto';
    audio.volume = 0.5;
    audio.currentTime = 0;

    void audio.play().catch((error: unknown) => {
      console.error('No se pudo reproducir el sonido de interacción.', error);
    });
  }, []);

  return playClickSound;
}
