import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, VideoOff, Mic, Camera, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useMediaStream } from '../../hooks/useMediaStream';

const REMOTE_IMAGES = {
  doctor: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&auto=format&fit=crop&q=80',
  patient: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&auto=format&fit=crop&q=80',
};

function LocalVideo({ stream, mirror, className, videoEnabled }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (stream && videoEnabled) {
      el.srcObject = stream;
      el.play().catch(() => {});
    } else {
      el.srcObject = null;
    }
  }, [stream, videoEnabled]);

  if (!stream || !videoEnabled) return null;

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className={cn('absolute inset-0 w-full h-full object-cover', mirror && '-scale-x-100', className)}
    />
  );
}

/**
 * @param {'doctor'|'patient'} role — who is using this device
 */
const TeleconsultVideoRoom = ({
  role = 'doctor',
  isVideoOn = true,
  isMicOn = true,
  remoteName = 'Alice Johnson',
  remoteId = 'PT-1024',
  enabled = true,
}) => {
  const { stream, error, status, start } = useMediaStream({ enabled, video: true, audio: true });

  useEffect(() => {
    stream?.getVideoTracks().forEach((t) => { t.enabled = isVideoOn; });
    stream?.getAudioTracks().forEach((t) => { t.enabled = isMicOn; });
  }, [stream, isVideoOn, isMicOn]);

  const remoteRole = role === 'doctor' ? 'patient' : 'doctor';
  const remoteImage = REMOTE_IMAGES[remoteRole];
  const remoteTitle = role === 'doctor' ? remoteName : remoteName;
  const remoteSubtitle =
    role === 'doctor' ? `Patient · ${remoteId}` : 'Your doctor · Live';

  return (
    <div className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden min-h-[320px]">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 via-slate-900 to-indigo-900/30" />

      {/* Remote participant (simulated HD feed) */}
      <div className="absolute inset-0">
        <img
          src={remoteImage}
          alt={remoteTitle}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.12)_50%)] bg-[size:100%_3px] pointer-events-none opacity-30" />
      </div>

      <div className="absolute top-4 right-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md z-10">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        HD · Connected
      </div>

      <p className="absolute bottom-4 left-4 text-white/90 bg-slate-950/70 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md border border-white/10 flex items-center gap-1.5 z-10">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        {remoteTitle} — {remoteSubtitle}
      </p>

      {/* Local webcam — picture in picture */}
      <div className="absolute bottom-24 right-4 w-48 h-36 sm:w-52 sm:h-40 bg-[#0a1a0f] rounded-2xl border-2 border-white/20 shadow-2xl overflow-hidden z-20 ring-2 ring-emerald-500/30">
        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10">
            <Camera className="text-emerald-400 animate-pulse mb-2" size={28} />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Starting camera…</p>
          </div>
        )}

        {status === 'denied' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 p-3 text-center z-10">
            <AlertCircle className="text-amber-400 mb-1" size={22} />
            <p className="text-[9px] text-slate-300 leading-snug mb-2">{error}</p>
            <button
              type="button"
              onClick={start}
              className="text-[9px] font-bold uppercase bg-emerald-600 text-white px-2 py-1 rounded-lg"
            >
              Allow camera
            </button>
          </div>
        )}

        {isVideoOn && status === 'active' ? (
          <>
            <LocalVideo stream={stream} mirror videoEnabled />
            {isMicOn && (
              <div className="absolute top-2 right-2 flex gap-0.5 items-end h-4 z-10">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 10 + Math.random() * 8, 4] }}
                    transition={{ duration: 0.6 + i * 0.1, repeat: Infinity }}
                    className="w-0.5 bg-emerald-400 rounded-full"
                  />
                ))}
              </div>
            )}
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded text-[9px] text-emerald-300 font-bold z-10">
              <Mic size={10} /> {isMicOn ? 'Live' : 'Muted'}
            </div>
          </>
        ) : status === 'active' ? (
          <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center">
            <VideoOff size={28} className="text-rose-400 mb-1" />
            <p className="text-[9px] text-rose-300 font-bold uppercase">Camera off</p>
          </div>
        ) : null}

        <p className="absolute bottom-1.5 left-2 text-white text-[10px] font-bold bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm z-10 flex items-center gap-1">
          <User size={10} /> You
        </p>
      </div>

      {status === 'active' && isVideoOn && (
        <p className="absolute bottom-24 left-4 text-[10px] text-emerald-300/90 font-semibold bg-black/40 px-2 py-1 rounded-lg z-10 hidden sm:block">
          Your camera is visible to {role === 'patient' ? 'your doctor' : 'the patient'}
        </p>
      )}
    </div>
  );
};

export default TeleconsultVideoRoom;
