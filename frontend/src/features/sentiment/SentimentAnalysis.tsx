import React, { useEffect, useMemo, useState } from "react";
import {
  Smile,
  Frown,
  Meh,
  Sparkles,
  Loader2,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { sentimentApi, SentimentRecordDto } from "@/services/sentimentApi";

type Sentiment = "positive" | "neutral" | "negative";

interface AnalyzedItem {
  id: string;
  text: string;
  sentiment: Sentiment;
  score: number;
  source: string;
  createdAt: Date;
  highlights: string[];
}

const SEED_ITEMS: AnalyzedItem[] = [
  {
    id: "s_1",
    text: "Your onboarding flow saved us hours. Excellent product!",
    sentiment: "positive",
    score: 0.92,
    source: "Twitter mention",
    createdAt: new Date(Date.now() - 1000 * 60 * 14),
    highlights: ["saved us hours", "Excellent product"],
  },
  {
    id: "s_2",
    text: "Support never replied to my ticket from last week.",
    sentiment: "negative",
    score: -0.78,
    source: "Support ticket",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    highlights: ["never replied"],
  },
  {
    id: "s_3",
    text: "Pricing page is informative but a comparison table would help.",
    sentiment: "neutral",
    score: 0.08,
    source: "On-site feedback",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    highlights: ["comparison table would help"],
  },
  {
    id: "s_4",
    text: "Love the new AI insights — felt like an instant strategy upgrade.",
    sentiment: "positive",
    score: 0.88,
    source: "LinkedIn comment",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
    highlights: ["Love the new AI insights", "instant strategy upgrade"],
  },
];

const SENTIMENT_META: Record<
  Sentiment,
  { label: string; icon: React.ReactNode; color: string; ring: string }
> = {
  positive: {
    label: "Positive",
    icon: <Smile size={14} />,
    color: "text-green-700 bg-green-50 dark:bg-green-950/40 dark:text-green-400",
    ring: "ring-green-500/20",
  },
  neutral: {
    label: "Neutral",
    icon: <Meh size={14} />,
    color: "text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300",
    ring: "ring-slate-500/20",
  },
  negative: {
    label: "Negative",
    icon: <Frown size={14} />,
    color: "text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-400",
    ring: "ring-red-500/20",
  },
};

const detectSentiment = (text: string): { sentiment: Sentiment; score: number } => {
  const positiveWords = ["love", "great", "amazing", "excellent", "fast", "easy", "happy", "good", "saved", "best"];
  const negativeWords = ["hate", "bad", "slow", "broken", "frustrated", "angry", "never", "worst", "issue", "bug"];
  const lower = text.toLowerCase();
  const pos = positiveWords.reduce((acc, w) => acc + (lower.includes(w) ? 1 : 0), 0);
  const neg = negativeWords.reduce((acc, w) => acc + (lower.includes(w) ? 1 : 0), 0);
  const raw = (pos - neg) / Math.max(1, pos + neg);
  if (raw > 0.25) return { sentiment: "positive", score: Math.min(0.98, 0.6 + raw / 2) };
  if (raw < -0.25) return { sentiment: "negative", score: Math.max(-0.98, -0.6 + raw / 2) };
  return { sentiment: "neutral", score: raw };
};

const dtoToItem = (dto: SentimentRecordDto): AnalyzedItem => ({
  id: dto.id,
  text: dto.text,
  sentiment: dto.sentiment,
  score: Number(dto.score),
  source: dto.source ?? "Manual entry",
  createdAt: new Date(dto.createdAt),
  highlights: dto.highlights ?? [],
});

export const SentimentAnalysis: React.FC = () => {
  const [items, setItems] = useState<AnalyzedItem[]>([]);
  const [draft, setDraft] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    sentimentApi
      .history()
      .then((list) => setItems(list.map(dtoToItem)))
      .catch((err) =>
        showToast("Failed to load history", {
          variant: "error",
          description: err instanceof Error ? err.message : "Unknown error",
        }),
      );
  }, [showToast]);

  const stats = useMemo(() => {
    const total = items.length;
    if (!total) return { total: 0, positive: 0, neutral: 0, negative: 0, avgScore: 0 };
    const positive = items.filter((i) => i.sentiment === "positive").length;
    const neutral = items.filter((i) => i.sentiment === "neutral").length;
    const negative = items.filter((i) => i.sentiment === "negative").length;
    const avgScore = items.reduce((s, i) => s + i.score, 0) / total;
    return { total, positive, neutral, negative, avgScore };
  }, [items]);

  const analyze = async () => {
    if (!draft.trim()) {
      showToast("Type a message to analyze", { variant: "warning" });
      return;
    }
    setIsAnalyzing(true);
    try {
      const record = await sentimentApi.analyze({ text: draft.trim(), source: "Manual entry" });
      const item = dtoToItem(record);
      setItems((prev) => [item, ...prev]);
      setDraft("");
      showToast(`Sentiment: ${SENTIMENT_META[item.sentiment].label}`, {
        variant:
          item.sentiment === "positive"
            ? "success"
            : item.sentiment === "negative"
              ? "error"
              : "info",
        description: `Confidence ${Math.abs(Math.round(item.score * 100))}%`,
      });
    } catch (err) {
      showToast("Sentiment analysis failed", {
        variant: "error",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatRelative = (d: Date) => {
    const diffMin = Math.round((Date.now() - d.getTime()) / 60000);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffH = Math.round(diffMin / 60);
    if (diffH < 24) return `${diffH}h ago`;
    return `${Math.round(diffH / 24)}d ago`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <MessageCircle size={16} />
          <span className="text-xs font-bold uppercase tracking-[0.2em]">
            Customer Voice
          </span>
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          Sentiment Analysis
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Understand how customers feel about your brand, in real time.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile
          label="Mentions"
          value={stats.total}
          icon={<MessageCircle size={16} />}
          color="text-blue-600"
        />
        <StatTile
          label="Positive"
          value={stats.positive}
          icon={<Smile size={16} />}
          color="text-green-600"
        />
        <StatTile
          label="Negative"
          value={stats.negative}
          icon={<Frown size={16} />}
          color="text-red-600"
        />
        <StatTile
          label="Avg score"
          value={stats.avgScore.toFixed(2)}
          icon={<TrendingUp size={16} />}
          color="text-purple-600"
        />
      </div>

      <section className="card p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
          <Sparkles size={14} className="text-blue-600" />
          Analyze new feedback
        </div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Paste a tweet, support ticket, or review here…"
          rows={3}
          className="w-full enterprise-input resize-none"
        />
        <div className="flex justify-end">
          <button
            onClick={analyze}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Analyzing…
              </>
            ) : (
              <>
                <Sparkles size={14} /> Analyze sentiment
              </>
            )}
          </button>
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            Recent feedback
          </h3>
          <span className="text-xs text-[var(--text-muted)]">
            {items.length} items
          </span>
        </div>
        <ul className="divide-y divide-[var(--border)]">
          {items.map((item) => {
            const meta = SENTIMENT_META[item.sentiment];
            return (
              <li key={item.id} className="px-6 py-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ring-1 ${meta.color} ${meta.ring}`}
                  >
                    {meta.icon} {meta.label}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {item.source}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    · {formatRelative(item.createdAt)}
                  </span>
                  <span className="ml-auto text-xs font-mono text-[var(--text-secondary)]">
                    {item.score >= 0 ? "+" : ""}
                    {item.score.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                  {item.text}
                </p>
                {item.highlights.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-secondary)]"
                      >
                        "{h}"
                      </span>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

const StatTile: React.FC<{
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}> = ({ label, value, icon, color }) => (
  <div className="card p-4">
    <div className="flex items-center gap-2 text-[var(--text-muted)] mb-2">
      <span className={color}>{icon}</span>
      <span className="text-[11px] font-semibold uppercase tracking-wider">
        {label}
      </span>
    </div>
    <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
  </div>
);
