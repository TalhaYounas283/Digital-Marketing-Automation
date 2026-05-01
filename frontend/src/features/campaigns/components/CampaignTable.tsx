import React, { useState } from "react";
import {
  MoreHorizontal,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Campaign } from "../hooks/useCampaigns";
import { Modal } from "@/components/ui/Modal";

interface CampaignTableProps {
  campaigns: Campaign[];
  onUpdateCampaign: (
    campaignId: string,
    payload: {
      status: Campaign["status"];
      platform: Campaign["platform"];
      budget: number;
      settings: Campaign["settings"];
    },
  ) => void;
}

export const CampaignTable: React.FC<CampaignTableProps> = ({
  campaigns,
  onUpdateCampaign,
}) => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [formState, setFormState] = useState({
    status: "draft" as Campaign["status"],
    platform: "Facebook" as Campaign["platform"],
    budget: "0",
    dailyCap: "0",
    autoOptimize: true,
    sendAlerts: true,
  });

  const openSettings = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setFormState({
      status: campaign.status,
      platform: campaign.platform,
      budget: String(campaign.budget),
      dailyCap: String(
        campaign.settings?.dailyCap ?? Math.floor(campaign.budget / 30),
      ),
      autoOptimize: campaign.settings?.autoOptimize ?? true,
      sendAlerts: campaign.settings?.sendAlerts ?? true,
    });
    setIsSettingsOpen(true);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;

    onUpdateCampaign(selectedCampaign.id, {
      status: formState.status,
      platform: formState.platform,
      budget: Number(formState.budget) || 0,
      settings: {
        dailyCap: Number(formState.dailyCap) || 0,
        autoOptimize: formState.autoOptimize,
        sendAlerts: formState.sendAlerts,
      },
    });

    setIsSettingsOpen(false);
    setSelectedCampaign(null);
  };
  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      { bg: string; text: string; icon: React.ReactNode }
    > = {
      active: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        icon: <Play size={12} className="fill-current" />,
      },
      paused: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        icon: <Pause size={12} className="fill-current" />,
      },
      completed: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        icon: <CheckCircle size={12} />,
      },
      draft: {
        bg: "bg-slate-50",
        text: "text-slate-600",
        icon: <Clock size={12} />,
      },
    };
    return (
      configs[status] || {
        bg: "bg-slate-50",
        text: "text-slate-600",
        icon: <AlertCircle size={12} />,
      }
    );
  };

  return (
    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-[var(--bg-main)] text-[var(--text-secondary)] font-semibold uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Campaign Name</th>
              <th className="px-6 py-4">Platform</th>
              <th className="px-6 py-4">Budget Progress</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Performance</th>
              <th className="px-6 py-4 text-right">Settings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {campaigns.map((campaign) => {
              const cfg = getStatusConfig(campaign.status);
              return (
                <tr
                  key={campaign.id}
                  className="hover:bg-[var(--bg-main)] transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[var(--text-primary)]">
                      {campaign.name}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Start: {new Date(campaign.startDate).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-[var(--bg-main)] text-[var(--text-secondary)] text-xs font-semibold">
                      {campaign.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 w-32">
                      <div className="flex justify-between text-xs font-bold text-[var(--text-primary)]">
                        <span>${campaign.spent.toLocaleString()}</span>
                        <span className="text-[var(--text-secondary)]">
                          / ${campaign.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--bg-main)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{
                            width: `${campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}
                    >
                      {cfg.icon}
                      <span className="capitalize">{campaign.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-center space-y-0.5">
                      <p className="text-[var(--text-primary)] font-bold">
                        {campaign.clicks.toLocaleString()} clicks
                      </p>
                      <p className="text-[var(--text-secondary)] font-medium">
                        {campaign.impressions.toLocaleString()} views
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openSettings(campaign)}
                      className="text-slate-400 hover:text-[var(--text-primary)] p-2 hover:bg-[var(--bg-main)] rounded-lg transition-colors"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {campaigns.length === 0 && (
        <div className="py-20 text-center">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
            No results matching your criteria
          </h3>
          <p className="text-[var(--text-secondary)] text-sm">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}

      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title={
          selectedCampaign
            ? `${selectedCampaign.name} Settings`
            : "Campaign Settings"
        }
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Status
              </label>
              <select
                value={formState.status}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    status: e.target.value as Campaign["status"],
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-primary)]"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Platform
              </label>
              <select
                value={formState.platform}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    platform: e.target.value as Campaign["platform"],
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-primary)]"
              >
                <option value="Facebook">Facebook</option>
                <option value="Google">Google</option>
                <option value="Instagram">Instagram</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Email">Email</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Budget
              </label>
              <input
                type="number"
                min="0"
                value={formState.budget}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, budget: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Daily Cap
              </label>
              <input
                type="number"
                min="0"
                value={formState.dailyCap}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    dailyCap: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">
                Enable auto optimization
              </span>
              <input
                type="checkbox"
                checked={formState.autoOptimize}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    autoOptimize: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded border-[var(--border)] text-blue-600 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">
                Send performance alerts
              </span>
              <input
                type="checkbox"
                checked={formState.sendAlerts}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    sendAlerts: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded border-[var(--border)] text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="flex-1 py-2.5 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-main)] font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold text-sm transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
