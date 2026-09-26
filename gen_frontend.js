import * as fs from 'fs';
import * as path from 'path';

const domains = ['illustration', 'encouragement'];
const baseDir = '/home/roushan-sheik/Desktop/Projects/Zic/dashboard/src';

for (const domain of domains) {
  const TitleCase = domain.charAt(0).toUpperCase() + domain.slice(1);
  
  // Create directories
  fs.mkdirSync(path.join(baseDir, 'hooks', `${domain}s`), { recursive: true });
  fs.mkdirSync(path.join(baseDir, 'components', `${domain}s`), { recursive: true });

  const hookContent = `import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface ${TitleCase} {
  id: string;
  contentText: string;
  reference: string;
  createdAt: string;
}

export interface Paginated${TitleCase}Response {
  data: ${TitleCase}[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface Create${TitleCase}Input {
  contentText: string;
  reference: string;
}

const getAuthHeaders = () => ({
  "Authorization": \`Bearer \${localStorage.getItem("accessToken")}\`,
  "Content-Type": "application/json"
});

export const use${TitleCase}s = (page: number, limit: number) => {
  return useQuery<Paginated${TitleCase}Response>({
    queryKey: ["${domain}s", page, limit],
    queryFn: async () => {
      const res = await fetch(\`\${import.meta.env.VITE_API_URL}/admin/${domain}s?page=\${page}&limit=\${limit}\`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch ${domain}s");
      }
      return res.json();
    },
  });
};

export const useCreate${TitleCase} = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Create${TitleCase}Input) => {
      const res = await fetch(\`\${import.meta.env.VITE_API_URL}/admin/${domain}s\`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create ${domain}");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["${domain}s"] });
      toast.success("${TitleCase} created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create ${domain}");
    },
  });
};

export const useUpdate${TitleCase} = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Create${TitleCase}Input }) => {
      const res = await fetch(\`\${import.meta.env.VITE_API_URL}/admin/${domain}s/\${id}\`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update ${domain}");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["${domain}s"] });
      toast.success("${TitleCase} updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update ${domain}");
    },
  });
};

export const useDelete${TitleCase} = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(\`\${import.meta.env.VITE_API_URL}/admin/${domain}s/\${id}\`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete ${domain}");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["${domain}s"] });
      toast.success("${TitleCase} deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete ${domain}");
    },
  });
};
`;

  const listContent = `import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { use${TitleCase}s, useDelete${TitleCase}, type ${TitleCase} } from "../../hooks/${domain}s/use${TitleCase}s";
import { ConfirmModal } from "../ConfirmModal";

interface Admin${TitleCase}ListProps {
  onEdit: (item: ${TitleCase}) => void;
}

export function Admin${TitleCase}List({ onEdit }: Admin${TitleCase}ListProps) {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const { data, isLoading } = use${TitleCase}s(page, limit);
  const deleteMutation = useDelete${TitleCase}();
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
                  No ${domain}s found.
                </td>
              </tr>
            ) : (
              items.map((item: ${TitleCase}) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 text-sm text-text-primary whitespace-pre-wrap max-w-2xl">
                    {item.contentText.length > 150 ? \`\${item.contentText.slice(0, 150)}...\` : item.contentText}
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
          message={\`Are you sure you want to delete this ${domain}? This action cannot be undone.\`}
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
`;

  const formContent = `import { useState } from "react";
import { X } from "lucide-react";
import { useCreate${TitleCase}, useUpdate${TitleCase}, type ${TitleCase}, type Create${TitleCase}Input } from "../../hooks/${domain}s/use${TitleCase}s";

interface Admin${TitleCase}FormProps {
  initialData?: ${TitleCase} | null;
  onClose: () => void;
}

export function Admin${TitleCase}Form({ initialData, onClose }: Admin${TitleCase}FormProps) {
  const [formData, setFormData] = useState<Create${TitleCase}Input>({
    contentText: initialData?.contentText || "",
    reference: initialData?.reference || "",
  });

  const createMutation = useCreate${TitleCase}();
  const updateMutation = useUpdate${TitleCase}();

  const isEditing = !!initialData;
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateMutation.mutate(
        { id: initialData.id, data: formData },
        { onSuccess: onClose }
      );
    } else {
      createMutation.mutate(formData, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-secondary w-full max-w-2xl rounded-2xl shadow-2xl border border-border-subtle flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-border-subtle shrink-0">
          <h2 className="text-xl font-semibold text-text-primary">
            {isEditing ? \`Edit ${TitleCase}\` : \`Add ${TitleCase}\`}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="${domain}-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Content Text
              </label>
              <textarea
                value={formData.contentText}
                onChange={(e) => setFormData({ ...formData, contentText: e.target.value })}
                className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none transition-colors min-h-[150px]"
                placeholder={\`Enter ${domain} content here...\`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Reference
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none transition-colors"
                placeholder="e.g. Psalm 23:1-2"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-border-subtle shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-text-secondary hover:text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="${domain}-form"
            disabled={isLoading}
            className="px-6 py-2.5 bg-accent text-white font-medium rounded-xl hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isLoading ? "Saving..." : isEditing ? "Save Changes" : \`Add ${TitleCase}\`}
          </button>
        </div>
      </div>
    </div>
  );
}
`;

  const pageContent = `import { useState } from "react";
import { Plus, ${domain === 'illustration' ? 'Sparkles' : 'Heart'} } from "lucide-react";
import { Admin${TitleCase}List } from "../components/${domain}s/Admin${TitleCase}List";
import { Admin${TitleCase}Form } from "../components/${domain}s/Admin${TitleCase}Form";
import { type ${TitleCase} } from "../hooks/${domain}s/use${TitleCase}s";

export function Admin${TitleCase}s() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing${TitleCase}, setEditing${TitleCase}] = useState<${TitleCase} | null>(null);

  const handleEdit = (item: ${TitleCase}) => {
    setEditing${TitleCase}(item);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditing${TitleCase}(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditing${TitleCase}(null);
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
              <${domain === 'illustration' ? 'Sparkles' : 'Heart'} size={20} />
            </div>
            <h1 className="text-3xl font-semibold text-text-primary">${TitleCase}s</h1>
          </div>
          <p className="text-text-secondary ml-14">
            Manage your daily ${TitleCase}s.
          </p>
        </div>
        
        <button
          onClick={handleCreateNew}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-accent text-white font-medium rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 w-full sm:w-auto"
        >
          <Plus size={20} />
          Add ${TitleCase}
        </button>
      </div>

      <Admin${TitleCase}List onEdit={handleEdit} />

      {isFormOpen && (
        <Admin${TitleCase}Form
          initialData={editing${TitleCase}}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
`;

  fs.writeFileSync(path.join(baseDir, 'hooks', \`\${domain}s\`, \`use\${TitleCase}s.ts\`), hookContent);
  fs.writeFileSync(path.join(baseDir, 'components', \`\${domain}s\`, \`Admin\${TitleCase}List.tsx\`), listContent);
  fs.writeFileSync(path.join(baseDir, 'components', \`\${domain}s\`, \`Admin\${TitleCase}Form.tsx\`), formContent);
  fs.writeFileSync(path.join(baseDir, 'pages', \`Admin\${TitleCase}s.tsx\`), pageContent);
}
