import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, Search, User, CheckCircle2, ChevronRight, RefreshCw, UserPlus, Clock, ArrowLeft, Ticket } from 'lucide-react';
import { cn } from '../../utils/cn';

const mockPatientsDatabase = [
  { id: "PT-1024", name: "Alice Johnson", phone: "555-0192", email: "alice@example.com", dob: "1998-04-12", age: 28, lastVisit: "2026-05-19" },
  { id: "PT-2910", name: "Robert Williams", phone: "555-0348", email: "robert@example.com", dob: "1981-08-25", age: 45, lastVisit: "2026-05-18" },
  { id: "PT-8821", name: "Maria Garcia", phone: "555-0811", email: "maria@example.com", dob: "1992-11-03", age: 34, lastVisit: "2026-05-15" }
];

const mockDoctorsList = [
  { name: "Dr. Sarah Smith", specialty: "Cardiology", department: "Heart Clinic" },
  { name: "Dr. Emily Chen", specialty: "Dermatology", department: "Skin & Allergy" },
  { name: "Dr. James Wilson", specialty: "General Medicine", department: "Primary Care Office" }
];

export default function ReceptionCheckin() {
  // Wizard steps: 1 = Search Patient, 2 = Verify & Select Doctor, 3 = Assigned token & Success
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Selection states
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [visitType, setVisitType] = useState("Consultation");
  
  // Completed token status
  const [generatedToken, setGeneratedToken] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Look up in mock database
    const results = mockPatientsDatabase.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.phone.includes(searchQuery) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setStep(2);
  };

  const handleProcessCheckin = () => {
    if (!selectedDoctor) return;
    setIsProcessing(true);

    setTimeout(() => {
      // Generate a mock token
      const tokenNum = Math.floor(Math.random() * 90) + 10;
      setGeneratedToken(`T-${tokenNum}`);
      setIsProcessing(false);
      setStep(3);
    }, 1200);
  };

  const handleReset = () => {
    setStep(1);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedPatient(null);
    setSelectedDoctor("");
    setVisitType("Consultation");
    setGeneratedToken("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <ScanLine className="text-blue-500" size={32} />
            Patient Check-In Kiosk
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Perform rapid registration and queue check-in for pre-scheduled or walk-in patients.
          </p>
        </div>
      </div>

      {/* Progress tracking indicator */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-4 flex items-center justify-between gap-4">
        {[
          { num: 1, label: "Search Patient" },
          { num: 2, label: "Verify & Routing" },
          { num: 3, label: "Token Generated" }
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2 text-xs font-bold">
            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border", 
              step === s.num ? "bg-blue-600 border-blue-650 text-white shadow-sm" :
              step > s.num ? "bg-emerald-500 border-emerald-600 text-white" :
              "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-400"
            )}>
              {s.num}
            </div>
            <span className={cn(step >= s.num ? "text-slate-700 dark:text-white" : "text-slate-400")}>{s.label}</span>
            {s.num < 3 && <ChevronRight size={14} className="text-slate-350" />}
          </div>
        ))}
      </div>

      {/* Core Wizard panel */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6 min-h-[420px] flex flex-col justify-between relative overflow-hidden">
        
        {/* Abstract floating blur background */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {/* STEP 1: Search Patient Database */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
                  <Search size={18} className="text-blue-500" /> Lookup Patient Record
                </h2>
                <p className="text-xs font-semibold text-slate-400">Search by patient name, primary phone number, or EMR identification code.</p>
              </div>

              <form onSubmit={handleSearch} className="flex gap-2.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-450" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search e.g. Alice Johnson, 555-0192, PT-1024..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                  />
                </div>
                <button type="submit" className="px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-500/10 cursor-pointer">
                  Query System
                </button>
              </form>

              {/* Query Results */}
              <div className="space-y-3 pt-2">
                {searchResults.length > 0 ? (
                  searchResults.map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => handleSelectPatient(p)}
                      className="p-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/60 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl flex items-center justify-between transition-all cursor-pointer shadow-sm group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600"><User size={20} /></div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors leading-tight">{p.name}</h4>
                          <p className="text-xs text-slate-450 mt-1 font-mono">{p.id} • DOB: {p.dob} (Age {p.age})</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-400" />
                    </div>
                  ))
                ) : searchQuery && (
                  <div className="p-8 text-center text-slate-405 border border-dashed border-slate-200 dark:border-slate-850 rounded-xl text-xs font-medium">
                    No records matched search parameters. Check details or register as a new client walk-in.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Verify & Selection */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-6">
              <div className="flex items-center gap-2">
                <button onClick={() => setStep(1)} className="p-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:text-slate-700 transition-colors">
                  <ArrowLeft size={14} />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-0.5 leading-none">Check-In Verification & Routing</h2>
                  <p className="text-xs font-semibold text-slate-450">Review identity profile and select medical routing destinations.</p>
                </div>
              </div>

              {/* Bio summary */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 text-xs font-semibold">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Verifying Client profile</span>
                  <h4 className="font-extrabold text-sm text-slate-850 dark:text-white mt-1 leading-none">{selectedPatient.name}</h4>
                  <p className="text-slate-500 mt-1 font-mono">{selectedPatient.id} • Phone: {selectedPatient.phone}</p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Last Visit Registry</span>
                  <p className="text-slate-800 dark:text-slate-350 mt-1 font-mono">{selectedPatient.lastVisit}</p>
                </div>
              </div>

              {/* Selection inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase mb-2">Assign Consulting Practitioner</label>
                  <select 
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Choose Practitioner --</option>
                    {mockDoctorsList.map((d, idx) => (
                      <option key={idx} value={d.name}>{d.name} ({d.specialty})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase mb-2">Visit Category classification</label>
                  <select 
                    value={visitType}
                    onChange={(e) => setVisitType(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Consultation</option>
                    <option>Follow-up Visit</option>
                    <option>Diagnostic Lab Check</option>
                    <option>Vaccination / Immunization</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button 
                  disabled={!selectedDoctor || isProcessing}
                  onClick={handleProcessCheckin}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="animate-spin" size={14} /> Synchronizing...
                    </>
                  ) : (
                    <>
                      Verify and Assign Token <ChevronRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: assigned token & success */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-6">
              <div className="text-center py-6 space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto border border-emerald-500/25">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">Check-In Registry Complete!</h2>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-450 mt-1.5 leading-relaxed">
                    Patient <strong className="text-slate-700 dark:text-white">{selectedPatient.name}</strong> was assigned to <strong className="text-slate-700 dark:text-white">{selectedDoctor}</strong> queue segment.
                  </p>
                </div>

                {/* Queue ticket visualization */}
                <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 border-dashed relative overflow-hidden">
                  <Ticket className="absolute -bottom-4 -right-4 w-20 h-20 text-slate-200 dark:text-slate-900 pointer-events-none" />
                  
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Queue Token Registry</span>
                  <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-mono tracking-wider mt-1.5">{generatedToken}</div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 text-xs font-semibold text-slate-550 dark:text-slate-400">
                    <div className="text-left">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Clinic Dept</span>
                      <p className="mt-0.5 leading-none">Primary Care</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Est. Wait</span>
                      <p className="mt-0.5 leading-none">~15 mins</p>
                    </div>
                  </div>
                </div>

                {/* Return button */}
                <button onClick={handleReset} className="w-full py-3 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all">
                  Next Registration Check-In
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
