import { useState } from "react";
import { Plus } from "lucide-react";
import { useAdminQuotes, useCreateQuote, useUpdateQuote, useDeleteQuote } from "../hooks/quotes/useQuotes";
import type { Quote } from "../hooks/quotes/useQuotes";
import { AdminQuoteList } from "../components/quotes/AdminQuoteList";
import { AdminQuoteForm } from "../components/quotes/AdminQuoteForm";

export function AdminQuotes() {
  const { data: quotes, isLoading } = useAdminQuotes();
  const createMutation = useCreateQuote();
  const updateMutation = useUpdateQuote();
  const deleteMutation = useDeleteQuote();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  const handleFormSubmit = (data: any) => {
    if (editingQuote) {
      updateMutation.mutate(
        { id: editingQuote.id, data },
        { onSuccess: () => setIsFormOpen(false) }
      );
    } else {
      createMutation.mutate(data, { onSuccess: () => setIsFormOpen(false) });
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="h-full flex flex-col p-8 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Daily Quotes</h1>
          <p className="text-text-secondary mt-1">Manage scheduled daily quotes and devotionals.</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setEditingQuote(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl font-medium transition-colors shadow-lg shadow-accent/25"
          >
            <Plus size={20} />
            <span>Add Quote</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-bg-secondary border border-border-subtle rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-black/20">
        <div className="flex-1 overflow-y-auto">
          <AdminQuoteList 
            quotes={quotes || []} 
            isLoading={isLoading} 
            onEdit={(quote) => {
              setEditingQuote(quote);
              setIsFormOpen(true);
            }}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <AdminQuoteForm 
        quote={editingQuote}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
