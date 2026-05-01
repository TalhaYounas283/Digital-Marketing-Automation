import React, { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  Clock,
  TrendingUp,
  Users,
  Target,
  RefreshCw,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { insightsApi, RecommendationDto } from "@/services/insightsApi";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: "timing" | "audience" | "content" | "channel";
  confidence: number;
  applied?: boolean;
}

const CATEGORY_META: Record<
  Recommendation["category"],
  { icon: React.ReactNode; label: string; color: string }
> = {
  timing: {
    icon: <Clock size={16} />,
    label: "Posting Time",
    color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40",
  },
  audience: {
    icon: <Users size={16} />,
    label: "Audience",
    color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40",
  },
  content: {
    icon: <Lightbulb size={16} />,
    label: "Content",
    color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/40",
  },
  channel: {
    icon: <Target size={16} />,
    label: "Channel",
    color: "text-green-600 bg-green-50 dark:bg-green-950/40",
  },
};

const IMPACT_BADGE: Record<Recommendation["impact"], string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  medium:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400",
  low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

const SEED_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec_1",
    title: "Post on LinkedIn at Tuesday 10:00 AM",
    description:
      "Your B2B audience engagement peaks on Tuesday mornings. Posts published in this window have a 38% higher click-through rate than your weekly average.",
    impact: "high",
    category: "timing",
    confidence: 92,
  },
  {
    id: "rec_2",
    title: "Target 'Marketing Managers, 28-40' segment",
    description:
      "This segment converted 2.4× better than average over the last 30 days. Allocating more budget here could lift ROI by ~21%.",
    impact: "high",
    category: "audience",
    confidence: 87,
  },
  {
    id: "rec_3",
    title: "Use shorter copy under 120 characters",
    description:
      "Posts under 120 characters have 1.6× more saves and shares. Try compressing your top-performing thread into a single hook.",
    impact: "medium",
    category: "content",
    confidence: 81,
  },
  {
    id: "rec_4",
    title: "Reduce Twitter spend, double down on LinkedIn",
    description:
      "LinkedIn's CPL is currently $4.10 vs Twitter's $11.80 for the same audience. A budget shift could save ~$640/month.",
    impact: "high",
    category: "channel",
    confidence: 89,
  },
  {
    id: "rec_5",
    title: "Add a question hook to email subjects",
    description:
      "Subjects ending with a question have shown a 14% lift in open rate across your industry benchmark.",
    impact: "medium",
    category: "content",
    confidence: 74,
  },
  {
    id: "rec_6",
    title: "Re-engage dormant leads from 60+ days",
    description:
      "You have 142 leads with no activity in 60+ days but high original scores. A win-back sequence could recover ~12 conversions.",
    impact: "medium",
    category: "audience",
    confidence: 78,
  },
];

const dtoToRec = (dto: RecommendationDto): Recommendation => ({
  id: dto.id,
  title: dto.title,
  description: dto.description,
  impact: dto.impact,
  category: dto.category,
  confidence: dto.confidence,
  applied: dto.applied,
});

export const AIInsights: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Recommendation["category"]>(
    "all",
  );
  const { showToast } = useToast();

  useEffect(() => {
    insightsApi
      .list()
      .then(async (list) => {
        if (list.length === 0) {
          const fresh = await insightsApi.regenerate();
          setRecommendations(fresh.map(dtoToRec));
        } else {
          setRecommendations(list.map(dtoToRec));
        }
      })
      .catch((err) =>
        showToast("Failed to load insights", {
          variant: "error",
          description: err instanceof Error ? err.message : "Unknown error",
        }),
      )
      .finally(() => setIsLoading(false));
  }, [showToast]);

  const filtered = useMemo(() => {
    if (filter === "all") return recommendations;
    return recommendations.filter((r) => r.category === filter);
  }, [filter, recommendations]);

  const stats = useMemo(() => {
    const total = recommendations.length;
    const applied = recommendations.filter((r) => r.applied).length;
    const high = recommendations.filter((r) => r.impact === "high").length;
    const avgConfidence = total
      ? Math.round(
          recommendations.reduce((s, r) => s + r.confidence, 0) / total,
        )
      : 0;
    return { total, applied, high, avgConfidence };
  }, [recommendations]);

  const handleRegenerate = async () => {
    setIsLoading(true);
    setRecommendations([]);
    try {
      const fresh = await insightsApi.regenerate();
      setRecommendations(fresh.map(dtoToRec));
      showToast("Recommendations refreshed", {
        variant: "success",
        description: "AI re-analyzed your last 30 days of data.",
      });
    } catch (err) {
      showToast("Could not regenerate insights", {
        variant: "error",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (id: string) => {
    try {
      const updated = await insightsApi.apply(id);
      setRecommendations((prev) =>
        prev.map((r) => (r.id === id ? dtoToRec(updated) : r)),
      );
      showToast("Recommendation applied", { variant: "success" });
    } catch (err) {
      showToast("Could not apply", {
        variant: "error",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              AI Insights
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Recommendations from Kimi K2
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Data-driven actions to improve campaign performance.
          </p>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
        >
          <RefreshCw
            size={14}
            className={isLoading ? "animate-spin" : undefined}
          />
          Regenerate
        </button>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile
          label="Active suggestions"
          value={stats.total}
          icon={<Sparkles size={16} />}
        />
        <StatTile
          label="High impact"
          value={stats.high}
          icon={<TrendingUp size={16} />}
        />
        <StatTile
          label="Applied"
          value={stats.applied}
          icon={<CheckCircle2 size={16} />}
        />
        <StatTile
          label="Avg confidence"
          value={`${stats.avgConfidence}%`}
          icon={<Target size={16} />}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "timing", "audience", "content", "channel"] as const).map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors capitalize ${
                filter === cat
                  ? "bg-blue-600 text-white"
                  : "bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {cat === "all" ? "All" : CATEGORY_META[cat].label}
            </button>
          ),
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="card p-5 animate-pulse h-28 bg-gradient-to-r from-[var(--bg-card)] to-[var(--bg-main)]"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <Lightbulb
            size={28}
            className="mx-auto text-[var(--text-muted)] mb-3"
          />
          <p className="text-sm text-[var(--text-secondary)]">
            No recommendations in this category. Try a different filter or
            regenerate.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((rec) => {
            const meta = CATEGORY_META[rec.category];
            return (
              <article
                key={rec.id}
                className="card p-5 flex flex-col md:flex-row gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${meta.color}`}
                >
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">
                      {rec.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${IMPACT_BADGE[rec.impact]}`}
                    >
                      {rec.impact} impact
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {rec.confidence}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {rec.description}
                  </p>
                </div>
                <div className="flex md:flex-col md:items-end justify-end gap-2">
                  {rec.applied ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-xs font-semibold">
                      <CheckCircle2 size={14} /> Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(rec.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                    >
                      Apply <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

const StatTile: React.FC<{
  label: string;
  value: number | string;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="card p-4">
    <div className="flex items-center gap-2 text-[var(--text-muted)] mb-2">
      <span className="text-blue-600">{icon}</span>
      <span className="text-[11px] font-semibold uppercase tracking-wider">
        {label}
      </span>
    </div>
    <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
  </div>
);
