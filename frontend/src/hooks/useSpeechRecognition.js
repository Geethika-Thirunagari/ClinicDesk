import { useState, useEffect, useRef, useCallback } from 'react';
import { registerSpeechRecognition } from '../utils/stopAllMedia';

const getSpeechRecognition = () => {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

const SILENCE_MS = 2000;

/**
 * Browser speech-to-text (Web Speech API).
 * @param {{ lang?: string, continuous?: boolean, onListeningEnd?: (fullText: string) => void }} options
 */
export function useSpeechRecognition({
  lang = 'en-US',
  continuous = true,
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
    }, SILENCE_MS);
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
      }
      setInterim(interimChunk);
      interimRef.current = interimChunk;
      if (finalChunk || interimChunk) scheduleSilenceStop();
    };

    recognition.onerror = (e) => {
      clearSilenceTimer();
      const msg =
        e.error === 'not-allowed'
          ? 'Microphone permission denied. Allow mic access to use voice.'
          : e.error === 'no-speech'
            ? 'No speech detected. Speak now — listening will continue.'
            : `Speech error: ${e.error}`;
      if (e.error !== 'no-speech') setError(msg);
      if (e.error === 'not-allowed') setIsListening(false);
    };

    recognition.onend = () => {
      clearSilenceTimer();
      setIsListening(false);
      const full = `${transcriptRef.current} ${interimRef.current}`.trim();
      setInterim('');
      interimRef.current = '';
      if (full) {
        setTranscript(full);
        transcriptRef.current = full;
      }
      onListeningEndRef.current?.(full);
    };

    recognitionRef.current = recognition;
    unregisterRecognitionRef.current = registerSpeechRecognition(recognition);

    return () => {
      clearSilenceTimer();
      unregisterRecognitionRef.current?.();
      unregisterRecognitionRef.current = null;
      try {
        recognition.abort();
      } catch {
        /* ignore */
      }
    };
  }, [continuous, lang, scheduleSilenceStop]);

  const start = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
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
        setError('Could not start voice recognition. Try again.');
      }
    }
  }, []);

  const stop = useCallback(() => {
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
