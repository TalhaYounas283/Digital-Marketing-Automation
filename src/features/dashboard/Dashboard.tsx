import React, { useState, useEffect, useCallback } from "react";
import { StatsCard } from "./StatsCard";
import {
  Users,
  Eye,
  MousePointerClick,
  TrendingUp,
  ArrowRight,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { websocketService } from "@/services/websocketService";
import { KPIData } from "@/types";

const defaultKPI: KPIData = {
  totalReach: 0,
  impressions: 0,
  clickRate: 0,
  conversion: 0,
  chartData: [],
  recentActivity: [],
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [kpiData, setKpiData] = useState<KPIData>(defaultKPI);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribeMessage = websocketService.subscribe((data) => {
      setKpiData(data);
    });

    const unsubscribeConnection = websocketService.onConnectionChange((connected) => {
      setIsConnected(connected);
    });

    websocketService.connect();

    return () => {
      unsubscribeMessage();
      unsubscribeConnection();
      websocketService.disconnect();
    };
  }, []);

  const formatNumber = useCallback((num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toLocaleString();
  }, []);

  const formatPercent = useCallback((num: number): string => {
    return `${num.toFixed(1)}%`;
  }, []);

return (
    <div className="space-y-6 animate-fade-in transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Dashboard Overview
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Track your marketing performance and key metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
            isConnected 
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
            {isConnected ? "Live" : "Disconnected"}
          </div>
          <button
            onClick={() => navigate("/analytics")}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
          >
            View Analytics
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Reach"
          value={formatNumber(kpiData.totalReach)}
          change="+12%"
          isPositive={true}
          icon={<Users size={20} />}
        />
        <StatsCard
          title="Impressions"
          value={formatNumber(kpiData.impressions)}
          change="+8.1%"
          isPositive={true}
          icon={<Eye size={20} />}
        />
        <StatsCard
          title="Click Rate"
          value={formatNumber(kpiData.clickRate)}
          change="+2.4%"
          isPositive={false}
          icon={<MousePointerClick size={20} />}
        />
        <StatsCard
          title="Conversion"
          value={formatPercent(kpiData.conversion)}
          change="+1.2%"
          isPositive={true}
          icon={<TrendingUp size={20} />}
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6 transition-colors duration-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Traffic Overview
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Real-time website visits
              </p>
            </div>
            <select className="px-3 py-2 text-sm border border-[var(--border)] rounded-lg text-[var(--text-secondary)] bg-[var(--bg-card)] focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={kpiData.chartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="var(--text-muted)"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    boxShadow: "var(--shadow-md)",
                  }}
                  itemStyle={{ color: "var(--text-primary)", fontSize: "13px" }}
                />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="#2563EB"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVisits)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6 transition-colors duration-200">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Recent Activity
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Live updates
            </p>
          </div>

          <div className="space-y-3">
            {kpiData.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bg-main)] transition-colors cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {activity.campaign}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] truncate">
                    {activity.performance}
                  </p>
                </div>
                <span className="text-xs text-[var(--text-muted)]">{activity.time}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/campaigns")}
            className="w-full mt-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-main)] border border-[var(--border)] rounded-lg transition-colors"
          >
            View Campaigns
          </button>
        </div>
      </div>
    </div>
  );
};
