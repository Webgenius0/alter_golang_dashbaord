import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import type { AdminFAQ } from "./AdminFAQList";

interface AdminFAQFormProps {
  faq?: AdminFAQ | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function AdminFAQForm({ faq, isOpen, onClose, onSubmit, isSubmitting }: AdminFAQFormProps) {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question,
        answer: faq.answer,
        sort_order: faq.sort_order,
        is_active: faq.is_active,
      });
    } else {
      setFormData({
        question: "",
        answer: "",
        sort_order: 0,
        is_active: true,
      });
    }
  }, [faq, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      <div className="bg-bg-secondary w-full max-w-lg rounded-2xl shadow-2xl border border-border-subtle flex flex-col overflow-hidden animate-slide-up relative max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-subtle bg-bg-secondary/50">
          <h2 className="text-xl font-bold text-white">
            {faq ? 'Edit FAQ' : 'Add New FAQ'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto">
          <form id="faq-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Question */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Question <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="w-full bg-bg-tertiary border border-border-subtle rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                placeholder="e.g., How do I reset my password?"
              />
            </div>

            {/* Answer */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Answer <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                className="w-full bg-bg-tertiary border border-border-subtle rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
                placeholder="Detailed explanation..."
              />
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Sort Order
              </label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full bg-bg-tertiary border border-border-subtle rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                placeholder="0"
              />
              <p className="text-xs text-text-secondary">Lower numbers appear first</p>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between p-4 bg-bg-tertiary border border-border-subtle rounded-xl">
              <div>
                <h4 className="text-sm font-medium text-white">Active Status</h4>
                <p className="text-xs text-text-secondary mt-1">Show this FAQ in the mobile app</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                  formData.is_active ? 'bg-accent' : 'bg-border-subtle'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    formData.is_active ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-subtle bg-bg-secondary/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            form="faq-form"
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/25"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {faq ? 'Update FAQ' : 'Create FAQ'}
          </button>
        </div>
      </div>
    </div>
  );
}
