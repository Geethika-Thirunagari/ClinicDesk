import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, AlertTriangle, Plus, Search, CheckCircle, PackageSearch, Trash2, Edit2, X, ShoppingCart, RefreshCw, CheckCircle2, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

const ORDERS_STORAGE_KEY = 'clinicdesk_pharmacy_orders';

const computeStatus = (stock, minStock) => {
  if (stock === 0) return 'Critical';
  if (stock <= minStock) return 'Low Stock';
  return 'In Stock';
};

const parsePrice = (price) => parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;

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
  const [inventoryList, setInventoryList] = useState(() => {
    const saved = localStorage.getItem('clinicdesk_pharmacy');
    return saved ? JSON.parse(saved) : inventory;
  });

  useEffect(() => {
    localStorage.setItem('clinicdesk_pharmacy', JSON.stringify(inventoryList));
  }, [inventoryList]);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', category: 'Antibiotics', stock: '', minStock: '', price: '', expiry: '' });

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseCart, setPurchaseCart] = useState([]);
  const [selectedMedId, setSelectedMedId] = useState('');
  const [orderQty, setOrderQty] = useState('');
  const [supplier, setSupplier] = useState('MedSupply Co.');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderMessage, setOrderMessage] = useState({ type: '', text: '' });

  const handleSaveItem = () => {
    const stockVal = parseInt(formData.stock, 10) || 0;
    const minVal = parseInt(formData.minStock, 10) || 0;
    const status = computeStatus(stockVal, minVal);

    if (formData.id) {
      setInventoryList(inventoryList.map(i => i.id === formData.id ? { ...i, ...formData, stock: stockVal, minStock: minVal, status } : i));
    } else {
      const newId = `MED-${100 + inventoryList.length + 1}`;
      const newItem = {
        id: newId,
        name: formData.name || 'Unknown',
        category: formData.category,
        stock: stockVal,
        minStock: minVal,
        price: formData.price.startsWith('$') ? formData.price : `$${formData.price || '0.00'}`,
        expiry: formData.expiry || new Date().toISOString().slice(0, 10),
        status
      };
      setInventoryList([newItem, ...inventoryList]);
    }
    setFormData({ id: null, name: '', category: 'Antibiotics', stock: '', minStock: '', price: '', expiry: '' });
    setShowModal(false);
  };

  const handleEditItem = (item) => {
    setFormData({ id: item.id, name: item.name, category: item.category, stock: item.stock, minStock: item.minStock, price: item.price.replace('$', ''), expiry: item.expiry });
    setShowModal(true);
  };

  const handleDeleteItem = (id) => {
    if (window.confirm("Remove this medicine from inventory?")) {
      setInventoryList(inventoryList.filter(i => i.id !== id));
    }
  };

  const filtered = inventoryList.filter(i =>
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

  const openPurchaseModal = () => {
    setPurchaseCart([]);
    setSelectedMedId('');
    setOrderQty('');
    setSupplier('MedSupply Co.');
    setOrderMessage({ type: '', text: '' });
    setShowPurchaseModal(true);
  };

  const suggestedQty = (item) => {
    if (!item) return 100;
    const deficit = Math.max(0, item.minStock - item.stock);
    return deficit > 0 ? deficit : Math.ceil(item.minStock * 0.5) || 100;
  };

  const handleAddToCart = () => {
    const item = inventoryList.find((i) => i.id === selectedMedId);
    const qty = parseInt(orderQty, 10);
    if (!item || !qty || qty < 1) {
      setOrderMessage({ type: 'error', text: 'Select a medicine and enter a valid quantity.' });
      return;
    }
    setPurchaseCart((prev) => {
      const existing = prev.find((l) => l.id === item.id);
      if (existing) {
        return prev.map((l) =>
          l.id === item.id ? { ...l, qty: l.qty + qty } : l
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          qty,
          unitPrice: parsePrice(item.price),
          priceLabel: item.price,
        },
      ];
    });
    setSelectedMedId('');
    setOrderQty('');
    setOrderMessage({ type: '', text: '' });
  };

  const handleRemoveFromCart = (id) => {
    setPurchaseCart((prev) => prev.filter((l) => l.id !== id));
  };

  const cartTotal = purchaseCart.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);

  const handleSubmitPurchaseOrder = async () => {
    if (purchaseCart.length === 0) {
      setOrderMessage({ type: 'error', text: 'Add at least one item to the order.' });
      return;
    }
    if (!supplier.trim()) {
      setOrderMessage({ type: 'error', text: 'Supplier name is required.' });
      return;
    }

    setIsSubmittingOrder(true);
    setOrderMessage({ type: '', text: '' });

    await new Promise((r) => setTimeout(r, 900));

    setInventoryList((prev) =>
      prev.map((item) => {
        const line = purchaseCart.find((l) => l.id === item.id);
        if (!line) return item;
        const newStock = item.stock + line.qty;
        return {
          ...item,
          stock: newStock,
          status: computeStatus(newStock, item.minStock),
        };
      })
    );

    const orderRecord = {
      id: `PO-${Date.now()}`,
      supplier: supplier.trim(),
      items: purchaseCart,
      total: cartTotal,
      status: 'Received',
      createdAt: new Date().toISOString(),
    };
    const existingOrders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([orderRecord, ...existingOrders]));

    setIsSubmittingOrder(false);
    setOrderMessage({
      type: 'success',
      text: `Purchase order ${orderRecord.id} completed. Stock updated for ${purchaseCart.length} item(s).`,
    });
    setPurchaseCart([]);
    setTimeout(() => {
      setShowPurchaseModal(false);
      setOrderMessage({ type: '', text: '' });
    }, 2000);
  };

  const handleSelectMedForOrder = (medId) => {
    setSelectedMedId(medId);
    const item = inventoryList.find((i) => i.id === medId);
    if (item) setOrderQty(String(suggestedQty(item)));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 font-['Outfit']">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0a1a0f] tracking-tight">Pharmacy Inventory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage medicines, stock levels, and supply chain.</p>
        </div>
        <div className="flex gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openPurchaseModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-xl font-semibold text-sm shadow-md hover:bg-slate-700 transition-all">
            <PackageSearch size={18} /> Purchase Order
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setFormData({ id: null, name: '', category: 'Antibiotics', stock: '', minStock: '', price: '', expiry: '' }); setShowModal(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all">
            <Plus size={18} /> Add Item
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Items" value={inventoryList.length} icon={Pill} color="bg-blue-500" delay={0.1} />
        <StatCard title="Healthy Stock" value={inventoryList.filter(i => i.status === 'In Stock').length} icon={CheckCircle} color="bg-emerald-500" delay={0.15} />
        <StatCard title="Low Stock" value={inventoryList.filter(i => i.status === 'Low Stock').length} icon={AlertTriangle} color="bg-amber-500" delay={0.2} />
        <StatCard title="Critical/Out" value={inventoryList.filter(i => i.status === 'Critical').length} icon={AlertTriangle} color="bg-rose-500" delay={0.25} />
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
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const stockPercent = Math.min(100, Math.round((item.stock / item.minStock) * 100));
                return (
                  <tr key={item.id} className="group border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
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
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); handleEditItem(item); }} className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }} className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <AnimatePresence>
        {showPurchaseModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isSubmittingOrder && setShowPurchaseModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#0a1a0f] flex items-center gap-2">
                    <ShoppingCart size={22} className="text-slate-700" /> Create Purchase Order
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Restock inventory from your supplier. Stock updates when the order is received.</p>
                </div>
                <button type="button" disabled={isSubmittingOrder} onClick={() => setShowPurchaseModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-50">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Supplier</label>
                  <input type="text" value={supplier} onChange={(e) => setSupplier(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Add line item</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <select value={selectedMedId} onChange={(e) => handleSelectMedForOrder(e.target.value)}
                      className="sm:col-span-2 px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="">Select medicine...</option>
                      {inventoryList.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.stock} in stock{item.status !== 'In Stock' ? ` — ${item.status}` : ''})
                        </option>
                      ))}
                    </select>
                    <input type="number" min="1" placeholder="Qty" value={orderQty}
                      onChange={(e) => setOrderQty(e.target.value)}
                      className="px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <button type="button" onClick={handleAddToCart}
                    className="w-full py-2.5 border border-dashed border-blue-300 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                    <Plus size={16} /> Add to order
                  </button>
                </div>

                {inventoryList.filter((i) => i.status !== 'In Stock').length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase w-full">Quick add low stock:</span>
                    {inventoryList.filter((i) => i.status !== 'In Stock').map((item) => (
                      <button key={item.id} type="button"
                        onClick={() => {
                          setSelectedMedId(item.id);
                          setOrderQty(String(suggestedQty(item)));
                        }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100 transition-colors">
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}

                {purchaseCart.length > 0 && (
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="text-left py-2 px-4 text-[10px] font-bold text-slate-400 uppercase">Item</th>
                          <th className="text-right py-2 px-4 text-[10px] font-bold text-slate-400 uppercase">Qty</th>
                          <th className="text-right py-2 px-4 text-[10px] font-bold text-slate-400 uppercase">Subtotal</th>
                          <th className="w-10" />
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseCart.map((line) => (
                          <tr key={line.id} className="border-b border-slate-100 last:border-0">
                            <td className="py-3 px-4 font-semibold text-[#0a1a0f]">{line.name}</td>
                            <td className="py-3 px-4 text-right font-mono">{line.qty}</td>
                            <td className="py-3 px-4 text-right font-semibold">${(line.qty * line.unitPrice).toFixed(2)}</td>
                            <td className="py-3 pr-2">
                              <button type="button" onClick={() => handleRemoveFromCart(line.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50">
                                <Minus size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex justify-between items-center px-4 py-3 bg-slate-50 border-t border-slate-200">
                      <span className="text-xs font-bold text-slate-500 uppercase">Order total</span>
                      <span className="text-lg font-extrabold text-[#0a1a0f]">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {orderMessage.text && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className={cn(
                        'p-3 rounded-xl flex items-center gap-2 text-sm font-semibold',
                        orderMessage.type === 'success' && 'bg-emerald-50 text-emerald-700 border border-emerald-100',
                        orderMessage.type === 'error' && 'bg-rose-50 text-rose-700 border border-rose-100'
                      )}>
                      {orderMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                      {orderMessage.text}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-3 mt-8">
                <button type="button" disabled={isSubmittingOrder} onClick={() => setShowPurchaseModal(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button type="button" disabled={isSubmittingOrder || purchaseCart.length === 0}
                  onClick={handleSubmitPurchaseOrder}
                  className="flex-1 py-3 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  {isSubmittingOrder ? (
                    <><RefreshCw size={18} className="animate-spin" /> Processing...</>
                  ) : (
                    <><PackageSearch size={18} /> Complete purchase</>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#0a1a0f] ">{formData.id ? "Edit Medicine" : "Add New Medicine"}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"><X size={20} /></button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Item Name</label>
                  <input type="text" placeholder="Medicine Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Category</label>
                    <input type="text" placeholder="e.g. Antibiotics" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Expiry Date</label>
                    <input type="date" placeholder="Expiry" value={formData.expiry} onChange={e => setFormData({ ...formData, expiry: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Stock</label>
                    <input type="number" placeholder="0" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Min Stock</label>
                    <input type="number" placeholder="500" value={formData.minStock} onChange={e => setFormData({ ...formData, minStock: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Unit Price</label>
                    <input type="text" placeholder="0.00" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={handleSaveItem} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2">
                  <Plus size={18} /> {formData.id ? "Save Changes" : "Save Item"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminPharmacy;
