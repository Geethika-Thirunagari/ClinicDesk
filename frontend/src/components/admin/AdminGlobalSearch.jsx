import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Stethoscope, Contact, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { searchAdminDirectory } from '../../utils/adminSearch';

const TYPE_META = {
  patient: { label: 'Patient', icon: User, color: 'text-blue-600 bg-blue-50' },
  staff: { label: 'Staff', icon: Contact, color: 'text-violet-600 bg-violet-50' },
  doctor: { label: 'Doctor', icon: Stethoscope, color: 'text-emerald-600 bg-emerald-50' },
};

const AdminGlobalSearch = ({ className, inputClassName }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  const results = useMemo(() => searchAdminDirectory(query), [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goToResult = (result) => {
    navigate(result.path, { state: { search: result.highlight || query } });
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen && e.key !== 'Escape') return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(0, results.length - 1)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[activeIndex]) goToResult(results[activeIndex]);
      else if (query.trim()) {
        navigate('/admin/patients', { state: { search: query.trim() } });
        setQuery('');
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const showPanel = isOpen && query.trim().length > 0;

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none"
          size={16}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search patients, staff..."
          aria-label="Search patients, staff, and doctors"
          aria-expanded={showPanel}
          aria-autocomplete="list"
          className={cn(
            'pl-11 pr-4 py-3 rounded-xl text-sm outline-none w-64 bg-white border border-[#e2e8e2] placeholder-slate-400 focus:border-emerald-200 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)] font-bold text-[#0a1a0f]',
            inputClassName
          )}
        />
      </div>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 sm:left-auto sm:right-0 mt-2 sm:w-96 bg-white border border-[#e2e8e2] rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            {results.length > 0 ? (
              <ul className="max-h-72 overflow-y-auto custom-scrollbar py-2" role="listbox">
                {results.map((result, index) => {
                  const meta = TYPE_META[result.type];
                  const Icon = meta.icon;
                  return (
                    <li key={`${result.type}-${result.id}`} role="option" aria-selected={index === activeIndex}>
                      <button
                        type="button"
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => goToResult(result)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                          index === activeIndex ? 'bg-emerald-50' : 'hover:bg-slate-50'
                        )}
                      >
                        <div className={cn('p-2 rounded-lg shrink-0', meta.color)}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#0a1a0f] truncate">{result.title}</p>
                          <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                          {meta.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-sm font-semibold text-slate-600">No matches found</p>
                <p className="text-xs text-slate-400 mt-1">Try a name, ID, email, or department</p>
              </div>
            )}
            {results.length > 0 && (
              <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                <span>↑↓ navigate · Enter open</span>
                <ArrowRight size={12} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminGlobalSearch;
