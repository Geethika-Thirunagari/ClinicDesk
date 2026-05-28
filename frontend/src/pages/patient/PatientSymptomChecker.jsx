import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchCheck, HelpCircle, Activity, ChevronRight, AlertTriangle, AlertCircle, ArrowLeft, Calendar, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

const bodyRegions = [
  { id: "head", label: "Head & Neck", description: "Headaches, throat, ears, eyes, sinus" },
  { id: "chest", label: "Chest & Heart", description: "Breathing, coughing, palpitations" },
  { id: "abdomen", label: "Abdomen & Digestive", description: "Stomach pain, nausea, bloating" },
  { id: "limbs", label: "Limbs & Joints", description: "Muscle ache, swelling, stiffness" },
  { id: "general", label: "General Systemic", description: "Fever, fatigue, chills, body aches" }
];

const symptomsByRegion = {
  head: [
    { id: "headache", label: "Severe Headache" },
    { id: "migraine", label: "Throbbing Migraine" },
    { id: "sorethroat", label: "Sore Throat" },
    { id: "dizzy", label: "Dizziness or Vertigo" },
    { id: "sinus", label: "Sinus Congestion" }
  ],
  chest: [
    { id: "cough", label: "Dry Cough" },
    { id: "chestpain", label: "Chest Tightness / Pain", warning: true },
    { id: "shortbreath", label: "Shortness of Breath", warning: true },
    { id: "palpitations", label: "Rapid Palpitations" }
  ],
  abdomen: [
    { id: "nausea", label: "Nausea or Vomiting" },
    { id: "stomachache", label: "Acute Stomach Pain" },
    { id: "cramps", label: "Abdominal Cramping" },
    { id: "acid", label: "Heartburn / Acid Reflux" }
  ],
  limbs: [
    { id: "jointpain", label: "Joint Pain" },
    { id: "muscleache", label: "Muscle Strain / Soreness" },
    { id: "swelling", label: "Localized Swelling" },
    { id: "numbness", label: "Numbness / Tingling" }
  ],
  general: [
    { id: "fever", label: "High Fever" },
    { id: "fatigue", label: "Extreme Fatigue" },
    { id: "chills", label: "Cold Chills / Shivering" },
    { id: "rash", label: "Sudden Skin Rash" }
  ]
};

const mockQuestions = [
  { id: "duration", text: "How long have you experienced these symptoms?", options: ["Less than 24 hours", "1 to 3 days", "Over a week"] },
  { id: "severity", text: "Rate the severity of your current discomfort:", options: ["Mild / Manageable", "Moderate / Interfering", "Severe / Restricting"] },
  { id: "history", text: "Have you had similar symptoms in the past?", options: ["No, first time", "Yes, occasionally", "Chronic recurring"] }
];

export default function PatientSymptomChecker() {
  const navigate = useNavigate();
  
  // Wizard steps: 1 = Region selection, 2 = Symptom chips, 3 = Follow-up questions, 4 = Assessment result
  const [step, setStep] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  
  // Follow-up answer states
  const [answers, setAnswers] = useState({});

  const handleSelectRegion = (regionId) => {
    setSelectedRegion(regionId);
    setSelectedSymptoms([]);
    setStep(2);
  };

  const handleToggleSymptom = (symptomId) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(id => id !== symptomId) 
        : [...prev, symptomId]
    );
  };

  const handleAnswerQuestion = (qId, option) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleProceedToQuestions = () => {
    if (selectedSymptoms.length === 0) return;
    setStep(3);
  };

  const handleCalculateAssessment = () => {
    // Basic clinical urgency evaluation logic
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedRegion("");
    setSelectedSymptoms([]);
    setAnswers({});
  };

  // Determine urgency assessment
  const getUrgencyAssessment = () => {
    const hasWarningSymptom = selectedSymptoms.some(id => {
      const regionSyms = symptomsByRegion[selectedRegion] || [];
      const s = regionSyms.find(item => item.id === id);
      return s?.warning;
    });

    const isSevere = answers["severity"] === "Severe / Restricting";
    const isProlonged = answers["duration"] === "Over a week";

    if (hasWarningSymptom || isSevere) {
      return {
        level: "High Urgency",
        color: "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400",
        icon: AlertTriangle,
        desc: "Seek Immediate Evaluation: Your symptoms indicate potentially high-severity physiological stress. We highly recommend scheduling an urgent or immediate physical consultation. If you experience severe chest pain or acute respiratory difficulty, proceed to the nearest Emergency Room immediately.",
        specialty: "Emergency Care / Specialized Practitioner"
      };
    } else if (isProlonged || answers["severity"] === "Moderate / Interfering") {
      return {
        level: "Moderate Urgency",
        color: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400",
        icon: AlertCircle,
        desc: "Schedule Appointment Soon: Your symptoms suggest moderate physiological distress. While not immediately critical, seeking professional assessment within 24-48 hours is advised to prevent escalation. Ensure adequate rest and hydration in the meantime.",
        specialty: "General Physician / Family Practitioner"
      };
    } else {
      return {
        level: "Low Urgency",
        color: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400",
        icon: Info,
        desc: "Standard Care Profile: Symptoms are currently classified as low-urgency. Self-care, rest, and fluid monitoring may help alleviate discomfort. If symptoms persist or worsen over the next 48 hours, schedule a general practitioner consultation.",
        specialty: "Primary Care / Self-Care"
      };
    }
  };

  const assessment = step === 4 ? getUrgencyAssessment() : null;

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <SearchCheck className="text-blue-500" size={32} />
            Interactive Symptom Triage Assessment
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Perform an automated, guided triage query to assess symptoms and identify appropriate care profiles.
          </p>
        </div>
      </div>

      {/* Progress Wizard bar */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-4 flex items-center justify-between gap-4 overflow-x-auto">
        {[
          { num: 1, label: "Select Region" },
          { num: 2, label: "Identify Symptoms" },
          { num: 3, label: "Clarifying Questions" },
          { num: 4, label: "Triage Score" }
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2 text-xs font-bold shrink-0">
            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border", 
              step === s.num ? "bg-blue-600 border-blue-700 text-white shadow-sm" :
              step > s.num ? "bg-emerald-500 border-emerald-600 text-white" :
              "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-400"
            )}>
              {s.num}
            </div>
            <span className={cn(step >= s.num ? "text-slate-700 dark:text-white" : "text-slate-400")}>{s.label}</span>
            {s.num < 4 && <ChevronRight size={14} className="text-slate-400" />}
          </div>
        ))}
      </div>

      {/* Wizard steps content */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
        
        {/* Decorative corner background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {/* STEP 1: Body region selector */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
                  <HelpCircle size={18} className="text-blue-500" /> Which physical region is primary?
                </h2>
                <p className="text-xs font-semibold text-slate-400">Select the anatomical segment corresponding to your focal discomfort.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bodyRegions.map((region) => (
                  <button 
                    key={region.id} 
                    onClick={() => handleSelectRegion(region.id)}
                    className="p-5 text-left bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/60 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl transition-all shadow-sm hover:shadow-md cursor-pointer group"
                  >
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-white leading-tight group-hover:text-blue-600 transition-colors">{region.label}</h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{region.description}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Symptoms checklist chips */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-6">
              <div className="flex items-center gap-2">
                <button onClick={() => setStep(1)} className="p-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:text-slate-700 transition-colors">
                  <ArrowLeft size={14} />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-0.5 leading-none">
                    Select Your Specific Symptoms
                  </h2>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-400">Check all indicators matching your current feeling.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {(symptomsByRegion[selectedRegion] || []).map((s) => {
                  const isChecked = selectedSymptoms.includes(s.id);
                  return (
                    <button 
                      key={s.id}
                      onClick={() => handleToggleSymptom(s.id)}
                      className={cn("px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer", 
                        isChecked 
                          ? "bg-blue-600 border-blue-700 text-white shadow-md shadow-blue-500/10" 
                          : s.warning 
                            ? "bg-rose-500/5 hover:bg-rose-500/10 border-rose-200 text-rose-600 dark:border-rose-900/40 dark:text-rose-400"
                            : "bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                      )}
                    >
                      {s.label} {s.warning && "⚠️"}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button 
                  disabled={selectedSymptoms.length === 0}
                  onClick={handleProceedToQuestions}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5 cursor-pointer"
                >
                  Confirm Symptoms <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Question Triage flow */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-6">
              <div className="flex items-center gap-2">
                <button onClick={() => setStep(2)} className="p-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:text-slate-700 transition-colors">
                  <ArrowLeft size={14} />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-0.5 leading-none">
                    Clarifying Physiological Details
                  </h2>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-400">These questions assist in calculating standard severity levels.</p>
                </div>
              </div>

              <div className="space-y-5">
                {mockQuestions.map((q) => (
                  <div key={q.id} className="space-y-2.5">
                    <h4 className="text-xs font-extrabold text-slate-700 dark:text-white">{q.text}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {q.options.map((opt) => {
                        const isChosen = answers[q.id] === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleAnswerQuestion(q.id, opt)}
                            className={cn("py-2.5 px-4 text-center rounded-xl border text-xs font-bold transition-all cursor-pointer", 
                              isChosen 
                                ? "bg-slate-800 border-slate-900 text-white dark:bg-slate-700 dark:border-slate-700" 
                                : "bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                            )}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button 
                  disabled={Object.keys(answers).length < mockQuestions.length}
                  onClick={handleCalculateAssessment}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5 cursor-pointer"
                >
                  Compile Urgency Score <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Diagnostic Urgency Triage Assessment Result */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-6">
              <div className="p-6 rounded-2xl border flex flex-col md:flex-row gap-5 items-start relative overflow-hidden bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-700">
                <div className={cn("p-4 rounded-xl shrink-0 border flex items-center justify-center", assessment.color)}>
                  <assessment.icon size={36} />
                </div>
                
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest bg-slate-200 dark:bg-slate-900 px-3 py-1 rounded-full text-slate-500 dark:text-slate-400">Clinical Triage Score</span>
                    <span className={cn("text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider", 
                      assessment.level.includes("High") ? "bg-rose-500 text-white shadow-sm shadow-rose-500/15" :
                      assessment.level.includes("Mod") ? "bg-amber-500 text-white shadow-sm shadow-amber-500/15" :
                      "bg-blue-500 text-white shadow-sm"
                    )}>
                      {assessment.level}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-800 dark:text-white leading-tight">Recommended Action Protocol</h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">{assessment.desc}</p>
                </div>
              </div>

              {/* Action grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button onClick={handleReset} className="py-3 border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all">
                  Restart Triage Wizard
                </button>
                <button 
                  onClick={() => navigate('/patient/book')}
                  className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5"
                >
                  <Calendar size={14} /> Schedule Doctor Consultation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
