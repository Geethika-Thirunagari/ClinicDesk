import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Search, Filter, AlertTriangle, RefreshCw, Plus, CheckCircle2, ShoppingCart, ArrowUpRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const initialInventory = [
  { id: "INV-0912", name: "Amoxicillin 500mg capsules", category: "Pharmaceuticals", stock: 1200, minStock: 300, unit: "units", supplier: "Pfizer Distrib.", cost: "$0.12" },
  { id: "INV-0481", name: "Sterile Nitrile Gloves (Medium)", category: "Consumables", stock: 80, minStock: 200, unit: "boxes", supplier: "Medline Corp.", cost: "$14.50" },
  { id: "INV-8812", name: "Disposable Syringes 5ml", category: "Consumables", stock: 450, minStock: 500, unit: "units", supplier: "BD Diagnostics", cost: "$0.45" },
  { id: "INV-7291", name: "Infusion Pumps (Dual Channel)", category: "Equipment", stock: 12, minStock: 15, unit: "devices", supplier: "Baxter Health", cost: "$820.00" },
  { id: "INV-3829", name: "Metformin 500mg tablets", category: "Pharmaceuticals", stock: 3500, minStock: 500, unit: "units", supplier: "Novartis AG", cost: "$0.08" },
  { id: "INV-2911", name: "Surgical Gauze Pads (4x4)", category: "Consumables", stock: 1500, minStock: 300, unit: "units", supplier: "Johnson & Johnson", cost: "$0.22" }
];

export default function AdminInventory() {
  const [inventory, setInventory] = useState(initialInventory);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Quick restock states
  const [selectedItemId, setSelectedItemId] = useState("");
  const [restockQty, setRestockQty] = useState("100");
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState("");

  const handleCreateRestockOrder = (e) => {
    e.preventDefault();
    if (!selectedItemId || !restockQty) return;
    
    setIsOrdering(true);
    const item = inventory.find(i => i.id === selectedItemId);
    
    setTimeout(() => {
      // Simulate restocking inside inventory
      setInventory(prev => prev.map(invItem => 
        invItem.id === selectedItemId 
          ? { ...invItem, stock: invItem.stock + parseInt(restockQty) }
          : invItem
      ));
      
      setIsOrdering(false);
      setOrderSuccess(`Purchase Order dispatched to ${item.supplier} for ${restockQty} ${item.unit} of ${item.name}.`);
      setSelectedItemId("");
      
      setTimeout(() => {
        setOrderSuccess("");
      }, 3500);
    }, 1200);
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.id.toLowerCase().includes(search.toLowerCase()) ||
                          item.supplier.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate critical items count
  const criticalItems = inventory.filter(i => i.stock < i.minStock);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <Package className="text-blue-500" size={32} />
            Clinical Supply & Inventory Console
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track pharmaceutical stocks, clinical consumables levels, equipment procurement schedules, and supplier dispatch orders.
          </p>
        </div>
      </div>

      {/* Row 1: Stock Alert Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-5 hover:shadow-md transition-all flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-slate-450 uppercase tracking-wider">Total SKU Categories</p>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1.5 leading-none">{inventory.length} SKUs</h3>
            <span className="text-[10px] text-slate-400 font-semibold block mt-2">Active database entries</span>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-xl"><Package size={20} /></div>
        </div>

        <div className={cn("bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-5 hover:shadow-md transition-all flex justify-between items-center", 
          criticalItems.length > 0 ? "border-rose-200/50 bg-rose-50/10" : ""
        )}>
          <div>
            <p className="text-xs font-bold text-slate-450 uppercase tracking-wider">Low Stock Warnings</p>
            <h3 className={cn("text-3xl font-extrabold mt-1.5 leading-none", criticalItems.length > 0 ? "text-rose-500" : "text-slate-800 dark:text-white")}>{criticalItems.length} Alarms</h3>
            <span className="text-[10px] text-slate-400 font-semibold block mt-2">Items below safety margins</span>
          </div>
          <div className={cn("p-3 rounded-xl", criticalItems.length > 0 ? "bg-rose-500/10 text-rose-500" : "bg-slate-50 dark:bg-slate-950 text-slate-450")}><AlertTriangle size={20} /></div>
        </div>

        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-5 hover:shadow-md transition-all flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-slate-450 uppercase tracking-wider">Estimated Stock Value</p>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1.5 leading-none">$14,845.00</h3>
            <span className="text-[10px] text-slate-400 font-semibold block mt-2">Valuation of physical stocks</span>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 rounded-xl"><Plus size={20} /></div>
        </div>
      </div>

      {/* Row 2: Search, Filters & Stock Listing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory list - columns 1 & 2 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-4 flex flex-col sm:flex-row justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450" size={16} />
              <input 
                type="text" 
                placeholder="Search SKU by name, ID, or supplier name..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
              />
            </div>

            {/* Category Filter tabs */}
            <div className="flex gap-2 items-center overflow-x-auto py-1">
              <Filter size={14} className="text-slate-400" />
              {["All", "Pharmaceuticals", "Consumables", "Equipment"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all border uppercase tracking-wider cursor-pointer",
                    selectedCategory === cat 
                      ? "bg-blue-600 text-white border-blue-650 shadow-sm" 
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                  )}
                >
                  {cat === "Pharmaceuticals" ? "Meds" : cat === "Equipment" ? "Equip" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Core Table */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6 overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs font-semibold text-slate-500 dark:text-slate-400 border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-extrabold text-slate-405 uppercase tracking-wider">
                    <th className="pb-3.5 pl-2">SKU ID</th>
                    <th className="pb-3.5">Name</th>
                    <th className="pb-3.5">Category</th>
                    <th className="pb-3.5">Physical Stock</th>
                    <th className="pb-3.5">Safety Min</th>
                    <th className="pb-3.5">Unit Cost</th>
                    <th className="pb-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {filteredInventory.length > 0 ? (
                    filteredInventory.map((item) => {
                      const isLow = item.stock < item.minStock;
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                          <td className="py-4 pl-2 font-mono font-bold text-blue-600 dark:text-blue-405">{item.id}</td>
                          <td className="py-4">
                            <div>
                              <div className="font-extrabold text-slate-800 dark:text-white">{item.name}</div>
                              <div className="text-[9px] text-slate-400 mt-0.5 leading-none">Dist: {item.supplier}</div>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="text-[10px] font-extrabold bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded uppercase tracking-wider text-slate-550 dark:text-slate-450">
                              {item.category === "Pharmaceuticals" ? "Pharmacy" : item.category}
                            </span>
                          </td>
                          <td className={cn("py-4 font-extrabold font-mono", isLow ? "text-rose-500" : "text-slate-700 dark:text-slate-350")}>{item.stock} {item.unit}</td>
                          <td className="py-4 font-mono text-slate-500">{item.minStock} {item.unit}</td>
                          <td className="py-4 font-mono text-slate-500">{item.cost}</td>
                          <td className="py-4 text-center">
                            <span className={cn("text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-widest", 
                              isLow ? "bg-rose-500 text-white shadow-sm shadow-rose-500/10 animate-pulse" :
                              "bg-emerald-500 text-white shadow-sm"
                            )}>
                              {isLow ? "Low Stock" : "In Stock"}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-850 rounded-xl">
                        No supply listings matched search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Restock Ordering panel - column 3 */}
        <div className="space-y-6">
          {/* Quick procurement dispatcher */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShoppingCart size={16} className="text-blue-500" />
              Procurement Restock Dispatcher
            </h2>
            
            <form onSubmit={handleCreateRestockOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase mb-2">Identify Supply SKU</label>
                <select 
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choose Item SKU --</option>
                  {inventory.map((item, idx) => (
                    <option key={idx} value={item.id}>{item.name} ({item.stock} left)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase mb-2">Restock Target volume</label>
                <input 
                  type="number" 
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white font-mono"
                />
              </div>

              <button type="submit" disabled={!selectedItemId || isOrdering} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer">
                {isOrdering ? (
                  <>
                    <RefreshCw className="animate-spin" size={14} /> Dispatching PO...
                  </>
                ) : (
                  <>
                    Authorize Procurement Order <ArrowUpRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Procure alert success */}
            <AnimatePresence>
              {orderSuccess && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center gap-2 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide leading-relaxed">
                  <CheckCircle2 size={14} className="shrink-0" /> {orderSuccess}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
