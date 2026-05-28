import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, AlertTriangle, AlertCircle, RefreshCw, FileText, CheckCircle2, ChevronRight, Search } from 'lucide-react';
import { cn } from '../../utils/cn';

const initialSuggestions = [
  { text: "Female, 45, chronic fatigue and high TSH levels", category: "Endocrine" },
  { text: "Male, 62, chest pressure radiating to left arm", category: "Cardiology" },
  { text: "Child, 8, sudden onset high fever with macular rash", category: "Pediatric" }
];

const mockDifferential = {
  "Male, 62, chest pressure radiating to left arm": [
    { diagnosis: "Acute Myocardial Infarction", probability: 85, critical: true, notes: "Requires immediate ECG, cardiac enzymes (Troponin), and urgent cardiology consult." },
    { diagnosis: "Unstable Angina", probability: 65, critical: true, notes: "Ischemic origin highly likely. Admit for observation and continuous cardiac telemetry." },
    { diagnosis: "Acute Pericarditis", probability: 40, critical: false, notes: "Check for positional chest pain variations and friction rub. PR segment depression on ECG." },
    { diagnosis: "Gastroesophageal Reflux Disease (GERD)", probability: 15, critical: false, notes: "Diagnosis of exclusion in this context. Rule out life-threatening cardiac events first." }
  ],
  "Female, 45, chronic fatigue and high TSH levels": [
    { diagnosis: "Primary Hypothyroidism (Hashimoto's)", probability: 90, critical: false, notes: "Order Anti-TPO antibodies. Initiate low-dose Levothyroxine (e.g., 25-50 mcg) and repeat TSH in 6-8 weeks." },
    { diagnosis: "Subacute Thyroiditis", probability: 35, critical: false, notes: "Often self-limiting. Check ESR/CRP. Monitor for transient hyperthyroid phase before resolution." },
    { diagnosis: "Pituitary Adenoma (Secondary)", probability: 5, critical: true, notes: "Extremely low probability given high TSH, but maintain clinical vigilance if neurological symptoms arise." }
  ],
  "Child, 8, sudden onset high fever with macular rash": [
    { diagnosis: "Scarlet Fever (Streptococcal)", probability: 80, critical: false, notes: "Perform rapid Strep test. Administer standard course of Penicillin V or Amoxicillin." },
    { diagnosis: "Measles (Rubeola)", probability: 45, critical: true, notes: "Check immunization history. Look for Koplik spots. Isolate patient immediately and report to local health authority." },
    { diagnosis: "Roseola Infantum", probability: 30, critical: false, notes: "Typically affects younger children, but possible. Reassure parents, provide supportive antipyretic care." }
  ]
};

const drugDatabase = [
  { name: "Sildenafil", category: "Vasodilator" },
  { name: "Nitroglycerin", category: "Nitrate" },
  { name: "Warfarin", category: "Anticoagulant" },
  { name: "Aspirin", category: "NSAID" },
  { name: "Levothyroxine", category: "Hormone" },
  { name: "Calcium Carbonate", category: "Supplement" },
  { name: "Simvastatin", category: "Statin" },
  { name: "Amlodipine", category: "Calcium Channel Blocker" }
];

export default function DoctorAIAssistant() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello Dr. Smith! I'm your AI Clinical Workspace Companion. Input patient symptoms, vital anomalies, or lab results below to get differential diagnosis suggestions and clinical summaries.", time: "System Active" }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [differential, setDifferential] = useState([]);
  
  // Drug interaction states
  const [drugA, setDrugA] = useState("");
  const [drugB, setDrugB] = useState("");
  const [interactionResult, setInteractionResult] = useState(null);

  // Clinical Summary generator states
  const [rawNotes, setRawNotes] = useState("");
  const [generatedSummary, setGeneratedSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = { role: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsGenerating(true);

    setTimeout(() => {
      // Look up matches in mock database
      let matchKey = Object.keys(mockDifferential).find(key => 
        text.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().split(', ').some(word => text.toLowerCase().includes(word))
      );

      let responseText = "";
      let foundDiff = [];

      if (matchKey) {
        foundDiff = mockDifferential[matchKey];
        responseText = `Based on the parameters clinical evaluation indicates ${foundDiff[0].diagnosis} (approx ${foundDiff[0].probability}% confidence) as the primary suspect. I have loaded the full differential diagnosis list in the workspace panel to the right.`;
      } else {
        foundDiff = [
          { diagnosis: "Generalized Viral Syndrome", probability: 60, critical: false, notes: "Provide supportive care, rest, hydration. Review if symptoms worsen." },
          { diagnosis: "Atypical Presentation (Monitor)", probability: 40, critical: false, notes: "Follow up in 48-72 hours. Order baseline CBC, BMP if persistent." }
        ];
        responseText = "I've analyzed the symptoms. Given the general description, a standard symptomatic analysis has been mapped to the workspace side panel. Please specify age, gender, and key vitals for higher fidelity recommendations.";
      }

      setDifferential(foundDiff);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsGenerating(false);
    }, 1200);
  };

  const handleCheckInteraction = () => {
    if (!drugA || !drugB) return;
    
    const dA = drugA.toLowerCase();
    const dB = drugB.toLowerCase();
    
    // Sildenafil + Nitroglycerin = Severe danger
    if ((dA.includes("sildenafil") && dB.includes("nitro")) || (dA.includes("nitro") && dB.includes("sildenafil"))) {
      setInteractionResult({
        severity: "severe",
        title: "Contraindicated — Severe Hypotensive Risk",
        desc: "Co-administration of nitrates and PDE5 inhibitors can lead to life-threatening hypotension and cardiovascular collapse. Absolutely do not prescribe together."
      });
    } 
    // Warfarin + Aspirin = Moderate warning
    else if ((dA.includes("warfarin") && dB.includes("aspirin")) || (dA.includes("aspirin") && dB.includes("warfarin"))) {
      setInteractionResult({
        severity: "moderate",
        title: "Increased Bleeding Hazard",
        desc: "Concomitant use increases risk of gastrointestinal and systemic bleeding. If both are necessary, monitor INR closely and consider proton-pump inhibitor gastroprotection."
      });
    }
    // Levothyroxine + Calcium Carbonate = Mild absorption alert
    else if ((dA.includes("levo") && dB.includes("calcium")) || (dA.includes("calcium") && dB.includes("levo"))) {
      setInteractionResult({
        severity: "mild",
        title: "Reduced Therapeutic Absorption",
        desc: "Calcium carbonate can bind to Levothyroxine in the gut, reducing absorption efficacy. Instruct patient to separate administration times by at least 4 hours."
      });
    }
    else {
      setInteractionResult({
        severity: "none",
        title: "No Major Interactions Found",
        desc: "No high-severity interactions registered in current reference database. Ensure patient is queried on all OTC supplements."
      });
    }
  };

  const handleSummarize = () => {
    if (!rawNotes.trim()) return;
    setIsSummarizing(true);
    setTimeout(() => {
      setGeneratedSummary(
        `## CLINICAL VISIT SUMMARY\n\n` +
        `**CHIEF COMPLAINT:**\n${rawNotes}\n\n` +
        `**ASSESSMENT & PLAN:**\n` +
        `1. Standard patient monitoring protocols initiated.\n` +
        `2. Schedule laboratory diagnostics panel as indicated by symptomatic history.\n` +
        `3. Follow-up consultation scheduled in 7 business days or PRN if symptoms escalate.\n\n` +
        `*Drafted automatically via AI clinical assistant. Review before saving to EMR.*`
      );
      setIsSummarizing(false);
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0a1a0f] tracking-tight flex items-center gap-2">
            <Bot className="text-blue-500" size={32} />
            AI Clinical Workspace Assistant
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time diagnostic support, drug interaction checks, and EMR note summarization tools.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Diagnostic Helper Chat - Columns 1 & 2 */}
        <div className="lg:col-span-2 flex flex-col finai-card p-6 min-h-[600px] justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0a1a0f] flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <Sparkles size={18} className="text-blue-500" />
              Symptom Analyzer & Assistant
            </h2>

            {/* Suggestions prompt */}
            {messages.length === 1 && (
              <div className="mb-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100/30">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Try quick-testing clinical profiles:</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                  {initialSuggestions.map((s, idx) => (
                    <button key={idx} onClick={() => handleSend(s.text)} className="p-3 text-left bg-white hover:bg-blue-50 :bg-slate-800 border border-slate-200 rounded-lg text-xs font-medium transition-all text-slate-700 ">
                      <span className="block font-bold text-blue-600 mb-0.5">{s.category}</span>
                      {s.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex flex-col max-w-[85%] rounded-[24px] p-4 text-sm font-medium", 
                  m.role === 'user' 
                    ? "bg-blue-600 text-white ml-auto rounded-tr-none shadow-md shadow-blue-500/10" 
                    : "bg-slate-100 text-[#0a1a0f] mr-auto rounded-tl-none"
                )}>
                  <p className="leading-relaxed">{m.text}</p>
                  <span className={cn("text-[9px] mt-1.5 text-right font-semibold block opacity-75", m.role === 'user' ? "text-blue-100" : "text-slate-500")}>{m.time}</span>
                </div>
              ))}
              
              {isGenerating && (
                <div className="bg-slate-100 text-slate-500 mr-auto rounded-[24px] rounded-tl-none p-4 max-w-[85%] flex items-center gap-2">
                  <RefreshCw className="animate-spin text-blue-500" size={16} />
                  <span className="text-xs font-semibold">Running diagnostic logic models...</span>
                </div>
              )}
            </div>
          </div>

          {/* Chat Input */}
          <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100 ">
            <input 
              type="text" 
              placeholder="Describe symptoms, vital anomalies (e.g. child 8 sudden high fever rash)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all "
            />
            <button onClick={() => handleSend()} className="px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-all shadow-md shadow-blue-500/10">
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Diagnostic Workspace sidepanel - Column 3 */}
        <div className="space-y-6">
          {/* Differential Diagnosis Workspace */}
          <div className="finai-card p-6">
            <h2 className="text-sm font-bold text-[#0a1a0f] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              Differential Workspace
            </h2>
            {differential.length > 0 ? (
              <div className="space-y-3.5">
                {differential.map((d, idx) => (
                  <div key={idx} className={cn("p-4 rounded-xl border transition-all text-xs font-semibold", 
                    d.critical 
                      ? "bg-rose-50/50 border-rose-200 " 
                      : "bg-slate-50 border-slate-100 "
                  )}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-extrabold text-[#0a1a0f] leading-tight pr-2">{d.diagnosis}</h4>
                      <span className={cn("text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase shrink-0", 
                        d.critical 
                          ? "bg-rose-100 text-rose-700 " 
                          : "bg-blue-100 text-blue-700 "
                      )}>
                        {d.probability}% Prob
                      </span>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed mb-2">{d.notes}</p>
                    {d.critical && (
                      <span className="flex items-center gap-1 text-[10px] text-rose-600 font-bold uppercase tracking-wider">
                        <AlertTriangle size={12} /> Critical Warning Indicator
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl text-xs font-medium">
                No active differential load. Enter symptoms in the analyzer chat to compile differential probabilities.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Drug interaction checker & Clinical Note Summarizer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Drug Interaction Matrix */}
        <div className="finai-card p-6">
          <h2 className="text-lg font-bold text-[#0a1a0f] flex items-center gap-2 mb-4">
            <AlertCircle size={20} className="text-rose-500" />
            Drug-Drug Interaction Checker
          </h2>
          <p className="text-xs font-medium text-slate-500 mb-4">
            Input two clinical substances to analyze mutual drug compatibility matrix. e.g. <strong className="text-blue-500">Sildenafil</strong> & <strong className="text-blue-500">Nitroglycerin</strong> or <strong className="text-blue-500">Warfarin</strong> & <strong className="text-blue-500">Aspirin</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Drug substance A</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="e.g. Sildenafil"
                  value={drugA}
                  onChange={(e) => setDrugA(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all "
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Drug substance B</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="e.g. Nitroglycerin"
                  value={drugB}
                  onChange={(e) => setDrugB(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all "
                />
              </div>
            </div>
          </div>

          <button onClick={handleCheckInteraction} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/10">
            Verify Co-Administration Profile
          </button>

          {interactionResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("mt-4 p-4 rounded-xl border flex gap-3 text-xs font-semibold", 
              interactionResult.severity === 'severe' ? "bg-rose-50/70 border-rose-200 text-rose-800 " :
              interactionResult.severity === 'moderate' ? "bg-amber-50/70 border-amber-200 text-amber-800 " :
              interactionResult.severity === 'mild' ? "bg-blue-50/70 border-blue-200 text-blue-800 " :
              "bg-emerald-50/70 border-emerald-200 text-emerald-800 "
            )}>
              <div className="mt-0.5">
                {interactionResult.severity === 'severe' ? <AlertTriangle className="text-rose-500" size={18} /> :
                 interactionResult.severity === 'moderate' ? <AlertCircle className="text-amber-500" size={18} /> :
                 interactionResult.severity === 'mild' ? <AlertCircle className="text-blue-500" size={18} /> :
                 <CheckCircle2 className="text-emerald-500" size={18} />}
              </div>
              <div>
                <h4 className="font-extrabold text-sm uppercase tracking-wide leading-none mb-1">{interactionResult.title}</h4>
                <p className="leading-relaxed font-medium opacity-90">{interactionResult.desc}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* EMR AI Summarizer */}
        <div className="finai-card p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0a1a0f] flex items-center gap-2 mb-4">
              <FileText size={20} className="text-blue-500" />
              AI Clinical Note Builder
            </h2>
            <textarea 
              rows="4"
              placeholder="Type raw clinical observations, e.g. Patient presents with sore throat, mild productive cough, fatigue for 3 days. No fever, normal chest sounds. Strep swab negative..."
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder:text-slate-400"
            />
            
            <button onClick={handleSummarize} className="mt-3 w-full py-3 bg-slate-800 hover:bg-[#0a1a0f] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2">
              {isSummarizing ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
              Draft EMR Visit Summary
            </button>
          </div>

          <AnimatePresence>
            {generatedSummary && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 p-4 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 font-mono overflow-x-auto whitespace-pre-wrap">
                {generatedSummary}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
