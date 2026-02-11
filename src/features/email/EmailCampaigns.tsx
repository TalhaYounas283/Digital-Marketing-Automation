import React, { useState } from "react";
import {
  Mail,
  Plus,
  Send,
  Users,
  Eye,
  MousePointerClick,
  TrendingUp,
  Calendar,
  Clock,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: "draft" | "scheduled" | "sending" | "sent";
  recipients: number;
  openRate: number;
  clickRate: number;
  sentDate?: string;
  scheduledDate?: string;
  template: string;
}

const mockCampaigns: EmailCampaign[] = [
  {
    id: "1",
    name: "Welcome Series - New Users",
    subject: "Welcome to AutoMarketer! Let's get you started",
    status: "sent",
    recipients: 1250,
    openRate: 45.2,
    clickRate: 12.8,
    sentDate: "2026-02-10",
    template: "Welcome Email",
  },
  {
    id: "2",
    name: "February Product Update",
    subject: "🚀 New Features: AI Content Calendar & Templates",
    status: "scheduled",
    recipients: 3400,
    openRate: 0,
    clickRate: 0,
    scheduledDate: "2026-02-15T10:00",
    template: "Product Update",
  },
  {
    id: "3",
    name: "Weekly Newsletter",
    subject: "This Week in Marketing: Top 5 Trends",
    status: "draft",
    recipients: 5000,
    openRate: 0,
    clickRate: 0,
    template: "Newsletter",
  },
  {
    id: "4",
    name: " Valentine Special Offer",
    subject: "❤️ 30% Off - Valentine's Special Ends Soon!",
    status: "sent",
    recipients: 2800,
    openRate: 38.5,
    clickRate: 15.2,
    sentDate: "2026-02-08",
    template: "Promotional",
  },
  {
    id: "5",
    name: "Re-engagement Campaign",
    subject: "We miss you! Here's what you missed",
    status: "sending",
    recipients: 1200,
    openRate: 0,
    clickRate: 0,
    template: "Re-engagement",
  },
];

const templates = [
  "Welcome Email",
  "Newsletter",
  "Product Update",
  "Promotional",
  "Re-engagement",
  "Event Invitation",
  "Survey",
];

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    draft: "bg-slate-100 text-slate-600 border-slate-200",
    scheduled: "bg-amber-100 text-amber-700 border-amber-200",
    sending: "bg-blue-100 text-blue-700 border-blue-200",
    sent: "bg-green-100 text-green-700 border-green-200",
  };

  const icons = {
    draft: <Edit size={12} />,
    scheduled: <Calendar size={12} />,
    sending: <Send size={12} className="animate-pulse" />,
    sent: <CheckCircle size={12} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
        styles[status as keyof typeof styles]
      }`}
    >
      {icons[status as keyof typeof icons]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const EmailCampaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(mockCampaigns);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);

  // New campaign form state
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    subject: "",
    template: "Welcome Email",
    recipients: "",
    scheduledDate: "",
  });

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || campaign.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalSent: campaigns
      .filter((c) => c.status === "sent")
      .reduce((acc, c) => acc + c.recipients, 0),
    avgOpenRate: 42.5,
    avgClickRate: 14.2,
    activeCampaigns: campaigns.filter((c) => c.status === "scheduled").length,
  };

  const handleCreateCampaign = () => {
    const campaign: EmailCampaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      subject: newCampaign.subject,
      status: newCampaign.scheduledDate ? "scheduled" : "draft",
      recipients: parseInt(newCampaign.recipients) || 0,
      openRate: 0,
      clickRate: 0,
      scheduledDate: newCampaign.scheduledDate || undefined,
      template: newCampaign.template,
    };
    setCampaigns([campaign, ...campaigns]);
    setIsCreateModalOpen(false);
    setNewCampaign({
      name: "",
      subject: "",
      template: "Welcome Email",
      recipients: "",
      scheduledDate: "",
    });
  };

  const duplicateCampaign = (campaign: EmailCampaign) => {
    const newCampaign: EmailCampaign = {
      ...campaign,
      id: Date.now().toString(),
      name: `${campaign.name} (Copy)`,
      status: "draft",
      openRate: 0,
      clickRate: 0,
      sentDate: undefined,
      scheduledDate: undefined,
    };
    setCampaigns([newCampaign, ...campaigns]);
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Email Campaigns
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Create, manage, and track your email marketing campaigns
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<Download size={18} />}>
            Export Report
          </Button>
          <Button icon={<Plus size={18} />} onClick={() => setIsCreateModalOpen(true)}>
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[var(--text-secondary)] text-sm">Total Sent</span>
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Send className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {stats.totalSent.toLocaleString()}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">All time emails</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[var(--text-secondary)] text-sm">Avg Open Rate</span>
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.avgOpenRate}%</p>
          <p className="text-xs text-green-600 mt-1">+2.3% from last month</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[var(--text-secondary)] text-sm">Avg Click Rate</span>
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <MousePointerClick className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.avgClickRate}%</p>
          <p className="text-xs text-green-600 mt-1">+0.8% from last month</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[var(--text-secondary)] text-sm">Scheduled</span>
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.activeCampaigns}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Upcoming campaigns</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
            <Input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-[var(--text-secondary)]" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[var(--bg-main)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="sending">Sending</option>
              <option value="sent">Sent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-main)] border-b border-[var(--border)]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">
                  Campaign
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">
                  Recipients
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">
                  Open Rate
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">
                  Click Rate
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">
                  Date
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-[var(--bg-main)] transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">{campaign.name}</p>
                      <p className="text-sm text-[var(--text-secondary)] truncate max-w-xs">
                        {campaign.subject}
                      </p>
                      <span className="text-xs text-[var(--text-muted)] mt-1">
                        Template: {campaign.template}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={campaign.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-[var(--text-secondary)]" />
                      <span className="text-[var(--text-primary)]">
                        {campaign.recipients.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {campaign.status === "sent" ? (
                      <div className="flex items-center gap-2">
                        <Eye size={16} className="text-green-600" />
                        <span className="font-semibold text-[var(--text-primary)]">
                          {campaign.openRate}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-[var(--text-muted)]">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {campaign.status === "sent" ? (
                      <div className="flex items-center gap-2">
                        <MousePointerClick size={16} className="text-purple-600" />
                        <span className="font-semibold text-[var(--text-primary)]">
                          {campaign.clickRate}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-[var(--text-muted)]">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[var(--text-secondary)]">
                    {campaign.sentDate || campaign.scheduledDate ? (
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {campaign.sentDate || campaign.scheduledDate}
                      </div>
                    ) : (
                      <span className="text-[var(--text-muted)]">Not scheduled</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCampaign(campaign)}
                        className="p-2 hover:bg-[var(--bg-main)] rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} className="text-[var(--text-secondary)]" />
                      </button>
                      <button
                        onClick={() => duplicateCampaign(campaign)}
                        className="p-2 hover:bg-[var(--bg-main)] rounded-lg transition-colors"
                        title="Duplicate"
                      >
                        <Copy size={16} className="text-[var(--text-secondary)]" />
                      </button>
                      <button
                        onClick={() => deleteCampaign(campaign.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Campaign Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Email Campaign"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Campaign Name
            </label>
            <Input
              type="text"
              placeholder="e.g., February Newsletter"
              value={newCampaign.name}
              onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Email Subject
            </label>
            <Input
              type="text"
              placeholder="e.g., Exciting updates inside!"
              value={newCampaign.subject}
              onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Template
              </label>
              <select
                value={newCampaign.template}
                onChange={(e) => setNewCampaign({ ...newCampaign, template: e.target.value })}
                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {templates.map((template) => (
                  <option key={template} value={template}>
                    {template}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Recipient Count
              </label>
              <Input
                type="number"
                placeholder="e.g., 1000"
                value={newCampaign.recipients}
                onChange={(e) => setNewCampaign({ ...newCampaign, recipients: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Schedule (Optional)
            </label>
            <Input
              type="datetime-local"
              value={newCampaign.scheduledDate}
              onChange={(e) => setNewCampaign({ ...newCampaign, scheduledDate: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCampaign} icon={<Sparkles size={18} />}>
              Create Campaign
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
