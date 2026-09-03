import React, { useState } from "react";
import { useLibraryCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "../hooks/library/useLibrary";
import { X, Plus, Edit2, Trash2, Save } from "lucide-react";

interface CategoryManagerProps {
  onClose: () => void;
}

export function CategoryManager({ onClose }: CategoryManagerProps) {
  const { data: categories, isLoading } = useLibraryCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    createMutation.mutate(newCategoryName.trim(), {
      onSuccess: () => setNewCategoryName("")
    });
  };

  const handleUpdate = (id: string) => {
    if (!editingName.trim()) return;
    updateMutation.mutate({ id, name: editingName.trim() }, {
      onSuccess: () => setEditingId(null)
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-primary border border-border-subtle rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border-subtle bg-bg-secondary/50">
          <h2 className="text-xl font-semibold text-text-primary">Manage Categories</h2>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 border-b border-border-subtle">
          <form onSubmit={handleCreate} className="flex items-end gap-2">
            <div className="flex-1 space-y-1">
              <label className="block text-sm font-medium text-text-secondary mb-2">New Category Name</label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Sermons"
                className="w-full px-4 py-2.5 bg-bg-tertiary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={!newCategoryName.trim() || createMutation.isPending}
              className="px-6 py-2.5 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-lg shadow-accent/20"
            >
              <Plus size={18} /> Add
            </button>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="p-8 text-center text-text-secondary">Loading...</div>
          ) : categories?.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">No categories found.</div>
          ) : (
            <ul className="space-y-2 p-4">
              {categories?.map((cat) => (
                <li key={cat.id} className="flex items-center justify-between p-4 bg-bg-tertiary/50 hover:bg-bg-tertiary rounded-xl group transition-all border border-transparent hover:border-border-subtle">
                  {editingId === cat.id ? (
                    <div className="flex items-center gap-2 flex-1 mr-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        autoFocus
                        className="flex-1 px-3 py-1.5 bg-bg-tertiary border border-accent rounded-md text-text-primary focus:outline-none text-sm"
                      />
                      <button
                        onClick={() => handleUpdate(cat.id)}
                        disabled={updateMutation.isPending}
                        className="p-1.5 text-accent hover:bg-accent/10 rounded-md transition-colors"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 text-text-secondary hover:bg-bg-tertiary rounded-md transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-text-primary text-base">{cat.name}</span>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingId(cat.id);
                            setEditingName(cat.name);
                          }}
                          className="p-2 text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
