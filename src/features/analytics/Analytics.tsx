import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Users,
  BarChart3,
  Activity,
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EngagementPoint {
  name: string;
  twitter: number;
  instagram: number;
  linkedin: number;
  facebook: number;
}

const engagementData6M: EngagementPoint[] = [
  { name: "Jan", twitter: 4000, instagram: 2400, linkedin: 3200, facebook: 2800 },
  { name: "Feb", twitter: 3000, instagram: 1398, linkedin: 2900, facebook: 2400 },
  { name: "Mar", twitter: 2000, instagram: 9800, linkedin: 3600, facebook: 3000 },
  { name: "Apr", twitter: 2780, instagram: 3908, linkedin: 3400, facebook: 2600 },
  { name: "May", twitter: 1890, instagram: 4800, linkedin: 3100, facebook: 2500 },
  { name: "Jun", twitter: 2390, instagram: 3800, linkedin: 3300, facebook: 2700 },
];

const engagementData12M: EngagementPoint[] = [
  { name: "Jul", twitter: 1800, instagram: 3200, linkedin: 2700, facebook: 2300 },
  { name: "Aug", twitter: 2100, instagram: 3500, linkedin: 2800, facebook: 2400 },
  { name: "Sep", twitter: 2600, instagram: 4000, linkedin: 3000, facebook: 2500 },
  { name: "Oct", twitter: 3000, instagram: 4700, linkedin: 3200, facebook: 2600 },
  { name: "Nov", twitter: 3300, instagram: 5000, linkedin: 3400, facebook: 2800 },
  { name: "Dec", twitter: 3700, instagram: 5400, linkedin: 3600, facebook: 3000 },
  ...engagementData6M,
];

const demographicData = [
  { name: "18-24", value: 400 },
  { name: "25-34", value: 300 },
  { name: "35-44", value: 300 },
  { name: "45+", value: 200 },
];

const BLUE_PALETTE = ["#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-card)] px-4 py-3 border border-[var(--border)] shadow-lg rounded-lg">
        <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-medium text-[var(--text-primary)]">
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const QuickStat = ({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
}) => (
  <div className="bg-[var(--bg-card)] border border-[var(--border)] p-5 rounded-xl flex items-center gap-4 shadow-sm transition-colors duration-200">
    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
      <Icon className="w-5 h-5 text-blue-600" />
    </div>
    <div className="flex-1">
      <p className="text-xs font-medium text-[var(--text-secondary)]">{label}</p>
      <p className="text-xl font-bold text-[var(--text-primary)] mt-0.5">{value}</p>
    </div>
    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">
      +{change}
    </span>
  </div>
);

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<"6m" | "12m">("6m");
  const [refreshTick, setRefreshTick] = useState(0);

  const engagementData = timeRange === "12m" ? engagementData12M : engagementData6M;

  const stats = useMemo(() => {
    const jitter = refreshTick % 2 === 0 ? 0 : 1;
    return {
      impressions: `${(2.4 + jitter * 0.1).toFixed(1)}M`,
      audience: `${847 + jitter * 8}K`,
      engagementRate: `${(4.8 + jitter * 0.1).toFixed(1)}%`,
      growthIndex: (94.2 + jitter * 0.4).toFixed(1),
    };
  }, [refreshTick]);

  return (
    <div className="space-y-6 animate-fade-in pb-8 transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Analytics Overview
            </h2>
            <p className="text-[var(--text-secondary)] text-sm mt-1">
              Comprehensive performance metrics across platforms
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            icon={<RefreshCw size={16} />}
            onClick={() => setRefreshTick((prev) => prev + 1)}
          >
            Refresh
          </Button>
          <Button variant="outline" icon={<Download size={16} />}>
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStat
          label="Total Impressions"
          value={stats.impressions}
          change="18%"
          icon={TrendingUp}
        />
        <QuickStat
          label="Active Audience"
          value={stats.audience}
          change="12%"
          icon={Users}
        />
        <QuickStat
          label="Engagement Rate"
          value={stats.engagementRate}
          change="0.6%"
          icon={BarChart3}
        />
        <QuickStat
          label="Growth Index"
          value={stats.growthIndex}
          change="3.1"
          icon={Activity}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Engagement by Platform
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Monthly performance comparison
              </p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as "6m" | "12m")}
              className="bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="6m">Last 6 Months</option>
              <option value="12m">Last 12 Months</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData} barGap={4}>
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
                  dy={8}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  width={45}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: "16px",
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                  }}
                />
                <Bar
                  dataKey="twitter"
                  fill="#2563EB"
                  radius={[4, 4, 0, 0]}
                  name="X / Twitter"
                  barSize={14}
                />
                <Bar
                  dataKey="instagram"
                  fill="#94A3B8"
                  radius={[4, 4, 0, 0]}
                  name="Instagram"
                  barSize={14}
                />
                <Bar
                  dataKey="linkedin"
                  fill="#0A66C2"
                  radius={[4, 4, 0, 0]}
                  name="LinkedIn"
                  barSize={14}
                />
                <Bar
                  dataKey="facebook"
                  fill="#1877F2"
                  radius={[4, 4, 0, 0]}
                  name="Facebook"
                  barSize={14}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Audience Analysis
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Demographic user distribution
              </p>
            </div>
          </div>
          <div className="h-72 w-full relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center -mt-4">
                <p className="text-3xl font-bold text-[var(--text-primary)]">1.2M</p>
                <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-widest">
                  Total Users
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographicData}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="var(--bg-card)"
                  strokeWidth={2}
                >
                  {demographicData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={BLUE_PALETTE[index]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={40}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px" }}
                  formatter={(value) => (
                    <span className="text-[var(--text-secondary)]">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
