import React, { useState, useRef } from "react";
import {
  User,
  Camera,
  Mail,
  Lock,
  CheckCircle2,
  Save,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { usersApi } from "@/services/usersApi";

interface ProfileForm {
  name: string;
  email: string;
  workspace: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const buildInitial = (
  name: string | undefined,
  email: string | undefined,
  organization: string | undefined,
): ProfileForm => ({
  name: name ?? "",
  email: email ?? "",
  workspace: organization ?? "AutoMarketer Workspace",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [form, setForm] = useState<ProfileForm>(
    buildInitial(user?.name, user?.email, user?.organization),
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setField = <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 800 * 1024) {
      showToast("Image too large", {
        variant: "warning",
        description: "Choose a file under 800 KB.",
      });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result as string);
      showToast("Photo updated", { variant: "success" });
    };
    reader.readAsDataURL(file);
  };

  const handleDiscard = () => {
    setForm(buildInitial(user?.name, user?.email, user?.organization));
    showToast("Changes discarded", { variant: "info" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      showToast("Name and email are required", { variant: "warning" });
      return;
    }

    const wantsPasswordChange =
      form.newPassword || form.confirmPassword || form.currentPassword;
    if (wantsPasswordChange) {
      if (!form.currentPassword) {
        showToast("Enter your current password", { variant: "warning" });
        return;
      }
      if (form.newPassword.length < 8) {
        showToast("New password must be at least 8 characters", {
          variant: "warning",
        });
        return;
      }
      if (form.newPassword !== form.confirmPassword) {
        showToast("Passwords do not match", { variant: "error" });
        return;
      }
    }

    try {
      const updated = await usersApi.update({
        name: form.name.trim(),
        email: form.email.trim(),
        organization: form.workspace.trim(),
        ...(profilePic ? { profilePicture: profilePic } : {}),
      });
      updateUser({
        name: updated.name,
        email: updated.email,
        organization: updated.organization,
      });

      if (wantsPasswordChange) {
        await usersApi.changePassword({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        });
      }

      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      showToast("Profile saved", { variant: "success" });
    } catch (err) {
      showToast("Save failed", {
        variant: "error",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in transition-colors duration-200 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Account Settings
        </h1>
        <p className="text-[var(--text-secondary)]">
          Manage your profile, preferences, and account security.
        </p>
      </div>

      {isSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 size={20} className="text-emerald-500" />
          <span className="font-medium">Changes saved successfully!</span>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-8 text-center shadow-sm">
            <div className="relative group mx-auto w-32 h-32 mb-6">
              <div className="w-full h-full rounded-full bg-[var(--bg-main)] border-2 border-[var(--border)] flex items-center justify-center overflow-hidden">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-[var(--text-muted)]" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full text-white cursor-pointer"
              >
                <Camera size={24} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <h3 className="font-bold text-[var(--text-primary)] text-lg">
              {form.name || "Your Name"}
            </h3>
            <p className="text-[var(--text-secondary)] text-sm mb-6">
              {user?.role === "admin"
                ? "Administrator"
                : user?.role === "owner"
                  ? "Business Owner"
                  : "Marketing Manager"}
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 rounded-xl border border-[var(--border)] text-[var(--text-primary)] text-sm font-semibold hover:bg-[var(--bg-main)] transition-colors"
            >
              Change Photo
            </button>
            <p className="mt-4 text-[11px] text-[var(--text-muted)]">
              JPG, GIF or PNG. Max size of 800K
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <section className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
            <div className="px-8 py-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-main)] opacity-70">
              <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                <User size={18} className="text-blue-600" /> Personal Information
              </h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-[var(--text-primary)]"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                    />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-[var(--text-primary)]"
                      placeholder="Email address"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={form.workspace}
                  onChange={(e) => setField("workspace", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-[var(--text-primary)]"
                />
              </div>
            </div>
          </section>

          <section className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
            <div className="px-8 py-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-main)] opacity-70">
              <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Lock size={18} className="text-blue-600" /> Security & Password
              </h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={form.currentPassword}
                    onChange={(e) => setField("currentPassword", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-[var(--text-primary)]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={form.newPassword}
                      onChange={(e) => setField("newPassword", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-[var(--text-primary)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setField("confirmPassword", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-[var(--text-primary)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleDiscard}
              className="px-6 py-3 rounded-xl border border-[var(--border)] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-main)] transition-all text-sm"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 group text-sm"
            >
              <Save size={18} />
              Save Settings
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
