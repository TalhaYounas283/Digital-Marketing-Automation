import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { CheckCircle2, AlertTriangle, Info, X, XCircle } from "lucide-react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (
    title: string,
    options?: { description?: string; variant?: ToastVariant; duration?: number },
  ) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const variantStyles: Record<
  ToastVariant,
  { icon: React.ReactNode; ring: string; bg: string }
> = {
  success: {
    icon: <CheckCircle2 size={18} className="text-green-500" />,
    ring: "ring-green-500/20",
    bg: "bg-green-50 dark:bg-green-950/40",
  },
  error: {
    icon: <XCircle size={18} className="text-red-500" />,
    ring: "ring-red-500/20",
    bg: "bg-red-50 dark:bg-red-950/40",
  },
  warning: {
    icon: <AlertTriangle size={18} className="text-yellow-500" />,
    ring: "ring-yellow-500/20",
    bg: "bg-yellow-50 dark:bg-yellow-950/40",
  },
  info: {
    icon: <Info size={18} className="text-blue-500" />,
    ring: "ring-blue-500/20",
    bg: "bg-blue-50 dark:bg-blue-950/40",
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast: ToastContextType["showToast"] = useCallback(
    (title, options) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const toast: Toast = {
        id,
        title,
        description: options?.description,
        variant: options?.variant ?? "info",
      };
      setToasts((prev) => [...prev, toast]);
      const duration = options?.duration ?? 4500;
      window.setTimeout(() => dismissToast(id), duration);
    },
    [dismissToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 w-[min(360px,calc(100vw-2rem))]">
        {toasts.map((t) => {
          const style = variantStyles[t.variant];
          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 p-3 pr-2 rounded-lg border border-[var(--border)] ${style.bg} shadow-lg ring-1 ${style.ring} animate-fade-in`}
            >
              <div className="mt-0.5">{style.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {t.title}
                </p>
                {t.description && (
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismissToast(t.id)}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
};
