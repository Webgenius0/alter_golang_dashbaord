import { useState } from "react";
import { AdminPrayerList } from "../components/prayers/AdminPrayerList";
import { AdminPrayerForm } from "../components/prayers/AdminPrayerForm";
import { type Prayer } from "../hooks/prayers/usePrayers";
import { Plus, BookHeart } from "lucide-react";

export function PrayerManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState<Prayer | null>(null);

  const handleEdit = (prayer: Prayer) => {
    setEditingPrayer(prayer);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPrayer(null);
  };

  const handleCreateNew = () => {
    setEditingPrayer(null);
    setIsFormOpen(true);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
              <BookHeart size={20} />
            </div>
            <h1 className="text-3xl font-semibold text-text-primary">Prayers</h1>
          </div>
          <p className="text-text-secondary ml-14">
            Manage prayers, categorizations, and media content.
          </p>
        </div>
        
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white font-medium rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5"
        >
          <Plus size={20} />
          Add Prayer
        </button>
      </div>

      <AdminPrayerList onEdit={handleEdit} />

      {isFormOpen && (
        <AdminPrayerForm
          initialData={editingPrayer}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
