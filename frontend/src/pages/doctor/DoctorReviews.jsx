import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageCircleHeart, TrendingUp, ThumbsUp, CalendarClock, MessageSquareReply, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const reviewsData = [
  { id: 1, patient: 'Alice Johnson', rating: 5, date: 'Today', tags: ['Bedside Manner', 'Clear Explanations'], text: 'Dr. Smith was incredibly attentive and explained my diagnosis clearly. Best cardiologist in town!', replied: false },
  { id: 2, patient: 'Robert Williams', rating: 5, date: 'Yesterday', tags: ['Short Wait Time'], text: 'Very short wait time and excellent bedside manner. Highly recommend.', replied: true },
  { id: 3, patient: 'Maria Garcia', rating: 4, date: '3 days ago', tags: ['Thorough'], text: 'Overall great experience, but the waiting room was a bit crowded. Dr. Smith herself was wonderful.', replied: false },
  { id: 4, patient: 'David Lee', rating: 5, date: 'Last week', tags: ['Follow-up Care'], text: 'Appreciate the quick follow-up on my lab results via Teleconsult.', replied: true },
];

const StatCard = ({ title, value, subtitle, icon: Icon, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}
    className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-5 relative overflow-hidden group hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={cn("p-3 rounded-xl", color)}><Icon size={22} className="text-white" /></div>
      <TrendingUp size={20} className="text-emerald-500 opacity-50" />
    </div>
    <div>
      <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
        {value} {title === 'Overall Rating' && <Star size={20} className="text-amber-400 fill-amber-400" />}
      </h3>
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">{title}</p>
      <p className="text-xs text-slate-400 mt-2 bg-white/50 dark:bg-slate-800/50 inline-block px-2 py-1 rounded-md">{subtitle}</p>
    </div>
  </motion.div>
);

const DoctorReviews = () => {
  const [filter, setFilter] = useState('All');
  
  const filtered = reviewsData.filter(r => {
    if (filter === 'All') return true;
    if (filter === 'Needs Reply') return !r.replied;
    return r.rating === parseInt(filter.charAt(0));
  });

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8 min-h-screen">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Reputation & Feedback</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitor patient satisfaction and respond to reviews.</p>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Overall Rating" value="4.8" subtitle="Based on 142 reviews" icon={Star} color="bg-amber-500" delay={0.1} />
        <StatCard title="Bedside Manner" value="98%" subtitle="+2% from last month" icon={MessageCircleHeart} color="bg-rose-500" delay={0.15} />
        <StatCard title="Treatment Efficacy" value="95%" subtitle="Consistent" icon={ThumbsUp} color="bg-blue-500" delay={0.2} />
        <StatCard title="Avg Wait Time" value="12m" subtitle="-3m improvement" icon={CalendarClock} color="bg-emerald-500" delay={0.25} />
      </div>

      {/* Reviews List */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-800 pb-4 gap-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            Patient Reviews
          </h2>
          <div className="flex gap-2">
            {['All', '5 Stars', '4 Stars', 'Needs Reply'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-semibold transition-all border",
                  filter === f 
                    ? "bg-slate-800 text-white border-slate-800 dark:bg-slate-700 dark:border-slate-600" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700"
                )}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <AnimatePresence>
            {filtered.map((review, i) => (
              <motion.div key={review.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-all group">
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center font-bold text-lg text-blue-600 dark:text-blue-300">
                      {review.patient.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white">{review.patient}</h4>
                      <p className="text-xs text-slate-500 font-medium">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, index) => (
                      <Star key={index} size={16} className={cn(index < review.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700")} />
                    ))}
                  </div>
                </div>

                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">"{review.text}"</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {review.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
                  {review.replied ? (
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={16} /> Replied publicly
                    </div>
                  ) : (
                    <button className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
                      <MessageSquareReply size={16} /> Reply to Patient
                    </button>
                  )}
                  <button className="text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors">Flag as inappropriate</button>
                </div>
                
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <p>No reviews match this filter.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorReviews;
