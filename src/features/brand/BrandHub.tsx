import React, { useState } from "react";
import {
  Sparkles,
  Palette,
  Type,
  Target,
  Save,
  CheckCircle2,
  ArrowRight,
  Fingerprint,
} from "lucide-react";

export const BrandHub: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in transition-colors duration-200 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight flex items-center gap-3">
          <Fingerprint className="text-blue-600" size={32} />
          Brand Identity Hub
        </h1>
        <p className="text-[var(--text-secondary)]">
          Define your brand's core essence to power AI-driven marketing
          strategies.
        </p>
      </div>

      {isSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 size={20} className="text-emerald-500" />
          <span className="font-medium">
            Brand guidelines updated successfully!
          </span>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Brand Persona Section */}
        <section className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm lg:col-span-2">
          <div className="px-8 py-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-main)] opacity-70">
            <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles size={18} className="text-blue-600" /> Brand Persona &
              Voice
            </h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    defaultValue="EcoSmart Pro"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-[var(--text-primary)]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">
                    Core Values (Comma separated)
                  </label>
                  <input
                    type="text"
                    defaultValue="Sustainability, Innovation, Efficiency"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-[var(--text-primary)]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">
                  Brand Mission Statement
                </label>
                <textarea
                  rows={4}
                  defaultValue="To empower homeowners with intelligent, sustainable heating solutions that reduce carbon footprints without compromising comfort."
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-[var(--text-primary)] resize-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Visual Identity */}
        <section className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
          <div className="px-8 py-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-main)] opacity-70">
            <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Palette size={18} className="text-blue-600" /> Visual Identity
            </h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-[var(--bg-main)] rounded-xl border border-dashed border-[var(--border)]">
              <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                LOGO
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  Primary Brand Logo
                </p>
                <button
                  type="button"
                  className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline mt-1"
                >
                  Change Logo Asset
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1 flex items-center gap-2">
                <Type size={16} /> Primary Typography
              </label>
              <select className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-[var(--text-primary)]">
                <option>Inter (Sans-Serif)</option>
                <option>Outfit (Modern)</option>
                <option>Playfair Display (Elegant)</option>
                <option>Roboto Mono (Technical)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Strategic Focus */}
        <section className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
          <div className="px-8 py-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-main)] opacity-70">
            <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Target size={18} className="text-blue-600" /> Strategic Focus
            </h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">
                  Primary Keywords
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Smart Home", "Energy Efficient", "Sustainability"].map(
                    (kw) => (
                      <span
                        key={kw}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold"
                      >
                        {kw}
                      </span>
                    ),
                  )}
                  <button
                    type="button"
                    className="px-3 py-1 border border-dashed border-[var(--border)] text-[var(--text-muted)] rounded-lg text-xs font-bold hover:bg-[var(--bg-main)]"
                  >
                    + Add
                  </button>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <p className="text-xs text-[var(--text-muted)] italic">
                  * These keywords will be prioritized in all AI content
                  generation and SEO campaigns.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="lg:col-span-2 flex justify-end gap-3 pt-4">
          <button
            type="button"
            className="px-6 py-3 rounded-xl border border-[var(--border)] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-main)] transition-all text-sm"
          >
            Discard Changes
          </button>
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 group text-sm"
          >
            <Save size={18} />
            Update Identity
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </form>
    </div>
  );
};
