import React, { useState } from "react";
import { User, Bell, Shield, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SocialConnections } from "./SocialConnections";

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
      <div className="w-full md:w-64 space-y-2 shrink-0">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
          Settings
        </h1>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-main)]"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 max-w-3xl">
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm p-6 md:p-8 min-h-[500px]">
          {activeTab === "profile" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Profile Information
              </h2>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {user?.name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <button className="px-4 py-2 bg-[var(--bg-main)] text-[var(--text-secondary)] rounded-lg text-sm font-medium hover:opacity-90 transition-colors">
                    Change Avatar
                  </button>
                </div>
              </div>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "social" && <SocialConnections />}

          {activeTab === "notifications" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
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
                    className="flex items-center justify-between p-4 bg-[var(--bg-main)] rounded-xl"
                  >
                    <span className="text-sm font-medium text-[var(--text-secondary)]">
                      {item}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
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
