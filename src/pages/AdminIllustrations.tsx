import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { AdminIllustrationList } from "../components/illustrations/AdminIllustrationList";
import { AdminIllustrationForm } from "../components/illustrations/AdminIllustrationForm";
import { type Illustration } from "../hooks/illustrations/useIllustrations";

export function AdminIllustrations() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIllustration, setEditingIllustration] = useState<Illustration | null>(null);

  const handleEdit = (item: Illustration) => {
    setEditingIllustration(item);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingIllustration(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingIllustration(null);
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
              <Sparkles size={20} />
            </div>
            <h1 className="text-3xl font-semibold text-text-primary">Illustrations</h1>
          </div>
          <p className="text-text-secondary ml-14">
            Manage your daily Illustrations.
          </p>
        </div>
        
        <button
          onClick={handleCreateNew}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-accent text-white font-medium rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 w-full sm:w-auto"
        >
          <Plus size={20} />
          Add Illustration
        </button>
      </div>

      <AdminIllustrationList onEdit={handleEdit} />

      {isFormOpen && (
        <AdminIllustrationForm
          initialData={editingIllustration}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
