import React from 'react';
import { motion } from 'framer-motion';

export default function StatsCard({ icon: Icon, label, value, trend, color = 'primary' }) {
  const colorClasses = {
    primary: 'from-[#FFE5DF] to-[#FFF0EB] text-[#FF6B4A]',
    coral: 'from-[#FFE5DF] to-[#FFF0EB] text-[#FF8F6D]',
    violet: 'from-[#F3E5F5] to-[#F8F0FA] text-[#AB47BC]',
    green: 'from-green-100 to-green-50 text-green-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-gray-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-3xl font-mono font-bold text-[#3B4759] mb-1">{value}</p>
      <p className="text-sm text-[#6B7A94]">{label}</p>
    </motion.div>
  );
}