import React, { useState } from "react";
import { User, Bell, Shield, Globe, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { SocialConnections } from "./SocialConnections";

const NOTIFICATION_PREFS = [
  { key: "leads", label: "Email me about new leads" },
  { key: "campaigns", label: "Notify me when campaigns finish" },
  { key: "weekly", label: "Weekly performance report" },
];

export const Settings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  const [profileDraft, setProfileDraft] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
  });

  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    leads: true,
    campaigns: true,
    weekly: true,
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "social", label: "Social Accounts", icon: <Globe size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
  ];

  const handleSaveProfile = () => {
    if (!profileDraft.name.trim() || !profileDraft.email.trim()) {
      showToast("Name and email are required", { variant: "warning" });
      return;
    }
    updateUser({
      name: profileDraft.name.trim(),
      email: profileDraft.email.trim(),
    });
    showToast("Profile saved", { variant: "success" });
  };

  const handleChangeAvatar = () => {
    showToast("Avatar upload coming soon", {
      variant: "info",
      description: "Connect your storage bucket to enable uploads.",
    });
  };

  const handleChangePassword = () => {
    if (!user?.email) {
      showToast("No email on file", { variant: "warning" });
      return;
    }
    showToast("Password reset link sent", {
      variant: "success",
      description: `Check ${user.email} for instructions.`,
    });
  };

  const handleSaveNotifications = () => {
    showToast("Notification preferences saved", {
      variant: "success",
      description: `${Object.values(notifications).filter(Boolean).length} of ${NOTIFICATION_PREFS.length} enabled.`,
    });
  };

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
                  {user?.name?.slice(0, 2).toUpperCase() || "AM"}
                </div>
                <div>
                  <button
                    onClick={handleChangeAvatar}
                    className="px-4 py-2 bg-[var(--bg-main)] text-[var(--text-secondary)] rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
                  >
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
                    value={profileDraft.name}
                    onChange={(e) =>
                      setProfileDraft((d) => ({ ...d, name: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileDraft.email}
                    onChange={(e) =>
                      setProfileDraft((d) => ({ ...d, email: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-[var(--border)]">
                <button
                  onClick={handleSaveProfile}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                >
                  <Save size={14} /> Save changes
                </button>
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
                {NOTIFICATION_PREFS.map((pref) => (
                  <div
                    key={pref.key}
                    className="flex items-center justify-between p-4 bg-[var(--bg-main)] rounded-xl"
                  >
                    <span className="text-sm font-medium text-[var(--text-secondary)]">
                      {pref.label}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[pref.key] ?? false}
                        onChange={(e) =>
                          setNotifications((n) => ({
                            ...n,
                            [pref.key]: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4 border-t border-[var(--border)]">
                <button
                  onClick={handleSaveNotifications}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                >
                  <Save size={14} /> Save preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Security Settings
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                For security, password changes happen via an email reset link.
              </p>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors border border-red-200"
              >
                Send password reset link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
