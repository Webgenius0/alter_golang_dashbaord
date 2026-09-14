import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = true,
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-bg-secondary w-full max-w-md rounded-2xl shadow-2xl border border-border-subtle flex flex-col overflow-hidden animate-slide-up relative">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors disabled:opacity-50"
        >
          <X size={20} />
        </button>
        <div className="p-6">
          <div className="flex flex-col items-center text-center gap-4">
            <div className={`shrink-0 p-4 rounded-full ${isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-accent/10 text-accent'}`}>
              <AlertTriangle size={32} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{message}</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-border-subtle bg-bg-tertiary flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-border-subtle text-text-primary rounded-xl hover:bg-white/5 transition-colors disabled:opacity-50 font-medium"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 text-white rounded-xl transition-colors font-medium flex items-center justify-center disabled:opacity-50 ${
              isDestructive 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-accent hover:bg-accent-hover'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
