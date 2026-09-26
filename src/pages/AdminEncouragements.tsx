import { useState } from "react";
import { Plus, Heart } from "lucide-react";
import { AdminEncouragementList } from "../components/encouragements/AdminEncouragementList";
import { AdminEncouragementForm } from "../components/encouragements/AdminEncouragementForm";
import { type Encouragement } from "../hooks/encouragements/useEncouragements";

export function AdminEncouragements() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEncouragement, setEditingEncouragement] = useState<Encouragement | null>(null);

  const handleEdit = (item: Encouragement) => {
    setEditingEncouragement(item);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingEncouragement(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEncouragement(null);
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
              <Heart size={20} />
            </div>
            <h1 className="text-3xl font-semibold text-text-primary">Encouragements</h1>
          </div>
          <p className="text-text-secondary ml-14">
            Manage your daily Encouragements.
          </p>
        </div>
        
        <button
          onClick={handleCreateNew}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-accent text-white font-medium rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 w-full sm:w-auto"
        >
          <Plus size={20} />
          Add Encouragement
        </button>
      </div>

      <AdminEncouragementList onEdit={handleEdit} />

      {isFormOpen && (
        <AdminEncouragementForm
          initialData={editingEncouragement}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
