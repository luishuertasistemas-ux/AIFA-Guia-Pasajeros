'use client';

import { useState } from 'react';
import { MapPinned, TrainFront } from 'lucide-react';
import { MEXIBUS_FARES, transitRoutes } from '@/data/transitRoutes';
import type { RouteMapTranslations } from '@/data/translations';

type RouteMapExplorerProps = {
  copy: RouteMapTranslations;
  onOpenImage: (src: string, alt: string) => void;
  initialRouteId?: 'mexibus' | 'suburban';
};

export default function RouteMapExplorer({
  copy,
  onOpenImage,
  initialRouteId = 'mexibus'
}: RouteMapExplorerProps) {
  const [selectedRouteId, setSelectedRouteId] = useState<'mexibus' | 'suburban'>(initialRouteId);
  const route = transitRoutes.find(({ id }) => id === selectedRouteId) ?? transitRoutes[0];
  const [selectedStationId, setSelectedStationId] = useState(route.stations[0].id);
  const selectedStation = route.stations.find(({ id }) => id === selectedStationId) ?? route.stations[0];
  const stationDescription = copy.stationDetails[selectedStation.id] ?? copy.stationDetails.default;

  const selectRoute = (id: 'mexibus' | 'suburban') => {
    const nextRoute = transitRoutes.find((item) => item.id === id);
    if (!nextRoute) return;
    setSelectedRouteId(id);
    setSelectedStationId(nextRoute.stations[0].id);
  };

  return (
    <section aria-labelledby="route-map-title" className="rounded-3xl border border-white/25 bg-slate-950/35 p-5 text-white shadow-2xl backdrop-blur-2xl sm:p-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="route-map-title" className="text-2xl font-extrabold tracking-tight text-emerald-200 sm:text-3xl">{copy.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-100/85 sm:text-base">{copy.description}</p>
        </div>
        <button
          type="button"
          onClick={() => onOpenImage('/images/aifa-mapa.png', copy.viewAirportMap)}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300"
        >
          <MapPinned aria-hidden="true" size={18} />
          {copy.viewAirportMap}
        </button>
      </header>

      <div className="mt-6">
        <h3 className="mb-2 text-sm font-bold text-emerald-100">{copy.selectorLabel}</h3>
        <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label={copy.selectorLabel}>
          {transitRoutes.map((item) => {
            const isSelected = item.id === route.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => selectRoute(item.id)}
                aria-pressed={isSelected}
                className={`flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300 ${isSelected ? 'border-emerald-300 bg-emerald-400/20 text-white shadow-[0_0_24px_rgba(52,211,153,0.16)]' : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'}`}
              >
                <TrainFront aria-hidden="true" className="shrink-0" size={20} />
                {item.id === 'mexibus' ? copy.mexibusLabel : copy.suburbanLabel}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">{copy.frequencyLabel}</p>
          <p className="mt-1 text-lg font-bold text-white">{route.frequencyMinutes} {copy.minutesLabel}</p>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">{copy.travelTimeLabel}</p>
          <p className="mt-1 text-lg font-bold text-white">{route.travelTimeMinutes} {copy.minutesLabel}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.7fr)]">
        <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 sm:p-5">
          <h3 className="mb-4 text-lg font-bold">{copy.stationListLabel}</h3>
          <ol className="relative space-y-2 before:absolute before:bottom-5 before:left-[1.05rem] before:top-5 before:w-0.5 before:bg-gradient-to-b before:from-emerald-300 before:to-sky-400">
            {route.stations.map((station, index) => {
              const isSelected = station.id === selectedStation.id;
              return (
                <li key={station.id} className="relative">
                  <button
                    type="button"
                    onClick={() => setSelectedStationId(station.id)}
                    aria-pressed={isSelected}
                    className={`relative flex min-h-12 w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300 ${isSelected ? 'bg-white/15 text-white' : 'text-slate-200 hover:bg-white/10'}`}
                  >
                    <span className={`z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-extrabold ${isSelected ? 'border-emerald-200 bg-emerald-300 text-slate-950' : 'border-white/50 bg-slate-900 text-slate-200'}`}>
                      {index + 1}
                    </span>
                    <span className="font-semibold">{station.name}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <aside aria-live="polite" className="rounded-2xl border border-emerald-200/20 bg-emerald-300/10 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-100">{copy.stationDetailsLabel}</p>
          <h3 className="mt-2 text-xl font-extrabold">{selectedStation.name}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-100">
            {stationDescription.replace(/\{station\}/g, selectedStation.name)}
          </p>
          {selectedRouteId === 'mexibus' && (
            <div className="mt-5 border-t border-white/15 pt-4">
              <h4 className="font-bold text-amber-100">{copy.faresTitle}</h4>
              <p className="mt-2 text-sm text-slate-100">
                {copy.generalFareLabel}: <strong className="text-white">${MEXIBUS_FARES.singleRideMxn.toFixed(2)} MXN</strong>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-100">
                {copy.cardFareLabel}: <strong className="text-white">${MEXIBUS_FARES.cardIncludingRideMxn.toFixed(2)} MXN</strong>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-amber-100">
                <strong>{copy.transferTitle}:</strong> {copy.transferDescription}
              </p>
            </div>
          )}
        </aside>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-slate-300">{copy.estimateNote}</p>
    </section>
  );
}
