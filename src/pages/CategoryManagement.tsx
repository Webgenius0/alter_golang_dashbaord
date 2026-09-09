import { useState } from "react";
import { FolderTree, Plus, Edit2, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "../hooks/prayers/useCategories";
import type { Category } from "../hooks/prayers/useCategories";
import { useSubCategories, useCreateSubCategory, useUpdateSubCategory, useDeleteSubCategory } from "../hooks/prayers/useSubCategories";
import type { SubCategory } from "../hooks/prayers/useSubCategories";
import { toast } from "sonner";

export function CategoryManagement() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", targetAudience: "General" as any });


  const handleOpenCategoryModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({ name: category.name, targetAudience: category.targetAudience });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: "", targetAudience: "General" });
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return toast.error("Name is required");

    if (editingCategory) {
      updateCategory.mutate({ id: editingCategory.id, data: categoryForm }, {
        onSuccess: () => setIsCategoryModalOpen(false)
      });
    } else {
      createCategory.mutate(categoryForm, {
        onSuccess: () => setIsCategoryModalOpen(false)
      });
    }
  };


  return (
    <div className="p-8 pb-24 max-w-5xl mx-auto animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
              <FolderTree size={20} />
            </div>
            <h1 className="text-3xl font-semibold text-text-primary">Categories</h1>
          </div>
          <p className="text-text-secondary ml-14">
            Manage prayer categories and subcategories.
          </p>
        </div>
        
        <button
          onClick={() => handleOpenCategoryModal()}
          className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white font-medium rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 hover:shadow-accent/40"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <div className="bg-bg-secondary/50 backdrop-blur-md rounded-2xl border border-border-subtle overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-text-secondary">Loading categories...</div>
        ) : categories?.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">No categories found.</div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {categories?.map(category => (
              <CategoryRow 
                key={category.id} 
                category={category} 
                isExpanded={expandedCategory === category.id}
                onToggle={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                onEdit={() => handleOpenCategoryModal(category)}
                onDelete={() => {
                  if (confirm("Are you sure? This will delete all associated subcategories and prayers.")) {
                    deleteCategory.mutate(category.id);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-primary border border-border-subtle rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">{editingCategory ? "Edit Category" : "New Category"}</h2>
            <form onSubmit={handleSaveCategory} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={e => setCategoryForm({...categoryForm, name: e.target.value})}
                  className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-4 py-2.5 text-white focus:border-accent focus:outline-none transition-colors"
                  placeholder="e.g. Morning Prayers"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Target Audience</label>
                <select
                  value={categoryForm.targetAudience}
                  onChange={e => setCategoryForm({...categoryForm, targetAudience: e.target.value as any})}
                  className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-4 py-2.5 text-white focus:border-accent focus:outline-none transition-colors"
                >
                  <option value="General">General</option>
                  <option value="Kids">Kids</option>
                  <option value="Teens">Teens</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 text-text-secondary hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={createCategory.isPending || updateCategory.isPending} className="px-6 py-2 bg-accent text-white rounded-xl hover:bg-accent-hover transition-colors font-medium">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryRow({ category, isExpanded, onToggle, onEdit, onDelete }: any) {
  const { data: subCategories, isLoading } = useSubCategories(isExpanded ? category.id : undefined);
  const createSub = useCreateSubCategory();
  const updateSub = useUpdateSubCategory();
  const deleteSub = useDeleteSubCategory();

  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<SubCategory | null>(null);
  const [subName, setSubName] = useState("");

  const handleOpenSubModal = (sub?: SubCategory) => {
    if (sub) {
      setEditingSub(sub);
      setSubName(sub.name);
    } else {
      setEditingSub(null);
      setSubName("");
    }
    setIsSubModalOpen(true);
  };

  const handleSaveSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return toast.error("Name is required");

    if (editingSub) {
      updateSub.mutate({ id: editingSub.id, data: { categoryId: category.id, name: subName } }, {
        onSuccess: () => setIsSubModalOpen(false)
      });
    } else {
      createSub.mutate({ categoryId: category.id, name: subName }, {
        onSuccess: () => setIsSubModalOpen(false)
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between p-4 hover:bg-bg-tertiary/50 transition-colors cursor-pointer group" onClick={onToggle}>
        <div className="flex items-center gap-4">
          <div className="text-text-secondary">
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
          <div>
            <div className="font-semibold text-white">{category.name}</div>
            <div className="text-xs text-text-secondary mt-0.5 px-2 py-0.5 bg-white/5 rounded-md inline-block">{category.targetAudience}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
          <button onClick={() => handleOpenSubModal()} className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors" title="Add Subcategory">
            <Plus size={16} />
          </button>
          <button onClick={onEdit} className="p-2 text-text-secondary hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <Edit2 size={16} />
          </button>
          <button onClick={onDelete} className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-bg-primary/30 pl-14 pr-4 py-4 border-t border-border-subtle/50">
          <div className="text-sm font-medium text-text-secondary mb-3 flex justify-between items-center">
            <span>Subcategories</span>
          </div>
          {isLoading ? (
            <div className="text-sm text-text-secondary py-2">Loading...</div>
          ) : subCategories?.length === 0 ? (
            <div className="text-sm text-text-secondary py-2">No subcategories yet.</div>
          ) : (
            <div className="flex flex-col gap-2">
              {subCategories?.map(sub => (
                <div key={sub.id} className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl border border-border-subtle/50 group/sub">
                  <span className="text-sm font-medium text-white">{sub.name}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenSubModal(sub)} className="p-1.5 text-text-secondary hover:text-white hover:bg-white/10 rounded-md transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => {
                      if (confirm("Delete subcategory?")) deleteSub.mutate(sub.id);
                    }} className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isSubModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-primary border border-border-subtle rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold mb-4">{editingSub ? "Edit Subcategory" : "New Subcategory"}</h2>
            <form onSubmit={handleSaveSub} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                <input
                  type="text"
                  value={subName}
                  onChange={e => setSubName(e.target.value)}
                  className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-4 py-2.5 text-white focus:border-accent focus:outline-none transition-colors"
                  placeholder="e.g. Thanksgiving"
                />
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setIsSubModalOpen(false)} className="px-4 py-2 text-text-secondary hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={createSub.isPending || updateSub.isPending} className="px-6 py-2 bg-accent text-white rounded-xl hover:bg-accent-hover transition-colors font-medium">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
