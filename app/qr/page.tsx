'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { getLocalizedLocationInfo, MOCK_LOCATIONS } from '@/data/locations';
import { useLanguage } from '@/LanguageContext';
import type { Language } from '@/data/translations';

const APP_URL = 'https://aifa-guia-pasajeros.vercel.app/?origen=';
const LANGUAGE_OPTIONS = [
  { code: 'ES', label: 'Español' },
  { code: 'EN', label: 'English' },
  { code: 'FR', label: 'Français' },
  { code: 'ZH', label: '中文' }
] as const;
const QR_TRANSLATIONS: Record<Language, {
  eyebrow: string;
  title: string;
  description: string;
  origin: string;
  copy: string;
  copied: string;
}> = {
  ES: {
    eyebrow: 'AIFA Guía de Pasajeros',
    title: 'Códigos QR de ubicaciones',
    description: 'Escanea o copia un enlace para probar la guía desde cada punto de origen.',
    origin: 'Punto de origen',
    copy: 'Copiar enlace',
    copied: 'Enlace copiado'
  },
  EN: {
    eyebrow: 'AIFA Passenger Guide',
    title: 'Location QR codes',
    description: 'Scan or copy a link to try the guide from each starting point.',
    origin: 'Starting point',
    copy: 'Copy link',
    copied: 'Link copied'
  },
  FR: {
    eyebrow: 'Guide des passagers AIFA',
    title: 'Codes QR des emplacements',
    description: 'Scannez ou copiez un lien pour essayer le guide depuis chaque point de départ.',
    origin: 'Point de départ',
    copy: 'Copier le lien',
    copied: 'Lien copié'
  },
  ZH: {
    eyebrow: 'AIFA 旅客指南',
    title: '位置二维码',
    description: '扫描或复制链接，从每个起点试用指南。',
    origin: '起点',
    copy: '复制链接',
    copied: '链接已复制'
  }
};

export default function QRPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { language: currentLang, setLanguage: setCurrentLang } = useLanguage();
  const copy = QR_TRANSLATIONS[currentLang];

  const copyLink = async (id: string) => {
    const url = `${APP_URL}${id}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <main className="min-h-screen bg-slate-900 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-5 text-white sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              {copy.eyebrow}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {copy.title}
            </h1>
            <p className="mt-3 max-w-xl text-sm text-slate-300">
              {copy.description}
            </p>
          </div>
          <div className="inline-flex w-fit shrink-0 gap-1 rounded-full border border-white/25 bg-white/10 p-1.5 shadow-lg shadow-blue-950/30 backdrop-blur-md" role="group" aria-label="Language selector">
            {LANGUAGE_OPTIONS.map((option) => (
              <button
                key={option.code}
                type="button"
                onClick={() => setCurrentLang(option.code)}
                aria-pressed={currentLang === option.code}
                className={`rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white/80 ${
                  currentLang === option.code
                    ? 'bg-white/90 text-blue-800 shadow'
                    : 'text-blue-50 hover:bg-white/15'
                }`}
              >
                <span className="sm:hidden">{option.code}</span>
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            ))}
          </div>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(MOCK_LOCATIONS).filter((location) => location.isPassengerAccessible).map((location) => {
            const url = `${APP_URL}${location.id}`;
            const isCopied = copiedId === location.id;
            const locationTranslation = getLocalizedLocationInfo(location, currentLang);

            return (
              <article
                key={location.id}
                className="flex flex-col rounded-2xl bg-white p-5 shadow-xl shadow-slate-950/20"
              >
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    {copy.origin}
                  </p>
                  <h2 className="mt-1 min-h-14 text-lg font-bold leading-tight text-slate-800">
                    {locationTranslation.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {locationTranslation.mapZone}
                  </p>
                </div>

                <div className="flex justify-center rounded-xl bg-slate-50 p-4">
                  <QRCodeSVG value={url} size={176} bgColor="#f8fafc" fgColor="#0f172a" />
                </div>

                <p className="mt-4 break-all text-center text-xs leading-relaxed text-slate-500">
                  {url}
                </p>

                <button
                  type="button"
                  onClick={() => copyLink(location.id)}
                  className="mt-5 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isCopied ? copy.copied : copy.copy}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}