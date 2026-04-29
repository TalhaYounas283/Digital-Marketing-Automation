import React, { useMemo, useState } from "react";
import {
  Workflow,
  Plus,
  Play,
  Pause,
  Trash2,
  Mail,
  MessageSquare,
  UserPlus,
  TrendingUp,
  Zap,
  Save,
  ArrowRight,
  Activity,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { AutomationWorkflow } from "@/types";

const TRIGGER_OPTIONS = [
  { id: "new_lead", label: "New Lead Captured", icon: <UserPlus size={14} /> },
  {
    id: "form_submit",
    label: "Form Submission",
    icon: <MessageSquare size={14} />,
  },
  {
    id: "campaign_end",
    label: "Campaign Completed",
    icon: <TrendingUp size={14} />,
  },
  { id: "schedule", label: "Scheduled (Daily)", icon: <Activity size={14} /> },
];

const ACTION_OPTIONS = [
  { id: "send_email", label: "Send Email", icon: <Mail size={14} /> },
  {
    id: "post_social",
    label: "Publish Social Post",
    icon: <MessageSquare size={14} />,
  },
  { id: "score_lead", label: "Score Lead with AI", icon: <Zap size={14} /> },
  {
    id: "notify_team",
    label: "Notify Team in Slack",
    icon: <Activity size={14} />,
  },
];

const SEED_WORKFLOWS: AutomationWorkflow[] = [
  {
    id: "wf_1",
    name: "Auto-respond to new leads",
    tool: "n8n",
    trigger: "New Lead Captured",
    action: "Send Email",
    status: "Active",
    lastRun: "2 minutes ago",
  },
  {
    id: "wf_2",
    name: "Score every signup with Kimi",
    tool: "n8n",
    trigger: "Form Submission",
    action: "Score Lead with AI",
    status: "Active",
    lastRun: "12 minutes ago",
  },
  {
    id: "wf_3",
    name: "Daily Twitter recap",
    tool: "n8n",
    trigger: "Scheduled (Daily)",
    action: "Publish Social Post",
    status: "Paused",
    lastRun: "Yesterday, 9:00 AM",
  },
];

export const WorkflowBuilder: React.FC = () => {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>(SEED_WORKFLOWS);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    trigger: TRIGGER_OPTIONS[0].label,
    action: ACTION_OPTIONS[0].label,
  });
  const { showToast } = useToast();

  const stats = useMemo(() => {
    const total = workflows.length;
    const active = workflows.filter((w) => w.status === "Active").length;
    const paused = total - active;
    return { total, active, paused };
  }, [workflows]);

  const toggleStatus = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, status: w.status === "Active" ? "Paused" : "Active" }
          : w,
      ),
    );
    const wf = workflows.find((w) => w.id === id);
    if (wf) {
      showToast(
        wf.status === "Active" ? "Workflow paused" : "Workflow activated",
        { variant: wf.status === "Active" ? "warning" : "success" },
      );
    }
  };

  const removeWorkflow = (id: string) => {
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
    showToast("Workflow deleted", { variant: "info" });
  };

  const saveDraft = () => {
    if (!draft.name.trim()) {
      showToast("Please give the workflow a name", { variant: "warning" });
      return;
    }
    const newWorkflow: AutomationWorkflow = {
      id: `wf_${Date.now()}`,
      name: draft.name,
      tool: "n8n",
      trigger: draft.trigger,
      action: draft.action,
      status: "Active",
      lastRun: "Never",
    };
    setWorkflows((prev) => [newWorkflow, ...prev]);
    setDraft({
      name: "",
      trigger: TRIGGER_OPTIONS[0].label,
      action: ACTION_OPTIONS[0].label,
    });
    setIsBuilderOpen(false);
    showToast("Workflow created", {
      variant: "success",
      description: `${newWorkflow.name} is now active.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Workflow size={16} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Automation
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Workflow Builder
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Connect triggers to actions through n8n.
          </p>
        </div>
        <button
          onClick={() => setIsBuilderOpen((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
        >
          <Plus size={16} /> New workflow
        </button>
      </header>

      <div className="grid grid-cols-3 gap-4">
        <StatTile label="Workflows" value={stats.total} accent="blue" />
        <StatTile label="Active" value={stats.active} accent="green" />
        <StatTile label="Paused" value={stats.paused} accent="yellow" />
      </div>

      {isBuilderOpen && (
        <section className="card p-6 space-y-5 animate-fade-in">
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
              Build a new automation
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Pick a trigger, then chain it to an action. Workflows execute on
              your selected engine.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
              Name
            </label>
            <input
              type="text"
              value={draft.name}
              onChange={(e) =>
                setDraft((d) => ({ ...d, name: e.target.value }))
              }
              placeholder="e.g. Welcome new SaaS leads"
              className="w-full enterprise-input"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4 items-stretch">
            <BuilderColumn label="Trigger" tag="WHEN">
              {TRIGGER_OPTIONS.map((opt) => (
                <BuilderOption
                  key={opt.id}
                  active={draft.trigger === opt.label}
                  onClick={() =>
                    setDraft((d) => ({ ...d, trigger: opt.label }))
                  }
                  icon={opt.icon}
                  label={opt.label}
                />
              ))}
            </BuilderColumn>

            <div className="hidden md:flex flex-col items-center justify-center text-[var(--text-muted)]">
              <ArrowRight size={28} />
              <span className="text-[10px] uppercase tracking-wider mt-1">
                Then
              </span>
            </div>

            <BuilderColumn label="Action" tag="DO">
              {ACTION_OPTIONS.map((opt) => (
                <BuilderOption
                  key={opt.id}
                  active={draft.action === opt.label}
                  onClick={() => setDraft((d) => ({ ...d, action: opt.label }))}
                  icon={opt.icon}
                  label={opt.label}
                />
              ))}
            </BuilderColumn>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Workflow size={14} />
              <span className="font-semibold uppercase tracking-wider">
                Powered by n8n
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsBuilderOpen(false)}
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text-primary)] text-sm font-semibold hover:bg-[var(--bg-main)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveDraft}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
              >
                <Save size={14} /> Save & activate
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            Existing workflows
          </h3>
          <span className="text-xs text-[var(--text-muted)]">
            {workflows.length} total
          </span>
        </div>

        {workflows.length === 0 ? (
          <div className="p-12 text-center">
            <Workflow
              size={28}
              className="mx-auto text-[var(--text-muted)] mb-3"
            />
            <p className="text-sm text-[var(--text-secondary)]">
              No workflows yet. Click "New workflow" to create your first one.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {workflows.map((wf) => (
              <li
                key={wf.id}
                className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                      {wf.name}
                    </p>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                        wf.status === "Active"
                          ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400"
                      }`}
                    >
                      {wf.status}
                    </span>
                    <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      {wf.tool}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                    <span className="font-semibold">{wf.trigger}</span>
                    <ArrowRight size={12} />
                    <span>{wf.action}</span>
                    <span className="mx-2 text-[var(--text-muted)]">·</span>
                    <span>Last run {wf.lastRun}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleStatus(wf.id)}
                    className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-main)] transition-colors"
                    title={wf.status === "Active" ? "Pause" : "Activate"}
                  >
                    {wf.status === "Active" ? (
                      <Pause size={14} />
                    ) : (
                      <Play size={14} />
                    )}
                  </button>
                  <button
                    onClick={() => removeWorkflow(wf.id)}
                    className="p-2 rounded-lg border border-[var(--border)] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

const StatTile: React.FC<{
  label: string;
  value: number;
  accent: "blue" | "green" | "yellow";
}> = ({ label, value, accent }) => {
  const accentMap = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
  };
  return (
    <div className="card p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
        {label}
      </p>
      <p className={`text-2xl font-bold ${accentMap[accent]}`}>{value}</p>
    </div>
  );
};

const BuilderColumn: React.FC<{
  label: string;
  tag: string;
  children: React.ReactNode;
}> = ({ label, tag, children }) => (
  <div className="rounded-xl bg-[var(--bg-main)] border border-[var(--border)] p-4 space-y-2">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-bold text-[var(--text-primary)]">
        {label}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
        {tag}
      </span>
    </div>
    {children}
  </div>
);

const BuilderOption: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-medium border transition-all ${
      active
        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
        : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]"
    }`}
  >
    <span>{icon}</span>
    <span className="flex-1">{label}</span>
  </button>
);
