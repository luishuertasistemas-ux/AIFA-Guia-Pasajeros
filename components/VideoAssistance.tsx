'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { DataConnection, MediaConnection, Peer as PeerInstance } from 'peerjs';
import { Camera, Mic, PhoneOff, Star, X } from 'lucide-react';
import type { VideoCallTranslations } from '@/data/translations';
import {
  createManagementId,
  GESTOR_PEER_ID,
  parseVideoCallMessage,
  PASSENGER_CALL_LOG_KEY,
  saveCallRecord,
  type VideoCallRecord
} from '@/lib/video-calls';

type CallPhase = 'idle' | 'connecting' | 'ringing' | 'active' | 'review';

export default function VideoAssistance({ copy }: { copy: VideoCallTranslations }) {
  const [phase, setPhase] = useState<CallPhase>('idle');
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratingSaved, setRatingSaved] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<PeerInstance | null>(null);
  const callRef = useRef<MediaConnection | null>(null);
  const connectionRef = useRef<DataConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const recordRef = useRef<VideoCallRecord | null>(null);
  const callEndedRef = useRef(false);

  const setLocalVideoRef = useCallback((node: HTMLVideoElement | null) => {
    if (node && localStream) {
      node.srcObject = localStream;
      node.play().catch((err) => console.log('Autoplay local bloqueado:', err));
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  useEffect(() => () => {
    callRef.current?.close();
    connectionRef.current?.close();
    peerRef.current?.destroy();
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const cleanMedia = () => {
    callRef.current?.close();
    callRef.current = null;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    setLocalStream(null);
    setRemoteStream(null);
  };

  const abortPendingCall = () => {
    if (callEndedRef.current || callRef.current) return;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    setLocalStream(null);
    connectionRef.current?.close();
    connectionRef.current = null;
    peerRef.current?.destroy();
    peerRef.current = null;
    setPhase('idle');
    setError(copy.connectionError);
  };

  const finishCall = (endedAt = new Date().toISOString(), durationSeconds?: number) => {
    if (callEndedRef.current) return;
    callEndedRef.current = true;
    const currentRecord = recordRef.current;
    if (!currentRecord) return;

    const duration = durationSeconds ?? Math.max(
      0,
      Math.floor((Date.parse(endedAt) - Date.parse(currentRecord.startedAt)) / 1000)
    );
    recordRef.current = { ...currentRecord, endedAt, durationSeconds: duration };
    try {
      saveCallRecord(recordRef.current, PASSENGER_CALL_LOG_KEY);
    } catch {
      setError(copy.connectionError);
    }
    connectionRef.current?.send({
      type: 'ended',
      callId: currentRecord.callId,
      endedAt,
      durationSeconds: duration
    });
    cleanMedia();
    setPhase('review');
  };

  const startCall = async () => {
    setError('');
    setPhase('connecting');
    setRating(0);
    setComment('');
    setRatingSaved(false);
    callEndedRef.current = false;
    callRef.current = null;
    connectionRef.current = null;
    const startedAt = new Date().toISOString();
    const managementId = createManagementId();
    recordRef.current = {
      callId: managementId,
      managementId,
      startedAt,
      endedAt: '',
      durationSeconds: 0,
      rating: null,
      comment: ''
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { facingMode: 'user' }
      });
      localStreamRef.current = stream;
      setLocalStream(stream);

      const { default: Peer } = await import('peerjs');
      const peer = new Peer(managementId, {
        host: '0.peerjs.com',
        port: 443,
        path: '/',
        secure: true,
        config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
      });
      peerRef.current = peer;
      peer.on('error', (peerError) => {
        setError(peerError.type === 'unavailable-id' ? copy.connectionError : peerError.message);
        abortPendingCall();
      });
      peer.on('open', () => {
        const connection = peer.connect(GESTOR_PEER_ID, {
          reliable: true,
          metadata: { callId: managementId, startedAt }
        });
        connectionRef.current = connection;
        connection.on('open', () => {
          setPhase('ringing');
          connection.send({ type: 'incoming', callId: managementId, startedAt });
          const mediaCall = peer.call(GESTOR_PEER_ID, stream, {
            metadata: { callId: managementId, startedAt }
          });
          callRef.current = mediaCall;
          mediaCall.on('stream', (remote) => {
            setRemoteStream(remote);
            setPhase('active');
          });
          mediaCall.on('close', () => {
            if (!callEndedRef.current) finishCall();
          });
          mediaCall.on('error', () => {
            setError(copy.connectionError);
            if (!callEndedRef.current) finishCall();
          });
        });
        connection.on('data', (payload) => {
          const message = parseVideoCallMessage(payload);
          if (message?.type === 'ended' && message.callId === managementId) {
            finishCall(message.endedAt, message.durationSeconds);
          }
        });
        connection.on('error', abortPendingCall);
      });
    } catch (callError) {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
      peerRef.current?.destroy();
      peerRef.current = null;
      const permissionDenied = callError instanceof DOMException &&
        ['NotAllowedError', 'NotFoundError', 'NotReadableError'].includes(callError.name);
      setPhase('idle');
      setError(permissionDenied ? copy.permissionError : copy.connectionError);
    }
  };

  const submitRating = () => {
    if (rating < 1 || !recordRef.current) {
      setError(copy.ratingRequired);
      return;
    }
    const updatedRecord = { ...recordRef.current, rating, comment };
    try {
      saveCallRecord(updatedRecord, PASSENGER_CALL_LOG_KEY);
    } catch {
      setError(copy.connectionError);
      return;
    }
    recordRef.current = updatedRecord;
    connectionRef.current?.send({
      type: 'rating',
      callId: updatedRecord.callId,
      rating,
      comment
    });
    setError('');
    setRatingSaved(true);
  };

  const closeCall = () => {
    cleanMedia();
    connectionRef.current?.close();
    connectionRef.current = null;
    peerRef.current?.destroy();
    peerRef.current = null;
    recordRef.current = null;
    callEndedRef.current = false;
    setError('');
    setRatingSaved(false);
    setPhase('idle');
  };

  return (
    <>
      {phase === 'idle' && (
        <button
          type="button"
          onClick={startCall}
          className="fixed bottom-20 right-4 z-40 inline-flex min-h-14 items-center gap-3 rounded-2xl border border-emerald-100/50 bg-slate-950/75 px-5 py-3 text-left text-sm font-bold text-white shadow-[0_0_24px_rgba(52,211,153,0.3)] backdrop-blur-xl transition hover:border-emerald-200 hover:bg-emerald-950/80 focus-visible:outline focus-visible:outline-4 focus-visible:outline-emerald-300 sm:bottom-24 sm:right-6 sm:text-base"
        >
          <Camera aria-hidden="true" className="shrink-0 text-emerald-200" size={22} />
          {copy.button}
        </button>
      )}

      {error && phase === 'idle' && (
        <p role="alert" className="fixed bottom-36 right-4 z-40 max-w-sm rounded-xl border border-rose-200/40 bg-slate-950/90 p-4 text-sm text-white shadow-xl sm:bottom-24 sm:right-6">
          {error}
        </p>
      )}

      {phase !== 'idle' && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/90 p-4 backdrop-blur-xl" role="dialog" aria-modal="true" aria-labelledby="video-call-title">
          <section className="relative my-auto w-full max-w-5xl rounded-3xl border border-emerald-100/30 bg-slate-900/95 p-5 text-white shadow-[0_0_50px_rgba(16,185,129,0.18)] sm:p-8">
            <h2 id="video-call-title" className="text-2xl font-extrabold text-emerald-100 sm:text-3xl">{copy.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">{copy.privacy}</p>
            {phase === 'connecting' && <p role="status" className="mt-5 text-lg font-semibold">{copy.requestingPermissions}</p>}
            {phase === 'ringing' && <p role="status" className="mt-5 flex items-center gap-2 text-lg font-semibold text-emerald-100"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-300" />{copy.calling}</p>}
            {phase === 'active' && <p role="status" className="mt-5 text-lg font-semibold text-emerald-100">{copy.connected}</p>}
            {(phase === 'ringing' || phase === 'active') && (
              <>
                {phase === 'ringing' && <p className="mt-1 text-sm text-slate-300">{copy.waiting}</p>}
                <div className="mt-5 flex h-full flex-col gap-2 p-2 md:grid md:grid-cols-[1fr_220px] md:gap-4">
                  <figure className="relative flex-1 w-full overflow-hidden rounded-xl bg-black">
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      aria-label={copy.remoteVideoLabel}
                    />
                    {!remoteStream && <figcaption className="absolute inset-0 flex items-center justify-center text-sm text-slate-300">{copy.remoteVideoLabel}</figcaption>}
                  </figure>
                  <div className="flex flex-1 flex-col gap-2">
                    <figure className="relative flex-1 w-full overflow-hidden rounded-xl bg-black">
                      <video
                        ref={setLocalVideoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        aria-label={copy.localVideoLabel}
                      />
                    </figure>
                    <p className="flex items-center gap-2 text-xs text-slate-300"><Camera aria-hidden="true" size={15} />{copy.localVideoLabel}<Mic aria-hidden="true" size={15} /></p>
                  </div>
                </div>
                {error && <p role="alert" className="mt-4 text-sm text-rose-200">{error}</p>}
                <button type="button" onClick={() => finishCall()} className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl border border-rose-200/40 bg-rose-600 px-5 py-3 font-bold text-white hover:bg-rose-500 focus-visible:outline focus-visible:outline-4 focus-visible:outline-rose-200">
                  <PhoneOff aria-hidden="true" size={19} />{copy.endCall}
                </button>
              </>
            )}
            {phase === 'review' && (
              <div className="mt-6">
                {ratingSaved ? (
                  <>
                    <p role="status" className="text-lg font-semibold text-emerald-100">{copy.thanks}</p>
                    <button type="button" onClick={closeCall} className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-4 focus-visible:outline-emerald-200">
                      <X aria-hidden="true" size={18} />{copy.close}
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold">{copy.ratingTitle}</h3>
                    <p className="mt-2 text-slate-200">{copy.ratingPrompt}</p>
                    <div className="mt-4 flex gap-2" role="group" aria-label={copy.ratingPrompt}>
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button key={stars} type="button" onClick={() => setRating(stars)} aria-label={`${stars} ${copy.ratingLabel}`} aria-pressed={rating === stars} className="rounded-lg p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300">
                          <Star aria-hidden="true" size={34} className={stars <= rating ? 'fill-amber-300 text-amber-300' : 'text-slate-400'} />
                        </button>
                      ))}
                    </div>
                    <label htmlFor="video-call-comment" className="mt-5 block font-semibold">{copy.commentLabel}</label>
                    <textarea id="video-call-comment" rows={3} maxLength={1000} value={comment} onChange={(event) => setComment(event.target.value)} placeholder={copy.commentPlaceholder} className="mt-2 w-full rounded-xl border border-white/20 bg-white/5 p-3 text-white placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/40" />
                    {error && <p role="alert" className="mt-3 text-sm text-rose-200">{error}</p>}
                    <button type="button" onClick={submitRating} className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-xl border border-emerald-200/50 bg-emerald-400 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-300 focus-visible:outline focus-visible:outline-4 focus-visible:outline-white">
                      {copy.submitRating}
                    </button>
                  </>
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
