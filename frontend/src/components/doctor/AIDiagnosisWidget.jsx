import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { cn } from '../../utils/cn';
import { aiService } from '../../services/ai.service';

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
        } catch (err) {
            setError('AI Engine unreachable. Check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="finai-card p-6 relative overflow-hidden group">
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
                    placeholder="Enter patient symptoms here (e.g., 'fever and cough' or 'chest pain')..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 transition-all placeholder:text-slate-400"
                />
            </div>

            <button
                onClick={handleAnalyze}
                disabled={loading || !symptoms.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm rounded-xl hover:from-indigo-600 hover:to-purple-600 focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-500/20"
            >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {loading ? 'Analyzing Neural Pathways...' : 'Analyze Symptoms'}
            </button>

            <AnimatePresence>
                {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 p-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-semibold border border-rose-100 flex gap-2">
                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                        {error}
                    </motion.div>
                )}

                {result && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-4">
                        <div className={cn(
                            "px-3 py-2 rounded-lg border flex items-center justify-between",
                            result.severity === 'CRITICAL' ? "bg-rose-50 border-rose-200 text-rose-700 " :
                                result.severity === 'HIGH' ? "bg-amber-50 border-amber-200 text-amber-700 " :
                                    "bg-emerald-50 border-emerald-200 text-emerald-700 "
                        )}>
                            <div className="flex items-center gap-2">
                                {result.severity === 'CRITICAL' ? <AlertTriangle size={16} /> : <ShieldCheck size={16} />}
                                <span className="text-xs font-bold uppercase">Severity: {result.severity}</span>
                            </div>
                            <span className="text-xs font-extrabold">{result.confidence} Confidence</span>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Predictions</h4>
                            {result.predictions.map((pred, i) => (
                                <div key={i} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100 ">
                                    <span className="text-sm font-semibold text-slate-700 ">{pred.condition}</span>
                                    <span className="text-xs font-mono font-bold text-indigo-600 ">{pred.probability}%</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Info size={14} /> Recommended Actions</h4>
                            <ul className="text-sm space-y-1 text-slate-600 font-medium">
                                {result.recommendations.map((rec, i) => (
                                    <li key={i} className="flex gap-2 items-start"><span className="text-indigo-500">•</span> {rec}</li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
