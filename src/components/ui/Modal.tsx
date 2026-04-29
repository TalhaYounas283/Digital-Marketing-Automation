import React, { useEffect } from "react";
import { X } from "lucide-react";

type ModalSize = "sm" | "md" | "lg" | "xl";

const SIZE_TO_MAX_WIDTH: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  size?: ModalSize;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth,
  size = "md",
}) => {
  const widthClass = maxWidth ?? SIZE_TO_MAX_WIDTH[size];
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);

    // Lock body scroll
    if (isOpen) document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`bg-[var(--bg-card)] border border-[var(--border)] w-full ${widthClass} p-6 rounded-2xl shadow-2xl transform transition-all scale-100 relative animate-fade-in z-10`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[var(--text-primary)] font-display">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors bg-[var(--bg-main)] hover:bg-[var(--bg-card)] p-2 rounded-full"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
