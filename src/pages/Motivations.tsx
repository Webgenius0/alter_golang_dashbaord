import { useState } from "react";
import { useMotivations, useDeleteMotivation, type Motivation } from "../hooks/motivations/useMotivations";
import { MotivationForm } from "../components/MotivationForm";
import { Plus, Edit2, Trash2, Video, PlayCircle } from "lucide-react";

export function Motivations() {
  const { data: motivations, isLoading } = useMotivations();
  const deleteMutation = useDeleteMotivation();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMotivation, setEditingMotivation] = useState<Motivation | null>(null);

  const handleEdit = (motivation: Motivation) => {
    setEditingMotivation(motivation);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingMotivation(null);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this motivation?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-text-primary">Motivations</h1>
          <p className="text-text-secondary mt-2">Manage motivation content for mobile users.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
        >
          <Plus size={20} />
          Add Motivation
        </button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-text-secondary">
          Loading motivations...
        </div>
      ) : (
        <div className="bg-bg-secondary border border-border-subtle rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 border-b border-border-subtle">
                  <th className="p-4 font-semibold text-text-secondary text-sm uppercase tracking-wider">Thumbnail</th>
                  <th className="p-4 font-semibold text-text-secondary text-sm uppercase tracking-wider">Title</th>
                  <th className="p-4 font-semibold text-text-secondary text-sm uppercase tracking-wider">Speaker</th>
                  <th className="p-4 font-semibold text-text-secondary text-sm uppercase tracking-wider">Duration</th>
                  <th className="p-4 font-semibold text-text-secondary text-sm uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {motivations?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-text-secondary">
                      No motivations found. Click "Add Motivation" to create one.
                    </td>
                  </tr>
                ) : (
                  motivations?.map((m) => (
                    <tr key={m.id} className="border-b border-border-subtle hover:bg-white/5 transition-colors group">
                      <td className="p-4 align-middle">
                        <div className="relative w-20 h-12 rounded bg-bg-primary overflow-hidden">
                          <img src={m.thumbnail_url} alt={m.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center text-white/80 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlayCircle size={20} />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle font-medium text-text-primary">
                        {m.title}
                      </td>
                      <td className="p-4 align-middle">{m.speaker_name}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-1 text-sm text-text-secondary">
                          <Video size={14} /> {m.duration}
                        </div>
                      </td>
                      <td className="p-4 align-middle text-right space-x-2">
                        <button 
                          onClick={() => handleEdit(m)}
                          className="inline-flex items-center justify-center p-2 bg-bg-tertiary text-text-primary rounded hover:bg-white/10 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(m.id)}
                          disabled={deleteMutation.isPending}
                          className="inline-flex items-center justify-center p-2 bg-bg-tertiary text-red-500 rounded hover:bg-red-500/20 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isFormOpen && (
        <MotivationForm 
          initialData={editingMotivation} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
}
