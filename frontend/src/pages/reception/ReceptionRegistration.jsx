import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Heart, AlertCircle, ShieldAlert,
  CheckCircle, Users, Stethoscope, ChevronRight, UserPlus2, CalendarDays
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';

const doctorsList = [
  { id: 1, name: 'Dr. Sarah Smith', dept: 'Cardiology' },
  { id: 2, name: 'Dr. Emily Chen', dept: 'Dermatology' },
  { id: 3, name: 'Dr. John Doe', dept: 'Neurology' },
];

const ReceptionRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    email: '',
    phone: '',
    address: '',
    emergencyName: '',
    emergencyRelation: '',
    emergencyPhone: '',
    allergies: '',
    chronicConditions: '',
    immediateCheckIn: false,
    selectedDoctor: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registeredName, setRegisteredName] = useState('');

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{7,15}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid phone number';
    }
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.emergencyName.trim()) newErrors.emergencyName = 'Emergency contact name is required';
    if (!formData.emergencyPhone.trim()) {
      newErrors.emergencyPhone = 'Emergency contact phone is required';
    } else if (!/^\+?[\d\s-]{7,15}$/.test(formData.emergencyPhone)) {
      newErrors.emergencyPhone = 'Enter a valid phone number';
    }
    
    if (formData.immediateCheckIn && !formData.selectedDoctor) {
      newErrors.selectedDoctor = 'Please select a doctor for immediate queue check-in';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear field-specific error
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.getElementsByName(firstErrorKey)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Mock network request
    setRegisteredName(formData.fullName);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      dob: '',
      gender: '',
      bloodGroup: '',
      email: '',
      phone: '',
      address: '',
      emergencyName: '',
      emergencyRelation: '',
      emergencyPhone: '',
      allergies: '',
      chronicConditions: '',
      immediateCheckIn: false,
      selectedDoctor: '',
    });
    setIsSubmitted(false);
    setErrors({});
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="flex items-center justify-center p-4 min-h-[75vh]"
      >
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-xl rounded-3xl p-8 md:p-12 text-center max-w-lg w-full">
          <div className="w-20 h-20 mx-auto bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={36} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white mb-2">Registration Successful!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Patient <strong>{registeredName}</strong> has been successfully registered in the ClinicDesk system.
            {formData.immediateCheckIn && (
              <span className="block mt-2 font-semibold text-blue-600 dark:text-blue-400">
                Added to the live queue for {doctorsList.find(d => d.id === parseInt(formData.selectedDoctor))?.name}.
              </span>
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleReset}
              className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-bold transition-all"
            >
              Register Another
            </button>
            <button 
              onClick={() => navigate(formData.immediateCheckIn ? '/reception/queue' : '/reception/dashboard')}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg shadow-blue-500/20 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-1.5"
            >
              {formData.immediateCheckIn ? <Users size={16} /> : <Stethoscope size={16} />}
              {formData.immediateCheckIn ? 'View Live Queue' : 'Go to Workspace'}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 p-4 lg:p-8 min-h-screen"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Patient Registration</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Register walk-ins and verify basic patient details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Form Fields (Takes up 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Section 1: Personal Details */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6 space-y-4">
              <h2 className="text-md font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <User size={18} className="text-blue-500" /> Personal Details
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name *</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-4 py-2.5 bg-white dark:bg-slate-950 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all",
                      errors.fullName ? "border-rose-500 ring-2 ring-rose-500/10" : "border-slate-200 dark:border-slate-800"
                    )}
                    placeholder="E.g. David Beckham"
                  />
                  {errors.fullName && <p className="text-xs text-rose-500 font-semibold">{errors.fullName}</p>}
                </div>

                {/* Date of Birth */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date of Birth *</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className={cn(
                        "w-full px-4 py-2.5 bg-white dark:bg-slate-950 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all",
                        errors.dob ? "border-rose-500 ring-2 ring-rose-500/10" : "border-slate-200 dark:border-slate-800"
                      )}
                    />
                  </div>
                  {errors.dob && <p className="text-xs text-rose-500 font-semibold">{errors.dob}</p>}
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gender *</label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-4 py-2.5 bg-white dark:bg-slate-950 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all",
                      errors.gender ? "border-rose-500 ring-2 ring-rose-500/10" : "border-slate-200 dark:border-slate-800"
                    )}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  {errors.gender && <p className="text-xs text-rose-500 font-semibold">{errors.gender}</p>}
                </div>

                {/* Blood Group */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Blood Group</label>
                  <select 
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                  >
                    <option value="">Unknown</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Contact Info */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6 space-y-4">
              <h2 className="text-md font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Phone size={18} className="text-blue-500" /> Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number *</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-4 py-2.5 bg-white dark:bg-slate-950 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all",
                      errors.phone ? "border-rose-500 ring-2 ring-rose-500/10" : "border-slate-200 dark:border-slate-800"
                    )}
                    placeholder="E.g. +1 555-0100"
                  />
                  {errors.phone && <p className="text-xs text-rose-500 font-semibold">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-4 py-2.5 bg-white dark:bg-slate-950 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all",
                      errors.email ? "border-rose-500 ring-2 ring-rose-500/10" : "border-slate-200 dark:border-slate-800"
                    )}
                    placeholder="E.g. david@example.com"
                  />
                  {errors.email && <p className="text-xs text-rose-500 font-semibold">{errors.email}</p>}
                </div>

                {/* Address */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Residential Address</label>
                  <textarea 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                    placeholder="Full residential address details..."
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Emergency Contact */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6 space-y-4">
              <h2 className="text-md font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Heart size={18} className="text-blue-500" /> Emergency Contact
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Contact Name */}
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Name *</label>
                  <input 
                    type="text" 
                    name="emergencyName"
                    value={formData.emergencyName}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-4 py-2.5 bg-white dark:bg-slate-950 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all",
                      errors.emergencyName ? "border-rose-500 ring-2 ring-rose-500/10" : "border-slate-200 dark:border-slate-800"
                    )}
                    placeholder="E.g. Victoria Beckham"
                  />
                  {errors.emergencyName && <p className="text-xs text-rose-500 font-semibold">{errors.emergencyName}</p>}
                </div>

                {/* Relationship */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Relationship</label>
                  <select 
                    name="emergencyRelation"
                    value={formData.emergencyRelation}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                  >
                    <option value="">Select Relation</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Child">Child</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Emergency Phone */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Phone *</label>
                  <input 
                    type="tel" 
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-4 py-2.5 bg-white dark:bg-slate-950 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all",
                      errors.emergencyPhone ? "border-rose-500 ring-2 ring-rose-500/10" : "border-slate-200 dark:border-slate-800"
                    )}
                    placeholder="E.g. +1 555-0102"
                  />
                  {errors.emergencyPhone && <p className="text-xs text-rose-500 font-semibold">{errors.emergencyPhone}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Medical Background & Check-in (Takes up 1 column) */}
          <div className="space-y-6">
            
            {/* Medical Background */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6 space-y-4">
              <h2 className="text-md font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <ShieldAlert size={18} className="text-blue-500" /> Medical Background
              </h2>

              {/* Known Allergies */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Known Allergies</label>
                <textarea 
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                  placeholder="E.g. Penicillin, Peanuts (or leave empty)"
                />
              </div>

              {/* Chronic Conditions */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Chronic Conditions</label>
                <textarea 
                  name="chronicConditions"
                  value={formData.chronicConditions}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                  placeholder="E.g. Asthma, Diabetes (or leave empty)"
                />
              </div>
            </div>

            {/* Check-in / Queue Integration */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-md rounded-2xl p-6 space-y-4">
              <h2 className="text-md font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Queue Management
              </h2>

              {/* Toggle immediate check in */}
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  name="immediateCheckIn"
                  checked={formData.immediateCheckIn}
                  onChange={handleChange}
                  className="mt-1 w-4.5 h-4.5 accent-blue-600 dark:bg-slate-950" 
                />
                <div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block">Check In Immediately</span>
                  <span className="text-xs text-slate-400 block mt-0.5">Directly check patient into today's queue after registration.</span>
                </div>
              </label>

              {/* Doctor select (Conditional) */}
              <AnimatePresence>
                {formData.immediateCheckIn && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 overflow-hidden"
                  >
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assign Doctor *</label>
                    <select 
                      name="selectedDoctor"
                      value={formData.selectedDoctor}
                      onChange={handleChange}
                      className={cn(
                        "w-full px-4 py-2.5 bg-white dark:bg-slate-950 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all",
                        errors.selectedDoctor ? "border-rose-500" : "border-slate-200 dark:border-slate-800"
                      )}
                    >
                      <option value="">Select Doctor</option>
                      {doctorsList.map(doc => (
                        <option key={doc.id} value={doc.id}>{doc.name} ({doc.dept})</option>
                      ))}
                    </select>
                    {errors.selectedDoctor && <p className="text-xs text-rose-500 font-semibold">{errors.selectedDoctor}</p>}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg shadow-blue-500/20 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all mt-4"
              >
                <UserPlus2 size={18} />
                Register New Patient
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ReceptionRegistration;
