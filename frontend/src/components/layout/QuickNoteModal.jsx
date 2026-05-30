import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, StickyNote, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/useAuthStore';

const STORAGE_KEY = 'clinicdesk_quick_notes';

const CATEGORIES = [
  { id: 'general', label: 'General', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { id: 'patient', label: 'Patient', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { id: 'staff', label: 'Staff', color: 'bg-violet-50 text-violet-700 border-violet-100' },
  { id: 'urgent', label: 'Urgent', color: 'bg-rose-50 text-rose-700 border-rose-100' },
];

const loadNotes = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const formatWhen = (iso) => {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const QuickNoteModal = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (isOpen) setNotes(loadNotes());
  }, [isOpen]);

  const persist = (next) => {
    setNotes(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!body.trim()) {
      setMessage({ type: 'error', text: 'Write something in the note before saving.' });
      return;
    }

    const note = {
      id: `QN-${Date.now()}`,
      title: title.trim() || 'Untitled note',
      body: body.trim(),
      category,
      author: user?.name || 'User',
      authorRole: user?.role || 'staff',
      createdAt: new Date().toISOString(),
    };

    persist([note, ...notes]);
    setTitle('');
    setBody('');
    setCategory('general');
    setMessage({ type: 'success', text: 'Note saved.' });
    setTimeout(() => setMessage({ type: '', text: '' }), 2500);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this note?')) return;
    persist(notes.filter((n) => n.id !== id));
  };

  const categoryMeta = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 12 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-[#e2e8e2] font-['Outfit']"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0a1a0f] text-white flex items-center justify-center">
                  <StickyNote size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#0a1a0f] tracking-tight">Quick Note</h2>
                  <p className="text-xs text-slate-500 font-medium">Jot down reminders — saved on this device</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 border-b border-slate-100 shrink-0">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Title (optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Follow up with PT-1004"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-[#0a1a0f]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Note
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Type your note here..."
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none custom-scrollbar"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all',
                        category === cat.id ? cat.color : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {message.text && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold',
                      message.type === 'success' && 'bg-emerald-50 text-emerald-700',
                      message.type === 'error' && 'bg-rose-50 text-rose-700'
                    )}
                  >
                    {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {message.text}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                className="w-full py-3 bg-[#0a1a0f] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-emerald-900 transition-colors shadow-lg"
              >
                Save note
              </button>
            </form>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-4 min-h-0">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Recent notes ({notes.length})
              </h3>
              {notes.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8 border border-dashed border-slate-200 rounded-xl">
                  No notes yet. Save your first quick note above.
                </p>
              ) : (
                <ul className="space-y-3">
                  {notes.map((note) => {
                    const cat = categoryMeta(note.category);
                    return (
                      <li
                        key={note.id}
                        className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-emerald-100 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-[#0a1a0f] truncate">{note.title}</p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                              {note.author} · {formatWhen(note.createdAt)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDelete(note.id)}
                            className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                            aria-label="Delete note"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap line-clamp-3">{note.body}</p>
                        <span
                          className={cn(
                            'inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider',
                            cat.color
                          )}
                        >
                          {cat.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickNoteModal;
