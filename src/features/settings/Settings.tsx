import React, { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Globe,
  Monitor,
  Moon,
  Sun,
  Twitter,
  Linkedin,
  Facebook,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// --- Social Accounts Component (Inline for Simplicity) ---
interface SocialAccount {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  username?: string;
  color: string;
}

const SocialConnections = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    {
      id: "twitter",
      name: "Twitter",
      icon: <Twitter size={20} />,
      connected: false,
      color: "bg-sky-500",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: <Linkedin size={20} />,
      connected: true,
      username: "@automarketer_inc",
      color: "bg-blue-700",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook size={20} />,
      connected: false,
      color: "bg-blue-600",
    },
  ]);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    setConnectingId(id);
    setTimeout(() => {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === id
            ? { ...acc, connected: true, username: "@demo_user" }
            : acc,
        ),
      );
      setConnectingId(null);
    }, 1500);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
        Connected Accounts
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full ${account.color} flex items-center justify-center text-white`}
              >
                {account.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  {account.name}
                </h4>
                {account.connected ? (
                  <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle2 size={12} /> {account.username}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">Not connected</p>
                )}
              </div>
            </div>
            <button
              onClick={() => !account.connected && handleConnect(account.id)}
              disabled={account.connected || connectingId === account.id}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                account.connected
                  ? "bg-green-100 text-green-700 cursor-default"
                  : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90"
              }`}
            >
              {connectingId === account.id ? (
                <Loader2 size={16} className="animate-spin" />
              ) : account.connected ? (
                "Connected"
              ) : (
                "Connect"
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "social", label: "Social Accounts", icon: <Globe size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 animate-fade-in pb-10">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 space-y-2 shrink-0">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
          Settings
        </h1>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 max-w-3xl">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 md:p-8 min-h-[500px]">
          {activeTab === "profile" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                Profile Information
              </h2>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {user?.name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                    Change Avatar
                  </button>
                </div>
              </div>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "social" && <SocialConnections />}

          {activeTab === "notifications" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                Notification Preferences
              </h2>
              <div className="space-y-4">
                {[
                  "Email me about new leads",
                  "Notify me when campaigns finish",
                  "Weekly performance report",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl"
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {item}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                Security Settings
              </h2>
              <button className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors border border-red-200">
                Change Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
