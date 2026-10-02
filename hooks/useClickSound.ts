'use client';

import { useCallback, useRef } from 'react';

export function useClickSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playClickSound = useCallback(() => {
    if (typeof window === 'undefined' || typeof window.AudioContext === 'undefined') return;

    const audioContext = audioContextRef.current ?? new AudioContext({ latencyHint: 'interactive' });
    audioContextRef.current = audioContext;

    const playTone = () => {
      const startTime = audioContext.currentTime;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(720, startTime);
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.35, startTime + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.055);

      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.06);
    };

    if (audioContext.state === 'running') {
      playTone();
      return;
    }

    void audioContext.resume().then(
      () => playTone(),
      (error: unknown) => console.error('No se pudo activar el sonido de interacción.', error)
    );
  }, []);

  return playClickSound;
}
