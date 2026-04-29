import React from "react";
import { Wand2, Target, Search, Zap, Swords, UserSearch } from "lucide-react";
import { ContentTab } from "../hooks/useMarketingStudio";

interface StudioTabsProps {
  activeTab: ContentTab;
  setActiveTab: (tab: ContentTab) => void;
}

export const StudioTabs: React.FC<StudioTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    { id: "quick", label: "Quick Post", icon: <Wand2 size={14} /> },
    { id: "campaign", label: "Strategy", icon: <Target size={14} /> },
    { id: "seo", label: "SEO", icon: <Search size={14} /> },
    { id: "optimize", label: "Optimizer", icon: <Zap size={14} /> },
    { id: "competitor", label: "Competitor", icon: <Swords size={14} /> },
    { id: "persona", label: "Persona", icon: <UserSearch size={14} /> },
  ];

  return (
    <div className="bg-[var(--bg-main)] p-1 rounded-xl flex gap-1 h-fit border border-[var(--border)] flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as ContentTab)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === tab.id
              ? "bg-[var(--bg-card)] text-blue-600 shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};
