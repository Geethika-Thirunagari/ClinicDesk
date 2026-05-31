import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare, Send,
  Clock, ShieldCheck, Check, Volume2, VolumeX,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/useAuthStore';
import TeleconsultVideoRoom from '../../components/teleconsult/TeleconsultVideoRoom';
import { speakText, stopSpeaking } from '../../utils/speech';
import VoiceHealthAssistant from '../../components/ai/VoiceHealthAssistant';
import { aiService } from '../../services/ai.service';
import {
  isSymptomLike,
  buildPatientDoctorReply,
  chatTime,
} from '../../utils/teleconsultSymptoms';

const PatientTeleconsult = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [autoListen, setAutoListen] = useState(true);
  const [speakingId, setSpeakingId] = useState(null);

  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'doctor', text: "Hello! I can see you now. How are you feeling today?", time: '09:10' },
    { id: 2, sender: 'patient', text: 'Hi Doctor, I am feeling a bit better, thank you.', time: '09:11' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);
  const prevChatLengthRef = useRef(chatMessages.length);

  useEffect(() => () => stopSpeaking(), []);

  useEffect(() => {
    if (isCallEnded) return;
    const t = setInterval(() => setElapsedTime((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isCallEnded]);

  useEffect(() => {
    if (showChat) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, showChat]);

  useEffect(() => {
    if (!autoListen) {
      prevChatLengthRef.current = chatMessages.length;
      return;
    }
    if (chatMessages.length > prevChatLengthRef.current) {
      const newMsgs = chatMessages.slice(prevChatLengthRef.current);
      const lastDoctor = [...newMsgs].reverse().find((m) => m.sender === 'doctor');
      if (lastDoctor) {
        setSpeakingId(lastDoctor.id);
        speakText(lastDoctor.text, { onEnd: () => setSpeakingId(null) });
      }
    }
    prevChatLengthRef.current = chatMessages.length;
  }, [chatMessages, autoListen]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const postSymptomSolution = (transcript, result) => {
    const timeString = chatTime();
    const solutionText = buildPatientDoctorReply(result);
    const doctorMsg = {
      id: Date.now() + 1,
      sender: 'doctor',
      text: solutionText,
      time: timeString,
    };

    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'patient', text: transcript, time: timeString },
      doctorMsg,
    ]);

    if (autoListen) {
      setSpeakingId(doctorMsg.id);
      speakText(solutionText, { onEnd: () => setSpeakingId(null) });
    }
  };

  const handleVoiceAnalyzed = (transcript, result) => {
    postSymptomSolution(transcript, result);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text) return;
    setNewMessage('');

    if (isSymptomLike(text)) {
      const result = await aiService.analyzeSymptoms(text);
      postSymptomSolution(text, result);
      return;
    }

    const timeString = chatTime();
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'patient', text, time: timeString },
    ]);

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'doctor',
          text: "Thank you for sharing that. I'll note it in your chart and we'll discuss next steps.",
          time: chatTime(),
        },
      ]);
    }, 1500);
  };

  if (isCallEnded) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] flex items-center justify-center p-6 font-['Outfit']"
      >
        <div className="cd-card p-8 max-w-md text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <Check size={28} />
          </div>
          <h2 className="text-xl font-bold text-[#0a1a0f]">Visit ended</h2>
          <p className="text-sm text-slate-500 mt-2">Thank you, {user?.name?.split(' ')[0] || 'Patient'}. Your doctor has saved the consultation notes.</p>
          <button
            type="button"
            onClick={() => navigate('/patient/dashboard')}
            className="mt-6 w-full py-3 bg-[#0a1a0f] text-white rounded-xl font-bold text-sm"
          >
            Back to Health Hub
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 font-['Outfit']"
    >
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-[#0a1a0f] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            Video visit with Dr. Sarah Smith
          </h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
            Cardiology · <Clock size={14} /> {formatTime(elapsedTime)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowChat(!showChat)}
          className={cn(
            'self-start px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2',
            showChat ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200'
          )}
        >
          <MessageSquare size={14} /> Chat
        </button>
      </div>

      <VoiceHealthAssistant
        compact
        title="Tell us your problem (voice)"
        onAnalyzed={handleVoiceAnalyzed}
        autoSpeakSolution
        autoStart={isMicOn && !isCallEnded}
        deferStartMs={1200}
        silenceMs={1800}
      />

      <div className="flex flex-col lg:flex-row gap-4 min-h-[520px]">
        <div className="flex-1 bg-slate-950 rounded-[24px] overflow-hidden relative shadow-2xl border border-slate-900 group">
          <TeleconsultVideoRoom
            role="patient"
            isVideoOn={isVideoOn}
            isMicOn={isMicOn}
            remoteName="Dr. Sarah Smith"
            remoteId="Cardiology"
            enabled={!isCallEnded}
            includeCallAudio={false}
          />

          <div className="absolute bottom-0 left-0 right-0 h-20 bg-slate-950/90 backdrop-blur flex items-center justify-center gap-3 z-30 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
            <button type="button" onClick={() => setIsMicOn(!isMicOn)} className={cn('p-3 rounded-full', isMicOn ? 'bg-slate-700 text-white' : 'bg-rose-500/30 text-rose-400')}>
              {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
            <button type="button" onClick={() => setIsVideoOn(!isVideoOn)} className={cn('p-3 rounded-full', isVideoOn ? 'bg-slate-700 text-white' : 'bg-rose-500/30 text-rose-400')}>
              {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
            </button>
            <button type="button" onClick={() => setIsCallEnded(true)} className="px-5 py-3 rounded-full bg-rose-600 text-white font-bold text-sm flex items-center gap-2">
              <PhoneOff size={16} /> End visit
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="w-full lg:w-[340px] cd-card p-4 flex flex-col min-h-[400px] lg:min-h-0"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <h3 className="font-bold text-sm text-[#0a1a0f]">Message your doctor</h3>
                <button
                  type="button"
                  onClick={() => { if (autoListen) stopSpeaking(); setAutoListen(!autoListen); }}
                  className={cn('text-[10px] font-bold uppercase flex items-center gap-1 px-2 py-1 rounded-lg', autoListen ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400')}
                >
                  {autoListen ? <Volume2 size={12} /> : <VolumeX size={12} />}
                  {autoListen ? 'Listen' : 'Mute'}
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'max-w-[90%] p-2.5 rounded-2xl text-xs',
                      msg.sender === 'patient' ? 'bg-blue-600 text-white ml-auto rounded-br-none' : 'bg-slate-100 text-slate-700 mr-auto rounded-bl-none',
                      speakingId === msg.id && 'ring-2 ring-indigo-400'
                    )}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[9px] opacity-70 block mt-1">{msg.time}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={sendMessage} className="flex gap-2 mt-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type to your doctor..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="p-2.5 bg-blue-600 text-white rounded-xl">
                  <Send size={14} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
        <ShieldCheck size={12} /> Allow camera & microphone when prompted — your face appears in the small “You” window.
      </p>
    </motion.div>
  );
};

export default PatientTeleconsult;
