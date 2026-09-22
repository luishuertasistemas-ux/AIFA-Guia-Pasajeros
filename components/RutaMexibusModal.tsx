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
  const progress = ((currentStepIndex + 1) / mexibusToDocRoute.length) * 100;

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
      <div className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl">
        <div className="h-1.5 w-full bg-slate-200" aria-hidden="true">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar guía de ruta"
          className="absolute right-4 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl text-slate-500 shadow-md transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="overflow-y-auto p-5 sm:p-7">
          <div className="pr-12">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="ruta-mexibus-modal-title" className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Ruta: Mexibús ➔ Documentación
              </h2>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                5 a 7 min a pie
              </span>
            </div>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Paso {currentStep.stepNumber} de {mexibusToDocRoute.length}
            </p>
          </div>

          <div className="mt-5" aria-live="polite">
            {imageError ? (
              <div className="flex aspect-[16/9] items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 p-6 text-center shadow-md">
                <div>
                  <span className="text-3xl" aria-hidden="true">◫</span>
                  <p className="mt-2 text-sm font-semibold text-slate-600">Imagen no disponible</p>
                  <p className="mt-1 text-xs text-slate-500">Sigue las indicaciones y los puntos de referencia.</p>
                </div>
              </div>
            ) : (
              <img
                src={currentStep.image}
                alt={`${currentStep.title}: ${currentStep.stage}`}
                onError={() => setImageError(true)}
                className="aspect-[16/9] w-full rounded-2xl object-cover shadow-md"
              />
            )}
          </div>

          <div className="mt-5">
            <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
              {currentStep.stage}
            </span>
            <h3 className="mt-3 text-xl font-bold text-slate-900">{currentStep.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{currentStep.description}</p>
          </div>

          {currentStep.referencePoint && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Punto de referencia</p>
              <p className="mt-1 font-medium">{currentStep.referencePoint}</p>
            </div>
          )}

          {currentStep.accessibilityNote && (
            <p className="mt-3 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-medium text-sky-800">
              Accesibilidad: {currentStep.accessibilityNote}
            </p>
          )}

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={() => setCurrentStepIndex((stepIndex) => Math.max(0, stepIndex - 1))}
              disabled={isFirstStep}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {isLastStep ? 'Finalizar / Entendido' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
