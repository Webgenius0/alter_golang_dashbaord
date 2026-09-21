import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Plus } from "lucide-react";
import { AdminLanguageList } from "../components/languages/AdminLanguageList";
import type { AdminLanguage } from "../components/languages/AdminLanguageList";
import { AddLanguageModal } from "../components/languages/AddLanguageModal";
import { EditLanguageModal } from "../components/languages/EditLanguageModal";

export function LanguageManagement() {
  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<AdminLanguage | null>(null);

  const fetchLanguages = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const url = new URL(`${import.meta.env.VITE_API_URL}/admin/languages`);
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", limit.toString());
      if (search) {
        url.searchParams.append("search", search);
      }

      const res = await fetch(url.toString(), {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch languages");
      
      setLanguages(data.languages || []);
      setTotalCount(data.total_count || 0);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLanguages();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this language? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/languages/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete language");
      toast.success("Language deleted permanently");
      fetchLanguages(); // Refresh list
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="p-4 lg:p-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Language Management</h1>
          <p className="text-text-secondary mt-1 text-sm lg:text-base">
            Add, update, and manage supported languages.
          </p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl font-bold shadow-lg shadow-accent/25 transition-all w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          Add Language
        </button>
      </div>

      <div className="bg-bg-secondary/50 backdrop-blur-xl border border-border-subtle rounded-3xl overflow-hidden shadow-2xl shadow-black/20">
        <div className="p-4 sm:p-6 border-b border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/5">
          <div className="relative w-full sm:w-[350px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
            <input 
              type="text"
              placeholder="Search by name or code..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset to first page on search
              }}
              className="w-full bg-bg-tertiary border border-border-subtle rounded-xl pl-11 pr-4 py-2.5 text-white placeholder:text-text-secondary/50 focus:border-accent focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all outline-none"
            />
          </div>
          
          <div className="text-sm font-medium text-text-secondary w-full sm:w-auto text-left sm:text-right">
            Total Languages: <span className="text-white font-bold">{totalCount}</span>
          </div>
        </div>

        <AdminLanguageList 
          languages={languages} 
          isLoading={isLoading} 
          onEdit={setEditingLanguage} 
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-between bg-bg-secondary/30">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-lg font-medium text-sm border border-border-subtle hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
            >
              Previous
            </button>
            <span className="text-sm font-medium text-text-secondary">
              Page {page} of {totalPages}
            </span>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-4 py-2 rounded-lg font-medium text-sm border border-border-subtle hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <AddLanguageModal 
          onClose={() => setIsAddModalOpen(false)} 
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchLanguages();
          }} 
        />
      )}

      {editingLanguage && (
        <EditLanguageModal 
          language={editingLanguage}
          onClose={() => setEditingLanguage(null)} 
          onSuccess={() => {
            setEditingLanguage(null);
            fetchLanguages();
          }} 
        />
      )}
    </div>
  );
}
