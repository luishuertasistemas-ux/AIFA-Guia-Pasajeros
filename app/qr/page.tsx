'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MOCK_LOCATIONS } from '@/data/locations';

const APP_URL = 'https://aifa-guia-pasajeros.vercel.app/?origen=';

export default function QRPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyLink = async (id: string) => {
    const url = `${APP_URL}${id}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <main className="min-h-screen bg-slate-900 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
            AIFA Guía de Pasajeros
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Códigos QR de ubicaciones
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300">
            Escanea o copia un enlace para probar la guía desde cada punto de origen.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(MOCK_LOCATIONS).map((location) => {
            const url = `${APP_URL}${location.id}`;
            const isCopied = copiedId === location.id;

            return (
              <article
                key={location.id}
                className="flex flex-col rounded-2xl bg-white p-5 shadow-xl shadow-slate-950/20"
              >
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    Punto de origen
                  </p>
                  <h2 className="mt-1 min-h-14 text-lg font-bold leading-tight text-slate-800">
                    {location.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {location.zone} <span className="px-1 text-slate-300">•</span> {location.level}
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
                  {isCopied ? 'Enlace copiado' : 'Copiar Enlace'}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}