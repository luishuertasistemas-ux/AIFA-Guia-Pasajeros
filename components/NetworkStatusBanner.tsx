'use client';

import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

type NetworkStatusBannerProps = {
  wifiHint: string;
  onlineLabel: string;
  offlineLabel: string;
};

export default function NetworkStatusBanner({
  wifiHint,
  onlineLabel,
  offlineLabel
}: NetworkStatusBannerProps) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  const StatusIcon = isOnline ? Wifi : WifiOff;

  return (
    <aside
      aria-live="polite"
      className="fixed inset-x-3 bottom-3 z-40 mx-auto flex w-fit max-w-[calc(100vw-1.5rem)] items-center gap-3 rounded-2xl border border-white/15 bg-slate-950/80 px-4 py-3 text-white shadow-xl backdrop-blur-xl sm:inset-x-auto sm:bottom-5 sm:right-5 sm:max-w-md"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-300/15 text-amber-200">
        <span aria-hidden="true">💡</span>
      </span>
      <p className="min-w-0 flex-1 text-xs font-medium leading-relaxed text-slate-100 sm:text-sm">{wifiHint}</p>
      <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold sm:text-xs ${isOnline ? 'bg-emerald-300/15 text-emerald-200' : 'bg-amber-300/15 text-amber-100'}`}>
        <StatusIcon aria-hidden="true" size={14} />
        {isOnline ? onlineLabel : offlineLabel}
      </span>
    </aside>
  );
}
