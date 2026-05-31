import { useState, useEffect, useRef, useCallback } from 'react';
import { registerSpeechRecognition } from '../utils/stopAllMedia';

const getSpeechRecognition = () => {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

/**
 * Browser speech-to-text (Web Speech API).
 * @param {{
 *   lang?: string,
 *   continuous?: boolean,
 *   silenceMs?: number,
 *   onListeningEnd?: (fullText: string) => void,
 * }} options
 */
export function useSpeechRecognition({
  lang = 'en-US',
  continuous = true,
  silenceMs = 1800,
  onListeningEnd,
} = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const interimRef = useRef('');
  const silenceTimerRef = useRef(null);
  const onListeningEndRef = useRef(onListeningEnd);
  const unregisterRecognitionRef = useRef(null);
  const listeningIntentRef = useRef(false);
  const intentionalStopRef = useRef(false);

  useEffect(() => {
    onListeningEndRef.current = onListeningEnd;
  }, [onListeningEnd]);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    interimRef.current = interim;
  }, [interim]);

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const scheduleSilenceStop = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      try {
        recognitionRef.current?.stop();
      } catch {
        /* ignore */
      }
    }, silenceMs);
  }, [silenceMs]);

  const tryRestartRecognition = useCallback(() => {
    if (!listeningIntentRef.current || intentionalStopRef.current) return;
    const recognition = recognitionRef.current;
    if (!recognition) return;
    window.setTimeout(() => {
      if (!listeningIntentRef.current) return;
      try {
        recognition.start();
        setIsListening(true);
        setError(null);
      } catch {
        try {
          recognition.stop();
          recognition.start();
          setIsListening(true);
        } catch {
          /* will retry on next onend/no-speech */
        }
      }
    }, 350);
  }, []);

  useEffect(() => {
    const SR = getSpeechRecognition();
    if (!SR) {
      setSupported(false);
      return undefined;
    }

    const recognition = new SR();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let finalChunk = '';
      let interimChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalChunk += text;
        else interimChunk += text;
      }
      if (finalChunk) {
        setTranscript((prev) => {
          const next = `${prev} ${finalChunk}`.trim();
          transcriptRef.current = next;
          return next;
        });
        setError(null);
      }
      setInterim(interimChunk);
      interimRef.current = interimChunk;
      if (finalChunk || interimChunk) scheduleSilenceStop();
    };

    recognition.onerror = (e) => {
      clearSilenceTimer();
      if (e.error === 'aborted' || e.error === 'interrupted') return;

      if (e.error === 'not-allowed') {
        setError(
          'Microphone blocked. Allow mic access, or turn off the video call mic conflict by using voice panel only.'
        );
        listeningIntentRef.current = false;
        setIsListening(false);
        return;
      }

      if (e.error === 'no-speech') {
        if (listeningIntentRef.current) {
          tryRestartRecognition();
        }
        return;
      }

      setError(`Speech error: ${e.error}. Retrying…`);
      if (listeningIntentRef.current) tryRestartRecognition();
    };

    recognition.onend = () => {
      clearSilenceTimer();
      setIsListening(false);

      if (intentionalStopRef.current) {
        intentionalStopRef.current = false;
        return;
      }

      if (!listeningIntentRef.current) return;

      const full = `${transcriptRef.current} ${interimRef.current}`.trim();
      setInterim('');
      interimRef.current = '';
      if (full) {
        setTranscript(full);
        transcriptRef.current = full;
      }

      onListeningEndRef.current?.(full);

      if (listeningIntentRef.current && !full) {
        tryRestartRecognition();
      }
    };

    recognitionRef.current = recognition;
    unregisterRecognitionRef.current = registerSpeechRecognition(recognition);

    return () => {
      listeningIntentRef.current = false;
      intentionalStopRef.current = true;
      clearSilenceTimer();
      unregisterRecognitionRef.current?.();
      unregisterRecognitionRef.current = null;
      try {
        recognition.abort();
      } catch {
        /* ignore */
      }
    };
  }, [continuous, lang, scheduleSilenceStop, tryRestartRecognition]);

  const start = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    listeningIntentRef.current = true;
    intentionalStopRef.current = false;
    setError(null);
    setInterim('');
    interimRef.current = '';
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      try {
        recognition.stop();
        recognition.start();
        setIsListening(true);
      } catch {
        setError('Could not start voice recognition. Tap “Listen again” below.');
      }
    }
  }, []);

  const stop = useCallback(() => {
    listeningIntentRef.current = false;
    intentionalStopRef.current = true;
    clearSilenceTimer();
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
    setIsListening(false);
    setInterim('');
    interimRef.current = '';
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    transcriptRef.current = '';
    setInterim('');
    interimRef.current = '';
    setError(null);
  }, []);

  const fullText = `${transcript} ${interim}`.trim();

  return {
    supported,
    isListening,
    transcript,
    interim,
    fullText,
    error,
    start,
    stop,
    reset,
    setTranscript,
  };
}
