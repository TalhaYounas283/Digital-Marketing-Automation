import React from "react";
import { StatCardProps } from "@/types";
import { TrendingUp, TrendingDown } from "lucide-react";

export const StatsCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  icon,
}) => {
  return (
    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="p-2 bg-[var(--bg-main)] rounded-lg text-[var(--text-secondary)]">
          {icon}
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {change}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-[var(--text-primary)]">
          {value}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{title}</p>
      </div>
    </div>
  );
};
