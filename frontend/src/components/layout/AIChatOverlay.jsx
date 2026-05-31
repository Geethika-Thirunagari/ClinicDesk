import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Sparkles, User, MessageCircle, MoreVertical } from 'lucide-react';
import { cn } from '../../utils/cn';
import { aiService } from '../../services/ai.service';

const initialMessages = [
    { id: 1, role: 'assistant', text: "Hello! I'm your ClinicDesk AI. How can I help you manage your practice today?", time: 'Now' }
];

const AIChatOverlay = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = {
            id: Date.now(),
            role: 'user',
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        const query = input.trim();
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const history = [...messages, userMessage].map((m) => ({
                role: m.role === 'user' ? 'user' : 'assistant',
                text: m.text,
            }));
            const data = await aiService.chat({
                message: query,
                history,
                context: 'clinic_admin',
            });
            const response =
                data.reply ||
                'I could not generate a response. Please check that the backend is running.';
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: 'assistant',
                    text: response,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: 'assistant',
                    text: 'Could not reach the AI service. Start the Django server (python run_server.py) and try again.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 100, scale: 0.95 }}
                    className="fixed bottom-6 right-6 w-[400px] h-[600px] z-[60] cd-card shadow-2xl flex flex-col overflow-hidden border border-emerald-100"
                >
                    {/* Header */}
                    <div className="p-4 bg-[#0a1a0f] text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">ClinicDesk AI</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Active Insights</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages area */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 custom-scrollbar">
                        {messages.map((msg) => (
                            <div key={msg.id} className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
                                <div className={cn(
                                    "max-w-[85%] p-3 rounded-2xl text-sm shadow-sm",
                                    msg.role === 'user'
                                        ? "bg-[#0a1a0f] text-white rounded-tr-none"
                                        : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                                )}>
                                    {msg.text}
                                </div>
                                <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider px-1">{msg.time}</span>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex flex-col items-start">
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce" />
                                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-slate-100">
                        <form onSubmit={handleSend} className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me about clinic insights..."
                                className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                            />
                            <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#0a1a0f] text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-all"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                        <p className="text-[9px] text-slate-400 text-center mt-3 font-semibold uppercase tracking-widest">Powered by Google Gemini</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AIChatOverlay;
