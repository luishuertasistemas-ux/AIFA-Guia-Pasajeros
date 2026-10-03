'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { translations } from '@/data/translations';
import { useLanguage } from '@/LanguageContext';

type QrScannerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onScan: (value: string) => void;
};

export default function QrScannerModal({ isOpen, onClose, onScan }: QrScannerModalProps) {
  const scannerId = useId().replace(/:/g, '');
  const [error, setError] = useState('');
  const [hasCameraConsent, setHasCameraConsent] = useState(false);
  const { language } = useLanguage();
  const copy = translations[language].scanner;
  const onCloseRef = useRef(onClose);
  const onScanRef = useRef(onScan);

  useEffect(() => {
    onCloseRef.current = () => {
      setHasCameraConsent(false);
      setError('');
      onClose();
    };
    onScanRef.current = onScan;
  }, [onClose, onScan]);

  useEffect(() => {
    if (!isOpen || !hasCameraConsent) return;

    let scanner: Html5Qrcode | null = null;
    let isMounted = true;

    const startScanner = async () => {
      try {
        scanner = new Html5Qrcode(scannerId);
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText) => {
            if (!isMounted) return;
            onScanRef.current(decodedText);
            onCloseRef.current();
          },
          () => undefined
        );
        if (!isMounted) {
          await scanner.stop();
          scanner.clear();
        }
      } catch {
        if (isMounted) {
          setError(copy.cameraError);
          setHasCameraConsent(false);
        }
      }
    };

    void startScanner();

    return () => {
      isMounted = false;
      if (scanner) {
        void scanner.stop().then(() => scanner?.clear()).catch(() => undefined);
      }
    };
  }, [copy.cameraError, hasCameraConsent, isOpen, scannerId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby={`${scannerId}-title`}>
      <div className="w-full max-w-md rounded-2xl bg-white p-5 text-slate-900 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={`${scannerId}-title`} className="text-xl font-bold">{copy.title}</h2>
            <p className="text-xs text-slate-500 italic mt-1">{copy.tagline}</p>
            <p className="mt-1 text-sm text-slate-500">{copy.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.close}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-900" role="note">
          {copy.privacyNotice}
        </p>
        {hasCameraConsent && <div id={scannerId} className="mt-4 min-h-64 overflow-hidden rounded-xl bg-slate-950" />}
        {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {!hasCameraConsent && (
          <button
            type="button"
            onClick={() => {
              setError('');
              setHasCameraConsent(true);
            }}
            className="mt-4 w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            {copy.allowCamera}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setHasCameraConsent(false);
            setError('');
            onClose();
          }}
          className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          {copy.close}
        </button>
      </div>
    </div>
  );
}
