'use client';

import { useEffect, useState } from 'react';
import {
  officeRouteDestinations,
  officeRouteNodes,
  mamutStartNodes,
  type OfficeDestinationId,
  type OfficeDirection,
  type MamutStartNodeId
} from '@/data/officeRouteDemo';

type MamutGuideModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialNode?: MamutStartNodeId | null;
};

const DIRECTION_META: Record<OfficeDirection, { arrow: string; label: string }> = {
  straight: { arrow: '↑', label: 'Sigue de frente' },
  left: { arrow: '←', label: 'Gira a la izquierda' },
  right: { arrow: '→', label: 'Gira a la derecha' }
};

export default function MamutGuideModal({ isOpen, onClose, initialNode = null }: MamutGuideModalProps) {
  const initialDestination: OfficeDestinationId = initialNode === 'sala_juntas' ? 'aodb' : 'servicios';
  const initialStepIndex = initialNode === 'interseccion_pared' ? 1 : initialNode === 'sala_juntas' ? 2 : 0;
  const [destination, setDestination] = useState<OfficeDestinationId>(initialDestination);
  const [stepIndex, setStepIndex] = useState(initialStepIndex);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechMessage, setSpeechMessage] = useState('');

  const route = officeRouteDestinations[destination];
  const routeStep = route.steps[stepIndex];
  const isStartingAtMeetingRoom = initialNode === 'sala_juntas' && destination === 'aodb';
  const step = isStartingAtMeetingRoom
    ? {
      ...routeStep,
      title: 'Estás en la Sala de Juntas',
      instruction: 'Estás en el Salón del Curso AODB con Martín. La Salida de Emergencia está en esta misma ruta.'
    }
    : routeStep;
  const node = isStartingAtMeetingRoom
    ? mamutStartNodes.sala_juntas
    : officeRouteNodes[step.nodeId];
  const direction = isStartingAtMeetingRoom
    ? { arrow: '📍', label: 'Punto de partida' }
    : DIRECTION_META[step.direction];
  const speechAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  if (!isOpen) return null;

  const speakCurrentStep = () => {
    if (!speechAvailable) {
      setSpeechMessage('La voz no está disponible en este navegador.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`Santa Lucía te guía. ${step.instruction}`);
    utterance.lang = 'es-MX';
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeechMessage('');
    };
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeechMessage('No se pudo reproducir la indicación de voz. Inténtalo de nuevo.');
    };
    window.speechSynthesis.speak(utterance);
  };

  const changeDestination = (nextDestination: OfficeDestinationId) => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setSpeechMessage('');
    setDestination(nextDestination);
    setStepIndex(initialNode === 'interseccion_pared' ? 1 : initialNode === 'sala_juntas' ? 2 : 0);
  };

  const changeStep = (nextIndex: number) => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setSpeechMessage('');
    setStepIndex(nextIndex);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mamut-guide-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          window.speechSynthesis?.cancel();
          setIsSpeaking(false);
          onClose();
        }
      }}
    >
      <section className="relative flex max-h-[calc(100svh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-amber-200/25 bg-slate-900 text-white shadow-2xl sm:max-h-[calc(100svh-2.5rem)]">
        <button
          type="button"
          onClick={() => {
            window.speechSynthesis?.cancel();
            setIsSpeaking(false);
            onClose();
          }}
          aria-label="Cerrar guía del Mamut"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-amber-300"
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="scrollbar-none overflow-y-auto p-5 sm:p-7">
          <header className="pr-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Demostración · Oficina</p>
            <h2 id="mamut-guide-title" className="mt-2 text-2xl font-extrabold sm:text-3xl">Prueba de navegación con Santa Lucía</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">Elige un destino y avanza paso a paso siguiendo las referencias del espacio.</p>
          </header>

          <div className="mt-5 grid gap-2 sm:grid-cols-2" role="group" aria-label="Selecciona un destino">
            {(Object.entries(officeRouteDestinations) as [OfficeDestinationId, typeof route][]).map(([id, destinationOption]) => (
              <button
                key={id}
                type="button"
                onClick={() => changeDestination(id)}
                disabled={initialNode === 'sala_juntas' && id === 'servicios'}
                aria-pressed={destination === id}
                className={`min-h-14 rounded-2xl border px-4 py-3 text-left text-sm font-bold leading-snug transition focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                  destination === id
                    ? 'border-amber-300 bg-amber-300/15 text-amber-100'
                    : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                {destinationOption.label}
              </button>
            ))}
          </div>
          {initialNode === 'sala_juntas' && (
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              No hay un trayecto registrado desde la Sala de Juntas hacia Servicios.
            </p>
          )}

          <div className="mt-5 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <button
              type="button"
              onClick={speakCurrentStep}
              aria-label={isSpeaking ? 'Reproducir de nuevo la indicación de Santa Lucía' : 'Escuchar indicación de Santa Lucía'}
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-amber-300/70 bg-amber-300/10 text-5xl shadow-[0_0_28px_rgba(252,211,77,0.16)] transition hover:scale-105 hover:bg-amber-300/20 focus:outline-none focus:ring-4 focus:ring-amber-200/50"
            >
              <span aria-hidden="true">🦣</span>
            </button>
            <div>
              <p className="font-bold text-amber-100">Santa Lucía</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">Toca mi avatar o el botón para escuchar este paso.</p>
              <p className="mt-2 text-xs font-semibold text-amber-200" aria-live="polite">
                {speechMessage || (isSpeaking ? 'Reproduciendo indicación…' : speechAvailable ? 'Voz en español · paso a paso' : 'Voz no disponible en este navegador')}
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-4" aria-live="polite">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-300/15 text-5xl font-black text-emerald-200" aria-label={direction.label}>
              {direction.arrow}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-200">Paso {stepIndex + 1} de {route.steps.length} · {direction.label}</p>
              <h3 className="mt-1 text-lg font-bold">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-200">{step.instruction}</p>
            </div>
          </div>

          <div className="mt-3 flex items-start gap-3 rounded-xl bg-white/5 px-4 py-3">
            <span aria-hidden="true" className="text-lg">📍</span>
            <p className="text-sm text-slate-300">
              <span className="font-bold text-white">{node.name}:</span> {node.landmark}
            </p>
          </div>

          <div className="mt-5 flex gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => changeStep(Math.max(0, stepIndex - 1))}
              disabled={stepIndex === 0}
              className="min-h-12 rounded-xl border border-white/15 px-4 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Anterior
            </button>
            <button
              type="button"
              onClick={() => {
                if (stepIndex === route.steps.length - 1) {
                  window.speechSynthesis?.cancel();
                  setIsSpeaking(false);
                  onClose();
                  return;
                }

                changeStep(stepIndex + 1);
              }}
              className="min-h-12 flex-1 rounded-xl bg-amber-300 px-4 text-sm font-extrabold text-slate-950 transition hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-100"
            >
              {stepIndex === route.steps.length - 1 ? 'Finalizar guía' : 'Siguiente paso →'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
