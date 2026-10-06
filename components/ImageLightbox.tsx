'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

type ImageLightboxProps = {
  src: string | null;
  alt: string;
  closeLabel: string;
  zoomInLabel: string;
  zoomOutLabel: string;
  resetLabel: string;
  gestureHint: string;
  onClose: () => void;
};

type Point = { x: number; y: number };
type PinchStart = { distance: number; scale: number; midpoint: Point; offset: Point };

const MIN_SCALE = 1;
const MAX_SCALE = 5;

export default function ImageLightbox({
  src,
  alt,
  closeLabel,
  zoomInLabel,
  zoomOutLabel,
  resetLabel,
  gestureHint,
  onClose
}: ImageLightboxProps) {
  const [scale, setScale] = useState(MIN_SCALE);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const pointers = useRef(new Map<number, Point>());
  const pinchStart = useRef<PinchStart | null>(null);
  const panStart = useRef<{ point: Point; offset: Point } | null>(null);
  const gestureStart = useRef<Point | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  const reset = useCallback(() => {
    setScale(MIN_SCALE);
    setOffset({ x: 0, y: 0 });
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  useEffect(() => {
    if (!src) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[role="dialog"] button:not(:disabled)'));
      const firstButton = buttons[0];
      const lastButton = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === firstButton) {
        event.preventDefault();
        lastButton?.focus();
      } else if (!event.shiftKey && document.activeElement === lastButton) {
        event.preventDefault();
        firstButton?.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    closeButton.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
      pointers.current.clear();
      pinchStart.current = null;
      panStart.current = null;
    };
  }, [handleClose, src]);

  if (!src) return null;

  const changeZoom = (delta: number) => {
    const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + delta));
    setScale(next);
    if (next === MIN_SCALE) setOffset({ x: 0, y: 0 });
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, point);
    gestureStart.current = point;
    if (pointers.current.size === 2) {
      const [first, second] = Array.from(pointers.current.values());
      const midpoint = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
      pinchStart.current = {
        distance: Math.max(1, Math.hypot(first.x - second.x, first.y - second.y)),
        scale,
        midpoint,
        offset
      };
      panStart.current = null;
    } else if (scale > MIN_SCALE) {
      panStart.current = { point, offset };
    }
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    const point = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, point);

    if (pointers.current.size >= 2 && pinchStart.current) {
      const [first, second] = Array.from(pointers.current.values());
      const midpoint = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
      const distance = Math.max(1, Math.hypot(first.x - second.x, first.y - second.y));
      setScale(Math.max(MIN_SCALE, Math.min(MAX_SCALE, pinchStart.current.scale * distance / pinchStart.current.distance)));
      setOffset({
        x: pinchStart.current.offset.x + midpoint.x - pinchStart.current.midpoint.x,
        y: pinchStart.current.offset.y + midpoint.y - pinchStart.current.midpoint.y
      });
    } else if (panStart.current) {
      setOffset({
        x: panStart.current.offset.x + point.x - panStart.current.point.x,
        y: panStart.current.offset.y + point.y - panStart.current.point.y
      });
    }
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = gestureStart.current;
    const end = { x: event.clientX, y: event.clientY };
    if (scale === MIN_SCALE && start && end.y - start.y > 110 && Math.abs(end.x - start.x) < 90) handleClose();
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) {
      panStart.current = null;
      gestureStart.current = null;
    } else if (pointers.current.size === 1 && scale > MIN_SCALE) {
      const remainingPoint = Array.from(pointers.current.values())[0];
      panStart.current = { point: remainingPoint, offset };
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 text-white backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        <button type="button" onClick={() => changeZoom(-0.5)} aria-label={zoomOutLabel} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300">
          <ZoomOut aria-hidden="true" size={20} />
        </button>
        <button type="button" onClick={reset} aria-label={resetLabel} className="min-h-11 rounded-full border border-white/20 bg-black/60 px-4 text-sm font-semibold hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300">
          {Math.round(scale * 100)}%
        </button>
        <button type="button" onClick={() => changeZoom(0.5)} aria-label={zoomInLabel} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300">
          <ZoomIn aria-hidden="true" size={20} />
        </button>
        <button ref={closeButton} type="button" onClick={handleClose} aria-label={closeLabel} className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-lg hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
          <X aria-hidden="true" size={22} />
        </button>
      </div>
      <div
        className="relative flex min-h-0 flex-1 touch-none select-none items-center justify-center overflow-hidden px-2 py-20 sm:px-8"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={(event) => {
          event.preventDefault();
          changeZoom(event.deltaY < 0 ? 0.25 : -0.25);
        }}
      >
        <div
          className="relative h-full w-full"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
        >
          <Image src={src} alt={alt} fill sizes="100vw" className="pointer-events-none object-contain" priority />
        </div>
      </div>
      <p className="pointer-events-none absolute inset-x-4 bottom-4 text-center text-xs text-white/75 sm:text-sm">{gestureHint}</p>
    </div>
  );
}
