'use client';

import { useEffect, useState } from 'react';
import { mexibusToDocRoute } from '@/data/mexibusToDocRoute';

type RutaMexibusModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RutaMexibusModal({ isOpen, onClose }: RutaMexibusModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const currentStep = mexibusToDocRoute[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === mexibusToDocRoute.length - 1;

  useEffect(() => {
    setImageError(false);
  }, [currentStep.image]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
      return;
    }

    setCurrentStepIndex((stepIndex) => stepIndex + 1);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ruta-mexibus-modal-title"
    >
      <div className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/15 bg-slate-900/95 text-white shadow-2xl backdrop-blur-2xl">
        <div
          className="flex w-full gap-1.5 bg-slate-950/80 px-5 py-3 sm:px-7"
          aria-label={`Progreso: paso ${currentStep.stepNumber} de ${mexibusToDocRoute.length}`}
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={mexibusToDocRoute.length}
          aria-valuenow={currentStep.stepNumber}
        >
          {mexibusToDocRoute.map((step) => (
            <span
              key={step.stepNumber}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step.stepNumber <= currentStep.stepNumber ? 'bg-amber-400' : 'bg-white/15'}`}
              aria-hidden="true"
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar guía de ruta"
          className="absolute right-4 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl text-slate-200 shadow-md transition hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="scrollbar-none overflow-y-auto p-5 sm:p-7">
          <div className="pr-12">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="ruta-mexibus-modal-title" className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Ruta: Mexibús ➔ Documentación
              </h2>
              <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-200">
                5 a 7 min a pie
              </span>
            </div>
            <p className="sr-only">Paso {currentStep.stepNumber} de {mexibusToDocRoute.length}</p>
          </div>

          <div className="mt-5" aria-live="polite">
            {imageError ? (
                <div className="flex h-52 w-full items-center justify-center rounded-2xl bg-slate-800 p-6 text-center shadow-md">
                <div>
                  <span className="text-3xl" aria-hidden="true">◫</span>
                  <p className="mt-2 text-sm font-semibold text-slate-200">Imagen no disponible</p>
                  <p className="mt-1 text-xs text-slate-400">Sigue las indicaciones y los puntos de referencia.</p>
                </div>
              </div>
            ) : (
              <img
                src={currentStep.image}
                alt={`${currentStep.title}: ${currentStep.stage}`}
                onError={() => setImageError(true)}
                className="h-52 w-full rounded-2xl object-cover shadow-md"
              />
            )}
          </div>

          <div className="mt-5">
            <span className="inline-flex rounded-full bg-sky-400/15 px-3 py-1 text-xs font-bold text-sky-200">
              {currentStep.stage}
            </span>
            <h3 className="mt-3 text-2xl font-bold leading-tight text-white">{currentStep.title}</h3>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-200">{currentStep.description}</p>
          </div>

          {currentStep.referencePoint && (
            <div className="mt-4 flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200 shadow-sm">
              <span className="text-xl" aria-hidden="true">📍</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-amber-300">Punto de referencia</p>
                <p className="mt-1 font-medium">{currentStep.referencePoint}</p>
              </div>
            </div>
          )}

          {currentStep.accessibilityNote && (
            <div className="mt-3 flex gap-3 rounded-2xl border border-sky-400/25 bg-sky-400/10 p-4 text-xs font-medium text-sky-100 shadow-sm">
              <span className="text-xl" aria-hidden="true">♿</span>
              <p><span className="font-bold text-sky-300">Accesibilidad:</span> {currentStep.accessibilityNote}</p>
            </div>
          )}

          <div className="sticky bottom-0 mt-6 flex items-center gap-3 border-t border-white/10 bg-slate-900/95 pt-5 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setCurrentStepIndex((stepIndex) => Math.max(0, stepIndex - 1))}
              disabled={isFirstStep}
              className="min-h-12 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ◀ Anterior
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="min-h-12 flex-1 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-md transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {isLastStep ? 'Finalizar / Entendido' : 'Siguiente Paso ➔'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
