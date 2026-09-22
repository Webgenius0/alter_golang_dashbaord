import { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { createPortal } from "react-dom";
import type { Quote } from "../../hooks/quotes/useQuotes";

interface AdminQuoteFormProps {
  quote: Quote | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function AdminQuoteForm({ quote, isOpen, onClose, onSubmit, isSubmitting }: AdminQuoteFormProps) {
  const [formData, setFormData] = useState({
    publish_date: new Date().toISOString().split('T')[0],
    quote_text: "",
    reference: "",
    explanation: ""
  });

  useEffect(() => {
    if (quote && isOpen) {
      setFormData({
        publish_date: quote.publish_date,
        quote_text: quote.quote_text,
        reference: quote.reference || "",
        explanation: quote.explanation || ""
      });
    } else if (!quote && isOpen) {
      setFormData({
        publish_date: new Date().toISOString().split('T')[0],
        quote_text: "",
        reference: "",
        explanation: ""
      });
    }
  }, [quote, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-bg-primary border border-border-subtle rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl shadow-black/50 animate-in slide-in-from-bottom-8 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-border-subtle bg-bg-secondary/50 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {quote ? "Edit Quote" : "Create New Quote"}
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Schedule a daily quote or devotional for users
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <form id="quote-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-secondary flex items-center gap-2">
                  <CalendarIcon size={14} />
                  Publish Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.publish_date}
                  onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                  className="w-full px-4 py-3 bg-bg-tertiary border border-border-subtle rounded-xl text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all [color-scheme:dark]"
                />
                <p className="text-xs text-text-secondary">Users will only see this on or after this date.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-secondary">Scripture Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Psalm 23:1-2"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  className="w-full px-4 py-3 bg-bg-tertiary border border-border-subtle rounded-xl text-white placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-secondary">Quote Text *</label>
              <textarea
                required
                rows={3}
                placeholder="The Lord is my shepherd; I shall not want..."
                value={formData.quote_text}
                onChange={(e) => setFormData({ ...formData, quote_text: e.target.value })}
                className="w-full px-4 py-3 bg-bg-tertiary border border-border-subtle rounded-xl text-white placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none italic"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-secondary">Explanation / Devotional</label>
              <textarea
                rows={8}
                placeholder="Provide context, explanation, or a devotional message..."
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                className="w-full px-4 py-3 bg-bg-tertiary border border-border-subtle rounded-xl text-white placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-y"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-border-subtle bg-bg-secondary/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-text-secondary hover:text-white font-medium rounded-xl hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="quote-form"
            disabled={isSubmitting}
            className="px-8 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover disabled:opacity-50 transition-colors shadow-lg shadow-accent/25"
          >
            {isSubmitting ? "Saving..." : quote ? "Save Changes" : "Create Quote"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
