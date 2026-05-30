import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Plus, Search, FileSignature, Save, Printer, History, X, Eye } from 'lucide-react';
import { cn } from '../../utils/cn';
import { loadPrescriptionHistory, savePrescriptionHistory } from '../../utils/doctorStorage';

const DoctorPrescriptions = () => {
  const [history, setHistory] = useState(() => loadPrescriptionHistory());
  const [showHistory, setShowHistory] = useState(false);
  const [selectedRx, setSelectedRx] = useState(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [medications, setMedications] = useState([
    { id: 1, drug: '', dosage: '', frequency: '', duration: '', instructions: '' },
  ]);

  useEffect(() => {
    savePrescriptionHistory(history);
  }, [history]);

  const openHistoryModal = (rx = null) => {
    setSelectedRx(rx || history[0] || null);
    setShowHistory(true);
  };

  const addMedication = () => {
    setMedications([...medications, { id: Date.now(), drug: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const removeMedication = (id) => {
    if (medications.length > 1) {
      setMedications(medications.filter((m) => m.id !== id));
    }
  };

  const updateMed = (id, field, value) => {
    setMedications((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const applyTemplate = (template) => {
    setMedications([
      {
        id: Date.now(),
        drug: template.drug,
        dosage: template.dosage,
        frequency: template.frequency,
        duration: template.duration,
        instructions: template.instructions || '',
      },
    ]);
  };

  const handleIssue = () => {
    const filled = medications.filter((m) => m.drug.trim());
    if (filled.length === 0) {
      setSaveMessage('Add at least one medication before issuing.');
      return;
    }
    const patientName = patientSearch.trim() || 'Unnamed Patient';
    const newRx = {
      id: `RX-${Date.now().toString().slice(-6)}`,
      patient: patientName,
      patientId: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().slice(0, 10),
      medications: filled.map(({ drug, dosage, frequency, duration, instructions }) => ({
        drug,
        dosage,
        frequency,
        duration,
        instructions,
      })),
    };
    setHistory((prev) => [newRx, ...prev]);
    setSaveMessage(`Prescription ${newRx.id} issued for ${patientName}.`);
    setMedications([{ id: Date.now(), drug: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const recentHistory = history.slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 font-['Outfit']">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0a1a0f] tracking-tight">e-Prescription</h1>
          <p className="text-sm text-slate-500 mt-1">Write and issue digital prescriptions.</p>
        </div>
        <button
          type="button"
          onClick={() => openHistoryModal()}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl font-semibold text-sm hover:bg-slate-700 transition-all"
        >
          <History size={16} /> View History
        </button>
      </div>

      {saveMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-semibold text-emerald-700">
          {saveMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 cd-card p-6 relative">
          <div className="border-b border-slate-200 pb-6 mb-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-black text-[#0a1a0f] flex items-center gap-2">
                <FileSignature className="text-blue-600" /> Rx Pad
              </h2>
              <p className="text-sm font-semibold text-slate-500 mt-1">Dr. Sarah Smith, MD • Cardiology</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-[#0a1a0f]">Date: {new Date().toLocaleDateString()}</p>
              <p className="text-xs text-slate-500 mt-1 font-mono">RX-ID: AUTO-GEN</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Patient</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search patient name or ID..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Medications</label>
            {medications.map((med, index) => (
              <div key={med.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl relative group">
                <div className="absolute -left-2 -top-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                  {index + 1}
                </div>
                {medications.length > 1 && (
                  <button type="button" onClick={() => removeMedication(med.id)} className="absolute top-3 right-3 text-rose-500 hover:text-rose-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold">Remove</span>
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Drug Name</label>
                    <input type="text" placeholder="e.g. Amoxicillin" value={med.drug} onChange={(e) => updateMed(med.id, 'drug', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dosage</label>
                      <input type="text" placeholder="500mg" value={med.dosage} onChange={(e) => updateMed(med.id, 'dosage', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Freq.</label>
                      <input type="text" placeholder="1x/day" value={med.frequency} onChange={(e) => updateMed(med.id, 'frequency', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</label>
                      <input type="text" placeholder="7 days" value={med.duration} onChange={(e) => updateMed(med.id, 'duration', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Instructions (Optional)</label>
                    <input type="text" placeholder="Take after meals" value={med.instructions} onChange={(e) => updateMed(med.id, 'instructions', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button type="button" onClick={addMedication} className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors mb-8">
            <Plus size={16} /> Add Another Medication
          </button>

          <div className="flex gap-3 pt-6 border-t border-slate-200">
            <button type="button" onClick={handleIssue} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
              <FileSignature size={18} /> Issue Prescription
            </button>
            <button type="button" onClick={handlePrint} className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all" title="Print">
              <Printer size={18} />
            </button>
            <button type="button" onClick={handleIssue} className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all" title="Save draft to history">
              <Save size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="cd-card p-6">
            <h2 className="text-sm font-bold text-[#0a1a0f] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Pill size={16} className="text-blue-500" />
              Drug Templates
            </h2>
            <div className="space-y-2">
              <button type="button" onClick={() => applyTemplate({ drug: 'Amoxicillin', dosage: '500mg', frequency: '3x/day', duration: '7 days', instructions: 'Take after meals' })} className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50 transition-all">
                <p className="font-bold text-sm text-slate-700">Standard Antibiotic Regimen</p>
                <p className="text-xs text-slate-500 mt-1">Amoxicillin 500mg • 3x/day • 7 days</p>
              </button>
              <button type="button" onClick={() => applyTemplate({ drug: 'Ibuprofen', dosage: '400mg', frequency: 'PRN', duration: '5 days', instructions: 'Take with food' })} className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50 transition-all">
                <p className="font-bold text-sm text-slate-700">Pain Management (Mild)</p>
                <p className="text-xs text-slate-500 mt-1">Ibuprofen 400mg • PRN • 5 days</p>
              </button>
            </div>
          </div>

          <div className="cd-card p-6">
            <h2 className="text-sm font-bold text-[#0a1a0f] uppercase tracking-wider mb-4 flex items-center gap-2">
              <History size={16} className="text-indigo-500" />
              Recent Issues
            </h2>
            <div className="space-y-3">
              {recentHistory.map((rx) => (
                <button
                  key={rx.id}
                  type="button"
                  onClick={() => openHistoryModal(rx)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left"
                >
                  <div>
                    <p className="font-bold text-sm text-slate-700">{rx.patient}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{rx.id} • {rx.date}</p>
                  </div>
                  <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-md">{rx.medications.length} Meds</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showHistory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowHistory(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-bold text-[#0a1a0f] flex items-center gap-2">
                  <History size={22} className="text-indigo-500" /> Prescription History
                </h2>
                <button type="button" onClick={() => setShowHistory(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-1 min-h-0">
                <div className="w-2/5 border-r border-slate-100 overflow-y-auto custom-scrollbar p-4 space-y-2">
                  {history.map((rx) => (
                    <button
                      key={rx.id}
                      type="button"
                      onClick={() => setSelectedRx(rx)}
                      className={cn(
                        'w-full text-left p-3 rounded-xl border transition-all',
                        selectedRx?.id === rx.id ? 'bg-blue-50 border-blue-200' : 'border-slate-100 hover:bg-slate-50'
                      )}
                    >
                      <p className="text-sm font-bold text-[#0a1a0f]">{rx.patient}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{rx.id} • {rx.date}</p>
                    </button>
                  ))}
                </div>
                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                  {selectedRx ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-[#0a1a0f]">{selectedRx.patient}</h3>
                          <p className="text-xs text-slate-500 font-mono">{selectedRx.id} • {selectedRx.patientId} • {selectedRx.date}</p>
                        </div>
                        <Eye size={20} className="text-slate-300" />
                      </div>
                      <ul className="space-y-3">
                        {selectedRx.medications.map((med, i) => (
                          <li key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="font-bold text-sm text-[#0a1a0f]">{med.drug}</p>
                            <p className="text-xs text-slate-500 mt-1">{med.dosage} • {med.frequency} • {med.duration}</p>
                            {med.instructions && <p className="text-xs text-slate-600 mt-2 italic">{med.instructions}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-12">Select a prescription to view details.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DoctorPrescriptions;
