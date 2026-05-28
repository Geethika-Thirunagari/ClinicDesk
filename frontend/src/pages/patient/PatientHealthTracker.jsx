import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, Heart, Activity, TrendingUp, Sparkles, Smile, Save, CheckCircle2, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { cn } from '../../utils/cn';

const initialHistory = [
  { day: 'Mon', systolic: 120, diastolic: 80, sugar: 95, weight: 74.2 },
  { day: 'Tue', systolic: 122, diastolic: 82, sugar: 98, weight: 74.3 },
  { day: 'Wed', systolic: 118, diastolic: 79, sugar: 90, weight: 74.1 },
  { day: 'Thu', systolic: 125, diastolic: 85, sugar: 104, weight: 74.5 },
  { day: 'Fri', systolic: 121, diastolic: 81, sugar: 96, weight: 74.4 },
  { day: 'Sat', systolic: 119, diastolic: 80, sugar: 92, weight: 74.2 },
  { day: 'Sun', systolic: 120, diastolic: 80, sugar: 95, weight: 74.0 }
];

const moodEmojis = [
  { emoji: "😀", label: "Excellent", color: "bg-emerald-100 border-emerald-300 text-emerald-700 " },
  { emoji: "🙂", label: "Good", color: "bg-blue-100 border-blue-300 text-blue-700 " },
  { emoji: "😐", label: "Neutral", color: "bg-slate-100 border-slate-300 text-slate-700 " },
  { emoji: "🙁", label: "Unwell", color: "bg-amber-100 border-amber-300 text-amber-700 " },
  { emoji: "🤒", label: "Sick", color: "bg-rose-100 border-rose-300 text-rose-700 " }
];

const mockInsights = [
  "Your Blood Pressure has been stable and within the optimal range (<120/80 mmHg) for 5 of the last 7 days. Keep up the low-sodium intake!",
  "Fasting Blood Sugar level is normal. We noticed a slight spike on Thursday (104 mg/dL); try tracking your carbohydrate intake for Wednesday's dinner.",
  "Weight fluctuation is minimal (±0.5kg), indicating steady fluid balances. Standard weight targets remain on course."
];

export default function PatientHealthTracker() {
  const [systolic, setSystolic] = useState("120");
  const [diastolic, setDiastolic] = useState("80");
  const [sugar, setSugar] = useState("95");
  const [weight, setWeight] = useState("74.0");
  const [selectedMood, setSelectedMood] = useState(1); // Default to 'Good'

  const [history, setHistory] = useState(initialHistory);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveVitals = (e) => {
    e.preventDefault();
    if (!systolic || !diastolic || !sugar || !weight) return;

    const newLog = {
      day: new Date().toLocaleDateString([], { weekday: 'short' }),
      systolic: parseFloat(systolic),
      diastolic: parseFloat(diastolic),
      sugar: parseFloat(sugar),
      weight: parseFloat(weight)
    };

    // Update history (simulate pushing or replacing today's entry)
    setHistory(prev => [...prev.slice(1), newLog]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0a1a0f] tracking-tight flex items-center gap-2">
            <HeartPulse className="text-rose-500" size={32} />
            My Personal Health Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Log your daily vitals, monitor physiological trends, and review automated clinical insights.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Vitals logger form */}
        <div className="finai-card p-6 h-fit">
          <h2 className="text-lg font-bold text-[#0a1a0f] flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 ">
            <Activity className="text-rose-500" size={18} />
            Log Vitals Checklist
          </h2>

          <form onSubmit={handleSaveVitals} className="space-y-4">
            {/* BP field group */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Systolic BP (mmHg)</label>
                <input 
                  type="number" 
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500 transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Diastolic BP (mmHg)</label>
                <input 
                  type="number" 
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Sugar & Weight */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Blood Sugar (mg/dL)</label>
                <input 
                  type="number" 
                  value={sugar}
                  onChange={(e) => setSugar(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500 transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Body Weight (kg)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Interactive Mood Tracker */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2.5">How are you feeling today?</label>
              <div className="grid grid-cols-5 gap-2">
                {moodEmojis.map((m, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedMood(idx)}
                    className={cn("p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all", 
                      selectedMood === idx 
                        ? m.color + " ring-2 ring-rose-500/20 scale-105" 
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    )}
                  >
                    <span className="text-xl mb-0.5">{m.emoji}</span>
                    <span className="text-[8px] font-extrabold uppercase tracking-wide opacity-80">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shadow-rose-500/10 mt-3">
              <Save size={14} /> Log Daily Vitals
            </button>
          </form>

          {/* Success Dialog */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-600 ">
                <CheckCircle2 size={16} /> Vitals entry synchronized with Clinical EMR.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Vitals Visual Charts - columns 2 & 3 */}
        <div className="lg:col-span-2 finai-card p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0a1a0f] flex items-center justify-between mb-6">
              <span>My Physiological Vitals Trends</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-full">Last 7 Logs</span>
            </h2>

            {/* charts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* BP Area Chart */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5"><Heart size={14} className="text-rose-500" /> Blood Pressure (mmHg)</span>
                  <span className="text-[10px] font-extrabold text-slate-500 bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-md">Systolic / Diastolic</span>
                </div>
                <div className="h-[180px] w-full font-medium text-xs">
                  <ResponsiveContainer width="99%" height="99%">
                    <AreaChart data={history} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorBP" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.08)" />
                      <XAxis dataKey="day" stroke="#94a3b8" />
                      <YAxis domain={[60, 140]} stroke="#94a3b8" />
                      <Tooltip />
                      <Area type="monotone" dataKey="systolic" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#colorBP)" name="Systolic" />
                      <Area type="monotone" dataKey="diastolic" stroke="#f43f5e" strokeWidth={1.5} fillOpacity={0} name="Diastolic" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Glucose Chart */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5"><Activity size={14} className="text-blue-500" /> Blood Sugar (mg/dL)</span>
                  <span className="text-[10px] font-extrabold text-slate-500 bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-md">Fasting Target: &lt;100</span>
                </div>
                <div className="h-[180px] w-full font-medium text-xs">
                  <ResponsiveContainer width="99%" height="99%">
                    <AreaChart data={history} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSugar" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.08)" />
                      <XAxis dataKey="day" stroke="#94a3b8" />
                      <YAxis domain={[80, 120]} stroke="#94a3b8" />
                      <Tooltip />
                      <Area type="monotone" dataKey="sugar" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSugar)" name="Glucose" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100 ">
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500"><TrendingUp size={20} /></div>
              <div>
                <h4 className="text-xs font-bold text-[#0a1a0f] leading-none">Last Log Weight</h4>
                <p className="text-lg font-extrabold text-[#0a1a0f] mt-1 leading-none">{weight} <span className="text-xs font-medium text-slate-400">kg</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500"><Smile size={20} /></div>
              <div>
                <h4 className="text-xs font-bold text-[#0a1a0f] leading-none">Avg Mood Score</h4>
                <p className="text-lg font-extrabold text-[#0a1a0f] mt-1 leading-none">Excellent <span className="text-xs font-medium text-slate-400">Stable</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: AI Health Recommendations & Insights */}
      <div className="finai-card p-6">
        <h2 className="text-lg font-bold text-[#0a1a0f] flex items-center gap-2 mb-5">
          <Sparkles size={20} className="text-amber-500" />
          Wellness Co-Pilot AI Recommendations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockInsights.map((insight, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              className="p-4 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all" />
              <div className="flex justify-between items-center text-xs font-extrabold text-rose-500 uppercase tracking-wider mb-2.5">
                <span>Insight Indicator #{idx + 1}</span>
                <ChevronRight size={14} />
              </div>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">{insight}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
