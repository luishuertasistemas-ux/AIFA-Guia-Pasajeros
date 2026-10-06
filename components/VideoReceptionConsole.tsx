'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { DataConnection, MediaConnection, Peer as PeerInstance } from 'peerjs';
import { Camera, Check, Clock3, Mic, Phone, PhoneOff, Star, Video } from 'lucide-react';
import type { VideoCallTranslations } from '@/data/translations';
import {
  GESTOR_PEER_ID,
  parseVideoCallMessage,
  readCallLog,
  saveCallRecord,
  type VideoCallRecord
} from '@/lib/video-calls';

type PendingIncomingCall = {
  call: MediaConnection;
  callId: string;
  startedAt: string;
};

function metadataString(metadata: unknown, key: 'callId' | 'startedAt'): string | null {
  if (typeof metadata !== 'object' || metadata === null) return null;
  if (key === 'callId' && 'callId' in metadata && typeof metadata.callId === 'string') return metadata.callId;
  if (key === 'startedAt' && 'startedAt' in metadata && typeof metadata.startedAt === 'string') return metadata.startedAt;
  return null;
}

export default function VideoReceptionConsole({ copy }: { copy: VideoCallTranslations }) {
  const [isOnline, setIsOnline] = useState(false);
  const [incomingCall, setIncomingCall] = useState<PendingIncomingCall | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isAlertEnabled, setIsAlertEnabled] = useState(false);
  const [error, setError] = useState('');
  const [records, setRecords] = useState<VideoCallRecord[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [passengerStream, setPassengerStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const passengerVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<PeerInstance | null>(null);
  const callRef = useRef<MediaConnection | null>(null);
  const connectionRef = useRef<DataConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pendingCallRef = useRef<PendingIncomingCall | null>(null);
  const endedCallsRef = useRef(new Set<string>());
  const audioContextRef = useRef<AudioContext | null>(null);
  const alertEnabledRef = useRef(false);

  useEffect(() => {
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (passengerVideoRef.current) passengerVideoRef.current.srcObject = passengerStream;
  }, [passengerStream]);

  const upsertRecord = useCallback((record: VideoCallRecord) => {
    try {
      setRecords(saveCallRecord(record));
    } catch {
      setError(copy.connectionError);
    }
  }, [copy.connectionError]);

  const notifyIncoming = useCallback(() => {
    if (!alertEnabledRef.current) return;
    try {
      const context = audioContextRef.current;
      if (!context || context.state !== 'running') return;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = 880;
      gain.gain.value = 0.12;
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.35);
    } catch {
      setError(copy.soundAlert);
    }
  }, [copy.soundAlert]);

  const finishCurrentCall = useCallback((callId: string, endedAt = new Date().toISOString(), durationSeconds?: number) => {
    if (endedCallsRef.current.has(callId)) return;
    endedCallsRef.current.add(callId);
    const current = pendingCallRef.current;
    const startedAt = current?.callId === callId ? current.startedAt : new Date().toISOString();
    const duration = durationSeconds ?? Math.max(0, Math.floor((Date.parse(endedAt) - Date.parse(startedAt)) / 1000));
    const record: VideoCallRecord = {
      callId,
      managementId: callId,
      startedAt,
      endedAt,
      durationSeconds: duration,
      rating: null,
      comment: ''
    };
    upsertRecord(record);
    if (current?.callId === callId) {
      current.call.close();
      pendingCallRef.current = null;
      setIncomingCall(null);
    }
    callRef.current = null;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    setLocalStream(null);
    setPassengerStream(null);
    setIsActive(false);
  }, [upsertRecord]);

  useEffect(() => {
    let isMounted = true;
    const connect = async () => {
      try {
        const { default: Peer } = await import('peerjs');
        if (!isMounted) return;
        const peer = new Peer(GESTOR_PEER_ID, {
          host: '0.peerjs.com',
          port: 443,
          path: '/',
          secure: true,
          config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
        });
        peerRef.current = peer;
        peer.on('open', () => {
          if (isMounted) {
            setIsOnline(true);
            setError('');
          }
        });
        peer.on('disconnected', () => {
          if (isMounted) setIsOnline(false);
        });
        peer.on('error', (peerError) => {
          if (isMounted) {
            setIsOnline(false);
            setError(peerError.type === 'unavailable-id' ? copy.peerIdError : peerError.message);
          }
        });
        peer.on('connection', (connection) => {
          connectionRef.current = connection;
          connection.on('data', (payload) => {
            const message = parseVideoCallMessage(payload);
            if (!message) return;
            if (message.type === 'ended') {
              finishCurrentCall(message.callId, message.endedAt, message.durationSeconds);
            } else if (message.type === 'rating') {
              setRecords((current) => {
                const existing = current.find((item) => item.callId === message.callId);
                if (!existing) return current;
                const updated = { ...existing, rating: message.rating, comment: message.comment };
                try {
                  return saveCallRecord(updated);
                } catch {
                  setError(copy.connectionError);
                  return current;
                }
              });
            }
          });
        });
        peer.on('call', (call) => {
          const callId = metadataString(call.metadata, 'callId');
          const startedAt = metadataString(call.metadata, 'startedAt');
          if (!callId || !startedAt || callRef.current) {
            call.close();
            return;
          }
          const pending = { call, callId, startedAt };
          callRef.current = call;
          pendingCallRef.current = pending;
          setIncomingCall(pending);
          notifyIncoming();
          call.on('stream', (stream) => {
            setPassengerStream(stream);
            setIsActive(true);
            setIncomingCall(null);
          });
          call.on('close', () => finishCurrentCall(callId));
          call.on('error', () => {
            setError(copy.connectionError);
            finishCurrentCall(callId);
          });
        });
      } catch {
        if (isMounted) setError(copy.connectionError);
      }
    };
    void connect();
    const loadRecordsTimeout = window.setTimeout(() => {
      try {
        setRecords(readCallLog());
      } catch {
        setError(copy.connectionError);
      }
    }, 0);
    return () => {
      isMounted = false;
      window.clearTimeout(loadRecordsTimeout);
      callRef.current?.close();
      peerRef.current?.destroy();
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      audioContextRef.current?.close();
    };
  }, [copy.connectionError, copy.peerIdError, finishCurrentCall, notifyIncoming]);

  const enableAlerts = async () => {
    try {
      const context = new AudioContext();
      await context.resume();
      audioContextRef.current = context;
      alertEnabledRef.current = true;
      setIsAlertEnabled(true);
      setError('');
    } catch {
      setError(copy.connectionError);
    }
  };

  const acceptCall = async () => {
    const pending = pendingCallRef.current;
    if (!pending) return;
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { facingMode: 'user' }
      });
      localStreamRef.current = stream;
      setLocalStream(stream);
      pending.call.answer(stream);
      setIncomingCall(null);
      setIsActive(true);
      pending.call.on('stream', (passenger) => {
        setPassengerStream(passenger);
      });
    } catch {
      setError(copy.permissionError);
    }
  };

  const endCall = () => {
    const pending = pendingCallRef.current;
    if (!pending) return;
    const endedAt = new Date().toISOString();
    const durationSeconds = Math.max(0, Math.floor((Date.parse(endedAt) - Date.parse(pending.startedAt)) / 1000));
    connectionRef.current?.send({ type: 'ended', callId: pending.callId, endedAt, durationSeconds });
    finishCurrentCall(pending.callId, endedAt, durationSeconds);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-emerald-100 sm:text-4xl">{copy.managerTitle}</h1>
            <p className="mt-2 max-w-2xl text-slate-300">{copy.managerDescription}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <p role="status" className={`rounded-full border px-4 py-2 text-sm font-semibold ${isOnline ? 'border-emerald-300/40 bg-emerald-300/10 text-emerald-100' : 'border-amber-200/40 bg-amber-200/10 text-amber-100'}`}>
              <span className={`mr-2 inline-block h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-300' : 'bg-amber-300 animate-pulse'}`} />
              {isOnline ? copy.managerOnline : copy.managerOffline}
            </p>
            <button type="button" onClick={enableAlerts} disabled={isAlertEnabled} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-sky-200/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/15 disabled:text-emerald-200 focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-300">
              <Check aria-hidden="true" size={17} />{isAlertEnabled ? copy.soundAlert : copy.activateAlerts}
            </button>
          </div>
        </header>
        {error && <p role="alert" className="mt-5 rounded-xl border border-rose-200/30 bg-rose-950/50 p-4 text-sm text-rose-100">{error}</p>}

        <section className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="rounded-3xl border border-emerald-200/25 bg-white/[0.04] p-4 shadow-[0_0_36px_rgba(16,185,129,0.08)] sm:p-6">
            {incomingCall && !isActive && (
              <div role="alert" className="mb-5 flex flex-col gap-4 rounded-2xl border border-amber-200/60 bg-amber-400/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-3 text-lg font-bold text-amber-100"><span className="h-3 w-3 animate-ping rounded-full bg-amber-300" />{copy.incomingCall}</p>
                <button type="button" onClick={acceptCall} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-300 focus-visible:outline focus-visible:outline-4 focus-visible:outline-white">
                  <Phone aria-hidden="true" size={19} />{copy.acceptCall}
                </button>
              </div>
            )}
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/15 bg-black">
              <video ref={passengerVideoRef} autoPlay playsInline className="h-full w-full object-cover" aria-label={copy.remoteVideoLabel} />
              {!passengerStream && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-slate-300"><Video aria-hidden="true" size={36} className="text-emerald-200" /><p>{incomingCall ? copy.incomingCall : copy.waitingForCalls}</p></div>}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-300">{isActive ? copy.connected : copy.waitingForCalls}</p>
              <button type="button" onClick={endCall} disabled={!isActive && !incomingCall} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-rose-200/40 bg-rose-600 px-4 py-2 font-bold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-4 focus-visible:outline-rose-200">
                <PhoneOff aria-hidden="true" size={18} />{copy.finishCall}
              </button>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-sky-200/20 bg-white/[0.04] p-4 sm:p-5">
            <h2 className="mb-3 font-bold text-sky-100">{copy.localVideoLabel}</h2>
            <div className="relative aspect-video overflow-hidden rounded-xl border border-sky-100/20 bg-black">
              <video ref={localVideoRef} autoPlay muted playsInline className="h-full w-full object-cover" aria-label={copy.localVideoLabel} />
              {!localStream && <div className="absolute inset-0 flex items-center justify-center text-slate-400"><Camera aria-hidden="true" size={28} /></div>}
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-slate-300"><Camera aria-hidden="true" size={14} /><Mic aria-hidden="true" size={14} />{copy.localVideoLabel}</p>
          </aside>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
          <h2 className="text-xl font-bold text-emerald-100">{copy.callHistory}</h2>
          {records.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">{copy.noCallHistory}</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                <thead><tr className="border-b border-white/15 text-slate-300">
                  <th className="p-3">{copy.dateLabel}</th><th className="p-3">{copy.managementIdLabel}</th><th className="p-3">{copy.durationLabel}</th><th className="p-3">{copy.ratingLabel}</th><th className="p-3">{copy.commentLabel}</th>
                </tr></thead>
                <tbody>{records.map((record) => (
                  <tr key={record.callId} className="border-b border-white/5 text-slate-100">
                    <td className="p-3"><Clock3 aria-hidden="true" className="mr-2 inline text-sky-200" size={15} />{record.endedAt ? new Intl.DateTimeFormat('es-MX', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(record.endedAt)) : '—'}</td>
                    <td className="p-3 font-mono text-xs">{record.managementId}</td>
                    <td className="p-3">{Math.floor(record.durationSeconds / 60)}:{String(record.durationSeconds % 60).padStart(2, '0')}</td>
                    <td className="p-3">{record.rating ? <span className="inline-flex items-center gap-1"><Star aria-hidden="true" size={15} className="fill-amber-300 text-amber-300" />{record.rating}/5</span> : '—'}</td>
                    <td className="max-w-xs p-3 whitespace-pre-wrap">{record.comment || '—'}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
