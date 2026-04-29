import React from "react";
import { Link } from "react-router-dom";
import { Compass, Home } from "lucide-react";

export const NotFound: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] p-6">
    <div className="max-w-md w-full text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
        <Compass className="text-blue-600" size={32} />
      </div>
      <p className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] mb-2">
        404 — Not Found
      </p>
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
        We can't find that page
      </h1>
      <p className="text-sm text-[var(--text-secondary)] mb-8">
        The page you are looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
      >
        <Home size={16} /> Back to dashboard
      </Link>
    </div>
  </div>
);
