import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { useEncouragements, useDeleteEncouragement, type Encouragement } from "../../hooks/encouragements/useEncouragements";
import { ConfirmModal } from "../ConfirmModal";

interface AdminEncouragementListProps {
  onEdit: (item: Encouragement) => void;
}

export function AdminEncouragementList({ onEdit }: AdminEncouragementListProps) {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const { data, isLoading } = useEncouragements(page, limit);
  const deleteMutation = useDeleteEncouragement();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  if (isLoading) {
    return <div className="p-8 text-center text-text-secondary">Loading...</div>;
  }

  const items = data?.data || [];

  return (
    <div className="bg-bg-secondary border border-border-subtle rounded-2xl overflow-hidden shadow-sm animate-slide-up">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-subtle text-xs uppercase tracking-wider text-text-secondary bg-bg-primary/50">
              <th className="p-4 font-medium">Content Text</th>
              <th className="p-4 font-medium">Reference</th>
              <th className="p-4 font-medium w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {items.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-text-secondary">
                  No encouragements found.
                </td>
              </tr>
            ) : (
              items.map((item: Encouragement) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 text-sm text-text-primary whitespace-pre-wrap max-w-2xl">
                    {item.contentText.length > 150 ? `${item.contentText.slice(0, 150)}...` : item.contentText}
                  </td>
                  <td className="p-4 text-sm text-text-secondary">
                    {item.reference || "-"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-text-secondary hover:text-accent bg-bg-primary hover:bg-white/10 rounded-lg transition-colors border border-border-subtle"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item.id)}
                        className="p-2 text-text-secondary hover:text-red-500 bg-bg-primary hover:bg-red-500/10 rounded-lg transition-colors border border-border-subtle"
                        title="Delete"
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

      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2 p-4 border-t border-border-subtle">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm bg-bg-primary rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-text-secondary">
            Page {page} of {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            className="px-4 py-2 text-sm bg-bg-primary rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          title="Delete Item"
          message={`Are you sure you want to delete this encouragement? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={() => {
            deleteMutation.mutate(deleteTarget, {
              onSuccess: () => setDeleteTarget(null)
            });
          }}
          onClose={() => setDeleteTarget(null)}
          isDestructive={true}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
