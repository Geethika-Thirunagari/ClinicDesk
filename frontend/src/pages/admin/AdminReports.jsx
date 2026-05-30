import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, Filter, Calendar, Users, Activity,
  Settings, Banknote, ShieldCheck, X, RefreshCw, CheckCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';

const reportTypes = [
  { id: 'fin', title: 'Financial Summary', icon: Banknote, color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Revenue, expenses, and pending payments.' },
  { id: 'apt', title: 'Appointment Stats', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Booking trends, cancellations, and no-shows.' },
  { id: 'pt', title: 'Patient Demographics', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Age, gender, and regional distribution.' },
  { id: 'stf', title: 'Staff Performance', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'Doctor ratings, active hours, and efficiency.' },
  { id: 'adt', title: 'Audit Logs', icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50', desc: 'System access, configuration changes, and alerts.' },
  { id: 'sys', title: 'System Usage', icon: Settings, color: 'text-slate-600', bg: 'bg-slate-100', desc: 'Storage, API requests, and uptime stats.' },
];

// Sample data per report type
const reportData = {
  fin: [
    ['Category', 'Value'],
    ['Total Revenue', '$2,450,800'],
    ['Total Expenses', '$850,000'],
    ['Net Profit', '$721,480'],
    ['Pending Payments', '$24,500'],
  ],
  apt: [
    ['Month', 'Booked', 'Completed', 'Cancelled', 'No-Shows'],
    ['January', 320, 298, 14, 8],
    ['February', 290, 270, 12, 8],
    ['March', 342, 310, 21, 11],
    ['April', 355, 330, 17, 8],
    ['May', 342, 315, 18, 9],
  ],
  pt: [
    ['Age Group', 'Count', 'Percentage'],
    ['0–18', 1842, '14.7%'],
    ['19–35', 3520, '28.1%'],
    ['36–50', 4100, '32.8%'],
    ['51–65', 2210, '17.7%'],
    ['65+', 810, '6.5%'],
  ],
  stf: [
    ['Doctor', 'Patients Seen', 'Rating', 'Hours Logged'],
    ['Dr. Sarah Smith', 142, '4.8/5', 160],
    ['Dr. Emily Chen', 118, '4.6/5', 148],
    ['Dr. James Kumar', 95, '4.7/5', 132],
    ['Dr. Liu Wei', 87, '4.5/5', 120],
  ],
  adt: [
    ['Event', 'Actor', 'Severity', 'Timestamp'],
    ['EMR Record Modified', 'Dr. Sarah Smith', 'Medium', '2026-05-22 21:40'],
    ['Database Backup Completed', 'System Daemon', 'Low', '2026-05-22 21:38'],
    ['Failed Login Attempt', 'Unknown IP', 'High', '2026-05-22 21:12'],
    ['Prescription Signed', 'Dr. Sarah Smith', 'Low', '2026-05-22 20:55'],
  ],
  sys: [
    ['Metric', 'Value'],
    ['API Requests Today', '14,280'],
    ['Storage Used', '48 GB / 100 GB'],
    ['Uptime', '99.97%'],
    ['Active Sessions', '342'],
    ['Error Rate', '0.03%'],
  ],
};

const generateCSV = (data) => {
  return data.map((row) => row.map((v) => `"${v}"`).join(',')).join('\n');
};

const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const initialReports = [
  { id: 'REP-101', name: 'Q1 Financial Report', type: 'Financial', generatedBy: 'Admin', date: '2026-05-18', size: '2.4 MB', format: 'PDF' },
  { id: 'REP-102', name: 'Weekly Staff Performance', type: 'Staff', generatedBy: 'System (Auto)', date: '2026-05-15', size: '1.1 MB', format: 'PDF' },
  { id: 'REP-103', name: 'Patient Demographics 2025', type: 'Patient', generatedBy: 'Dr. Sarah', date: '2026-05-10', size: '3.8 MB', format: 'PDF' },
  { id: 'REP-104', name: 'Security Audit May', type: 'Audit', generatedBy: 'Admin', date: '2026-05-01', size: '840 KB', format: 'CSV' },
];

const filterReportData = (data, typeId, fromDate, toDate) => {
  if (!fromDate || !toDate || !data || data.length <= 1) return data;

  const from = new Date(fromDate);
  const to = new Date(toDate);
  to.setHours(23, 59, 59, 999); // Include entire end day

  if (typeId === 'apt') {
    // Appointment Stats: Row 0 is header, column 0 is Month name.
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const validMonths = new Set();

    // Determine which months fall within the date range
    let d = new Date(from);
    d.setDate(1); // Start of from-month
    while (d <= to) {
      validMonths.add(months[d.getMonth()]);
      d.setMonth(d.getMonth() + 1);
    }

    // Filter the rows
    const filteredRows = data.slice(1).filter(row => validMonths.has(row[0]));
    return [data[0], ...filteredRows];
  }

  if (typeId === 'adt') {
    // Audit Logs: Row 0 is header, column 3 is Timestamp.
    const filteredRows = data.slice(1).filter(row => {
      const rowDate = new Date(row[3]);
      return rowDate >= from && rowDate <= to;
    });
    return [data[0], ...filteredRows];
  }

  // Other types (fin, pt, sys) are aggregate metrics, so we just return the snapshot
  return data;
};

const AdminReports = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState(reportTypes[0]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [format, setFormat] = useState('CSV');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [reports, setReports] = useState(initialReports);

  const executeDownload = (data, title, fmt, from, to) => {
    const dateTag = from && to ? `${from}_to_${to}` : new Date().toISOString().slice(0, 10);
    const filename = `clinicdesk-${title.toLowerCase().replace(/ /g, '-')}-report-${dateTag}`;

    if (fmt === 'CSV' || fmt === 'Excel') {
      const csv = generateCSV(data);
      downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
    } else {
      // PDF — generate a simple printable HTML page
      const rows = data.map((row) =>
        `<tr>${row.map((cell) => `<td style="border:1px solid #e2e8e2;padding:8px 12px;font-size:13px">${cell}</td>`).join('')}</tr>`
      ).join('');
      const html = `
        <html><head><title>${title} Report</title>
        <style>body{font-family:sans-serif;padding:32px}h1{color:#0a1a0f}table{border-collapse:collapse;width:100%}th{background:#0a1a0f;color:white;padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:0.1em}</style>
        </head><body>
        <h1>${title} Report</h1>
        <p style="color:#64748b;margin-bottom:24px">Period: ${from || 'N/A'} → ${to || 'N/A'} &nbsp;|&nbsp; Generated: ${new Date().toLocaleString()}</p>
        <table><thead><tr>${data[0].map((h) => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${rows.slice(1)}</tbody></table>
        </body></html>`;
      const win = window.open('', '_blank');
      win.document.write(html);
      win.document.close();
      win.print();
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let data = reportData[selectedType.id];
      data = filterReportData(data, selectedType.id, fromDate, toDate);

      executeDownload(data, selectedType.title, format, fromDate, toDate);

      const dateTag = fromDate && toDate ? `${fromDate}_to_${toDate}` : new Date().toISOString().slice(0, 10);

      const newId = `REP-${100 + reports.length + 2}`;
      setReports((prev) => [{
        id: newId,
        name: `${selectedType.title} — ${dateTag}`,
        type: selectedType.title.split(' ')[0],
        generatedBy: 'Admin',
        date: new Date().toISOString().slice(0, 10),
        size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
        format,
        fromDate,
        toDate
      }, ...prev]);

      setIsGenerating(false);
      setIsDone(true);
      setTimeout(() => { setIsDone(false); setShowModal(false); }, 1200);
    }, 1600);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 font-['Outfit']">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0a1a0f] tracking-tight">System Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Generate, schedule, and export clinic data reports.</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setIsDone(false); setShowModal(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0a1a0f] text-white rounded-xl font-semibold text-sm shadow-lg hover:bg-slate-800 transition-all">
          <FileText size={18} /> Generate New Report
        </motion.button>
      </div>

      {/* Report Types Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Report Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((type) => (
            <motion.div key={type.id} whileHover={{ y: -2 }}
              onClick={() => { setSelectedType(type); setIsDone(false); setShowModal(true); }}
              className="bg-white border border-[#e2e8e2] shadow-sm hover:shadow-md rounded-[24px] p-5 cursor-pointer transition-all flex items-start gap-4">
              <div className={cn('p-3 rounded-xl shrink-0', type.bg, type.color)}>
                <type.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#0a1a0f] mb-1">{type.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{type.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="cd-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#0a1a0f]">Recent Reports</h2>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{reports.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Report Name</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Generated By</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Format</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Download</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-slate-400" />
                      <div>
                        <p className="text-sm font-bold text-[#0a1a0f]">{report.name}</p>
                        <p className="text-xs text-slate-400 font-mono">{report.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-slate-600">{report.type}</td>
                  <td className="py-4 text-sm text-slate-600">{report.generatedBy}</td>
                  <td className="py-4 text-sm text-slate-600">{report.date}</td>
                  <td className="py-4">
                    <span className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider',
                      report.format === 'PDF' ? 'bg-blue-50 text-blue-600 border-blue-100'
                        : report.format === 'CSV' ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-purple-50 text-purple-600 border-purple-100'
                    )}>
                      {report.format || 'PDF'}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => {
                        const typeData = reportTypes.find(t => report.type.includes(t.title.split(' ')[0])) || reportTypes[0];
                        let data = reportData[typeData.id];
                        data = filterReportData(data, typeData.id, report.fromDate, report.toDate);
                        executeDownload(data, typeData.title, report.format || 'PDF', report.fromDate, report.toDate);
                      }}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors",
                        report.format === 'CSV' || report.format === 'Excel'
                          ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                          : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                      )}
                    >
                      <Download size={14} /> Download {report.format || 'PDF'}                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Report Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isGenerating && setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[24px] shadow-2xl w-full max-w-md p-8 border border-slate-200">

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#0a1a0f]">Generate Report</h2>
                <button onClick={() => !isGenerating && setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-50" disabled={isGenerating}>
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5">
                {/* Report type */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Report Type</label>
                  <select value={selectedType.id}
                    onChange={(e) => setSelectedType(reportTypes.find(t => t.id === e.target.value))}
                    disabled={isGenerating}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 bg-white text-[#0a1a0f]">
                    {reportTypes.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </select>
                </div>

                {/* Date range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">From Date</label>
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-[#0a1a0f]"
                      disabled={isGenerating} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">To Date</label>
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-[#0a1a0f]"
                      disabled={isGenerating} />
                  </div>
                </div>

                {/* Format */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Format</label>
                  <div className="flex gap-3">
                    {['CSV', 'Excel', 'PDF'].map(f => (
                      <label key={f} onClick={() => setFormat(f)}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors text-sm font-semibold',
                          format === f
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        )}>
                        <input type="radio" name="format" value={f} checked={format === f} onChange={() => setFormat(f)} className="hidden" disabled={isGenerating} />
                        {f}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button onClick={handleGenerate} disabled={isGenerating || isDone}
                  className={cn(
                    'w-full py-3.5 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed',
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#0a1a0f] text-white hover:bg-slate-800 disabled:opacity-75'
                  )}>
                  {isDone ? (
                    <><CheckCircle size={18} /> Report Ready!</>
                  ) : isGenerating ? (
                    <><RefreshCw size={18} className="animate-spin" /> Generating...</>
                  ) : (
                    'Generate & Download'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default AdminReports;
