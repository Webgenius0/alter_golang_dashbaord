import { useState } from "react";
import { AdminPrayerList } from "../components/prayers/AdminPrayerList";
import { AdminPrayerForm } from "../components/prayers/AdminPrayerForm";
import { type Prayer } from "../hooks/prayers/usePrayers";
import { Plus, BookHeart } from "lucide-react";

interface PrayerManagementProps {
  module: "Prayer" | "Faith";
}

export function PrayerManagement({ module }: PrayerManagementProps) {
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
    <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
              <BookHeart size={20} />
            </div>
            <h1 className="text-3xl font-semibold text-text-primary">{module}s</h1>
          </div>
          <p className="text-text-secondary ml-14">
            Manage {module.toLowerCase()}s, categorizations, and media content.
          </p>
        </div>
        
        <button
          onClick={handleCreateNew}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-accent text-white font-medium rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 w-full sm:w-auto"
        >
          <Plus size={20} />
          Add {module}
        </button>
      </div>

      <AdminPrayerList onEdit={handleEdit} module={module} />

      {isFormOpen && (
        <AdminPrayerForm
          initialData={editingPrayer}
          onClose={handleCloseForm}
          module={module}
        />
      )}
    </div>
  );
}
