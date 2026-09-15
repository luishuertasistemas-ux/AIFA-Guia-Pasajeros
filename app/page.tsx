'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { AIRPORT_LOCATIONS, MOCK_ROUTES } from '@/data/locations';
import { Location } from '@/types/location';

function NavigationContent() {
  const searchParams = useSearchParams();
  const originParam = searchParams.get('origen') || 'entrada-principal';

  const originLocation = AIRPORT_LOCATIONS.find((loc) => loc.id === originParam);
  const [selectedDestination, setSelectedDestination] = useState<Location | null>(null);

  const routeKey = selectedDestination ? `${originParam}_${selectedDestination.id}` : null;
  const currentRoute = routeKey ? MOCK_ROUTES[routeKey] : null;

  return (
    <main className="min-h-screen bg-slate-50 p-4 font-sans text-slate-800 max-w-md mx-auto">
      {/* Header / Ubicación Actual */}
      <header className="bg-blue-600 text-white p-4 rounded-xl shadow-md mb-6">
        <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Punto de inicio (QR Escaneado)</span>
        <h1 className="text-xl font-bold mt-1">{originLocation?.name || 'Escanee un código QR'}</h1>
        <p className="text-xs opacity-90 mt-1">
          {originLocation?.terminal} • Nivel {originLocation?.level} • Zona {originLocation?.zone}
        </p>
      </header>

      {/* Lista de Destinos */}
      {!selectedDestination ? (
        <section>
          <h2 className="text-lg font-semibold mb-3">¿A dónde quieres ir?</h2>
          <div className="space-y-3">
            {AIRPORT_LOCATIONS.filter((loc) => loc.id !== originParam).map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedDestination(loc)}
                className="w-full text-left p-4 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-blue-500 transition-colors flex justify-between items-center"
              >
                <div>
                  <div className="font-medium text-slate-900">{loc.name}</div>
                  <div className="text-xs text-slate-500 capitalize">{loc.category} • Zona {loc.zone}</div>
                </div>
                <span className="text-blue-600 text-sm font-semibold">Ir →</span>
              </button>
            ))}
          </div>
        </section>
      ) : (
        /* Indicaciones de Ruta */
        <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-md">
          <button
            onClick={() => setSelectedDestination(null)}
            className="text-xs font-semibold text-blue-600 mb-4 inline-block"
          >
            ← Cambiar destino
          </button>

          <h2 className="text-lg font-bold text-slate-900 mb-1">Ruta a: {selectedDestination.name}</h2>
          {currentRoute && (
            <p className="text-xs text-slate-500 mb-4">
              Tiempo estimado: <strong className="text-slate-700">{currentRoute.estimatedMinutes} minutos a pie</strong>
            </p>
          )}

          {currentRoute ? (
            <ol className="space-y-4 border-l-2 border-blue-500 pl-4 my-4">
              {currentRoute.steps.map((step) => (
                <li key={step.step} className="text-sm">
                  <span className="font-semibold text-blue-600">Paso {step.step}:</span> {step.instruction}
                  <span className="block text-xs text-slate-400 mt-0.5">{step.distanceMeters} metros</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-slate-500 my-4 bg-amber-50 p-3 rounded-lg border border-amber-200">
              Ruta en construcción para este destino. Selecciona <strong>Puerta 105</strong> para probar la navegación.
            </p>
          )}
        </section>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Cargando guía...</div>}>
      <NavigationContent />
    </Suspense>
  );
}