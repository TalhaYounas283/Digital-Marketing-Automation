import React from "react";
import {
  Sparkles,
  Copy,
  Image as ImageIcon,
  Target,
  Search,
  Zap,
  Check,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import {
  CampaignStrategy,
  OptimizationResult,
  SeoResult,
  Platform,
} from "@/types";
import { ContentTab } from "../hooks/useMarketingStudio";

interface ResultsTerminalProps {
  activeTab: ContentTab;
  isGenerating: boolean;
  generatedPosts: string[];
  strategy: CampaignStrategy | null;
  optimizationResult: OptimizationResult | null;
  seoResult: SeoResult | null;
  generatedImage: string | null;
  isGeneratingImage: boolean;
  copiedIndex: number | null;
  copyError: string | null;
  platform: Platform;
  actions: {
    handleGenerateImage: (post: string) => void;
    copyToClipboard: (text: string, index: number) => Promise<void> | void;
  };
}

export const ResultsTerminal: React.FC<ResultsTerminalProps> = ({
  activeTab,
  isGenerating,
  generatedPosts,
  strategy,
  optimizationResult,
  seoResult,
  generatedImage,
  isGeneratingImage,
  copiedIndex,
  copyError,
  platform,
  actions,
}) => {
  const hasResults =
    generatedPosts.length || strategy || optimizationResult || seoResult;

  if (isGenerating) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-40 bg-[var(--bg-main)] rounded-xl border border-[var(--border)]"></div>
        <div className="h-40 bg-[var(--bg-main)] rounded-xl border border-[var(--border)]"></div>
      </div>
    );
  }

  if (!hasResults) {
    return (
      <div className="bg-[var(--bg-main)] border border-[var(--border)] border-dashed rounded-xl p-12 text-center h-fit">
        <div className="w-16 h-16 mx-auto bg-[var(--bg-card)] rounded-full flex items-center justify-center border border-[var(--border)] shadow-sm mb-4">
          <Sparkles size={24} className="text-slate-300" />
        </div>
        <h3 className="text-base font-bold text-[var(--text-primary)]">
          AI Results Terminal
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xs mx-auto">
          Once generated, your copy, strategies, or research will appear here
          for review.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {copyError && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 text-xs text-rose-700">
          {copyError}
        </div>
      )}

      {activeTab === "quick" &&
        generatedPosts.map((post, idx) => (
          <div
            key={idx}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden hover:border-blue-300 transition-colors group"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">
                  {platform}
                </span>
                <button
                  onClick={() => actions.copyToClipboard(post, idx)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  {copiedIndex === idx ? (
                    <Check size={18} />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>
              </div>
              <p className="text-[var(--text-primary)] text-sm leading-relaxed whitespace-pre-wrap">
                {post}
              </p>
            </div>
            <div className="bg-[var(--bg-main)] px-6 py-3 border-t border-[var(--border)] flex justify-end">
              <button
                onClick={() => actions.handleGenerateImage(post)}
                className="text-xs font-bold text-[var(--text-secondary)] hover:text-blue-700 flex items-center gap-2 transition-colors"
              >
                <ImageIcon size={14} /> Generate Ad Visual
              </button>
            </div>
          </div>
        ))}

      {activeTab === "campaign" && strategy && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-sm p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2.5 rounded-lg text-blue-600">
              <Target size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Campaign Strategy
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Drafted by Advanced AI
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Executive Summary
              </h4>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                {strategy.overview}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[var(--bg-main)] p-4 rounded-lg border border-[var(--border)]">
                <h4 className="text-[10px] font-bold text-blue-600 uppercase mb-2">
                  Target Profile
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  {strategy.targetAudience}
                </p>
              </div>
              <div className="bg-[var(--bg-main)] p-4 rounded-lg border border-[var(--border)]">
                <h4 className="text-[10px] font-bold text-blue-600 uppercase mb-2">
                  Key Value Pillars
                </h4>
                <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                  {strategy.keyThemes.map((t, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-blue-400">-</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Suggested Posts
              </h4>
              <div className="space-y-3">
                {strategy.suggestedPosts.map((post, i) => (
                  <div
                    key={`${post.platform}-${i}`}
                    className="bg-[var(--bg-main)] p-4 rounded-lg border border-[var(--border)]"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                        {post.platform}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[var(--text-secondary)] font-semibold">
                          Best: {post.bestTime}
                        </span>
                        <button
                          onClick={() =>
                            actions.copyToClipboard(post.content, 2000 + i)
                          }
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          {copiedIndex === 2000 + i ? (
                            <Check size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {post.hashtags.map((tag, idx) => (
                        <span
                          key={`${tag}-${idx}`}
                          className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "seo" && seoResult && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-sm p-6">
          <h3 className="text-base font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Search size={18} className="text-blue-600" /> Keyword Intelligence
          </h3>
          <div className="bg-[var(--bg-main)] rounded-lg overflow-hidden border border-[var(--border)]">
            <table className="w-full text-xs">
              <thead className="bg-[var(--bg-main)] text-[var(--text-secondary)] font-bold uppercase">
                <tr>
                  <th className="px-4 py-2 text-left">Term</th>
                  <th className="px-4 py-2 text-center">Volume</th>
                  <th className="px-4 py-2 text-right">Difficulty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {seoResult.keywords.map((kw, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">
                      {kw.term}
                    </td>
                    <td className="px-4 py-3 text-center text-[var(--text-secondary)]">
                      {kw.volume}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${kw.difficulty === "High" ? "bg-red-50 text-red-600 border-red-100" : kw.difficulty === "Medium" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}
                      >
                        {kw.difficulty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-[var(--bg-main)] border border-[var(--border)] rounded-lg p-4">
              <h4 className="text-[10px] font-bold text-blue-600 uppercase mb-3 flex items-center gap-2">
                <Lightbulb size={12} /> Content Ideas
              </h4>
              <ul className="space-y-2">
                {seoResult.contentIdeas.map((idea, i) => (
                  <li
                    key={`${idea}-${i}`}
                    className="flex items-start justify-between gap-2 text-xs text-[var(--text-primary)]"
                  >
                    <span>{idea}</span>
                    <button
                      onClick={() => actions.copyToClipboard(idea, 3000 + i)}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded"
                    >
                      {copiedIndex === 3000 + i ? (
                        <Check size={12} />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[var(--bg-main)] border border-[var(--border)] rounded-lg p-4">
              <h4 className="text-[10px] font-bold text-blue-600 uppercase mb-3">
                Competitor URLs
              </h4>
              <ul className="space-y-2">
                {seoResult.competitorUrls.map((url, i) => (
                  <li key={`${url}-${i}`}>
                    <a
                      href={url.startsWith("http") ? url : `https://${url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-700 hover:underline inline-flex items-center gap-1 break-all"
                    >
                      {url}
                      <ExternalLink size={12} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === "optimize" && optimizationResult && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden">
          <div className="bg-blue-600 px-6 py-3 flex items-center gap-2 text-white">
            <Zap size={16} />
            <h3 className="font-bold text-sm">Optimized Output</h3>
          </div>
          <div className="p-6">
            <p className="text-[var(--text-primary)] text-sm leading-relaxed whitespace-pre-wrap">
              {optimizationResult.optimized}
            </p>
            <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-between items-center">
              <span className="text-[10px] text-[var(--text-secondary)] italic font-medium">
                * {optimizationResult.changesMade}
              </span>
              <button
                onClick={() =>
                  actions.copyToClipboard(optimizationResult.optimized, 999)
                }
                className="flex items-center gap-2 text-blue-600 font-bold text-xs"
              >
                <Copy size={14} /> Copy Content
              </button>
            </div>
          </div>
        </div>
      )}

      {(isGeneratingImage || generatedImage) && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
              Ad Creative
            </h4>
            {generatedImage && (
              <a
                href={generatedImage}
                download="expert-campaign.png"
                className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg font-bold"
              >
                Download
              </a>
            )}
          </div>
          {isGeneratingImage ? (
            <div className="h-64 bg-[var(--bg-main)] rounded-lg flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-[var(--text-secondary)]">
                Generating HD Visual...
              </p>
            </div>
          ) : (
            <img
              src={generatedImage!}
              alt="AI Generated"
              className="w-full rounded-lg border border-[var(--border)] shadow-inner"
            />
          )}
        </div>
      )}
    </div>
  );
};
