import { useState } from "react";
import { X } from "lucide-react";
import { useCreateIllustration, useUpdateIllustration, type Illustration, type CreateIllustrationInput } from "../../hooks/illustrations/useIllustrations";

interface AdminIllustrationFormProps {
  initialData?: Illustration | null;
  onClose: () => void;
}

export function AdminIllustrationForm({ initialData, onClose }: AdminIllustrationFormProps) {
  const [formData, setFormData] = useState<CreateIllustrationInput>({
    contentText: initialData?.contentText || "",
    reference: initialData?.reference || "",
  });

  const createMutation = useCreateIllustration();
  const updateMutation = useUpdateIllustration();

  const isEditing = !!initialData;
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateMutation.mutate(
        { id: initialData.id, data: formData },
        { onSuccess: onClose }
      );
    } else {
      createMutation.mutate(formData, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-secondary w-full max-w-2xl rounded-2xl shadow-2xl border border-border-subtle flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-border-subtle shrink-0">
          <h2 className="text-xl font-semibold text-text-primary">
            {isEditing ? `Edit Illustration` : `Add Illustration`}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="illustration-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Content Text
              </label>
              <textarea
                value={formData.contentText}
                onChange={(e) => setFormData({ ...formData, contentText: e.target.value })}
                className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none transition-colors min-h-[150px]"
                placeholder={`Enter illustration content here...`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Reference
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none transition-colors"
                placeholder="e.g. Psalm 23:1-2"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-border-subtle shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-text-secondary hover:text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="illustration-form"
            disabled={isLoading}
            className="px-6 py-2.5 bg-accent text-white font-medium rounded-xl hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isLoading ? "Saving..." : isEditing ? "Save Changes" : `Add Illustration`}
          </button>
        </div>
      </div>
    </div>
  );
}
