import { useState } from "react";
import { useWorships, useDeleteWorship, type Worship } from "../hooks/worships/useWorships";
import { AdminWorshipForm } from "../components/AdminWorshipForm";
import { Plus, Edit2, Trash2, Music, Sun, Moon } from "lucide-react";

export function Worship() {
  const [filter, setFilter] = useState<string>("All");
  const { data: response, isLoading } = useWorships(filter);
  const worships = response?.data || [];
  const deleteMutation = useDeleteWorship();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWorship, setEditingWorship] = useState<Worship | null>(null);

  const handleEdit = (worship: Worship) => {
    setEditingWorship(worship);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingWorship(null);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this worship track? This will also remove the assets from Cloudinary.")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-text-primary">Worship Tracks</h1>
          <p className="text-text-secondary mt-2">Manage audio tracks and devotionals for the Worship tab.</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-bg-secondary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent"
          >
            <option value="All">All Times</option>
            <option value="Day">Day</option>
            <option value="Night">Night</option>
          </select>
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
          >
            <Plus size={20} />
            Add Track
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-text-secondary">
          Loading worship tracks...
        </div>
      ) : (
        <div className="bg-bg-secondary border border-border-subtle rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 border-b border-border-subtle">
                  <th className="p-4 font-semibold text-text-secondary text-sm uppercase tracking-wider w-16">Cover</th>
                  <th className="p-4 font-semibold text-text-secondary text-sm uppercase tracking-wider">Title & Artist</th>
                  <th className="p-4 font-semibold text-text-secondary text-sm uppercase tracking-wider">Time</th>
                  <th className="p-4 font-semibold text-text-secondary text-sm uppercase tracking-wider">Duration</th>
                  <th className="p-4 font-semibold text-text-secondary text-sm uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {worships.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-text-secondary">
                      No tracks found. Click "Add Track" to create one.
                    </td>
                  </tr>
                ) : (
                  worships.map((w) => (
                    <tr key={w.id} className="border-b border-border-subtle hover:bg-white/5 transition-colors group">
                      <td className="p-4 align-middle">
                        <div className="w-12 h-12 rounded-lg bg-bg-primary overflow-hidden shrink-0 shadow-sm border border-border-subtle relative">
                          <img src={w.thumbnail_url} alt={w.title} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="font-medium text-text-primary">{w.title}</div>
                        <div className="text-sm text-text-secondary mt-0.5">{w.artist}</div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          w.time_of_day === 'Day' 
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                            : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        }`}>
                          {w.time_of_day === 'Day' ? <Sun size={12} /> : <Moon size={12} />}
                          {w.time_of_day}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                          <Music size={14} /> {w.duration}
                        </div>
                      </td>
                      <td className="p-4 align-middle text-right space-x-2">
                        <button 
                          onClick={() => handleEdit(w)}
                          className="inline-flex items-center justify-center p-2 bg-bg-tertiary text-text-primary rounded hover:bg-white/10 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(w.id)}
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
        <AdminWorshipForm 
          initialData={editingWorship} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
}
