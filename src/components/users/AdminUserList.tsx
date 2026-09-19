import { useState } from "react";
import type { AdminUser } from "../../pages/UserManagement";

import { Edit2, Trash2, ChevronLeft, ChevronRight, User as UserIcon } from "lucide-react";
import { EditUserModal } from "./EditUserModal";

interface AdminUserListProps {
  users: AdminUser[];
  isLoading: boolean;
  onUpdate: (id: string, role: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
  page: number;
  setPage: (page: number) => void;
  totalCount: number;
  limit: number;
}

export function AdminUserList({ users, isLoading, onUpdate, onDelete, page, setPage, totalCount, limit }: AdminUserListProps) {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <>
      <div className="bg-bg-secondary border border-border-subtle rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-tertiary/50">
                <th className="p-4 font-medium text-text-secondary text-sm uppercase tracking-wider">User</th>
                <th className="p-4 font-medium text-text-secondary text-sm uppercase tracking-wider">Role</th>
                <th className="p-4 font-medium text-text-secondary text-sm uppercase tracking-wider">Status</th>
                <th className="p-4 font-medium text-text-secondary text-sm uppercase tracking-wider">Joined</th>
                <th className="p-4 font-medium text-text-secondary text-sm uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-secondary">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-secondary">No users found.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-border-subtle" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center border border-border-subtle">
                            <UserIcon size={20} className="text-text-secondary" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-semibold text-text-primary group-hover:text-accent transition-colors">{user.name}</span>
                          <span className="text-xs text-text-secondary">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md border ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md border ${
                        user.is_active
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {user.is_active ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-text-secondary">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="p-2 text-text-secondary hover:text-accent bg-bg-primary hover:bg-white/10 rounded-lg transition-colors border border-border-subtle" 
                          title="Edit User"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => onDelete(user.id)}
                          className="p-2 text-text-secondary hover:text-red-500 bg-bg-primary hover:bg-red-500/10 rounded-lg transition-colors border border-border-subtle" 
                          title="Delete User"
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
        
        {!isLoading && totalPages > 1 && (
          <div className="p-4 border-t border-border-subtle bg-bg-tertiary/30 flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalCount)} of {totalCount} users
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-1.5 rounded-lg bg-bg-primary border border-border-subtle text-text-secondary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-medium px-2 text-white">
                Page {page} of {totalPages}
              </span>
              <button 
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg bg-bg-primary border border-border-subtle text-text-secondary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedUser && (
        <EditUserModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
          onSave={(role, isActive) => {
            onUpdate(selectedUser.id, role, isActive);
            setSelectedUser(null);
          }} 
        />
      )}
    </>
  );
}
