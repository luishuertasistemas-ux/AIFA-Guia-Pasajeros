'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Bus, CarFront, Clock3, TrainFront } from 'lucide-react';
import RouteMapExplorer from '@/components/RouteMapExplorer';
import type { DetailTranslations, TransportCategoryId, TransportTranslations } from '@/data/translations';

type TransportExperienceProps = {
  copy: TransportTranslations;
  details: DetailTranslations;
  currentTimeLabel: string;
  onOpenImage: (src: string, alt: string) => void;
  onBackToMenu: () => void;
};

const CATEGORY_IMAGES: Record<TransportCategoryId, string> = {
  mexibus: '/images/rutas/mexibus-doc/paso-01.jpg',
  suburban: '/images/rutas/mexibus-doc/paso-03.jpg',
  taxis: '/images/rutas/mexibus-doc/paso-02.jpg',
  buses: '/images/rutas/mexibus-doc/paso-04.jpg'
};

const CATEGORY_IDS: TransportCategoryId[] = ['mexibus', 'suburban', 'taxis', 'buses'];

export default function TransportExperience({
  copy,
  details,
  currentTimeLabel,
  onOpenImage,
  onBackToMenu
}: TransportExperienceProps) {
  const [selectedCategory, setSelectedCategory] = useState<TransportCategoryId | null>(null);
  const taxiDetails = details.modules['taxis-autobuses'].steps;
  const selectedCopy = selectedCategory ? copy[selectedCategory] : null;
  const selectedImage = selectedCategory ? CATEGORY_IMAGES[selectedCategory] : null;
  const prepaidCardImages = selectedCategory === 'mexibus'
    ? [
      { src: '/images/transporte/tarjeta-mexibus-frente.jpg', label: copy.cardFrontLabel },
      { src: '/images/transporte/tarjeta-mexibus-atras.jpg', label: copy.cardBackLabel }
    ]
    : selectedCategory === 'suburban'
      ? [
        { src: '/images/transporte/tarjeta-suburbano-frente.jpg', label: copy.cardFrontLabel },
        { src: '/images/transporte/tarjeta-suburbano-atras.jpg', label: copy.cardBackLabel }
      ]
      : [];
  const roadStep = selectedCategory === 'taxis' ? taxiDetails['trans-3'] : taxiDetails['trans-4'];
  const roadCopy = selectedCategory === 'taxis' ? copy.taxis : copy.buses;
  const recommendations = selectedCategory === 'taxis'
    ? copy.taxiRecommendations
    : copy.busRecommendations;

  return (
    <section
      className="fixed inset-0 z-50 isolate min-h-screen overflow-y-auto overflow-x-hidden bg-transparent"
      aria-labelledby="transport-welcome-title"
    >
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/salidas-bg.jpg')" }}
      />
      <div aria-hidden="true" className="fixed inset-0 -z-10 bg-slate-950/40" />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 18% 38%, rgba(56, 189, 248, 0.15), transparent 30%), radial-gradient(circle at 82% 62%, rgba(125, 211, 252, 0.1), transparent 34%)'
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-8 sm:py-10">
        <header className="mb-8 sm:mb-10">
          <button
            type="button"
            onClick={() => selectedCategory ? setSelectedCategory(null) : onBackToMenu()}
            className="mb-7 inline-flex min-h-14 items-center gap-3 rounded-xl border border-sky-200/40 bg-black/50 px-5 py-3 text-base font-bold text-white shadow-lg drop-shadow-md transition hover:bg-blue-950/80 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
          >
            <ArrowLeft aria-hidden="true" size={24} />
            {selectedCategory ? copy.detailBack : details.backToMenu}
          </button>
          {selectedCategory && selectedCopy ? (
            <>
              <h1 id="transport-welcome-title" className="text-3xl font-extrabold text-white drop-shadow-md md:text-5xl">{selectedCopy.title}</h1>
              <p className="mt-3 max-w-3xl text-lg leading-relaxed text-emerald-100 drop-shadow-md md:text-xl">{selectedCopy.summary}</p>
            </>
          ) : (
            <>
              <h1 id="transport-welcome-title" className="max-w-5xl text-3xl font-extrabold text-white drop-shadow-md md:text-5xl">
                {copy.welcomeTitle}
              </h1>
              <p className="mt-3 max-w-4xl rounded-2xl border border-white/15 bg-slate-950/45 p-4 text-lg font-medium leading-relaxed text-white shadow-lg drop-shadow-md backdrop-blur-md md:text-xl">
                {copy.welcomeDescription}
              </p>
              <p className="mt-4 flex max-w-4xl items-start gap-3 rounded-2xl border border-sky-200/25 bg-slate-950/35 p-4 text-sm leading-relaxed text-white shadow-xl backdrop-blur-xl sm:text-base">
                <Clock3 aria-hidden="true" className="mt-0.5 shrink-0 text-emerald-200" size={20} />
                <span>{copy.liveMessage} <span className="ml-1 whitespace-nowrap font-bold text-emerald-200">{currentTimeLabel}</span></span>
              </p>
            </>
          )}
        </header>

        {selectedCategory && selectedCopy && selectedImage ? (
          <div className="space-y-6">
            <div className="relative h-52 overflow-hidden rounded-3xl border border-white/25 shadow-xl sm:h-72">
              <Image
                src={selectedImage}
                alt={selectedCopy.imageAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/10" />
              <p className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/55 px-4 py-2 text-sm font-bold text-white backdrop-blur-md">
                {selectedCategory === 'mexibus' ? <Bus aria-hidden="true" size={18} /> : selectedCategory === 'suburban' ? <TrainFront aria-hidden="true" size={18} /> : <CarFront aria-hidden="true" size={18} />}
                {selectedCopy.title}
              </p>
            </div>

            {selectedCategory === 'mexibus' || selectedCategory === 'suburban' ? (
              <>
                <RouteMapExplorer
                  key={selectedCategory}
                  copy={details.routeMap}
                  initialRouteId={selectedCategory}
                  onOpenImage={onOpenImage}
                />
                <section aria-labelledby="prepaid-card-title" className="rounded-3xl border border-emerald-200/25 bg-slate-950/40 p-5 text-white shadow-xl backdrop-blur-xl sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 id="prepaid-card-title" className="text-xl font-extrabold text-emerald-200 sm:text-2xl">{copy.prepaidCardLabel}</h2>
                    <span className="rounded-full border border-emerald-200/30 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-100">{selectedCopy.title}</span>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {prepaidCardImages.map(({ src, label }) => (
                      <div key={src} className="overflow-hidden rounded-xl border border-white/20 bg-white/5 p-2 shadow-[0_0_20px_rgba(16,185,129,0.08)]">
                        <button
                          type="button"
                          onClick={() => onOpenImage(src, `${selectedCopy.title} · ${label}`)}
                          aria-label={`${details.routeMap.openImageLabel}: ${selectedCopy.title} · ${label}`}
                          className="relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300"
                        >
                          <Image
                            src={src}
                            alt={`${selectedCopy.title} · ${label}`}
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="object-contain"
                          />
                        </button>
                        <p className="px-2 pb-1 pt-3 text-sm font-bold text-emerald-100">{label}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            ) : (
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.65fr)]">
                <section className="rounded-3xl border border-white/25 bg-slate-950/35 p-5 text-white shadow-xl backdrop-blur-xl sm:p-7">
                  <h2 className="text-2xl font-extrabold text-emerald-200">{copy.itineraryTitle}</h2>
                  <h3 className="mt-4 text-lg font-bold text-emerald-100">{roadStep.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate-100">{roadCopy.details}</p>
                  <div className="mt-5 rounded-2xl border border-sky-200/20 bg-sky-300/10 p-4">
                    <h3 className="font-bold text-emerald-100">{copy.boardingPointLabel}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-100">{roadStep.description}</p>
                  </div>
                  <div className="mt-5 rounded-2xl border border-amber-200/20 bg-amber-300/10 p-4">
                    <h3 className="font-bold text-amber-100">{details.modules['taxis-autobuses'].title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-100">
                      {selectedCategory === 'taxis' ? copy.taxiFareNote : copy.busFareNote}
                    </p>
                  </div>
                </section>
                <aside className="rounded-3xl border border-white/25 bg-slate-950/35 p-5 text-white shadow-xl backdrop-blur-xl sm:p-7">
                  <h2 className="text-xl font-extrabold text-emerald-200">{copy.recommendationsTitle}</h2>
                  <ul className="mt-4 space-y-3">
                    {recommendations.map((recommendation) => (
                      <li key={recommendation} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-slate-100">
                        <span aria-hidden="true" className="font-bold text-sky-200">✓</span>
                        {recommendation}
                      </li>
                    ))}
                    {roadStep.tip && (
                      <li className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-slate-100">
                        <span aria-hidden="true" className="font-bold text-sky-200">✓</span>
                        {roadStep.tip}
                      </li>
                    )}
                  </ul>
                </aside>
              </div>
            )}
          </div>
        ) : (
          <section aria-labelledby="transport-categories-title">
            <h2 id="transport-categories-title" className="mb-5 text-xl font-bold text-emerald-200 drop-shadow-sm sm:text-2xl">{copy.categoriesTitle}</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {CATEGORY_IDS.map((categoryId) => {
                const category = copy[categoryId];
                const categoryImage = CATEGORY_IMAGES[categoryId];
                return (
                  <div
                    key={categoryId}
                    className="group relative rounded-3xl bg-gradient-to-br from-sky-300/90 via-emerald-300/65 to-rose-300/55 p-px shadow-[0_0_22px_rgba(56,189,248,0.12),inset_0_1px_1px_rgba(255,255,255,0.65)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(56,189,248,0.28),0_0_48px_rgba(52,211,153,0.16)]"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(categoryId)}
                      className="relative isolate flex min-h-72 w-full flex-col justify-end overflow-hidden rounded-[calc(1.5rem-1px)] bg-slate-900/70 p-5 text-left backdrop-blur-lg focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-300 sm:min-h-80 sm:p-7"
                    >
                      <Image
                        src={categoryImage}
                        alt={category.imageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                        className="-z-20 object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/10" />
                      <span className="relative z-10">
                        <span className="block text-xl font-extrabold text-white drop-shadow-md sm:text-2xl">{category.title}</span>
                        <span className="mt-2 block max-w-xl rounded-xl border border-white/15 bg-slate-950/45 p-3 text-sm font-medium leading-relaxed text-white shadow-md drop-shadow sm:text-base">{category.summary}</span>
                        <span className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-emerald-200/40 bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-50 backdrop-blur-md transition group-hover:bg-emerald-400/30">
                          {copy.categoryAction} <ArrowRight aria-hidden="true" size={17} />
                        </span>
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
