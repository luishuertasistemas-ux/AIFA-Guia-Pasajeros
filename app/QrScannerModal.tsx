'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

type ScannerLanguage = 'ES' | 'EN' | 'FR' | 'ZH';

type QrScannerModalProps = {
  isOpen: boolean;
  language: ScannerLanguage;
  onClose: () => void;
  onScan: (value: string) => void;
};

const COPY: Record<ScannerLanguage, {
  title: string;
  description: string;
  close: string;
  cameraError: string;
  scanError: string;
}> = {
  ES: {
    title: 'Escanear ubicación',
    description: 'Apunta la cámara a un código QR de AIFA.',
    close: 'Cerrar escáner',
    cameraError: 'No se pudo acceder a la cámara. Revisa los permisos del navegador.',
    scanError: 'No se pudo leer este código QR.'
  },
  EN: {
    title: 'Scan location',
    description: 'Point the camera at an AIFA QR code.',
    close: 'Close scanner',
    cameraError: 'Camera access failed. Check your browser permissions.',
    scanError: 'This QR code could not be read.'
  },
  FR: {
    title: 'Scanner un emplacement',
    description: 'Pointez la caméra vers un code QR AIFA.',
    close: 'Fermer le scanner',
    cameraError: 'Impossible d’accéder à la caméra. Vérifiez les autorisations du navigateur.',
    scanError: 'Ce code QR n’a pas pu être lu.'
  },
  ZH: {
    title: '扫描位置',
    description: '将摄像头对准 AIFA 二维码。',
    close: '关闭扫描器',
    cameraError: '无法访问摄像头，请检查浏览器权限。',
    scanError: '无法读取此二维码。'
  }
};

export default function QrScannerModal({ isOpen, language, onClose, onScan }: QrScannerModalProps) {
  const scannerId = useId().replace(/:/g, '');
  const [error, setError] = useState('');
  const copy = COPY[language];
  const onCloseRef = useRef(onClose);
  const onScanRef = useRef(onScan);

  onCloseRef.current = onClose;
  onScanRef.current = onScan;

  useEffect(() => {
    if (!isOpen) return;

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
        if (isMounted) setError(copy.cameraError);
      }
    };

    void startScanner();

    return () => {
      isMounted = false;
      if (scanner) {
        void scanner.stop().then(() => scanner?.clear()).catch(() => undefined);
      }
    };
  }, [copy.cameraError, isOpen, scannerId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby={`${scannerId}-title`}>
      <div className="w-full max-w-md rounded-2xl bg-white p-5 text-slate-900 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={`${scannerId}-title`} className="text-xl font-bold">{copy.title}</h2>
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
        <div id={scannerId} className="mt-4 min-h-64 overflow-hidden rounded-xl bg-slate-950" />
        {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          {copy.close}
        </button>
      </div>
    </div>
  );
}
