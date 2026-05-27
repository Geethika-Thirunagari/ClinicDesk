import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareHeart, Star, Smile, Send, Sparkles, Award, ClipboardList, CheckCircle2, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { cn } from '../../utils/cn';

const ratingDistribution = [
  { rating: "5 Star", count: 85, color: "#10b981" },
  { rating: "4 Star", count: 42, color: "#3b82f6" },
  { rating: "3 Star", count: 12, color: "#f59e0b" },
  { rating: "2 Star", count: 4, color: "#a855f7" },
  { rating: "1 Star", count: 2, color: "#ef4444" }
];

const sentimentBreakdown = [
  { name: "Promoters (9-10)", value: 72, color: "#10b981" },
  { name: "Passives (7-8)", value: 20, color: "#3b82f6" },
  { name: "Detractors (0-6)", value: 8, color: "#ef4444" }
];

const mockRecentComments = [
  { patient: "Alice J.", rating: 5, date: "Today", text: "Reception check-in was incredibly fast, and the staff was extremely friendly!" },
  { patient: "David L.", rating: 4, date: "Yesterday", text: "Very smooth check-in. The wait was slightly longer than estimated, but otherwise great service." },
  { patient: "Emma B.", rating: 5, date: "2 days ago", text: "Amazing receptionist staff. Made me feel very comfortable before my clinical appointment." }
];

const recentVisitsToSurvey = [
  { id: "PT-1024", name: "Alice Johnson", visited: "Dr. Smith", status: "Not Sent" },
  { id: "PT-2910", name: "Robert Williams", visited: "Dr. Smith", status: "Not Sent" },
  { id: "PT-8821", name: "Maria Garcia", visited: "Dr. Chen", status: "Sent" }
];

export default function ReceptionFeedback() {
  const [comments, setComments] = useState(mockRecentComments);
  const [surveyList, setSurveyList] = useState(recentVisitsToSurvey);
  const [successMsg, setSuccessMsg] = useState("");
  
  // Custom feedback generator
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [surveyType, setSurveyType] = useState("Standard Post-Consultation");

  const handleSendSurvey = (patientId, patientName) => {
    setSurveyList(prev => prev.map(s => s.id === patientId ? { ...s, status: "Sent" } : s));
    setSuccessMsg(`Survey dispatch request sent to ${patientName} via email/SMS.`);
    
    setTimeout(() => {
      setSuccessMsg("");
    }, 2800);
  };

  const handleCreateMockFeedback = (e) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    const patientObj = surveyList.find(p => p.id === selectedPatientId);
    if (!patientObj) return;

    // Dispatch survey
    handleSendSurvey(patientObj.id, patientObj.name);
    
    // Simulate auto receiving a rating in the comments log 1 second later
    setTimeout(() => {
      const newComment = {
        patient: patientObj.name,
        rating: 5,
        date: "Just now",
        text: `Submitted feedback for visit with ${patientObj.visited}. Extremely satisfied with clinic service!`
      };
      setComments(prev => [newComment, ...prev]);
    }, 1200);

    setSelectedPatientId("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <MessageSquareHeart className="text-blue-500" size={32} />
            Client Experience & Feedback Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Aggregate patient satisfaction scores, send clinical surveys, and monitor service Net Promoter Scores.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Overall Practice CSAT", value: "4.74 / 5.0", sub: "96.4% Positive Sentiment", color: "text-emerald-500", icon: Award },
          { label: "Net Promoter Score (NPS)", value: "+64", sub: "Classified as Excellent Score", color: "text-blue-500", icon: Smile },
          { label: "Pending Survey Invites", value: "2 Clients", sub: "From recent check-outs", color: "text-indigo-500", icon: ClipboardList }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-5 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2 leading-none">{stat.value}</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2.5">{stat.sub}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-400"><stat.icon size={20} className={stat.color} /></div>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Breakdown Bar Chart */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Clinic Rating Distribution</h2>
          <div className="h-[220px] w-full font-medium text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingDistribution} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148, 163, 184, 0.08)" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="rating" type="category" stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                  {ratingDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment breakdown Donut */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">NPS Sentiment Classification</h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="h-[140px] w-[140px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sentimentBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={55} paddingAngle={4} dataKey="value">
                    {sentimentBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2.5 flex-1 w-full text-xs font-semibold text-slate-600 dark:text-slate-300">
              {sentimentBreakdown.map((s, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span>{s.name}</span>
                  </div>
                  <span className="font-mono">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Dispatch Surveys & Reviews timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* dispatch wizard panel */}
        <div className="lg:col-span-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Send size={16} className="text-blue-500" />
            Dispatch Clinic Survey
          </h2>
          
          <form onSubmit={handleCreateMockFeedback} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Select Recent Visitor</label>
              <select 
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Client --</option>
                {surveyList.filter(s => s.status === "Not Sent").map((p, idx) => (
                  <option key={idx} value={p.id}>{p.name} ({p.visited})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Survey Template</label>
              <select 
                value={surveyType}
                onChange={(e) => setSurveyType(e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
              >
                <option>Standard Post-Consultation</option>
                <option>Teleconsultation Review</option>
                <option>Wait Time assessment</option>
              </select>
            </div>

            <button type="submit" disabled={!selectedPatientId} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer">
              <Send size={14} /> Send Survey Request
            </button>
          </form>

          {/* Alert Success */}
          <AnimatePresence>
            {successMsg && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center gap-2 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                <CheckCircle2 size={14} className="shrink-0" /> {successMsg}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Survey List & Patient Voices feed */}
        <div className="lg:col-span-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2">
            <ClipboardList size={16} className="text-indigo-500" />
            Live Client Feedback Logs
          </h2>

          <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
            {comments.map((c, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-700 rounded-xl relative overflow-hidden group hover:shadow-sm transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 text-xs font-bold font-sans">{c.patient.charAt(0)}</div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800 dark:text-white">{c.patient}</h4>
                      <span className="text-[9px] font-semibold text-slate-400 font-mono">{c.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(c.rating)].map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{c.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
