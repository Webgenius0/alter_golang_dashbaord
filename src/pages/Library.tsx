import { useState } from "react";
import { useLibraryItems, useDeleteLibraryItem, useLibraryCategories, type LibraryItem } from "../hooks/library/useLibrary";
import { LibraryForm } from "../components/LibraryForm";
import { CategoryManager } from "../components/CategoryManager";
import { Plus, Edit2, Trash2, Filter, Settings2 } from "lucide-react";

export function Library() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  const { data: categoriesData = [] } = useLibraryCategories();
  const { data: response, isLoading } = useLibraryItems(selectedCategory);
  const libraryItems = response?.data || [];
  
  const deleteMutation = useDeleteLibraryItem();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);

  const handleEdit = (item: LibraryItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this library item?")) {
      deleteMutation.mutate(id);
    }
  };

  const categories = ["All", ...categoriesData.map(c => c.name)];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-text-primary">Library</h1>
          <p className="text-text-secondary mt-2">Manage library content (Prayers, Illustrations, etc.) for mobile users.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCategoryManagerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary font-semibold rounded-lg transition-colors border border-border-subtle"
          >
            <Settings2 size={20} />
            Categories
          </button>
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors shadow-lg shadow-accent/20"
          >
            <Plus size={20} />
            Add Library Item
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-text-secondary">
          <Filter size={20} />
          <span className="font-medium">Filter by Category:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-text-primary text-bg-primary shadow-lg"
                  : "bg-bg-secondary text-text-secondary border border-border-subtle hover:bg-bg-tertiary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-text-secondary flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          Loading library items...
        </div>
      ) : (
        <div className="bg-bg-secondary border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 border-b border-border-subtle">
                  <th className="p-4 font-semibold text-text-secondary text-sm uppercase tracking-wider w-[120px]">Thumbnail</th>
                  <th className="p-4 font-semibold text-text-secondary text-sm uppercase tracking-wider">Title</th>
                  <th className="p-4 font-semibold text-text-secondary text-sm uppercase tracking-wider">Category</th>
                  <th className="p-4 font-semibold text-text-secondary text-sm uppercase tracking-wider">Description</th>
                  <th className="p-4 font-semibold text-text-secondary text-sm uppercase tracking-wider text-right w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {libraryItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-text-secondary">
                      No library items found. Click "Add Library Item" to create one.
                    </td>
                  </tr>
                ) : (
                  libraryItems.map((item) => (
                    <tr key={item.id} className="border-b border-border-subtle hover:bg-white/5 transition-colors group">
                      <td className="p-4 align-middle">
                        <div className="relative w-20 h-16 rounded-lg bg-bg-primary overflow-hidden border border-border-subtle">
                          <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4 align-middle font-medium text-text-primary">
                        {item.title}
                      </td>
                      <td className="p-4 align-middle">
                        <span className="px-3 py-1 bg-bg-tertiary border border-border-subtle rounded-full text-xs font-medium text-text-secondary">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-text-secondary text-sm max-w-[300px] truncate">
                        {item.short_description}
                      </td>
                      <td className="p-4 align-middle text-right space-x-2">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="inline-flex items-center justify-center p-2 bg-bg-tertiary text-text-primary rounded-lg hover:bg-white/10 transition-colors shadow-sm"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteMutation.isPending}
                          className="inline-flex items-center justify-center p-2 bg-bg-tertiary text-red-500 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 shadow-sm"
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
        <LibraryForm 
          initialData={editingItem} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}

      {isCategoryManagerOpen && (
        <CategoryManager onClose={() => setIsCategoryManagerOpen(false)} />
      )}
    </div>
  );
}
