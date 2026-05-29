import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Trash2, CreditCard, CheckCircle, Download, 
  User, DollarSign, FileText, Printer, X, PlusCircle, Receipt, Percent
} from 'lucide-react';
import { cn } from '../../utils/cn';

const mockPatients = [
  { id: 'PT-1024', name: 'Alice Johnson', age: 28, gender: 'Female', email: 'alice@example.com', phone: '+1 555-0192' },
  { id: 'PT-2910', name: 'Robert Williams', age: 45, gender: 'Male', email: 'robert@example.com', phone: '+1 555-0348' },
  { id: 'PT-8821', name: 'Maria Garcia', age: 34, gender: 'Female', email: 'maria@example.com', phone: '+1 555-0811' },
  { id: 'PT-4491', name: 'David Lee', age: 52, gender: 'Male', email: 'david@example.com', phone: '+1 555-0239' },
  { id: 'PT-1122', name: 'Emma Brown', age: 19, gender: 'Female', email: 'emma@example.com', phone: '+1 555-0672' },
];

const presetItems = [
  { id: 'item-1', name: 'General Consultation', category: 'Consultation', price: 150 },
  { id: 'item-2', name: 'Specialist Consultation', category: 'Consultation', price: 300 },
  { id: 'item-3', name: 'Complete Blood Count (CBC)', category: 'Laboratory', price: 75 },
  { id: 'item-4', name: 'Lipid Panel Test', category: 'Laboratory', price: 120 },
  { id: 'item-5', name: 'Chest X-Ray', category: 'Imaging', price: 200 },
  { id: 'item-6', name: 'Amoxicillin 500mg (10 tabs)', category: 'Pharmacy', price: 45 },
  { id: 'item-7', name: 'Paracetamol 650mg (20 tabs)', category: 'Pharmacy', price: 15 },
  { id: 'item-8', name: 'Electrocardiogram (ECG)', category: 'Diagnostics', price: 180 },
];

const ReceptionBilling = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const [billingItems, setBillingItems] = useState([
    { ...presetItems[0], quantity: 1 }
  ]);
  const [discount, setDiscount] = useState(0);
  const [taxRate] = useState(0.05); // 5% Flat Tax
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
  const [isPaid, setIsPaid] = useState(false);

  // Filter patients based on query
  const filteredPatients = mockPatients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setSearchQuery(patient.name);
    setShowDropdown(false);
  };

  const handleAddItem = (item) => {
    const existing = billingItems.find(i => i.id === item.id);
    if (existing) {
      setBillingItems(billingItems.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setBillingItems([...billingItems, { ...item, quantity: 1 }]);
    }
  };

  const handleUpdateQty = (itemId, qty) => {
    if (qty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setBillingItems(billingItems.map(i => 
      i.id === itemId ? { ...i, quantity: qty } : i
    ));
  };

  const handleRemoveItem = (itemId) => {
    setBillingItems(billingItems.filter(i => i.id !== itemId));
  };

  // Calculations
  const subtotal = billingItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * taxRate;
  const total = taxableAmount + taxAmount;

  const handleGenerateInvoice = () => {
    if (!selectedPatient) return;
    const rand = Math.floor(100000 + Math.random() * 900000);
    setInvoiceId(`INV-${rand}`);
    setIsPaid(false);
    setIsInvoiceModalOpen(true);
  };

  const handlePay = () => {
    setIsPaid(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 font-['Outfit']"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0a1a0f] tracking-tight">Billing & Invoices</h1>
        <p className="text-sm text-slate-500 mt-1">Generate receipts, process payments, and manage patient invoices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left / Center Panel - Patient and Billing Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Selector */}
          <div className="cd-card p-6">
            <h2 className="text-md font-bold text-[#0a1a0f] mb-4 flex items-center gap-2">
              <User size={18} className="text-blue-500" /> Select Patient
            </h2>
            
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search patient by name or ID (e.g. Alice)..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all "
                />
                {selectedPatient && (
                  <button 
                    onClick={() => {
                      setSelectedPatient(null);
                      setSearchQuery('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 :text-slate-200"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Dropdown list */}
              <AnimatePresence>
                {showDropdown && searchQuery && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute z-20 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg max-h-52 overflow-y-auto"
                  >
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleSelectPatient(p)}
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 :bg-slate-800 transition-colors flex items-center justify-between border-b border-slate-50 last:border-b-0"
                        >
                          <div>
                            <span className="font-bold text-sm text-[#0a1a0f] ">{p.name}</span>
                            <span className="text-xs text-slate-400 ml-2 font-mono">{p.id}</span>
                          </div>
                          <span className="text-xs text-slate-500 font-semibold">{p.gender}, {p.age} yrs</span>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-slate-400 font-medium">No patients found</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Selected Patient Mini Card */}
            {selectedPatient && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex flex-col sm:flex-row justify-between gap-4"
              >
                <div>
                  <h4 className="font-extrabold text-sm text-[#0a1a0f] ">{selectedPatient.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">ID: <span className="font-mono font-bold text-blue-600 ">{selectedPatient.id}</span> • Email: {selectedPatient.email}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-slate-500 ">Phone: {selectedPatient.phone}</p>
                  <p className="text-xs font-semibold text-slate-500 mt-1">{selectedPatient.gender} • {selectedPatient.age} yrs old</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Preset Services Selector */}
          <div className="cd-card p-6">
            <h2 className="text-md font-bold text-[#0a1a0f] mb-4">Add Items / Services</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {presetItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleAddItem(item)}
                  className="p-3 bg-slate-50 hover:bg-blue-50 :bg-blue-500/5 border border-slate-100 hover:border-blue-200 :border-blue-500/20 rounded-xl text-left transition-all flex flex-col justify-between h-24 group"
                >
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">{item.category}</span>
                    <span className="text-xs font-bold text-slate-700 line-clamp-2 leading-tight group-hover:text-blue-600 :text-blue-400">{item.name}</span>
                  </div>
                  <div className="flex items-center justify-between w-full mt-2">
                    <span className="text-sm font-extrabold text-[#0a1a0f] ">${item.price}</span>
                    <PlusCircle size={16} className="text-slate-400 group-hover:text-blue-500 :text-blue-400 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Invoice Items list */}
          <div className="cd-card p-6 overflow-hidden">
            <h2 className="text-md font-bold text-[#0a1a0f] mb-4 flex items-center gap-2">
              <Receipt size={18} className="text-blue-500" /> Invoice Line Items
            </h2>

            {billingItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50 ">
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Item Details</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Unit Price</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center w-24">Qty</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Total</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center w-12">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence initial={false}>
                      {billingItems.map(item => (
                        <motion.tr 
                          key={item.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-b border-slate-100 hover:bg-slate-50/40 :bg-slate-800/40"
                        >
                          <td className="px-4 py-3.5">
                            <span className="text-xs font-bold text-slate-400 block mb-0.5">{item.category}</span>
                            <span className="text-sm font-bold text-slate-700 ">{item.name}</span>
                          </td>
                          <td className="px-4 py-3.5 text-center text-sm text-slate-700 font-semibold">${item.price}</td>
                          <td className="px-4 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5 border border-slate-200 bg-white rounded-lg p-1 w-20 mx-auto">
                              <button 
                                onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                                className="text-slate-400 hover:text-slate-600 :text-slate-200 font-bold px-1.5"
                              >
                                -
                              </button>
                              <span className="text-sm font-bold text-[#0a1a0f] select-none">{item.quantity}</span>
                              <button 
                                onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                                className="text-slate-400 hover:text-slate-600 :text-slate-200 font-bold px-1.5"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-right text-sm font-extrabold text-[#0a1a0f] ">
                            ${item.price * item.quantity}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <button 
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 :bg-rose-500/10 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                No items in the invoice list. Select preset services from above.
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Summary and Checkout */}
        <div className="bg-white border-[#e2e8e2] shadow-md rounded-[24px] p-6 space-y-6">
          <h2 className="text-md font-bold text-[#0a1a0f] flex items-center gap-2 border-b border-slate-100 pb-3">
            <DollarSign size={18} className="text-blue-500" /> Summary
          </h2>

          <div className="space-y-3.5">
            <div className="flex justify-between text-sm text-slate-500 ">
              <span>Subtotal</span>
              <span className="font-semibold text-[#0a1a0f] ">${subtotal}</span>
            </div>

            {/* Discount field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <Percent size={12} /> Discount (%)
              </label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  min="0" 
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 "
                />
              </div>
            </div>

            <div className="flex justify-between text-sm text-slate-500 ">
              <span>Discount ({discount}%)</span>
              <span className="font-semibold text-rose-500">-${discountAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm text-slate-500 ">
              <span>Tax (5.0%)</span>
              <span className="font-semibold text-[#0a1a0f] ">${taxAmount.toFixed(2)}</span>
            </div>

            <div className="border-t border-slate-200 my-2 pt-3 flex justify-between">
              <span className="font-extrabold text-[#0a1a0f] ">Grand Total</span>
              <span className="font-extrabold text-lg text-blue-600 ">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 pt-3 border-t border-slate-100 ">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
              <CreditCard size={12} /> Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Cash', 'Card', 'UPI', 'Insurance'].map(method => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={cn(
                    "py-2 rounded-xl text-xs font-bold border transition-all text-center",
                    paymentMethod === method 
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={handleGenerateInvoice}
            disabled={!selectedPatient || billingItems.length === 0}
            className={cn(
              "w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all shadow-md mt-6 flex items-center justify-center gap-2",
              selectedPatient && billingItems.length > 0
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg shadow-blue-500/20"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            )}
          >
            <FileText size={18} />
            Generate Invoice Receipt
          </button>
        </div>
      </div>

      {/* Invoice Modal Overlay */}
      <AnimatePresence>
        {isInvoiceModalOpen && selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInvoiceModalOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />

            {/* Content Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden relative shadow-2xl z-10 p-6 md:p-8"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsInvoiceModalOpen(false)}
                className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 :bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>

              {/* Receipt Body */}
              <div className="space-y-6">
                {/* Header info */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">+</div>
                      <span className="font-extrabold text-base text-[#0a1a0f] ">ClinicDesk Inc.</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">100 Healthcare Dr, New York, NY 10001<br/>support@clinicdesk.com</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      Invoice
                    </span>
                    <p className="text-xs font-mono font-bold text-slate-700 mt-2">{invoiceId}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Date: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Patient / Payment Summary */}
                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-[24px]">
                  <div>
                    <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[9px] mb-1">Billed To</h5>
                    <p className="font-extrabold text-[#0a1a0f] ">{selectedPatient.name}</p>
                    <p className="text-slate-500 mt-0.5">ID: {selectedPatient.id}</p>
                    <p className="text-slate-500 ">Phone: {selectedPatient.phone}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[9px] mb-1">Payment info</h5>
                    <p className="font-semibold text-slate-700 ">Method: {paymentMethod}</p>
                    <p className="font-semibold text-slate-700 ">Tax: Flat 5.0%</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="font-bold text-slate-500">Status:</span>
                      <span className={cn(
                        "font-extrabold uppercase text-[9px] px-2 py-0.5 rounded-full",
                        isPaid 
                          ? "bg-emerald-100 text-emerald-700 "
                          : "bg-amber-100 text-amber-700 "
                      )}>
                        {isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Receipt Line Items Table */}
                <div className="max-h-48 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-2">Description</th>
                        <th className="pb-2 text-center">Unit Price</th>
                        <th className="pb-2 text-center">Qty</th>
                        <th className="pb-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billingItems.map(item => (
                        <tr key={item.id} className="border-b border-slate-100 ">
                          <td className="py-2.5 font-bold text-slate-700 ">{item.name}</td>
                          <td className="py-2.5 text-center text-slate-600 ">${item.price}</td>
                          <td className="py-2.5 text-center text-slate-600 ">{item.quantity}</td>
                          <td className="py-2.5 text-right font-bold text-[#0a1a0f] ">${item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total break downs */}
                <div className="flex flex-col items-end gap-1.5 border-t border-slate-100 pt-4 text-xs">
                  <div className="flex justify-between w-48 text-slate-500">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-700 ">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-48 text-slate-500">
                    <span>Discount ({discount}%):</span>
                    <span className="font-semibold text-rose-500">-${discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-48 text-slate-500">
                    <span>Tax:</span>
                    <span className="font-semibold text-slate-700 ">${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-48 border-t border-slate-200 pt-1.5 text-sm font-extrabold">
                    <span className="text-[#0a1a0f] ">Amount Due:</span>
                    <span className="text-blue-600 ">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 ">
                  <button 
                    onClick={() => {
                      window.print();
                    }}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 :bg-slate-700 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Printer size={15} /> Print Receipt
                  </button>
                  <button 
                    onClick={() => {
                      alert('Downloaded PDF receipt! (Mock)');
                    }}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 :bg-slate-700 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Download size={15} /> Download PDF
                  </button>
                  {!isPaid ? (
                    <button 
                      onClick={handlePay}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={15} /> Record Payment
                    </button>
                  ) : (
                    <div className="flex-1 bg-emerald-50 border border-emerald-200 text-emerald-600 py-2.5 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-1.5">
                      <CheckCircle size={15} /> Success: Paid
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReceptionBilling;
