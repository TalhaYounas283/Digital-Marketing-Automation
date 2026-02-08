import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  LayoutDashboard,
  Layers,
  Sparkles,
  User,
  Settings,
  Bell,
  Command,
  Fingerprint,
  ChevronRight,
} from "lucide-react";

interface CommandItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  category: string;
}

const COMMANDS: CommandItem[] = [
  {
    icon: <LayoutDashboard size={18} />,
    label: "Dashboard",
    path: "/",
    category: "Navigation",
  },
  {
    icon: <Layers size={18} />,
    label: "Campaigns",
    path: "/campaigns",
    category: "Navigation",
  },
  {
    icon: <Sparkles size={18} />,
    label: "Content Studio",
    path: "/generate",
    category: "AI Studio",
  },
  {
    icon: <User size={18} />,
    label: "Audience Builder",
    path: "/audience",
    category: "Optimization",
  },
  {
    icon: <User size={18} />,
    label: "Profile Settings",
    path: "/profile",
    category: "Account",
  },
  {
    icon: <Fingerprint size={18} />,
    label: "Brand Identity Hub",
    path: "/brand",
    category: "Account",
  },
  {
    icon: <Settings size={18} />,
    label: "System Settings",
    path: "/settings",
    category: "Account",
  },
  {
    icon: <Bell size={18} />,
    label: "Notifications",
    path: "/notifications",
    category: "Account",
  },
];

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const paletteRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const togglePalette = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        togglePalette();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePalette]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredCommands = COMMANDS.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()),
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 animate-fade-in bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-colors duration-200"
      onClick={(e) => {
        if (
          paletteRef.current &&
          !paletteRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      }}
    >
      <div
        ref={paletteRef}
        className="w-full max-w-xl bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden transition-all duration-200 transform scale-100"
      >
        <div className="relative">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            size={20}
          />
          <input
            ref={inputRef}
            type="text"
            className="w-full pl-14 pr-16 py-5 bg-transparent border-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none text-lg"
            placeholder="Search commands, pages, and actions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="text-[10px] font-bold text-[var(--text-muted)] px-1.5 py-0.5 border border-[var(--border)] rounded opacity-50 uppercase tracking-widest">
              ESC
            </span>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar border-t border-[var(--border)]">
          {filteredCommands.length > 0 ? (
            <div className="py-2">
              {Object.entries(
                filteredCommands.reduce(
                  (acc, cmd) => {
                    if (!acc[cmd.category]) acc[cmd.category] = [];
                    acc[cmd.category].push(cmd);
                    return acc;
                  },
                  {} as Record<string, CommandItem[]>,
                ),
              ).map(([category, items]) => (
                <div key={category}>
                  <div className="px-5 py-2 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.15em] opacity-60">
                    {category}
                  </div>
                  {items.map((cmd, idx) => (
                    <button
                      key={cmd.path}
                      onClick={() => {
                        navigate(cmd.path);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-all ${
                        idx === 0 && search
                          ? "bg-blue-600/10 text-blue-600 shadow-inner"
                          : "hover:bg-[var(--bg-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${idx === 0 && search ? "bg-blue-600/20" : "bg-[var(--bg-main)] opacity-70"} transition-colors`}
                      >
                        {React.cloneElement(cmd.icon as React.ReactElement, {
                          size: 18,
                          className:
                            idx === 0 && search
                              ? "text-blue-600"
                              : "text-[var(--text-secondary)]",
                        })}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm tracking-tight">
                          {cmd.label}
                        </p>
                        <p className="text-[11px] opacity-60 mt-0.5">
                          {cmd.path}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100">
                        <ChevronRight
                          size={14}
                          className="text-[var(--text-muted)]"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-[var(--bg-main)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--border)]">
                <Search
                  size={20}
                  className="text-[var(--text-muted)] opacity-30"
                />
              </div>
              <p className="text-[var(--text-secondary)] font-medium">
                No commands found for "{search}"
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Try searching for keywords like "dashboard" or "profile"
              </p>
            </div>
          )}
        </div>

        <div className="px-5 py-3 bg-[var(--bg-main)] border-t border-[var(--border)] flex items-center justify-between transition-colors">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
              <kbd className="px-1.5 py-0.5 text-[10px] bg-[var(--bg-card)] border border-[var(--border)] rounded font-bold shadow-sm">
                ↑↓
              </kbd>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                Navigate
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
              <kbd className="px-1.5 py-0.5 text-[10px] bg-[var(--bg-card)] border border-[var(--border)] rounded font-bold shadow-sm">
                ↵
              </kbd>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                Select
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest opacity-80">
            AutoMarketer AI
          </span>
        </div>
      </div>
    </div>
  );
};
