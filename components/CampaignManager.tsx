import React, { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Play, Pause, CheckCircle, Clock, AlertCircle, Target, DollarSign, Calendar } from "lucide-react";
import { Modal } from "./common/Modal";
import { Button } from "./common/Button";
import { Input } from "./common/Input";
import { Select } from "./common/Select";

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
  { id: "1", name: "Summer Sale 2024", status: "active", platform: "Facebook", budget: 5000, spent: 2340, clicks: 1250, impressions: 45000, startDate: "2024-06-01" },
  { id: "2", name: "Product Launch - GenAI Tool", status: "active", platform: "LinkedIn", budget: 10000, spent: 1500, clicks: 450, impressions: 12000, startDate: "2024-06-15" },
  { id: "3", name: "Q3 Brand Awareness", status: "paused", platform: "Google", budget: 15000, spent: 8900, clicks: 3400, impressions: 89000, startDate: "2024-05-15" },
  { id: "4", name: "Newsletter Signup", status: "draft", platform: "Email", budget: 1000, spent: 0, clicks: 0, impressions: 0, startDate: "2024-07-01" },
  { id: "5", name: "Retargeting Campaign", status: "completed", platform: "Instagram", budget: 3000, spent: 2950, clicks: 980, impressions: 32000, startDate: "2024-04-01" },
];

export const CampaignManager: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", platform: "Facebook", budget: "", status: "draft", startDate: new Date().toISOString().split('T')[0]
  });

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const newCampaign: Campaign = {
        id: Date.now().toString(),
        name: formData.name || "Untitled Campaign",
        platform: formData.platform as any,
        status: formData.status as any,
        budget: Number(formData.budget) || 0,
        spent: 0, clicks: 0, impressions: 0,
        startDate: formData.startDate
    };

    setCampaigns([newCampaign, ...campaigns]);
    setIsModalOpen(false);
    setFormData({ name: "", platform: "Facebook", budget: "", status: "draft", startDate: new Date().toISOString().split('T')[0] });
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    return (filter === "all" || campaign.status === filter) && 
           campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusConfig = (status: string) => {
      const configs: Record<string, {color: string, icon: React.ReactNode}> = {
          active: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20", icon: <Play size={14} className="fill-current" /> },
          paused: { color: "bg-amber-500/20 text-amber-400 border-amber-500/20", icon: <Pause size={14} className="fill-current" /> },
          completed: { color: "bg-blue-500/20 text-blue-400 border-blue-500/20", icon: <CheckCircle size={14} /> },
          draft: { color: "bg-slate-500/20 text-slate-400 border-slate-500/20", icon: <Clock size={14} /> }
      };
      return configs[status] || { color: "bg-slate-500/20 text-slate-400", icon: <AlertCircle size={14} /> };
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative flex-1 w-full md:w-auto max-w-md">
          <Input 
             placeholder="Search campaigns..." 
             icon={<Search size={18} />} 
             value={searchTerm} 
             onChange={(e) => setSearchTerm(e.target.value)}
             className="glass-input" // Keep glass-input class for specific dashboard look
             style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            className="glass-input px-4 py-2.5 text-sm w-full md:w-auto cursor-pointer rounded-lg bg-slate-900/60 border border-white/10 text-white" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="draft">Drafts</option>
          </select>
          <Button onClick={() => setIsModalOpen(true)} variant="primary" icon={<Plus size={18} />} className="bg-blue-600 hover:bg-blue-500 shadow-blue-500/25">
             Create Campaign
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Budget", value: `$${campaigns.reduce((acc, c) => acc + c.budget, 0).toLocaleString()}`, change: "+12%", color: "from-blue-500 to-cyan-500", positive: true },
          { label: "Total Spend", value: `$${campaigns.reduce((acc, c) => acc + c.spent, 0).toLocaleString()}`, change: "+8%", color: "from-purple-500 to-pink-500", positive: false },
          { label: "Total Clicks", value: campaigns.reduce((acc, c) => acc + c.clicks, 0).toLocaleString(), change: "-5%", color: "from-emerald-500 to-teal-500", positive: false },
          { label: "Impressions", value: campaigns.reduce((acc, c) => acc + c.impressions, 0).toLocaleString(), change: "+15%", color: "from-orange-500 to-amber-500", positive: true },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className={`text-xs ${stat.positive ? "text-emerald-400" : "text-red-400"} font-medium`}>{stat.change} <span className="text-slate-500 ml-1">vs last month</span></p>
          </div>
        ))}
      </div>

      {/* Table */}
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
              {filteredCampaigns.map((campaign) => {
                const statusConfig = getStatusConfig(campaign.status);
                return (
                <tr key={campaign.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-white mb-0.5">{campaign.name}</p>
                    <p className="text-xs text-slate-500">{new Date(campaign.startDate).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300">{campaign.platform}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-medium">${campaign.budget.toLocaleString()}</span>
                      <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0}%` }} />
                      </div>
                      <span className="text-xs text-slate-400">${campaign.spent.toLocaleString()} spent</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${statusConfig.color}`}>
                      {statusConfig.icon} <span className="capitalize">{campaign.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between gap-4"><span className="text-slate-400">Clicks</span><span className="text-white font-medium">{campaign.clicks.toLocaleString()}</span></div>
                      <div className="flex justify-between gap-4"><span className="text-slate-400">Impr.</span><span className="text-white font-medium">{campaign.impressions.toLocaleString()}</span></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"><MoreHorizontal size={18} /></button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        {filteredCampaigns.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 text-slate-600 mb-4"><Filter size={32} /></div>
            <h3 className="text-lg font-semibold text-white mb-1">No campaigns found</h3>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Campaign" maxWidth="max-w-lg">
        <form onSubmit={handleCreateCampaign} className="space-y-5">
            <Input 
              label="Campaign Name" 
              required
              placeholder="e.g. Winter Holiday Sale" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              icon={<Target size={16} />}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Select 
                label="Platform"
                value={formData.platform}
                onChange={(e) => setFormData({...formData, platform: e.target.value as any})}
                options={[
                    {label: "Facebook", value: "Facebook"},
                    {label: "Google", value: "Google"},
                    {label: "Instagram", value: "Instagram"},
                    {label: "LinkedIn", value: "LinkedIn"},
                    {label: "Email", value: "Email"}
                ]}
              />
              <Select 
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                options={[
                    {label: "Draft", value: "draft"},
                    {label: "Active", value: "active"},
                    {label: "Paused", value: "paused"}
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                 label="Total Budget"
                 type="number" 
                 min="0" 
                 required
                 placeholder="5000" 
                 value={formData.budget} 
                 onChange={(e) => setFormData({...formData, budget: e.target.value})}
                 icon={<DollarSign size={16} />}
              />
              <Input 
                 label="Start Date"
                 type="date" 
                 required
                 value={formData.startDate} 
                 onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                 icon={<Calendar size={16} />}
              />
            </div>
            <div className="pt-4 flex gap-3">
              <Button type="button" variant="outline" fullWidth onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" fullWidth className="bg-blue-600 hover:bg-blue-500 shadow-blue-500/25">
                Create Campaign
              </Button>
            </div>
        </form>
      </Modal>
    </div>
  );
};