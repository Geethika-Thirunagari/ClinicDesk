import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Mic, MicOff, VideoOff, PhoneOff, Maximize, 
  MessageSquare, FileText, User, Send, Plus, Trash2, 
  Check, Sparkles, AlertCircle, Clock, ShieldCheck, Heart 
} from 'lucide-react';
import { cn } from '../../utils/cn';

const DoctorTeleconsult = () => {
  // Call Controls State
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showRecords, setShowRecords] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCallEnded, setIsCallEnded] = useState(false);

  // EMR Form State
  const [prescriptions, setPrescriptions] = useState([
    { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: '30 days' },
    { name: 'Atorvastatin', dosage: '20mg', frequency: 'At night', duration: '90 days' },
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('10mg');
  const [newMedFrequency, setNewMedFrequency] = useState('Once daily');
  const [newMedDuration, setNewMedDuration] = useState('30 days');
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [clinicalNotes, setClinicalNotes] = useState('Patient reports mild exertion-based tightness in chest. Heart rate and blood pressure pre-readings show stable but elevated trends. Advising lipid review.');

  // Post Call checkout state
  const [diagnosis, setDiagnosis] = useState('Essential Hypertension');
  const [followUpDate, setFollowUpDate] = useState('2 weeks');
  const [isSaved, setIsSaved] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'patient', text: 'Hi Doctor, I am feeling a bit better today, but the chest pain still comes and goes.', time: '09:10' },
    { sender: 'doctor', text: "Good morning Alice. Let's check your symptoms. Did you take the medication yesterday?", time: '09:11' },
    { sender: 'patient', text: 'Yes, I took it after dinner as prescribed.', time: '09:12' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const chatEndRef = useRef(null);

  // Dynamic Call Timer
  useEffect(() => {
    if (isCallEnded) return;
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCallEnded]);

  // Scroll Chat to Bottom
  useEffect(() => {
    if (showChat) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, showChat]);

  // Format Elapsed Time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Add a medication prescription item
  const addPrescription = (e) => {
    e.preventDefault();
    if (!newMedName.trim()) return;
    setPrescriptions(prev => [...prev, {
      name: newMedName,
      dosage: newMedDosage,
      frequency: newMedFrequency,
      duration: newMedDuration
    }]);
    setNewMedName('');
    setShowPrescriptionForm(false);
  };

  // Remove medication
  const removePrescription = (index) => {
    setPrescriptions(prev => prev.filter((_, i) => i !== index));
  };

  // Send interactive chat message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const docMsg = {
      sender: 'doctor',
      text: newMessage,
      time: timeString
    };
    
    setChatMessages(prev => [...prev, docMsg]);
    const userText = newMessage;
    setNewMessage('');
    
    // Simulate patient reply after 1.8 seconds
    setTimeout(() => {
      let reply = "Got it. I will keep that in mind, Doctor.";
      const query = userText.toLowerCase();
      if (query.includes('pain') || query.includes('chest') || query.includes('hurt')) {
        reply = "Yes, it mostly starts when I climb stairs or jog. It fades after resting.";
      } else if (query.includes('pill') || query.includes('medicine') || query.includes('dose') || query.includes('prescription')) {
        reply = "Okay, I'll start the new prescriptions today. Should I stop my previous ones?";
      } else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
        reply = "Hello Doctor! Thank you for the call.";
      } else if (query.includes('exercise') || query.includes('diet') || query.includes('eat')) {
        reply = "I will stick to a low-sodium diet and daily light walking.";
      }
      
      setChatMessages(prev => [...prev, {
        sender: 'patient',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1800);
  };

  // Render Post Call Summary Layout if session ended
  if (isCallEnded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="p-4 lg:p-6 min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50 transition-colors"
      >
        <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-3xl p-6 lg:p-8 relative overflow-hidden">
          {/* Glowing Background Art */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />

          <div className="text-center mb-6">
            <div className="inline-flex p-3.5 bg-emerald-500/10 text-emerald-500 rounded-full mb-3 shadow-inner">
              <ShieldCheck size={36} />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0a1a0f] tracking-tight">Teleconsultation Completed</h2>
            <p className="text-sm font-medium text-slate-500 mt-1.5">
              Session with <span className="font-bold text-slate-700 ">Alice Johnson</span> concluded at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {isSaved ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-[24px] text-center"
            >
              <div className="inline-flex p-2.5 bg-emerald-500 text-white rounded-full mb-3">
                <Check size={20} />
              </div>
              <h4 className="font-extrabold text-emerald-800 ">EMR Updated Successfully</h4>
              <p className="text-xs text-emerald-600 mt-1.5 max-w-md mx-auto leading-relaxed">
                Consultation logs, patient biometrics, prescription lists, and diagnosis updates have been successfully written to the electronic database.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => window.location.href = '/doctor/dashboard'}
                  className="px-6 py-2.5 bg-[#0a1a0f] hover:bg-slate-800 text-white text-sm font-bold rounded-xl hover:opacity-95 transition-all shadow-md"
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Final Diagnosis</label>
                  <select
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="Essential Hypertension">Essential Hypertension</option>
                    <option value="Acute Bronchitis">Acute Bronchitis</option>
                    <option value="Type 2 Diabetes Mellitus">Type 2 Diabetes Mellitus</option>
                    <option value="Gastroesophageal Reflux Disease">Gastroesophageal Reflux (GERD)</option>
                    <option value="Mild Chest Pain (Non-Cardiac)">Mild Chest Pain (Non-Cardiac)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Follow-up Routine</label>
                  <select
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="No follow-up needed">No follow-up needed</option>
                    <option value="3 days">3 days (Review symptoms)</option>
                    <option value="1 week">1 week (Standard)</option>
                    <option value="2 weeks">2 weeks</option>
                    <option value="1 month">1 month</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Consultation Notes (Clinical History)</label>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Record summary clinical observations..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors leading-relaxed"
                />
              </div>

              {prescriptions.length > 0 && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Active Prescribed Medications</label>
                  <div className="flex flex-wrap gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 ">
                    {prescriptions.map((med, idx) => (
                      <div key={idx} className="px-2.5 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm">
                        <span>{med.name} ({med.dosage})</span>
                        <span className="text-[10px] text-slate-400 font-medium">| {med.frequency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setIsCallEnded(false)}
                  className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 :bg-slate-800 text-slate-700 font-bold text-sm rounded-xl transition-all"
                >
                  Resume Live Call
                </button>
                <button
                  onClick={() => setIsSaved(true)}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all"
                >
                  Save & Update EMR
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }} 
      className="p-4 lg:p-6 min-h-[calc(100vh-80px)] flex flex-col transition-all"
    >
      {/* Upper Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-5">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-[#0a1a0f] tracking-tight flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" /> Live Teleconsult
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1.5">
            Connected: <span className="font-bold text-slate-700 ">Alice Johnson (PT-1024)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 " />
            <Clock size={14} className="text-slate-400" />
            <span className="font-semibold text-blue-600 ">{formatTime(elapsedTime)}</span>
          </p>
        </div>
        
        {/* Toggle Sidebar buttons */}
        <div className="flex bg-slate-100/80 p-1 rounded-xl self-start sm:self-auto border border-slate-200/40 ">
          <button 
            onClick={() => { setShowRecords(!showRecords); if (showChat) setShowChat(false); }} 
            className={cn(
              "px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5", 
              showRecords 
                ? "bg-white shadow-sm text-blue-600 " 
                : "text-slate-500 hover:text-[#0a1a0f] :text-white"
            )}
          >
            <FileText size={14} /> EMR Panel
          </button>
          <button 
            onClick={() => { setShowChat(!showChat); if (showRecords) setShowRecords(false); }} 
            className={cn(
              "px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5", 
              showChat 
                ? "bg-white shadow-sm text-blue-600 " 
                : "text-slate-500 hover:text-[#0a1a0f] :text-white"
            )}
          >
            <MessageSquare size={14} /> Live Chat
          </button>
        </div>
      </div>

      {/* Main Work Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-5 h-full min-h-[500px]">
        
        {/* Left Hand Video Container */}
        <div className="flex-1 bg-slate-950 rounded-[24px] overflow-hidden relative shadow-2xl flex flex-col group border border-slate-900">
          
          {/* Simulated Webcam stream */}
          <div className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden">
            {/* Live dynamic camera background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-slate-900 to-indigo-900/20 animate-pulse" />
            
            {/* Video scanlines & high-tech grids */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none opacity-20" />

            {/* Soundwave pulse animation when patient is active */}
            <div className="relative flex flex-col items-center justify-center z-10 p-6">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-blue-500/20 blur-md animate-ping" />
                <div className="absolute -inset-2 rounded-full bg-indigo-500/10 blur-sm animate-pulse" />
                <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-blue-500/30 flex items-center justify-center shadow-inner">
                  <User size={48} className="text-blue-400" />
                </div>
              </div>
              <div className="mt-4 text-center">
                <h4 className="text-white font-bold text-lg">Alice Johnson</h4>
                <p className="text-slate-400 text-xs mt-1">Patient Camera Feed Live</p>
              </div>
              
              {/* Sound level graph overlay */}
              <div className="flex gap-1 items-end h-8 mt-6">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, Math.random() * 24 + 8, 8] }}
                    transition={{ duration: 1 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                    className="w-1 bg-blue-500 rounded-full"
                  />
                ))}
              </div>
            </div>

            <p className="absolute bottom-4 left-4 text-white/80 bg-slate-950/60 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md border border-white/10 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Patient: Alice Johnson (PT-1024)
            </p>
            
            <div className="absolute top-4 right-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Connection Stable
            </div>
          </div>

          {/* Picture-in-Picture (Doctor) Container */}
          <div className="absolute bottom-24 right-4 w-44 h-32 bg-[#0a1a0f] rounded-xl border border-white/10 shadow-2xl overflow-hidden z-20 transition-all">
            {isVideoOn ? (
              <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 to-slate-950" />
                <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center border border-white/5 relative z-10">
                  <User size={20} className="text-indigo-400" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 relative z-10">Local Camera</p>
                
                {/* Local Mic Equalizer */}
                {isMicOn && (
                  <div className="absolute top-2 right-2 flex gap-0.5 items-end h-3">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [3, Math.random() * 8 + 3, 3] }}
                        transition={{ duration: 0.8 + Math.random() * 0.4, repeat: Infinity }}
                        className="w-0.5 bg-emerald-400 rounded-full"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center">
                <VideoOff size={24} className="text-rose-500/80 mb-1" />
                <p className="text-[9px] text-rose-400 font-bold uppercase tracking-wider">Camera Muted</p>
              </div>
            )}
            <p className="absolute bottom-1.5 left-2 text-white/90 text-[10px] font-bold bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm">You</p>
          </div>

          {/* Video Control Bar */}
          <div className="h-20 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-center gap-4 px-6 absolute bottom-0 left-0 right-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 z-30">
            <button 
              onClick={() => setIsMicOn(!isMicOn)} 
              className={cn(
                "p-3.5 rounded-full transition-all shadow-md", 
                isMicOn ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-rose-500/20 text-rose-500 hover:bg-rose-500/30"
              )}
              title={isMicOn ? "Mute Mic" : "Unmute Mic"}
            >
              {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
            <button 
              onClick={() => setIsVideoOn(!isVideoOn)} 
              className={cn(
                "p-3.5 rounded-full transition-all shadow-md", 
                isVideoOn ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-rose-500/20 text-rose-500 hover:bg-rose-500/30"
              )}
              title={isVideoOn ? "Stop Video" : "Start Video"}
            >
              {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
            </button>
            <button 
              onClick={() => { setShowChat(!showChat); if (showRecords) setShowRecords(false); }} 
              className={cn(
                "p-3.5 rounded-full transition-all shadow-md", 
                showChat ? "bg-blue-600 text-white" : "bg-slate-800 text-white hover:bg-slate-700"
              )}
              title="Open Chat"
            >
              <MessageSquare size={18} />
            </button>
            <button 
              className="p-3.5 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-all shadow-md hidden sm:block"
              title="Fullscreen"
            >
              <Maximize size={18} />
            </button>
            <div className="w-px h-8 bg-slate-800 mx-1 hidden sm:block"></div>
            <button 
              onClick={() => setIsCallEnded(true)}
              className="px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all flex items-center gap-2 shadow-lg shadow-rose-600/20 text-sm"
            >
              <PhoneOff size={16} /> End Call
            </button>
          </div>
        </div>

        {/* Dynamic Sidebar panels */}
        <AnimatePresence mode="wait">
          {(showRecords || showChat) && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }} 
              animate={{ width: 360, opacity: 1 }} 
              exit={{ width: 0, opacity: 0 }} 
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4 w-full lg:w-[360px]"
            >
              
              {/* EMR Panel Screen */}
              {showRecords && (
                <div className="flex-1 bg-white border-[#e2e8e2] shadow-xl rounded-[24px] p-5 flex flex-col min-h-[450px]">
                  <h3 className="font-extrabold text-[#0a1a0f] mb-3.5 flex items-center gap-2 border-b border-slate-200/50 pb-3 text-base">
                    <FileText size={18} className="text-blue-500" /> Patient Chart & EMR
                  </h3>
                  
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1.5 text-slate-700 ">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Chief Complaint</p>
                      <p className="text-sm font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-100 ">
                        Persistent chest pain on climbing steps, intermittent breathlessness.
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pre-Call Patient Vitals</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 ">
                          <span className="text-[10px] text-slate-400 block font-medium">Blood Pressure</span> 
                          <span className="font-bold text-sm text-[#0a1a0f] ">132 / 84 mmHg</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 ">
                          <span className="text-[10px] text-slate-400 block font-medium">Pulse Rate</span> 
                          <span className="font-bold text-sm text-[#0a1a0f] ">82 bpm</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Clinical Observation Notes</p>
                      <textarea
                        rows={2}
                        value={clinicalNotes}
                        onChange={(e) => setClinicalNotes(e.target.value)}
                        className="w-full text-xs p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 outline-none focus:border-blue-500"
                        placeholder="Type observation details..."
                      />
                    </div>

                    {/* Prescription module */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Session Prescriptions</p>
                        <button 
                          onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                          className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                        >
                          <Plus size={12} /> Add
                        </button>
                      </div>

                      {showPrescriptionForm && (
                        <motion.form 
                          initial={{ opacity: 0, y: -5 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          onSubmit={addPrescription}
                          className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3 space-y-2 text-xs"
                        >
                          <div>
                            <input 
                              type="text" 
                              required 
                              placeholder="Medication Name (e.g. Metoprolol)" 
                              value={newMedName} 
                              onChange={(e) => setNewMedName(e.target.value)} 
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none text-[#0a1a0f] "
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            <input 
                              type="text" 
                              placeholder="Dosage" 
                              value={newMedDosage} 
                              onChange={(e) => setNewMedDosage(e.target.value)} 
                              className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] text-[#0a1a0f] "
                            />
                            <input 
                              type="text" 
                              placeholder="Frequency" 
                              value={newMedFrequency} 
                              onChange={(e) => setNewMedFrequency(e.target.value)} 
                              className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] text-[#0a1a0f] "
                            />
                            <input 
                              type="text" 
                              placeholder="Duration" 
                              value={newMedDuration} 
                              onChange={(e) => setNewMedDuration(e.target.value)} 
                              className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] text-[#0a1a0f] "
                            />
                          </div>
                          <div className="flex gap-2 justify-end pt-1">
                            <button type="button" onClick={() => setShowPrescriptionForm(false)} className="px-2.5 py-1 text-slate-400 hover:text-slate-600 font-semibold">Cancel</button>
                            <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Save</button>
                          </div>
                        </motion.form>
                      )}

                      {prescriptions.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No prescriptions written yet.</p>
                      ) : (
                        <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                          {prescriptions.map((med, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100 ">
                              <div>
                                <h5 className="text-xs font-bold text-[#0a1a0f] ">{med.name}</h5>
                                <p className="text-[10px] text-slate-400 mt-0.5">{med.dosage} • {med.frequency} • {med.duration}</p>
                              </div>
                              <button 
                                onClick={() => removePrescription(idx)} 
                                className="text-slate-400 hover:text-rose-500 p-1"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsCallEnded(true)}
                    className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1"
                  >
                    <Plus size={16} /> Complete Consultation
                  </button>
                </div>
              )}

              {/* Chat Panel Screen */}
              {showChat && (
                <div className="flex-1 bg-white border-[#e2e8e2] shadow-xl rounded-[24px] p-4 flex flex-col h-full min-h-[450px]">
                  <h3 className="font-extrabold text-[#0a1a0f] mb-2.5 flex items-center gap-2 border-b border-slate-200/50 pb-2 text-sm">
                    <MessageSquare size={16} className="text-indigo-500" /> Consult Session Chat
                  </h3>
                  
                  {/* Messages list */}
                  <div className="flex-1 overflow-y-auto space-y-3 p-1 pr-1.5">
                    {chatMessages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={cn(
                          "flex flex-col max-w-[85%] rounded-[24px] p-2.5 text-xs shadow-sm",
                          msg.sender === 'doctor' 
                            ? "bg-blue-600 text-white rounded-br-none ml-auto" 
                            : "bg-slate-100 text-slate-700 rounded-bl-none mr-auto border border-slate-200/20 "
                        )}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                        <span className={cn("text-[9px] mt-1 self-end", msg.sender === 'doctor' ? "text-blue-200" : "text-slate-400")}>
                          {msg.time}
                        </span>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Message Form */}
                  <form onSubmit={sendMessage} className="mt-2.5 relative flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Ask Alice a question..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 pl-3.5 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500 "
                    />
                    <button 
                      type="submit" 
                      className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md shadow-blue-500/15"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
};

export default DoctorTeleconsult;
