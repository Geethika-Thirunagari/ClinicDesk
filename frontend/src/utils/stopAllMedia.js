import { stopSpeaking } from './speech';

/** @type {Set<MediaStream>} */
const activeStreams = new Set();

/** @type {Set<SpeechRecognition>} */
const activeRecognitions = new Set();

/**
 * Track a camera/mic stream so it can be stopped on logout.
 * @returns {() => void} unregister
 */
export function registerMediaStream(stream) {
  if (!stream) return () => {};
  activeStreams.add(stream);
  return () => activeStreams.delete(stream);
}

/**
 * Track speech recognition so it can be aborted on logout.
 * @returns {() => void} unregister
 */
export function registerSpeechRecognition(recognition) {
  if (!recognition) return () => {};
  activeRecognitions.add(recognition);
  return () => activeRecognitions.delete(recognition);
}

/**
 * Stop microphone, camera, voice listening, and text-to-speech (call on logout).
 */
export function stopAllSessionMedia() {
  stopSpeaking();

  activeRecognitions.forEach((recognition) => {
    try {
      recognition.abort();
    } catch {
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
    }
  });
  activeRecognitions.clear();

  activeStreams.forEach((stream) => {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  });
  activeStreams.clear();
}
