import React, { useMemo } from "react";
import { StatCardProps } from "../types";
import { SEO } from "./common/SEO";
import {
  Users,
  Eye,
  MousePointerClick,
  Activity,
  ArrowRight,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  CreditCard,
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

// Custom Card Component for Glass Effect
const StatCard = React.memo<StatCardProps>(
  ({ title, value, change, isPositive, icon }) => {
    return (
      <div className="minimal-card p-6 flex flex-col justify-between h-full relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
          {React.cloneElement(icon as React.ReactElement, { size: 48 })}
        </div>
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
            {value}
          </h3>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span
            className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
              isPositive
                ? "text-emerald-700 bg-emerald-50 border border-emerald-100"
                : "text-rose-700 bg-rose-50 border border-rose-100"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={14} className="mr-1" />
            ) : (
              <ArrowDownRight size={14} className="mr-1" />
            )}
            {change}
          </span>
          <span className="text-slate-400 text-xs font-medium">
            vs last month
          </span>
        </div>
      </div>
    );
  },
);

const data = [
  { name: "Mon", visits: 4000, clicks: 2400 },
  { name: "Tue", visits: 3000, clicks: 1398 },
  { name: "Wed", visits: 2000, clicks: 9800 },
  { name: "Thu", visits: 2780, clicks: 3908 },
  { name: "Fri", visits: 1890, clicks: 4800 },
  { name: "Sat", visits: 2390, clicks: 3800 },
  { name: "Sun", visits: 3490, clicks: 4300 },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = useMemo(
    () => [
      {
        title: "Total Revenue",
        value: "$54,230",
        change: "+12.5%",
        isPositive: true,
        icon: <DollarSign size={24} />,
      },
      {
        title: "Active Campaigns",
        value: "13",
        change: "+4",
        isPositive: true,
        icon: <Activity size={24} />,
      },
      {
        title: "New Leads",
        value: "573",
        change: "+22.4%",
        isPositive: true,
        icon: <Users size={24} />,
      },
      {
        title: "Ad Spend",
        value: "$12,450",
        change: "-3.2%",
        isPositive: false,
        icon: <CreditCard size={24} />,
      },
    ],
    [],
  );

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      <SEO
        title="Dashboard"
        description="Overview of your marketing performance and key metrics."
      />

      {/* Intro Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 font-display">
            Performance Overview
          </h2>
          <p className="text-slate-500 mt-1">
            Track your key marketing metrics in real-time.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all">
            Download Report
          </button>
          <button className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all">
            + New Campaign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 minimal-card p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">
              Audience Growth
            </h3>
            <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "8px",
                    color: "#0f172a",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  itemStyle={{ color: "#0f172a" }}
                />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVisits)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="minimal-card p-6 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Recent Activity
          </h3>
          <div className="space-y-1 flex-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Campaign #{100 + i} launched
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Automated post scheduled for Twitter
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 ml-auto whitespace-nowrap">
                  2h ago
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/activity")}
            className="w-full mt-6 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium border border-slate-200 rounded-lg transition-all"
          >
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};
