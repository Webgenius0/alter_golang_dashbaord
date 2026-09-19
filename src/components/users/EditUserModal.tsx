import { useState } from "react";
import type { AdminUser } from "../../pages/UserManagement";
import { X } from "lucide-react";

interface EditUserModalProps {
  user: AdminUser;
  onClose: () => void;
  onSave: (role: string, isActive: boolean) => void;
}

export function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const [role, setRole] = useState(user.role);
  const [isActive, setIsActive] = useState(user.is_active);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(role, isActive);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-bg-primary border border-border-subtle rounded-3xl p-6 w-full max-w-sm shadow-2xl shadow-black/50 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h2 className="text-xl font-bold text-white tracking-tight">Edit User</h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-text-secondary hover:text-white bg-bg-secondary hover:bg-white/10 rounded-lg transition-colors border border-border-subtle"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
          <div className="flex items-center gap-3 p-3 bg-bg-secondary rounded-xl border border-border-subtle">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center">
                <span className="text-lg font-bold text-text-secondary">{user.name.charAt(0)}</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-semibold text-white leading-tight">{user.name}</span>
              <span className="text-xs text-text-secondary">{user.email}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all cursor-pointer appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div>
            <label className="flex items-center justify-between p-4 bg-bg-secondary border border-border-subtle rounded-xl cursor-pointer group hover:border-accent/50 transition-colors">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">Active Status</span>
                <span className="text-xs text-text-secondary">Allow user to log in and use the app</span>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 border border-border-subtle"></div>
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-white bg-bg-secondary hover:bg-bg-tertiary rounded-xl transition-colors border border-border-subtle"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 text-sm font-medium bg-accent text-white rounded-xl hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
