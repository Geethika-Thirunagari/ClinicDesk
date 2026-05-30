import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Mic, MicOff, VideoOff, PhoneOff, Maximize, 
  MessageSquare, FileText, Send, Plus, Trash2, 
  Check, AlertCircle, Clock, ShieldCheck, Volume2, VolumeX
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { speakText, stopSpeaking } from '../../utils/speech';
import TeleconsultVideoRoom from '../../components/teleconsult/TeleconsultVideoRoom';
import VoiceHealthAssistant from '../../components/ai/VoiceHealthAssistant';

const DoctorTeleconsult = () => {
  // Call Controls State
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [autoListen, setAutoListen] = useState(true);
  const [speakingId, setSpeakingId] = useState(null);
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
    { id: 1, sender: 'patient', text: 'Hi Doctor, I am feeling a bit better today, but the chest pain still comes and goes.', time: '09:10' },
    { id: 2, sender: 'doctor', text: "Good morning Alice. Let's check your symptoms. Did you take the medication yesterday?", time: '09:11' },
    { id: 3, sender: 'patient', text: 'Yes, I took it after dinner as prescribed.', time: '09:12' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const chatEndRef = useRef(null);
  const prevChatLengthRef = useRef(chatMessages.length);

  useEffect(() => () => stopSpeaking(), []);

  useEffect(() => {
    if (!autoListen) {
      prevChatLengthRef.current = chatMessages.length;
      return;
    }
    if (chatMessages.length > prevChatLengthRef.current) {
      const newMsgs = chatMessages.slice(prevChatLengthRef.current);
      const lastPatient = [...newMsgs].reverse().find((m) => m.sender === 'patient');
      if (lastPatient) {
        setSpeakingId(lastPatient.id);
        speakText(lastPatient.text, { onEnd: () => setSpeakingId(null) });
      }
    }
    prevChatLengthRef.current = chatMessages.length;
  }, [chatMessages, autoListen]);

  const playPatientMessage = (msg) => {
    if (msg.sender !== 'patient') return;
    stopSpeaking();
    setSpeakingId(msg.id);
    speakText(msg.text, { onEnd: () => setSpeakingId(null) });
  };

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
      id: Date.now(),
      sender: 'doctor',
      text: newMessage,
      time: timeString,
    };
    
    setChatMessages((prev) => [...prev, docMsg]);
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
      
      setChatMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: 'patient',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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

      <VoiceHealthAssistant
        compact
        title="Voice: patient symptoms → AI solution"
        autoSpeakSolution={false}
        onAnalyzed={(transcript, result) => {
          const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setChatMessages((prev) => [
            ...prev,
            { id: Date.now(), sender: 'patient', text: transcript, time: timeString },
          ]);
          const note = result.recommendations?.length
            ? `AI triage (${result.severity}): ${result.recommendations.join(' ')}`
            : `AI triage noted — ${result.severity} severity.`;
          setChatMessages((prev) => [
            ...prev,
            { id: Date.now() + 1, sender: 'doctor', text: note, time: timeString },
          ]);
        }}
      />

      {/* Main Work Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-5 h-full min-h-[500px]">
        
        {/* Left Hand Video Container */}
        <div className="flex-1 bg-slate-950 rounded-[24px] overflow-hidden relative shadow-2xl flex flex-col group border border-slate-900">
          
          <TeleconsultVideoRoom
            role="doctor"
            isVideoOn={isVideoOn}
            isMicOn={isMicOn}
            remoteName="Alice Johnson"
            remoteId="PT-1024"
            enabled={!isCallEnded}
          />

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
                  <div className="flex items-center justify-between mb-2.5 border-b border-slate-200/50 pb-2">
                    <h3 className="font-extrabold text-[#0a1a0f] flex items-center gap-2 text-sm">
                      <MessageSquare size={16} className="text-indigo-500" /> Consult Session Chat
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        if (autoListen) stopSpeaking();
                        setAutoListen(!autoListen);
                      }}
                      className={cn(
                        'flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all',
                        autoListen ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-100 text-slate-500 border border-slate-200'
                      )}
                      title={autoListen ? 'Auto-read patient messages aloud' : 'Patient messages muted'}
                    >
                      {autoListen ? <Volume2 size={12} /> : <VolumeX size={12} />}
                      {autoListen ? 'Listen on' : 'Listen off'}
                    </button>
                  </div>
                  
                  {/* Messages list */}
                  <div className="flex-1 overflow-y-auto space-y-3 p-1 pr-1.5">
                    {chatMessages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={cn(
                          'flex flex-col max-w-[85%] rounded-[24px] p-2.5 text-xs shadow-sm',
                          msg.sender === 'doctor' 
                            ? 'bg-blue-600 text-white rounded-br-none ml-auto' 
                            : 'bg-slate-100 text-slate-700 rounded-bl-none mr-auto border border-slate-200/20',
                          speakingId === msg.id && 'ring-2 ring-indigo-400 ring-offset-1'
                        )}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                        <div className={cn('flex items-center gap-2 mt-1', msg.sender === 'doctor' ? 'self-end' : 'self-start')}>
                          {msg.sender === 'patient' && (
                            <button
                              type="button"
                              onClick={() => playPatientMessage(msg)}
                              className="flex items-center gap-0.5 text-[9px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider"
                              title="Listen to this message"
                            >
                              <Volume2 size={11} /> Listen
                            </button>
                          )}
                          <span className={cn('text-[9px]', msg.sender === 'doctor' ? 'text-blue-200' : 'text-slate-400')}>
                            {msg.time}
                          </span>
                        </div>
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
