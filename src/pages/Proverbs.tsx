import { useState } from "react";
import { AdminProverbList } from "../components/AdminProverbList";
import { AdminProverbForm } from "../components/AdminProverbForm";
import { type Proverb } from "../hooks/proverbs/useProverbs";
import { Plus, BookText } from "lucide-react";

export function Proverbs() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProverb, setEditingProverb] = useState<Proverb | null>(null);

  const handleEdit = (proverb: Proverb) => {
    setEditingProverb(proverb);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProverb(null);
  };

  const handleCreateNew = () => {
    setEditingProverb(null);
    setIsFormOpen(true);
  };

  return (
    <div className="p-8 pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
              <BookText size={20} />
            </div>
            <h1 className="text-3xl font-semibold text-text-primary">Proverbs</h1>
          </div>
          <p className="text-text-secondary ml-14">
            Manage daily proverbs, devotionals, and scripture readings.
          </p>
        </div>
        
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white font-medium rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5"
        >
          <Plus size={20} />
          Add Proverb
        </button>
      </div>

      <AdminProverbList onEdit={handleEdit} />

      {isFormOpen && (
        <AdminProverbForm
          initialData={editingProverb}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
