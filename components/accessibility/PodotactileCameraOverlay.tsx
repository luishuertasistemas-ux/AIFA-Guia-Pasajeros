'use client';

import { useEffect, type RefObject } from 'react';

type RoutePoint = {
  x: number;
  y: number;
  halfWidth: number;
};

type PodotactileCameraOverlayProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  points: RoutePoint[];
  visible: boolean;
  sourceWidth: number;
  sourceHeight: number;
};

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
