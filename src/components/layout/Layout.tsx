import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Users,
  Layers,
  User,
  Sun,
  Moon,
  Search,
  Calendar,
  FileText,
  Mail,
} from "lucide-react";
import { CommandPalette } from "../CommandPalette";
import { KimiChatbot } from "../KimiChatbot";

const NavItem = ({
  to,
  icon,
  label,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
        isActive
          ? "bg-blue-600 text-white shadow-sm"
          : "text-slate-300 hover:text-white hover:bg-slate-700/50"
      }`}
    >
      <span className={`${isActive ? "text-white" : "text-slate-400"}`}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
};

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/campaigns":
        return "Campaigns";
      case "/generate":
        return "AI Content Generator";
      case "/calendar":
        return "Content Calendar";
      case "/templates":
        return "Template Library";
      case "/email":
        return "Email Campaigns";
      case "/leads":
        return "Lead Management";
      case "/analytics":
        return "Analytics";
      case "/settings":
        return "Settings";
      case "/profile":
        return "Profile Settings";
      default:
        return "AutoMarketer";
    }
  };

  return (
    <div className="flex h-screen bg-[var(--bg-main)] overflow-hidden transition-colors duration-200">
      {/* Sidebar - Desktop */}
      <aside className="w-64 hidden md:flex flex-col bg-[var(--bg-sidebar)] border-r border-slate-700 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              AutoMarketer
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">
            Main
          </div>
          <NavItem
            to="/"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
          />
          <NavItem
            to="/campaigns"
            icon={<Layers size={18} />}
            label="Campaigns"
          />
          <NavItem
            to="/generate"
            icon={<Sparkles size={18} />}
            label="AI Content"
          />

          <div className="px-3 mt-8 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">
            Content
          </div>
          <NavItem
            to="/calendar"
            icon={<Calendar size={18} />}
            label="Calendar"
          />
          <NavItem
            to="/templates"
            icon={<FileText size={18} />}
            label="Templates"
          />
          <NavItem
            to="/email"
            icon={<Mail size={18} />}
            label="Email Campaigns"
          />

          <div className="px-3 mt-8 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">
            Growth
          </div>
          <NavItem to="/leads" icon={<Users size={18} />} label="Leads" />
          <NavItem
            to="/analytics"
            icon={<BarChart3 size={18} />}
            label="Analytics"
          />
          <NavItem
            to="/settings"
            icon={<Settings size={18} />}
            label="Settings"
          />
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-700/30 border border-slate-700/50">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-inner">
              {user?.name?.slice(0, 2)?.toUpperCase() || "AM"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {user?.name || "Premium User"}
              </p>
              <p className="text-[10px] text-slate-400 truncate opacity-70">
                {user?.email || "enterprise@automarketer.ai"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="h-16 bg-[var(--bg-card)] border-b border-[var(--border)] flex items-center justify-between px-6 shrink-0 z-10 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-slate-500 hover:text-[var(--text-primary)] md:hidden"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
              {getPageTitle()}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="hidden md:flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-blue-600 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-sm transition-all"
              onClick={() => {
                const event = new KeyboardEvent("keydown", {
                  key: "k",
                  ctrlKey: true,
                  metaKey: true,
                  bubbles: true,
                });
                window.dispatchEvent(event);
              }}
            >
              <Search size={16} />
              <span>Search...</span>
              <kbd className="hidden lg:inline-flex items-center gap-1 text-[10px] font-bold opacity-50">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-400 hover:text-yellow-500 dark:hover:text-blue-400 transition-colors"
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="w-8 h-8 rounded-full bg-[var(--bg-main)] border border-[var(--border)] flex items-center justify-center text-slate-500 hover:bg-[var(--bg-card)] transition-colors"
            >
              <User size={16} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-[var(--bg-main)] custom-scrollbar transition-colors duration-200">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        <CommandPalette />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-slate-800 shadow-2xl flex flex-col animate-slide-in">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-700">
              <span className="font-bold text-white">AutoMarketer</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <div className="px-3 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">
                Main
              </div>
              <NavItem
                to="/"
                icon={<LayoutDashboard size={18} />}
                label="Dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <NavItem
                to="/campaigns"
                icon={<Layers size={18} />}
                label="Campaigns"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <NavItem
                to="/generate"
                icon={<Sparkles size={18} />}
                label="AI Content"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              <div className="px-3 mt-6 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">
                Content
              </div>
              <NavItem
                to="/calendar"
                icon={<Calendar size={18} />}
                label="Calendar"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <NavItem
                to="/templates"
                icon={<FileText size={18} />}
                label="Templates"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <NavItem
                to="/email"
                icon={<Mail size={18} />}
                label="Email Campaigns"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              <div className="px-3 mt-6 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">
                Growth
              </div>
              <NavItem
                to="/leads"
                icon={<Users size={18} />}
                label="Leads"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <NavItem
                to="/analytics"
                icon={<BarChart3 size={18} />}
                label="Analytics"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <NavItem
                to="/settings"
                icon={<Settings size={18} />}
                label="Settings"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            </nav>
            <div className="p-4 border-t border-slate-700">
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-slate-400 hover:text-red-400 w-full text-sm font-medium px-3 py-2.5 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
      <KimiChatbot />
    </div>
  );
};
