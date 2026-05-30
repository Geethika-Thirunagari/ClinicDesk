import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  Search,
  Plus,
  MoreVertical,
  Star,
  Calendar,
  Users,
  Activity,
  X,
  Phone,
  Mail,
  Clock,
  Filter,
  ChevronDown,
  Trash2,
  Edit2,
} from "lucide-react";
import { cn } from "../../utils/cn";
const initialDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Smith",
    specialty: "Cardiologist",
    status: "Active",
    patients: 248,
    rating: 4.9,
    exp: "12 yrs",
    phone: "+1 555-0101",
    email: "sarah@clinicdesk.com",
    schedule: "Mon-Fri",
  },
  {
    id: 2,
    name: "Dr. John Doe",
    specialty: "Neurologist",
    status: "Active",
    patients: 192,
    rating: 4.7,
    exp: "8 yrs",
    phone: "+1 555-0102",
    email: "john@clinicdesk.com",
    schedule: "Mon-Sat",
  },
  {
    id: 3,
    name: "Dr. Emily Chen",
    specialty: "Pediatrician",
    status: "On Leave",
    patients: 310,
    rating: 4.8,
    exp: "15 yrs",
    phone: "+1 555-0103",
    email: "emily@clinicdesk.com",
    schedule: "Tue-Sat",
  },
  {
    id: 4,
    name: "Dr. Michael Brown",
    specialty: "Orthopedic",
    status: "Active",
    patients: 175,
    rating: 4.6,
    exp: "10 yrs",
    phone: "+1 555-0104",
    email: "michael@clinicdesk.com",
    schedule: "Mon-Fri",
  },
  {
    id: 5,
    name: "Dr. Lisa Wang",
    specialty: "Dermatologist",
    status: "Active",
    patients: 220,
    rating: 4.9,
    exp: "7 yrs",
    phone: "+1 555-0105",
    email: "lisa@clinicdesk.com",
    schedule: "Wed-Sun",
  },
  {
    id: 6,
    name: "Dr. James Wilson",
    specialty: "General",
    status: "Inactive",
    patients: 89,
    rating: 4.3,
    exp: "5 yrs",
    phone: "+1 555-0106",
    email: "james@clinicdesk.com",
    schedule: "Mon-Thu",
  },
];
const specialties = [
  "All",
  "Cardiologist",
  "Neurologist",
  "Pediatrician",
  "Orthopedic",
  "Dermatologist",
  "General",
];
const statuses = ["All", "Active", "On Leave", "Inactive"];
const StatCard = ({ title, value, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="cd-card p-5 relative overflow-hidden group hover:border-emerald-200 transition-all"
  >

    <div className="flex items-center justify-between">

      <div>

        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">
          {title}
        </p>
        <h3 className="text-2xl font-black text-[#0a1a0f]">{value}</h3>
      </div>
      <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-all">

        <Icon size={20} />
      </div>
    </div>
  </motion.div>
);
const AdminDoctors = () => {
  const location = useLocation();
  const [doctorsList, setDoctorsList] = useState(() => {
    const saved = localStorage.getItem("clinicdesk_doctors");
    return saved ? JSON.parse(saved) : initialDoctors;
  });

  useEffect(() => {
    localStorage.setItem("clinicdesk_doctors", JSON.stringify(doctorsList));
  }, [doctorsList]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (location.state?.search) {
      setSearch(location.state.search);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    specialty: "Cardiologist",
    experience: "",
  });

  const handleSaveDoctor = () => {
    if (formData.id) {
      // Edit mode
      setDoctorsList(doctorsList.map(d => d.id === formData.id ? { ...d, ...formData, exp: formData.experience } : d));
    } else {
      // Add mode
      const newId = doctorsList.length > 0 ? Math.max(...doctorsList.map(d => d.id)) + 1 : 1;
      const newDoc = {
        id: newId,
        name: formData.name || "Unknown Doctor",
        specialty: formData.specialty,
        status: "Active",
        patients: 0,
        rating: 5.0,
        exp: formData.experience || "1 yr",
        phone: formData.phone || "N/A",
        email: formData.email || "N/A",
        schedule: "Mon-Fri",
      };
      setDoctorsList([newDoc, ...doctorsList]);
    }
    setFormData({ id: null, name: "", email: "", phone: "", specialty: "Cardiologist", experience: "" });
    setShowModal(false);
  };

  const handleEditDoctor = (doc) => {
    setFormData({
      id: doc.id,
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      specialty: doc.specialty,
      experience: doc.exp,
    });
    setShowModal(true);
  };

  const handleDeleteDoctor = (id) => {
    if (window.confirm("Are you sure you want to remove this physician?")) {
      setDoctorsList(doctorsList.filter(d => d.id !== id));
    }
  };

  const filtered = doctorsList.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty =
      specialtyFilter === "All" || d.specialty === specialtyFilter;
    const matchStatus = statusFilter === "All" || d.status === statusFilter;
    return matchSearch && matchSpecialty && matchStatus;
  });
  const statusStyle = (s) => {
    if (s === "Active")
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-100",
      };
    if (s === "On Leave")
      return {
        bg: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-100",
      };
    return {
      bg: "bg-slate-50",
      text: "text-slate-500",
      border: "border-slate-200",
    };
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 font-['Outfit']"
    >

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <div>

          <h1
            className="text-2xl font-black tracking-tight"
            style={{
              background: "linear-gradient(90deg, #34d399, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >

            Doctor Faculty
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-0.5">
            Manage doctor profiles and department assignments.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({ id: null, name: "", email: "", phone: "", specialty: "Cardiologist", experience: "" });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-[#0a1a0f] text-white rounded-[24px] font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >

          <Plus size={14} strokeWidth={3} /> Add New Doctor
        </button>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="Total Doctors"
          value={doctorsList.length}
          icon={Stethoscope}
          delay={0.1}
        />
        <StatCard
          title="Active Today"
          value={doctorsList.filter(d => d.status === "Active").length}
          icon={Activity}
          delay={0.15}
        />
        <StatCard title="On Leave" value={doctorsList.filter(d => d.status === "On Leave").length} icon={Clock} delay={0.2} />
        <StatCard
          title="Avg Rating"
          value="4.7"
          icon={Star}
          delay={0.25}
        />
      </div>
      {/* Filters Bar */}
      <div className="cd-card p-4">

        <div className="flex flex-col md:flex-row gap-4">

          <div className="relative flex-1 group">

            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-emerald-200 transition-all"
            />
          </div>
          <div className="flex gap-4">

            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 outline-none focus:bg-white focus:border-emerald-200"
            >

              {specialties.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All Specialties" : s}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 outline-none focus:bg-white focus:border-emerald-200"
            >

              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All Status" : s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Doctor Table - The Real ClinicDesk Look */}
      <div className="cd-card overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>

              <tr className="bg-slate-50/50">

                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Doctor
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Specialty
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Patients
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Rating
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Schedule
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>

              {filtered.map((doc, i) => {
                const style = statusStyle(doc.status);
                return (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-xs text-[#0a1a0f] shrink-0 group-hover:scale-110 transition-transform">

                          {doc.name
                            .split(" ")
                            .slice(1)
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>

                          <p className="font-bold text-sm text-[#0a1a0f]">
                            {doc.name}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {doc.exp}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-slate-500">
                      {doc.specialty}
                    </td>
                    <td className="px-6 py-5">

                      <span
                        className={cn(
                          "text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest",
                          style.bg,
                          style.text,
                          style.border,
                        )}
                      >

                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-black text-[#0a1a0f]">
                      {doc.patients}
                    </td>
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded-lg w-fit border border-amber-100">

                        <Star
                          size={10}
                          className="text-amber-500 fill-amber-500"
                        />
                        <span className="text-[10px] font-black text-amber-700">
                          {doc.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">

                        <Clock size={12} className="text-slate-300" />
                        {doc.schedule}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">

                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditDoctor(doc); }}
                          className="p-2 rounded-xl text-slate-400 hover:text-[#0a1a0f] hover:bg-white border border-transparent hover:border-slate-100 transition-all"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteDoctor(doc.id); }}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-20 text-center">

            <Stethoscope
              size={48}
              className="mx-auto mb-4 text-slate-200"
            />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">
              No Physicians Found
            </p>
          </div>
        )}
      </div>
      {/* Add Doctor Modal */}
      <AnimatePresence>

        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/5 index-50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
            onClick={() => setShowModal(false)}
          >

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-[#e2e8e2] rounded-[32px] shadow-2xl w-full max-w-lg p-10"
            >

              <div className="flex items-center justify-between mb-8">

                <div>

                  <h2 className="text-2xl font-black text-[#0a1a0f] tracking-tight">
                    {formData.id ? "Edit Physician Profile" : "Onboard New Physician"}
                  </h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {formData.id ? "Update credentials" : "Create credentials"}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors"
                >

                  <X size={20} />
                </button>
              </div>
              <div className="space-y-5">

                <div>

                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                    Full Professional Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Adam G."
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-[24px] text-sm font-bold outline-none focus:bg-white focus:border-emerald-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">

                  <div>

                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="official@clinic.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-[24px] text-sm font-bold outline-none focus:bg-white focus:border-emerald-200"
                    />
                  </div>
                  <div>

                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                      Department
                    </label>
                    <select
                      value={formData.specialty}
                      onChange={(e) =>
                        setFormData({ ...formData, specialty: e.target.value })
                      }
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-[24px] text-sm font-bold outline-none focus:bg-white focus:border-emerald-200"
                    >

                      {specialties
                        .filter((s) => s !== "All")
                        .map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-10">

                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 border border-slate-100 rounded-[24px] text-[10px] font-black text-slate-400 hover:bg-slate-50 uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDoctor}
                  className="flex-1 py-4 bg-[#0a1a0f] text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {formData.id ? "Save Changes" : "Onboard Physician"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
export default AdminDoctors;
