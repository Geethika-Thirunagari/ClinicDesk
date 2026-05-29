import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill, AlertTriangle, Plus, Search, CheckCircle, PackageSearch } from 'lucide-react';
import { cn } from '../../utils/cn';

const inventory = [
  { id: 'MED-101', name: 'Amoxicillin 500mg', category: 'Antibiotics', stock: 4500, minStock: 1000, price: '$0.25', expiry: '2027-11-20', status: 'In Stock' },
  { id: 'MED-102', name: 'Paracetamol 500mg', category: 'Analgesics', stock: 850, minStock: 2000, price: '$0.05', expiry: '2026-08-15', status: 'Low Stock' },
  { id: 'MED-103', name: 'Ibuprofen 400mg', category: 'NSAIDs', stock: 3200, minStock: 1500, price: '$0.15', expiry: '2028-01-10', status: 'In Stock' },
  { id: 'MED-104', name: 'Insulin Glargine', category: 'Hormones', stock: 120, minStock: 300, price: '$45.00', expiry: '2026-06-30', status: 'Critical' },
  { id: 'MED-105', name: 'Omeprazole 20mg', category: 'Antacids', stock: 2100, minStock: 1000, price: '$0.40', expiry: '2027-05-12', status: 'In Stock' },
  { id: 'MED-106', name: 'Lisinopril 10mg', category: 'Cardiovascular', stock: 400, minStock: 800, price: '$0.60', expiry: '2027-02-28', status: 'Low Stock' },
];

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}
    className="cd-card p-5 relative overflow-hidden group hover:shadow-md transition-all">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
        <h3 className="text-2xl font-extrabold text-[#0a1a0f] ">{value}</h3>
      </div>
      <div className={cn("p-3 rounded-xl", color)}><Icon size={22} className="text-white" /></div>
    </div>
  </motion.div>
);

const AdminPharmacy = () => {
  const [search, setSearch] = useState('');

  const filtered = inventory.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.category.toLowerCase().includes(search.toLowerCase()) ||
    i.id.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s) => {
    if (s === 'In Stock') return 'bg-emerald-100 text-emerald-700 ';
    if (s === 'Low Stock') return 'bg-amber-100 text-amber-700 ';
    if (s === 'Critical') return 'bg-rose-100 text-rose-700 ';
    return 'bg-slate-100 text-slate-500 ';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 font-['Outfit']">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0a1a0f] tracking-tight">Pharmacy Inventory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage medicines, stock levels, and supply chain.</p>
        </div>
        <div className="flex gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-xl font-semibold text-sm shadow-md hover:bg-slate-700 :bg-slate-600 transition-all">
            <PackageSearch size={18} /> Purchase Order
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all">
            <Plus size={18} /> Add Item
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Items" value="1,248" icon={Pill} color="bg-blue-500" delay={0.1} />
        <StatCard title="Healthy Stock" value="1,120" icon={CheckCircle} color="bg-emerald-500" delay={0.15} />
        <StatCard title="Low Stock" value="114" icon={AlertTriangle} color="bg-amber-500" delay={0.2} />
        <StatCard title="Critical/Out" value="14" icon={AlertTriangle} color="bg-rose-500" delay={0.25} />
      </div>

      <div className="cd-card p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-lg font-bold text-[#0a1a0f] ">Inventory Master List</h2>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search by name, category, or ID..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all :text-slate-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 ">
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Item ID &amp; Name</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock Level</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unit Price</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expiry Date</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const stockPercent = Math.min(100, Math.round((item.stock / item.minStock) * 100));
                return (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 :bg-slate-800/50 transition-colors">
                    <td className="py-4">
                      <p className="text-sm font-bold text-[#0a1a0f] ">{item.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{item.id}</p>
                    </td>
                    <td className="py-4 text-sm text-slate-600 ">{item.category}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-700 w-12">{item.stock}</span>
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className={cn("h-1.5 rounded-full", item.status === 'In Stock' ? 'bg-emerald-500' : item.status === 'Low Stock' ? 'bg-amber-500' : 'bg-rose-500')} style={{ width: `${stockPercent}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm font-semibold text-slate-700 ">{item.price}</td>
                    <td className="py-4 text-sm text-slate-500 ">{item.expiry}</td>
                    <td className="py-4"><span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider", statusColor(item.status))}>{item.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPharmacy;
