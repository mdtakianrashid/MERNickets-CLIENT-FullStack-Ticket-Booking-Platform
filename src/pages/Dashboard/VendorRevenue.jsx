import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Spinner from "../../components/Spinner";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid
} from "recharts";
import { 
  BanknotesIcon, 
  TicketIcon, 
  ChartBarIcon, 
  PresentationChartLineIcon 
} from "@heroicons/react/24/outline";

export default function VendorRevenue() {
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axiosSecure.get("/bookings/vendor/revenue").then(res => {
      setStats(res.data);
    });
  }, [axiosSecure]);

  if (!stats) return <Spinner className="h-[60vh]" />;

  const barData = [
    { name: "Revenue", value: stats.revenue, fill: "#8b5cf6" },
    { name: "Sold", value: stats.ticketsSold, fill: "#3b82f6" },
    { name: "Total", value: stats.ticketsAdded, fill: "#10b981" },
  ];

  const pieData = [
    { name: "Sold", value: stats.ticketsSold },
    { name: "Available", value: Math.max(0, stats.ticketsAdded - stats.ticketsSold) },
  ];

  const PIE_COLORS = ["#3b82f6", "#e5e7eb"];
  const PIE_COLORS_DARK = ["#60a5fa", "#374151"];
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 p-1">
      
      <div className="flex items-center gap-3 mb-6">
        <PresentationChartLineIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Revenue Overview</h2>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-3 gap-6"
      >
        <StatCard 
          title="Total Revenue" 
          value={`৳${stats.revenue}`} 
          icon={<BanknotesIcon className="w-8 h-8 text-white" />}
          gradient="from-purple-600 to-indigo-600"
          delay={0}
        />
        <StatCard 
          title="Tickets Sold" 
          value={stats.ticketsSold} 
          icon={<TicketIcon className="w-8 h-8 text-white" />}
          gradient="from-blue-500 to-cyan-500"
          delay={0.1}
        />
        <StatCard 
          title="Tickets Added" 
          value={stats.ticketsAdded} 
          icon={<ChartBarIcon className="w-8 h-8 text-white" />}
          gradient="from-emerald-500 to-teal-500"
          delay={0.2}
        />
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-gray-400" /> Performance Metrics
          </h3>
          
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar 
                  dataKey="value" 
                  radius={[8, 8, 8, 8]} 
                  barSize={50}
                  animationDuration={1500}
                >
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
             <TicketIcon className="w-5 h-5 text-gray-400" /> Sales Ratio
          </h3>

          <div className="h-75 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                >
                  {pieData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={document.documentElement.classList.contains('dark') ? PIE_COLORS_DARK[index] : PIE_COLORS[index]} 
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-gray-600 dark:text-gray-300 font-medium ml-2">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
               <div className="text-center">
                  <span className="block text-3xl font-bold text-gray-800 dark:text-white">
                    {Math.round((stats.ticketsSold / (stats.ticketsAdded || 1)) * 100)}%
                  </span>
                  <span className="text-xs text-gray-500 uppercase font-bold">Sold</span>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, gradient, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative overflow-hidden rounded-3xl p-6 shadow-lg bg-linear-to-br ${gradient} text-white`}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90 mb-1 uppercase tracking-wide">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
          {icon}
        </div>
      </div>
      
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
    </motion.div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
        <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
          {label ? label : payload[0].name}
        </p>
        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
          Count: <span className="text-gray-600 dark:text-gray-300">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
}