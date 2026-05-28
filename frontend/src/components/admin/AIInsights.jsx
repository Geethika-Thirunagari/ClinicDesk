import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const InsightCard = ({ title, description, icon: Icon, type, delay }) => {
  const styles = {
    prediction: "from-indigo-500/10 to-purple-500/10 border-indigo-500/20 text-indigo-600 ",
    success: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-600 ",
    warning: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600 "
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "p-4 rounded-xl border bg-gradient-to-r flex gap-4 items-start relative overflow-hidden group",
        styles[type]
      )}
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Sparkles size={48} />
      </div>
      <div className="p-2 rounded-lg bg-white/50 backdrop-blur-sm shrink-0">
        <Icon size={20} className="opacity-80" />
      </div>
      <div className="relative z-10">
        <h4 className="font-bold text-sm mb-1">{title}</h4>
        <p className="text-xs opacity-80 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

const AIInsights = () => {
  return (
    <div className="bg-white border border-[#e2e8e2] rounded-[24px] p-6 h-full shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-[#0a1a0f] flex items-center gap-2">
          <BrainCircuit className="text-indigo-500" />
          AI Healthcare Insights
        </h2>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg">
          Updated Live
        </span>
      </div>

      <div className="space-y-3">
        <InsightCard 
          type="prediction"
          icon={AlertCircle}
          title="High Patient Load Expected"
          description="Model predicts a 24% increase in cardiology walk-ins tomorrow based on weather and historical data."
          delay={0.1}
        />
        <InsightCard 
          type="success"
          icon={TrendingUp}
          title="Efficiency Improved"
          description="No-show rate has decreased by 12% this week after implementing automated SMS reminders."
          delay={0.2}
        />
        <InsightCard 
          type="warning"
          icon={BrainCircuit}
          title="Staffing Recommendation"
          description="Recommend adding 2 nurses to the night shift on Friday to maintain optimal patient wait times."
          delay={0.3}
        />
      </div>
    </div>
  );
};

export default AIInsights;
