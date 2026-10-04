'use client';

import { useEffect, type RefObject } from 'react';

type RoutePoint = {
  x: number;
  y: number;
  halfWidth: number;
};

export type PodotactileDetection = {
  found: boolean;
  points: RoutePoint[];
};

type PodotactileCameraOverlayProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  points: RoutePoint[];
  visible: boolean;
  sourceWidth: number;
  sourceHeight: number;
};

type TactileSurface = 'yellow' | 'neutral';

function classifyTactileSurface(
  red: number,
  green: number,
  blue: number,
  frameBrightness: number,
): TactileSurface | null {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const saturation = max === 0 ? 0 : delta / max;
  const valueFloor = Math.max(0.1, Math.min(0.24, frameBrightness * 0.42));
  const valueCeiling = Math.max(0.78, Math.min(0.99, frameBrightness * 1.42));
  if (max < valueFloor || max > valueCeiling) return null;

  let hue = 0;
  if (delta > 0) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6);
    else if (max === g) hue = 60 * ((b - r) / delta + 2);
    else hue = 60 * ((r - g) / delta + 4);
    if (hue < 0) hue += 360;
  }

  const minimumSaturation = frameBrightness < 0.3 ? 0.2 : frameBrightness > 0.72 ? 0.18 : 0.24;
  if (hue >= 18 && hue <= 76 && saturation >= minimumSaturation
    && red >= green * 1.02 && green >= blue * 1.08 && red - blue >= 24) {
    return 'yellow';
  }

  if (saturation <= 0.18 && max >= 0.22 && max <= 0.78 && delta <= 0.12) {
    return 'neutral';
  }
  return null;
}

export function analyzePodotactileFrame(
  image: ImageData,
  width: number,
  height: number,
): PodotactileDetection {
  const { data } = image;
  const bandCount = 9;
  const scanTop = Math.floor(height * 0.32);
  const bandHeight = (height - scanTop) / bandCount;
  const brightnessSamples: number[] = [];
  for (let y = scanTop; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      const index = (y * width + x) * 4;
      brightnessSamples.push((data[index] * 0.2126 + data[index + 1] * 0.7152 + data[index + 2] * 0.0722) / 255);
    }
  }
  const frameBrightness = brightnessSamples.reduce((sum, value) => sum + value, 0) / Math.max(1, brightnessSamples.length);
  const detectionsBySurface: Record<TactileSurface, (RoutePoint & { area: number })[]> = {
    yellow: [],
    neutral: []
  };

  for (let band = 0; band < bandCount; band += 1) {
    const firstY = Math.floor(scanTop + band * bandHeight);
    const lastY = Math.min(height - 1, Math.floor(scanTop + (band + 1) * bandHeight));
    const sampleYs = [firstY + 1, Math.floor((firstY + lastY) / 2), Math.max(firstY + 1, lastY - 1)];
    const columnHits: Record<TactileSurface, Uint8Array> = {
      yellow: new Uint8Array(width),
      neutral: new Uint8Array(width)
    };

    for (const y of sampleYs) {
      for (let x = 2; x < width - 2; x += 2) {
        const index = (y * width + x) * 4;
        const surface = classifyTactileSurface(data[index], data[index + 1], data[index + 2], frameBrightness);
        if (surface) columnHits[surface][x] += 1;
      }
    }

    for (const surface of ['yellow', 'neutral'] as const) {
      const columns = columnHits[surface];
      const runs: { start: number; end: number; hits: number }[] = [];
      let runStart = -1;
      let runHits = 0;
      let gap = 0;
      for (let x = 2; x < width - 2; x += 2) {
        if (columns[x] >= 2) {
          if (runStart < 0) runStart = x;
          runHits += columns[x];
          gap = 0;
        } else if (runStart >= 0 && gap < 2) {
          gap += 1;
        } else if (runStart >= 0) {
          runs.push({ start: runStart, end: x - gap * 2, hits: runHits });
          runStart = -1;
          runHits = 0;
          gap = 0;
        }
      }
      if (runStart >= 0) runs.push({ start: runStart, end: width - 2, hits: runHits });

      const depth = (band + 0.5) / bandCount;
      const minimumStripeWidth = width * (0.045 + depth * 0.075);
      const bestRun = runs
        .filter((run) => {
          const runWidth = run.end - run.start;
          const coverage = run.hits / (Math.max(1, Math.ceil(runWidth / 2)) * sampleYs.length);
          const maximumWidth = surface === 'neutral' ? width * 0.52 : width * 0.72;
          return runWidth >= minimumStripeWidth
            && runWidth <= maximumWidth
            && coverage >= (surface === 'neutral' ? 0.72 : 0.58);
        })
        .sort((a, b) => b.hits - a.hits)[0];

      if (bestRun) {
        const runWidth = bestRun.end - bestRun.start;
        const coverage = bestRun.hits / (Math.max(1, Math.ceil(runWidth / 2)) * sampleYs.length);
        detectionsBySurface[surface].push({
          x: (bestRun.start + bestRun.end) / 2,
          y: (firstY + lastY) / 2,
          halfWidth: runWidth / 2,
          area: runWidth * bandHeight * coverage
        });
      }
    }
  }

  for (const surface of ['yellow', 'neutral'] as const) {
    const detections = detectionsBySurface[surface];
    if (detections.length < 6) continue;

    const upper = detections.filter(({ y }) => y < scanTop + (height - scanTop) * 0.45);
    const lower = detections.filter(({ y }) => y > scanTop + (height - scanTop) * 0.55);
    if (upper.length < 2 || lower.length < 3) continue;

    const medianWidth = (values: typeof detections) => {
      const widths = values.map(({ halfWidth }) => halfWidth * 2).sort((a, b) => a - b);
      return widths[Math.floor(widths.length / 2)] ?? 0;
    };
    const upperWidth = medianWidth(upper);
    const lowerWidth = medianWidth(lower);
    const overallWidth = medianWidth(detections);
    if (lowerWidth < upperWidth * 1.08 && overallWidth < width * 0.2) continue;

    const centerDrift = detections.slice(1).reduce((total, point, index) =>
      total + Math.abs(point.x - detections[index].x), 0);
    const maximumDrift = width * 0.2 * (detections.length - 1);
    if (centerDrift > maximumDrift) continue;

    const relativeTrapezoidArea = detections.reduce((total, detection) => total + detection.area, 0)
      / (width * (height - scanTop));
    if (relativeTrapezoidArea < (surface === 'neutral' ? 0.09 : 0.035)) continue;

    return {
      found: true,
      points: detections.map(({ x, y, halfWidth }) => ({ x, y, halfWidth }))
    };
  }

  return { found: false, points: [] };
}

export function PodotactileCameraOverlay({
  canvasRef,
  points,
  visible,
  sourceWidth,
  sourceHeight
}: PodotactileCameraOverlayProps) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    if (!visible || points.length < 3 || !sourceWidth || !sourceHeight) return;

    const scaleX = canvas.width / sourceWidth;
    const scaleY = canvas.height / sourceHeight;
    const scaledPoints = points.map((point) => ({
      x: point.x * scaleX,
      y: point.y * scaleY,
      halfWidth: point.halfWidth * scaleX
    }));
    const centerline = new Path2D();
    scaledPoints.forEach((point, index) => {
      if (index === 0) centerline.moveTo(point.x, point.y);
      else centerline.lineTo(point.x, point.y);
    });

    const leftEdge: { x: number; y: number }[] = [];
    const rightEdge: { x: number; y: number }[] = [];
    scaledPoints.forEach((point, index) => {
      const previous = scaledPoints[Math.max(0, index - 1)];
      const next = scaledPoints[Math.min(scaledPoints.length - 1, index + 1)];
      const tangentX = next.x - previous.x;
      const tangentY = next.y - previous.y;
      const length = Math.hypot(tangentX, tangentY) || 1;
      const normalX = -tangentY / length;
      const normalY = tangentX / length;
      const halfWidth = Math.max(point.halfWidth, canvas.width * 0.025);
      leftEdge.push({ x: point.x + normalX * halfWidth, y: point.y + normalY * halfWidth });
      rightEdge.push({ x: point.x - normalX * halfWidth, y: point.y - normalY * halfWidth });
    });

    const mask = new Path2D();
    leftEdge.forEach((point, index) => {
      if (index === 0) mask.moveTo(point.x, point.y);
      else mask.lineTo(point.x, point.y);
    });
    for (let index = rightEdge.length - 1; index >= 0; index -= 1) {
      mask.lineTo(rightEdge[index].x, rightEdge[index].y);
    }
    mask.closePath();

    context.save();
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.fillStyle = 'rgba(74, 222, 128, 0.36)';
    context.shadowColor = 'rgba(74, 255, 107, 0.95)';
    context.shadowBlur = canvas.width * 0.035;
    context.fill(mask);
    context.strokeStyle = 'rgba(74, 255, 107, 0.98)';
    context.lineWidth = Math.max(canvas.width * 0.012, 5);
    context.stroke(mask);

    context.shadowBlur = canvas.width * 0.025;
    context.strokeStyle = 'rgba(250, 204, 21, 0.95)';
    context.lineWidth = Math.max(canvas.width * 0.055, 8);
    context.stroke(centerline);
    context.shadowBlur = 0;
    context.strokeStyle = 'rgba(254, 249, 195, 0.95)';
    context.lineWidth = Math.max(canvas.width * 0.009, 4);
    context.stroke(centerline);

    const arrowIndexes = [0.3, 0.58, 0.84].map((fraction) =>
      Math.min(scaledPoints.length - 2, Math.max(1, Math.round((scaledPoints.length - 1) * fraction)))
    );
    arrowIndexes.forEach((index) => {
      const point = scaledPoints[index];
      const towardFarEnd = scaledPoints[index - 1];
      const angle = Math.atan2(towardFarEnd.y - point.y, towardFarEnd.x - point.x);
      const arrowLength = Math.max(canvas.width * 0.035, 14);
      const arrowHalfWidth = arrowLength * 0.58;

      context.save();
      context.translate(point.x, point.y);
      context.rotate(angle);
      context.beginPath();
      context.moveTo(arrowLength, 0);
      context.lineTo(-arrowLength * 0.65, -arrowHalfWidth);
      context.lineTo(-arrowLength * 0.35, 0);
      context.lineTo(-arrowLength * 0.65, arrowHalfWidth);
      context.closePath();
      context.fillStyle = 'rgba(236, 253, 245, 0.98)';
      context.shadowColor = 'rgba(74, 255, 107, 0.95)';
      context.shadowBlur = canvas.width * 0.018;
      context.fill();
      context.restore();
    });
    context.restore();
  }, [canvasRef, points, sourceHeight, sourceWidth, visible]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      aria-hidden="true"
    />
  );
}
