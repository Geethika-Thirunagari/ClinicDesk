import { useState, useEffect, useCallback, useRef } from 'react';
import { registerMediaStream } from '../utils/stopAllMedia';

/**
 * Manages local camera + microphone via getUserMedia.
 */
export function useMediaStream({ enabled = true, video = true, audio = true } = {}) {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | active | denied
  const streamRef = useRef(null);
  const unregisterStreamRef = useRef(null);

  const stopTracks = useCallback(() => {
    unregisterStreamRef.current?.();
    unregisterStreamRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStream(null);
    setStatus('idle');
  }, []);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera is not supported in this browser.');
      setStatus('denied');
      return null;
    }

    setStatus('loading');
    setError(null);

    try {
      stopTracks();
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: video ? { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } : false,
        audio: audio ? { echoCancellation: true, noiseSuppression: true } : false,
      });
      streamRef.current = mediaStream;
      unregisterStreamRef.current = registerMediaStream(mediaStream);
      setStream(mediaStream);
      setStatus('active');
      return mediaStream;
    } catch (err) {
      const message =
        err.name === 'NotAllowedError'
          ? 'Please allow camera and microphone access to join the video call.'
          : err.message || 'Could not access camera.';
      setError(message);
      setStatus('denied');
      return null;
    }
  }, [audio, video, stopTracks]);

  useEffect(() => {
    if (!enabled) {
      stopTracks();
      return undefined;
    }
    start();
    return () => stopTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only restart when enabled toggles
  }, [enabled]);

  return { stream, error, status, start, stop: stopTracks };
}
