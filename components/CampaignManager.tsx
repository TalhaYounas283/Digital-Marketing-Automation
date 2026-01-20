import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "completed" | "draft";
  platform: "Facebook" | "Google" | "Instagram" | "LinkedIn" | "Email";
  budget: number;
  spent: number;
  clicks: number;
  impressions: number;
  startDate: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Summer Sale 2024",
    status: "active",
    platform: "Facebook",
    budget: 5000,
    spent: 2340,
    clicks: 1250,
    impressions: 45000,
    startDate: "2024-06-01",
  },
  {
    id: "2",
    name: "Product Launch - GenAI Tool",
    status: "active",
    platform: "LinkedIn",
    budget: 10000,
    spent: 1500,
    clicks: 450,
    impressions: 12000,
    startDate: "2024-06-15",
  },
  {
    id: "3",
    name: "Q3 Brand Awareness",
    status: "paused",
    platform: "Google",
    budget: 15000,
    spent: 8900,
    clicks: 3400,
    impressions: 89000,
    startDate: "2024-05-15",
  },
  {
    id: "4",
    name: "Newsletter Signup",
    status: "draft",
    platform: "Email",
    budget: 1000,
    spent: 0,
    clicks: 0,
    impressions: 0,
    startDate: "2024-07-01",
  },
  {
    id: "5",
    name: "Retargeting Campaign",
    status: "completed",
    platform: "Instagram",
    budget: 3000,
    spent: 2950,
    clicks: 980,
    impressions: 32000,
    startDate: "2024-04-01",
  },
];

export const CampaignManager: React.FC = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/20";
      case "paused":
        return "bg-amber-500/20 text-amber-400 border-amber-500/20";
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/20";
      case "draft":
        return "bg-slate-500/20 text-slate-400 border-slate-500/20";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play size={14} className="fill-current" />;
      case "paused":
        return <Pause size={14} className="fill-current" />;
      case "completed":
        return <CheckCircle size={14} />;
      case "draft":
        return <Clock size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesFilter = filter === "all" || campaign.status === filter;
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative flex-1 w-full md:w-auto max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search campaigns..."
            className="glass-input w-full pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            className="glass-input px-4 py-2.5 text-sm w-full md:w-auto cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="draft">Drafts</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/25 whitespace-nowrap">
            <Plus size={18} />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Budget",
            value: "$34,000",
            change: "+12%",
            color: "from-blue-500 to-cyan-500",
          },
          {
            label: "Total Spend",
            value: "$15,690",
            change: "+8%",
            color: "from-purple-500 to-pink-500",
          },
          {
            label: "Avg. CPA",
            value: "$12.50",
            change: "-5%",
            color: "from-emerald-500 to-teal-500",
          },
          {
            label: "Conversions",
            value: "1,250",
            change: "+15%",
            color: "from-orange-500 to-amber-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="glass-card p-4 relative overflow-hidden group"
          >
            <div
              className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}
            />
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p
              className={`text-xs ${
                stat.change.startsWith("+") ? "text-emerald-400" : "text-red-400"
              } font-medium`}
            >
              {stat.change}{" "}
              <span className="text-slate-500 ml-1">vs last month</span>
            </p>
          </div>
        ))}
      </div>

      {/* Campaigns List */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-slate-400 font-medium border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-6 py-4">Campaign Name</th>
                <th className="px-6 py-4">Platform</th>
                <th className="px-6 py-4">Budget / Spend</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Performance</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCampaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-white mb-0.5">
                      {campaign.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(campaign.startDate).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
                      {campaign.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-medium">
                        ${campaign.budget.toLocaleString()}
                      </span>
                      <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${(campaign.spent / campaign.budget) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">
                        ${campaign.spent.toLocaleString()} spent
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${getStatusColor(
                        campaign.status
                      )}`}
                    >
                      {getStatusIcon(campaign.status)}
                      <span className="capitalize">{campaign.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Clicks</span>
                        <span className="text-white font-medium">
                          {campaign.clicks.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Impr.</span>
                        <span className="text-white font-medium">
                          {campaign.impressions.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCampaigns.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 text-slate-600 mb-4">
              <Filter size={32} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              No campaigns found
            </h3>
            <p className="text-slate-400">
              Try adjusting your filters or create a new campaign.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};