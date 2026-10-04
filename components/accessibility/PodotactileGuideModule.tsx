'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, CameraOff, Footprints, Pause, Play } from 'lucide-react';
import { useLanguage } from '@/LanguageContext';
import { translations } from '@/data/translations';

type DetectionResult = {
  found: boolean;
  points: { x: number; y: number }[];
};

function analyzeFrame(
  image: ImageData,
  width: number,
  height: number,
  overlay: HTMLCanvasElement,
): DetectionResult {
  const { data } = image;
  const rowCount = 10;
  const rowHits = Array.from({ length: rowCount }, () => 0);
  const rowX = Array.from({ length: rowCount }, () => 0);
  const yellowRows = Array.from({ length: rowCount }, () => 0);
  const yellowX = Array.from({ length: rowCount }, () => 0);
  const edgeHistogram = Array.from({ length: rowCount }, () => Array<number>(width).fill(0));
  let yellowTotal = 0;
  let edgeTotal = 0;

  for (let y = Math.floor(height * 0.35); y < height - 1; y += 2) {
    const row = Math.min(rowCount - 1, Math.floor(((y / height) - 0.35) / 0.65 * rowCount));
    for (let x = 2; x < width - 2; x += 2) {
      const index = (y * width + x) * 4;
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const isYellow = red > 115 && green > 90 && blue < 125 && red > blue * 1.3 && green > blue * 1.12;

      if (isYellow) {
        yellowRows[row] += 1;
        yellowX[row] += x;
        yellowTotal += 1;
        continue;
      }

      const leftIndex = (y * width + x - 2) * 4;
      const rightIndex = (y * width + x + 2) * 4;
      const leftGray = (data[leftIndex] + data[leftIndex + 1] + data[leftIndex + 2]) / 3;
      const rightGray = (data[rightIndex] + data[rightIndex + 1] + data[rightIndex + 2]) / 3;
      const gray = (red + green + blue) / 3;
      const horizontalEdge = Math.abs(rightGray - leftGray);
      if (gray < 175 && horizontalEdge > 42) {
        edgeHistogram[row][x] += horizontalEdge;
        edgeTotal += 1;
      }
    }
  }

  let edgePairs = 0;
  for (let row = 0; row < rowCount; row += 1) {
    const peaks: { x: number; strength: number }[] = [];
    for (let x = 4; x < width - 4; x += 2) {
      const strength = edgeHistogram[row][x - 2] + edgeHistogram[row][x] + edgeHistogram[row][x + 2];
      if (strength < 150) continue;
      if (strength >= edgeHistogram[row][x - 4] + edgeHistogram[row][x + 4]) {
        peaks.push({ x, strength });
        x += 4;
      }
    }

    let bestPair: { center: number; strength: number } | null = null;
    for (let left = 0; left < peaks.length; left += 1) {
      for (let right = left + 1; right < peaks.length; right += 1) {
        const separation = peaks[right].x - peaks[left].x;
        if (separation < width * 0.06) continue;
        if (separation > width * 0.6) break;
        const strength = peaks[left].strength + peaks[right].strength;
        if (!bestPair || strength > bestPair.strength) {
          bestPair = { center: (peaks[left].x + peaks[right].x) / 2, strength };
        }
      }
    }
    if (bestPair) {
      rowHits[row] = bestPair.strength;
      rowX[row] = bestPair.center * bestPair.strength;
      edgePairs += 1;
    }
  }

  const useYellow = yellowTotal >= 12 && yellowTotal >= edgeTotal * 0.1;
  const minimumHits = useYellow ? 2 : 300;
  const points: DetectionResult['points'] = [];
  for (let index = 0; index < rowCount; index += 1) {
    const hits = useYellow ? yellowRows[index] : rowHits[index];
    const weightedX = useYellow ? yellowX[index] : rowX[index];
    if (hits < minimumHits) continue;
    points.push({
      x: weightedX / hits,
      y: height * (0.35 + ((index + 0.5) / rowCount) * 0.65)
    });
  }

  const found = points.length >= 4 && (useYellow ? yellowTotal >= 12 : edgePairs >= 4);
  const context = overlay.getContext('2d');
  if (!context) return { found, points };
  context.clearRect(0, 0, overlay.width, overlay.height);
  if (!found) return { found, points: [] };

  const scaleX = overlay.width / width;
  const scaleY = overlay.height / height;
  context.save();
  context.scale(scaleX, scaleY);

  const path = new Path2D();
  points.forEach(({ x, y }, index) => {
    if (index === 0) path.moveTo(x, y);
    else path.lineTo(x, y);
  });
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.shadowColor = 'rgba(52, 211, 153, 0.95)';
  context.shadowBlur = 24;
  context.strokeStyle = 'rgba(52, 211, 153, 0.5)';
  context.lineWidth = width * 0.075;
  context.stroke(path);
  context.shadowBlur = 0;
  context.strokeStyle = 'rgba(236, 253, 245, 0.95)';
  context.lineWidth = Math.max(3, width * 0.012);
  context.stroke(path);

  const arrowPoint = points[Math.floor(points.length * 0.62)];
  if (arrowPoint) {
    context.translate(arrowPoint.x, arrowPoint.y);
    context.rotate(-Math.PI / 2);
    context.fillStyle = 'rgba(236, 253, 245, 0.98)';
    context.beginPath();
    context.moveTo(width * 0.04, 0);
    context.lineTo(-width * 0.025, -width * 0.028);
    context.lineTo(-width * 0.025, width * 0.028);
    context.closePath();
    context.fill();
  }
  context.restore();
  return { found, points };
}

export function PodotactileGuideModule() {
  const { language } = useLanguage();
  const copy = translations[language].podotactile;
  const route = translations[language].details.routeGallery;
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const frameCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const previousDetectionRef = useRef(false);
  const detectionStreakRef = useRef(0);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isTransition, setIsTransition] = useState(false);
  const [isRouteDetected, setIsRouteDetected] = useState(false);
  const [hasAttemptedDetection, setHasAttemptedDetection] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState('');
  const [announcement, setAnnouncement] = useState('');

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsCameraOn(false);
    setIsRouteDetected(false);
    previousDetectionRef.current = false;
    const overlay = overlayRef.current;
    const context = overlay?.getContext('2d');
    if (overlay && context) context.clearRect(0, 0, overlay.width, overlay.height);
  }, []);

  const startCamera = async () => {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(copy.unsupported);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      const video = videoRef.current;
      if (!video) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = stream;
      video.srcObject = stream;
      await video.play();
      setIsCameraOn(true);
      setAnnouncement(copy.searching);
    } catch (cameraError) {
      console.error('No se pudo iniciar la cámara para la guía podotáctil.', cameraError);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setError(copy.cameraError);
      setIsCameraOn(false);
    }
  };

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    if (!isCameraOn || isTransition) return;
    let animationFrame = 0;
    let lastAnalysis = 0;
    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (!video || !overlay) return;
    const frameCanvas = frameCanvasRef.current ?? document.createElement('canvas');
    frameCanvasRef.current = frameCanvas;
    const frameContext = frameCanvas.getContext('2d', { willReadFrequently: true });
    if (!frameContext) {
      setError(copy.cameraError);
      return;
    }

    const analyze = (time: number) => {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && time - lastAnalysis > 140) {
        lastAnalysis = time;
        const frameWidth = 192;
        const frameHeight = 144;
        if (frameCanvas.width !== frameWidth || frameCanvas.height !== frameHeight) {
          frameCanvas.width = frameWidth;
          frameCanvas.height = frameHeight;
        }
        if (overlay.width !== video.videoWidth || overlay.height !== video.videoHeight) {
          overlay.width = video.videoWidth;
          overlay.height = video.videoHeight;
        }
        frameContext.drawImage(video, 0, 0, frameWidth, frameHeight);
        const result = analyzeFrame(frameContext.getImageData(0, 0, frameWidth, frameHeight), frameWidth, frameHeight, overlay);
        setHasAttemptedDetection(true);
        detectionStreakRef.current = result.found === previousDetectionRef.current
          ? 0
          : detectionStreakRef.current + 1;
        const requiredFrames = result.found ? 2 : 5;
        if (detectionStreakRef.current >= requiredFrames) {
          detectionStreakRef.current = 0;
          previousDetectionRef.current = result.found;
          setIsRouteDetected(result.found);
          setAnnouncement(result.found ? copy.routeDetected : copy.routeLost);
          if ('vibrate' in navigator) navigator.vibrate(result.found ? [90, 45, 90] : 180);
        }
      }
      animationFrame = window.requestAnimationFrame(analyze);
    };

    animationFrame = window.requestAnimationFrame(analyze);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [copy.cameraError, copy.routeDetected, copy.routeLost, isCameraOn, isTransition]);

  const moveToNextStep = () => {
    if (stepIndex + 1 >= route.steps.length) return;
    const nextIndex = stepIndex + 1;
    setStepIndex(nextIndex);
    if (nextIndex === 4) {
      setIsTransition(true);
      setIsRouteDetected(false);
      previousDetectionRef.current = false;
      detectionStreakRef.current = 0;
      setAnnouncement(copy.detectionPaused);
      if ('vibrate' in navigator) navigator.vibrate(60);
    }
  };

  const resumeAfterTransition = () => {
    setIsTransition(false);
    setHasAttemptedDetection(false);
    detectionStreakRef.current = 0;
    setAnnouncement(copy.searching);
  };

  const currentStep = route.steps[stepIndex];

  return (
    <section className="rounded-3xl border border-white/25 bg-slate-950/75 p-5 text-white shadow-2xl backdrop-blur-xl sm:p-7" aria-labelledby="podotactile-guide-title">
      <header className="mb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-200/30 bg-emerald-300/15 text-emerald-100">
            <Footprints aria-hidden="true" size={24} />
          </span>
          <h2 id="podotactile-guide-title" className="text-xl font-bold sm:text-2xl">{copy.title}</h2>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">{copy.description}</p>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">{copy.permissionHint}</p>
      </header>

      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/20 bg-slate-900 sm:aspect-video">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          aria-label={copy.cameraActive}
          muted
          playsInline
        />
        <canvas ref={overlayRef} className="pointer-events-none absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
        {!isCameraOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/75 px-6 text-center text-sm text-slate-200">
            <Camera aria-hidden="true" size={34} className="text-emerald-200" />
            <p>{copy.permissionRequired}</p>
          </div>
        )}
        {isTransition && (
          <div className="absolute inset-x-3 top-3 flex items-center gap-2 rounded-xl border border-amber-200/35 bg-slate-950/85 px-4 py-3 text-sm font-semibold text-white backdrop-blur-md" role="status">
            <Pause aria-hidden="true" size={18} /> {copy.transitionStatus}
          </div>
        )}
        {isCameraOn && !isTransition && (
          <div className="absolute inset-x-3 top-3 flex items-center gap-2 rounded-xl border border-white/20 bg-slate-950/75 px-4 py-3 text-sm font-semibold text-white backdrop-blur-md" role="status">
            <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${isRouteDetected ? 'bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]' : 'bg-white/65'}`} />
            {isRouteDetected ? copy.detected : hasAttemptedDetection ? copy.lost : copy.searching}
          </div>
        )}
      </div>

      {error && <p className="mt-3 rounded-xl border border-rose-200/30 bg-rose-950/60 p-3 text-sm text-rose-100" role="alert">{error}</p>}
      {isCameraOn && hasAttemptedDetection && !isRouteDetected && !isTransition && (
        <p className="mt-3 rounded-xl border border-white/15 bg-white/5 p-3 text-sm leading-relaxed text-slate-200" role="status">{copy.noDetection}</p>
      )}
      <p className="sr-only" aria-live="polite">{announcement}</p>

      <div className="mt-4 flex flex-wrap gap-3">
        {!isCameraOn ? (
          <button type="button" onClick={() => void startCamera()} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg transition hover:bg-emerald-200 focus:outline-none focus:ring-4 focus:ring-white/60">
            <Camera aria-hidden="true" size={18} /> {copy.startCamera}
          </button>
        ) : (
          <button type="button" onClick={stopCamera} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/60">
            <CameraOff aria-hidden="true" size={18} /> {copy.stopCamera}
          </button>
        )}
        {isCameraOn && !isTransition && (
          <button type="button" onClick={() => {
            setIsTransition(true);
            setIsRouteDetected(false);
            previousDetectionRef.current = false;
            setAnnouncement(copy.detectionPaused);
          }} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-amber-200/35 bg-amber-200/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-200/20 focus:outline-none focus:ring-4 focus:ring-amber-100/50">
            <Pause aria-hidden="true" size={18} /> {copy.transitionStart}
          </button>
        )}
        {isCameraOn && isTransition && (
          <button type="button" onClick={resumeAfterTransition} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-200 focus:outline-none focus:ring-4 focus:ring-white/60">
            <Play aria-hidden="true" size={18} /> {copy.transitionFinish}
          </button>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-100">{copy.step} {stepIndex + 1} / {route.steps.length}</p>
          <p className="text-xs text-slate-300">{isTransition ? copy.transitionStatus : isRouteDetected ? copy.detected : copy.lost}</p>
        </div>
        <h3 className="mt-2 text-lg font-bold">{currentStep.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-200">{currentStep.description}</p>
        {currentStep.referencePoint && <p className="mt-3 text-sm leading-relaxed text-slate-300">{currentStep.referencePoint}</p>}
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" disabled={stepIndex === 0} onClick={() => {
            setIsTransition(false);
            setStepIndex((index) => Math.max(0, index - 1));
          }} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-45 focus:outline-none focus:ring-2 focus:ring-white/70">
            <ArrowLeft aria-hidden="true" size={17} /> {copy.previous}
          </button>
          {stepIndex < route.steps.length - 1 && (
            <button type="button" onClick={isTransition ? () => {
              setStepIndex((index) => Math.min(route.steps.length - 1, index + 1));
              resumeAfterTransition();
            } : moveToNextStep} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/70">
              {isTransition ? copy.transitionFinish : copy.next} <ArrowRight aria-hidden="true" size={17} />
            </button>
          )}
        </div>
      </div>
      <p className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 text-xs leading-relaxed text-slate-300">{copy.visualAid}</p>
    </section>
  );
}
