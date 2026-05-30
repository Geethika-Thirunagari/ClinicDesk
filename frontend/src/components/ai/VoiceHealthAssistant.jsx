import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Loader2, Volume2, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { aiService } from '../../services/ai.service';
import { speakText, stopSpeaking } from '../../utils/speech';
import SymptomAnalysisResults from './SymptomAnalysisResults';

/**
 * Auto-start listening → user speaks → auto AI solution when they pause.
 */
const VoiceHealthAssistant = ({
  compact = false,
  onAnalyzed,
  autoSpeakSolution = true,
  autoStart = true,
  autoAnalyze = true,
  title = 'Tell us your problem',
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [analyzeError, setAnalyzeError] = useState(null);
  const [status, setStatus] = useState('initializing');
  const hasStartedRef = useRef(false);
  const analyzingRef = useRef(false);
  const runAnalysisRef = useRef(null);
  const timeoutIdsRef = useRef([]);

  const runAnalysis = useCallback(
    async (text) => {
      const symptoms = text.trim();
      if (!symptoms || analyzingRef.current) return;

      analyzingRef.current = true;
      setLoading(true);
      setAnalyzeError(null);
      setResult(null);
      setStatus('analyzing');
      stopSpeaking();

      try {
        const data = await aiService.analyzeSymptoms(symptoms);
        setResult(data);
        setStatus('done');
        onAnalyzed?.(symptoms, data);

        if (autoSpeakSolution && data.recommendations?.length) {
          const spoken = `Analysis complete. Severity is ${data.severity}. ${data.recommendations.join('. ')}`;
          speakText(spoken, {
            onEnd: () => {
              if (autoStart) {
                setStatus('listening');
                const id = setTimeout(() => start(), 800);
                timeoutIdsRef.current.push(id);
              }
            },
          });
        } else if (autoStart) {
          const id = setTimeout(() => {
            setStatus('listening');
            start();
          }, 1500);
          timeoutIdsRef.current.push(id);
        }
      } catch {
        setAnalyzeError('Could not reach the AI service. Is the backend running?');
        setStatus('error');
        if (autoStart) {
          const id = setTimeout(() => start(), 2000);
          timeoutIdsRef.current.push(id);
        }
      } finally {
        setLoading(false);
        analyzingRef.current = false;
      }
    },
    [autoSpeakSolution, autoStart, onAnalyzed]
  );

  runAnalysisRef.current = runAnalysis;

  const handleListeningEnd = useCallback(
    (fullText) => {
      if (!autoAnalyze || !fullText.trim()) {
        if (autoStart && !analyzingRef.current) {
          const id = setTimeout(() => start(), 600);
          timeoutIdsRef.current.push(id);
        }
        return;
      }
      runAnalysisRef.current?.(fullText);
    },
    [autoAnalyze, autoStart]
  );

  const {
    supported,
    isListening,
    transcript,
    interim,
    fullText,
    error: speechError,
    start,
    stop,
    setTranscript,
  } = useSpeechRecognition({
    continuous: true,
    onListeningEnd: handleListeningEnd,
  });

  const displayText = fullText || transcript;

  useEffect(() => {
    if (!supported || !autoStart || hasStartedRef.current) return;
    hasStartedRef.current = true;
    setStatus('listening');
    const t = setTimeout(() => start(), 600);
    timeoutIdsRef.current.push(t);
    return () => clearTimeout(t);
  }, [supported, autoStart, start]);

  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach(clearTimeout);
      timeoutIdsRef.current = [];
      stop();
      stopSpeaking();
      analyzingRef.current = false;
    };
  }, [stop]);

  useEffect(() => {
    if (isListening && status !== 'analyzing') setStatus('listening');
  }, [isListening, status]);

  if (!supported) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800 flex gap-2">
        <AlertCircle size={18} className="shrink-0" />
        Voice input needs Chrome or Edge with microphone permission.
      </div>
    );
  }

  const statusLabel = {
    initializing: 'Starting microphone…',
    listening: 'Listening — speak your problem now',
    analyzing: 'Getting your solution…',
    done: 'Solution ready',
    error: 'Something went wrong — listening again…',
  }[status] || '';

  return (
    <div
      className={cn(
        'rounded-[20px] border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white',
        compact ? 'p-4' : 'p-5'
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className={cn('font-bold text-[#0a1a0f] flex items-center gap-2', compact ? 'text-sm' : 'text-base')}>
            {loading ? (
              <Loader2 size={18} className="text-indigo-600 animate-spin" />
            ) : isListening ? (
              <Mic size={18} className="text-rose-500 animate-pulse" />
            ) : (
              <Sparkles size={18} className="text-emerald-600" />
            )}
            {title}
          </h3>
          <p className="text-xs text-indigo-600 font-semibold mt-1">{statusLabel}</p>
        </div>
      </div>

      <p className="text-xs text-slate-500 mb-3">
        Speak naturally, then pause for a moment — your solution appears automatically. Demo only, not medical advice.
      </p>

      {(speechError || analyzeError) && (
        <p className="text-xs text-rose-600 font-semibold mb-2 flex items-center gap-1">
          <AlertCircle size={14} />
          {speechError || analyzeError}
        </p>
      )}

      <div className="mb-3">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
          What we heard
        </label>
        <div
          className={cn(
            'w-full border rounded-xl p-3 text-sm min-h-[4rem]',
            isListening ? 'border-indigo-300 bg-indigo-50/50' : 'border-slate-200 bg-white',
            loading && 'opacity-70'
          )}
        >
          {displayText || (
            <span className="text-slate-400 italic">
              {isListening ? 'Waiting for you to speak…' : 'Your words will appear here'}
            </span>
          )}
          {isListening && interim && (
            <p className="text-indigo-500 mt-1 italic">{interim}</p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-indigo-700 font-semibold py-2"
          >
            <Loader2 size={16} className="animate-spin" />
            Analyzing your symptoms…
          </motion.div>
        )}

        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-3 border-t border-indigo-100"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Your solution</span>
              {autoSpeakSolution && (
                <button
                  type="button"
                  onClick={() =>
                    speakText(
                      `Severity ${result.severity}. ${result.recommendations?.join('. ') || ''}`
                    )
                  }
                  className="text-[10px] font-bold text-indigo-600 flex items-center gap-1"
                >
                  <Volume2 size={12} /> Hear again
                </button>
              )}
            </div>
            <SymptomAnalysisResults result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceHealthAssistant;
