import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { aiService } from '../../services/ai.service';
import SymptomAnalysisResults from '../ai/SymptomAnalysisResults';

export default function AIDiagnosisWidget() {
    const [symptoms, setSymptoms] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleAnalyze = async () => {
        if (!symptoms.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await aiService.analyzeSymptoms(symptoms);
            setResult(data);
        } catch {
            setError('AI Engine unreachable. Check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cd-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                <Sparkles size={80} />
            </div>

            <h2 className="text-sm font-bold text-[#0a1a0f] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-500" />
                AI Diagnostic Assistant
            </h2>

            <div className="relative mb-4">
                <textarea
                    rows={3}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Describe symptoms (e.g. fever and cough, chest pain)..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 transition-all placeholder:text-slate-400"
                />
            </div>

            <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading || !symptoms.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm rounded-xl hover:from-indigo-600 hover:to-purple-600 focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-500/20"
            >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {loading ? 'Analyzing...' : 'Analyze Symptoms'}
            </button>

            <AnimatePresence>
                {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 p-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-semibold border border-rose-100 flex gap-2">
                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                        {error}
                    </motion.div>
                )}

                {result && !loading && (
                    <div className="mt-5 pt-4 border-t border-slate-100">
                        <SymptomAnalysisResults result={result} />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
