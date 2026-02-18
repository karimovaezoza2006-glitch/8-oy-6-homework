"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: "blue" | "emerald" | "violet" | "amber";
}

const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-600",
  amber: "bg-amber-50 text-amber-600",
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
}: StatCardProps) {
  return (
    <div className="p-6 rounded-2xl shadow-sm border border-slate-200/60">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          <Icon size={24} />
        </div>

        {trend && (
          <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
            {trend}
          </span>
        )}
      </div>

      <p className="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wider">
        {title}
      </p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
    </div>
  );
}
