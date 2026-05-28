import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Banknote,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  DollarSign,
  Wallet,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "../../utils/cn";
const revenueData = [
  { name: "Jan", revenue: 45000, expenses: 32000 },
  { name: "Feb", revenue: 52000, expenses: 34000 },
  { name: "Mar", revenue: 48000, expenses: 33000 },
  { name: "Apr", revenue: 61000, expenses: 36000 },
  { name: "May", revenue: 59000, expenses: 35000 },
  { name: "Jun", revenue: 67000, expenses: 38000 },
  { name: "Jul", revenue: 72000, expenses: 40000 },
  { name: "Aug", revenue: 75000, expenses: 41000 },
  { name: "Sep", revenue: 68000, expenses: 39000 },
  { name: "Oct", revenue: 82000, expenses: 43000 },
  { name: "Nov", revenue: 85000, expenses: 44000 },
  { name: "Dec", revenue: 91000, expenses: 46000 },
];
const departmentData = [
  { name: "Cardiology", value: 340000, color: "#0a1a0f" },
  { name: "Neurology", value: 280000, color: "#10b981" },
  { name: "Pediatrics", value: 210000, color: "#34d399" },
  { name: "Orthopedics", value: 195000, color: "#6ee7b7" },
  { name: "Dermatology", value: 150000, color: "#a7f3d0" },
];
const transactions = [
  {
    id: "TX-901",
    date: "March 21, 9:42am",
    patient: "Alice Johnson",
    description: "Consultation - Cardiology",
    amount: 150,
    status: "Completed",
    method: "Credit Card",
  },
  {
    id: "TX-902",
    date: "March 16, 1:18pm",
    patient: "Robert Williams",
    description: "MRI Scan",
    amount: 850,
    status: "Completed",
    method: "Insurance",
  },
  {
    id: "TX-903",
    date: "March 16, 10:01am",
    patient: "Maria Garcia",
    description: "Blood Test Panel",
    amount: 120,
    status: "Pending",
    method: "Cash",
  },
  {
    id: "TX-904",
    date: "March 15, 2:20pm",
    patient: "David Lee",
    description: "Orthopedics",
    amount: 150,
    status: "Failed",
    method: "Credit Card",
  },
  {
    id: "TX-905",
    date: "March 15, 11:45am",
    patient: "Emma Brown",
    description: "Vaccination",
    amount: 80,
    status: "Completed",
    method: "Debit Card",
  },
];
const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  isPositive,
  delay,
  isPrimary,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className={cn(
      "p-6 rounded-[28px] relative overflow-hidden transition-all flex flex-col justify-between h-[150px]",
      isPrimary
        ? "bg-[#0a1a0f] text-white shadow-xl shadow-emerald-900/10"
        : "bg-white border border-[#e2e8e2] text-[#0a1a0f] hover:border-emerald-200",
    )}
  >
    {" "}
    <div className="flex justify-between items-start">
      {" "}
      <div className="flex items-center gap-2">
        {" "}
        <Icon
          size={16}
          className={isPrimary ? "text-emerald-400" : "text-emerald-500"}
        />{" "}
        <p
          className={cn(
            "text-[10px] font-bold uppercase tracking-widest",
            isPrimary ? "text-slate-300" : "text-slate-400",
          )}
        >
          {title}
        </p>{" "}
      </div>{" "}
      <button
        className={cn(
          "opacity-50 hover:opacity-100 transition-opacity",
          isPrimary ? "text-white" : "text-slate-400",
        )}
      >
        <MoreHorizontal size={16} />
      </button>{" "}
    </div>{" "}
    <div>
      {" "}
      <h3 className="text-3xl font-black tracking-tight">{value}</h3>{" "}
      <div className="flex items-center gap-2 mt-2">
        {" "}
        <div
          className={cn(
            "flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-lg",
            isPositive && isPrimary
              ? "bg-emerald-500/20 text-emerald-400"
              : isPositive && !isPrimary
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600",
          )}
        >
          {" "}
          {isPositive ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}{" "}
          {trend}{" "}
        </div>{" "}
        <span
          className={cn(
            "text-[10px] font-bold",
            isPrimary ? "text-slate-400" : "text-slate-400",
          )}
        >
          vs last month
        </span>{" "}
      </div>{" "}
    </div>{" "}
  </motion.div>
);
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 shadow-xl rounded-[24px] p-4 min-w-[140px]">
        {" "}
        <p className="text-sm font-black text-[#0a1a0f] mb-3">{label}</p>{" "}
        {payload.map((p, i) => (
          <div key={i} className="flex justify-between items-center gap-4 mb-1">
            {" "}
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {p.name}
            </span>{" "}
            <span className="text-xs font-black" style={{ color: p.color }}>
              ${p.value.toLocaleString()}
            </span>{" "}
          </div>
        ))}{" "}
      </div>
    );
  }
  return null;
};
const AdminRevenue = () => {
  const [dateRange, setDateRange] = useState("This Year");
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 font-['Outfit']"
    >
      {" "}
      {/* Header */}{" "}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {" "}
        <div>
          {" "}
          <h1 className="text-2xl font-black tracking-tight text-[#0a1a0f]">
            Finance Overview
          </h1>{" "}
          <p className="text-sm font-medium text-slate-400 mt-0.5">
            Here is your financial portfolio for {dateRange.toLowerCase()}
          </p>{" "}
        </div>{" "}
        <div className="flex items-center gap-3">
          {" "}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:border-emerald-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] cursor-pointer hover:bg-slate-50 transition-colors"
          >
            {" "}
            <option>This Month</option> <option>Last Quarter</option>{" "}
            <option>This Year</option> <option>All Time</option>{" "}
          </select>{" "}
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-emerald-200 hover:text-emerald-600 transition-all"
          >
            {" "}
            <Download size={14} /> Export CSV{" "}
          </motion.button>{" "}
        </div>{" "}
      </div>{" "}
      {/* Stats Row */}{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {" "}
        <StatCard
          title="Total Revenue"
          value="$2,450,800.50"
          icon={Banknote}
          trend="+5.2%"
          isPositive={true}
          isPrimary={true}
          delay={0.1}
        />{" "}
        <StatCard
          title="Total Expenses"
          value="$850,000.12"
          icon={Wallet}
          trend="+3.6%"
          isPositive={false}
          delay={0.15}
        />{" "}
        <StatCard
          title="Net Profit"
          value="$721,480.13"
          icon={DollarSign}
          trend="+8.3%"
          isPositive={true}
          delay={0.2}
        />{" "}
        <StatCard
          title="Pending Payments"
          value="$24,500.00"
          icon={Calendar}
          trend="-2.1%"
          isPositive={true}
          delay={0.25}
        />{" "}
      </div>{" "}
      {/* Charts Row */}{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {" "}
        {/* Revenue Trend */}{" "}
        <div className="lg:col-span-2 finai-card p-6 h-[380px] flex flex-col">
          {" "}
          <div className="flex items-center justify-between mb-6">
            {" "}
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Revenue & Expenses Trend
            </h2>{" "}
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-emerald-500">
              Details
            </span>{" "}
          </div>{" "}
          <div className="flex-1 w-full -ml-4">
            {" "}
            <ResponsiveContainer width="100%" height="100%">
              {" "}
              <AreaChart
                data={revenueData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                {" "}
                <defs>
                  {" "}
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    {" "}
                    <stop
                      offset="5%"
                      stopColor="#10b981"
                      stopOpacity={0.2}
                    />{" "}
                    <stop
                      offset="95%"
                      stopColor="#10b981"
                      stopOpacity={0}
                    />{" "}
                  </linearGradient>{" "}
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    {" "}
                    <stop
                      offset="5%"
                      stopColor="#f43f5e"
                      stopOpacity={0.1}
                    />{" "}
                    <stop
                      offset="95%"
                      stopColor="#f43f5e"
                      stopOpacity={0}
                    />{" "}
                  </linearGradient>{" "}
                </defs>{" "}
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#e2e8e2"
                />{" "}
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />{" "}
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />{" "}
                <Tooltip content={<CustomTooltip />} />{" "}
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />{" "}
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#f43f5e"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorExp)"
                />{" "}
              </AreaChart>{" "}
            </ResponsiveContainer>{" "}
          </div>{" "}
        </div>{" "}
        {/* Dept Revenue */}{" "}
        <div className="finai-card p-6 h-[380px] flex flex-col">
          {" "}
          <div className="flex items-center justify-between mb-8">
            {" "}
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Revenue by Department
            </h2>{" "}
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-emerald-500">
              View All
            </span>{" "}
          </div>{" "}
          <div className="flex-1 w-full space-y-4">
            {" "}
            {departmentData.map((d, i) => {
              const maxVal = departmentData[0].value;
              const pct = (d.value / maxVal) * 100;
              return (
                <div key={i} className="space-y-1.5 group cursor-pointer">
                  {" "}
                  <div className="flex justify-between items-center text-xs font-bold">
                    {" "}
                    <span className="text-slate-600 group-hover:text-[#0a1a0f] transition-colors">
                      {d.name}
                    </span>{" "}
                    <span className="text-[#0a1a0f]">
                      ${d.value.toLocaleString()}
                    </span>{" "}
                  </div>{" "}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    {" "}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: d.color }}
                    />{" "}
                  </div>{" "}
                </div>
              );
            })}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Transactions Table */}{" "}
      <div className="finai-card overflow-hidden">
        {" "}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          {" "}
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Recent Transactions
          </h2>{" "}
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-emerald-500">
            View All
          </span>{" "}
        </div>{" "}
        <div className="overflow-x-auto">
          {" "}
          <table className="w-full text-left">
            {" "}
            <thead>
              {" "}
              <tr className="bg-slate-50/50">
                {" "}
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                  Transaction Info
                </th>{" "}
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                  Amount
                </th>{" "}
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap text-right">
                  Status
                </th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody>
              {" "}
              {transactions.map((tx, i) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  {" "}
                  <td className="px-6 py-4">
                    {" "}
                    <div className="flex items-center gap-4">
                      {" "}
                      <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform group-hover:border-emerald-200">
                        {" "}
                        <Banknote
                          size={16}
                          className="text-slate-400 group-hover:text-emerald-600"
                        />{" "}
                      </div>{" "}
                      <div>
                        {" "}
                        <p className="font-bold text-sm text-slate-900">
                          {tx.description}
                        </p>{" "}
                        <p className="text-[10px] font-bold text-slate-400 tracking-wide mt-0.5">
                          {tx.date}
                        </p>{" "}
                      </div>{" "}
                    </div>{" "}
                  </td>{" "}
                  <td className="px-6 py-4">
                    {" "}
                    <p
                      className={cn(
                        "text-sm font-black",
                        tx.status === "Failed"
                          ? "text-slate-900"
                          : "text-emerald-600",
                      )}
                    >
                      {" "}
                      {tx.status === "Failed" ? "-" : "+"}$
                      {tx.amount.toLocaleString()}{" "}
                    </p>{" "}
                  </td>{" "}
                  <td className="px-6 py-4 text-right">
                    {" "}
                    <span
                      className={cn(
                        "text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-widest inline-flex",
                        tx.status === "Completed"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : tx.status === "Pending"
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : "bg-slate-50 text-slate-500 border-slate-200",
                      )}
                    >
                      {" "}
                      {tx.status}{" "}
                    </span>{" "}
                  </td>{" "}
                </motion.tr>
              ))}{" "}
            </tbody>{" "}
          </table>{" "}
        </div>{" "}
      </div>{" "}
    </motion.div>
  );
};
export default AdminRevenue;
