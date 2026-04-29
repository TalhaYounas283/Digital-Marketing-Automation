import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface State {
  hasError: boolean;
  error: Error | null;
}

interface Props {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] p-6">
        <div className="max-w-md w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-8 text-center shadow-lg">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <AlertTriangle className="text-red-600" size={28} />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            {this.state.error?.message ||
              "An unexpected error occurred. Please try refreshing the page."}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <RefreshCw size={14} /> Try again
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text-primary)] text-sm font-semibold hover:bg-[var(--bg-main)] transition-colors"
            >
              Go home
            </button>
          </div>
        </div>
      </div>
    );
  }
}
