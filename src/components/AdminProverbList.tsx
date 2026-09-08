import { useState } from "react";
import { useProverbs, useDeleteProverb, type Proverb } from "../hooks/proverbs/useProverbs";
import { Edit2, Trash2, Calendar, LayoutGrid } from "lucide-react";

interface AdminProverbListProps {
  onEdit: (proverb: Proverb) => void;
}

export function AdminProverbList({ onEdit }: AdminProverbListProps) {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const { data, isLoading, isError } = useProverbs(page, limit);
  const deleteMutation = useDeleteProverb();

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/20 text-center">
        Failed to load proverbs. Please try again later.
      </div>
    );
  }

  const proverbs = data?.data || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-bg-secondary border border-border-subtle rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-tertiary border-b border-border-subtle text-text-secondary text-sm">
                <th className="py-4 px-6 font-medium">Proverb Details</th>
                <th className="py-4 px-6 font-medium">Category</th>
                <th className="py-4 px-6 font-medium">Publish Date</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {proverbs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-text-secondary">
                    No proverbs found. Click "Add New Proverb" to create one.
                  </td>
                </tr>
              ) : (
                proverbs.map((proverb) => (
                  <tr key={proverb.id} className="hover:bg-bg-tertiary/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg bg-bg-primary border border-border-subtle overflow-hidden shrink-0">
                          <img 
                            src={proverb.thumbnail_url} 
                            alt={proverb.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://placehold.co/400x225/1A1D24/FFFFFF?text=No+Image";
                            }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-text-primary group-hover:text-accent transition-colors line-clamp-1">
                            {proverb.title}
                          </span>
                          <span className="text-sm text-text-secondary line-clamp-1">
                            {proverb.scripture_reference}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 text-text-secondary text-xs font-medium rounded-full border border-border-subtle">
                        <LayoutGrid size={12} />
                        {proverb.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-text-secondary text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-accent" />
                        {new Date(proverb.publish_date).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(proverb)}
                          className="p-2 text-text-secondary hover:text-accent bg-bg-primary hover:bg-white/10 rounded-lg transition-colors border border-border-subtle"
                          title="Edit Proverb"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(proverb.id, proverb.title)}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-text-secondary hover:text-red-500 bg-bg-primary hover:bg-red-500/10 rounded-lg transition-colors border border-border-subtle"
                          title="Delete Proverb"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {data && data.total_pages > 1 && (
          <div className="p-4 border-t border-border-subtle flex items-center justify-between bg-bg-tertiary">
            <span className="text-sm text-text-secondary">
              Showing <span className="text-text-primary font-medium">{proverbs.length}</span> of <span className="text-text-primary font-medium">{data.total_items}</span> items
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-border-subtle rounded-lg text-sm disabled:opacity-50 hover:bg-white/5 transition-colors text-text-primary"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: data.total_pages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPage(idx + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                      page === idx + 1 
                        ? 'bg-accent text-white border-transparent' 
                        : 'border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-white/5'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(p => Math.min(data.total_pages, p + 1))}
                disabled={page === data.total_pages}
                className="px-3 py-1.5 border border-border-subtle rounded-lg text-sm disabled:opacity-50 hover:bg-white/5 transition-colors text-text-primary"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
