export const GESTOR_PEER_ID = process.env.NEXT_PUBLIC_AIFA_GESTOR_PEER_ID || 'aifa-gestor-service';
export const CALL_LOG_KEY = 'aifa-video-call-log-v1';
export const PASSENGER_CALL_LOG_KEY = 'aifa-video-call-passenger-log-v1';

export type VideoCallRecord = {
  callId: string;
  managementId: string;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  rating: number | null;
  comment: string;
};

export type VideoCallMessage =
  | { type: 'incoming'; callId: string; startedAt: string }
  | { type: 'ended'; callId: string; endedAt: string; durationSeconds: number }
  | { type: 'rating'; callId: string; rating: number; comment: string };

export function parseVideoCallMessage(value: unknown): VideoCallMessage | null {
  if (typeof value !== 'object' || value === null || !('type' in value) || !('callId' in value)) return null;
  if (typeof value.callId !== 'string') return null;

  if (value.type === 'incoming' && 'startedAt' in value && typeof value.startedAt === 'string') {
    return { type: 'incoming', callId: value.callId, startedAt: value.startedAt };
  }
  if (
    value.type === 'ended' &&
    'endedAt' in value &&
    typeof value.endedAt === 'string' &&
    'durationSeconds' in value &&
    typeof value.durationSeconds === 'number'
  ) {
    return { type: 'ended', callId: value.callId, endedAt: value.endedAt, durationSeconds: value.durationSeconds };
  }
  if (
    value.type === 'rating' &&
    'rating' in value &&
    typeof value.rating === 'number' &&
    'comment' in value &&
    typeof value.comment === 'string'
  ) {
    return { type: 'rating', callId: value.callId, rating: value.rating, comment: value.comment };
  }
  return null;
}

export function createManagementId(): string {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
  const suffix = globalThis.crypto?.randomUUID?.().slice(0, 8).toUpperCase()
    ?? Math.random().toString(36).slice(2, 10).toUpperCase();
  return `AIFA-${timestamp}-${suffix}`;
}

export function readCallLog(storageKey = CALL_LOG_KEY): VideoCallRecord[] {
  const rawLog = window.localStorage.getItem(storageKey);
  if (!rawLog) return [];
  const parsed: unknown = JSON.parse(rawLog);
  if (!Array.isArray(parsed)) throw new Error('El registro de videollamadas tiene un formato inválido.');
  return parsed.filter((record): record is VideoCallRecord =>
    typeof record === 'object' &&
    record !== null &&
    'callId' in record &&
    typeof record.callId === 'string' &&
    'managementId' in record &&
    typeof record.managementId === 'string' &&
    'startedAt' in record &&
    typeof record.startedAt === 'string' &&
    'endedAt' in record &&
    typeof record.endedAt === 'string' &&
    'durationSeconds' in record &&
    typeof record.durationSeconds === 'number' &&
    'rating' in record &&
    (typeof record.rating === 'number' || record.rating === null) &&
    'comment' in record &&
    typeof record.comment === 'string'
  );
}

export function saveCallRecord(record: VideoCallRecord, storageKey = CALL_LOG_KEY): VideoCallRecord[] {
  const records = readCallLog(storageKey);
  const nextRecords = [record, ...records.filter((item) => item.callId !== record.callId)].slice(0, 200);
  window.localStorage.setItem(storageKey, JSON.stringify(nextRecords));
  return nextRecords;
}
