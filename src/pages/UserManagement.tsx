import { useState, useEffect } from "react";
import { AdminUserList } from "../components/users/AdminUserList";
import { toast } from "sonner";
import { Search } from "lucide-react";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
};

export function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const url = new URL(`${import.meta.env.VITE_API_URL}/admin/users`);
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
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");
      
      setUsers(data.data.users || []);
      setTotalCount(data.data.total_count || 0);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search]);

  const handleUpdateUser = async (id: string, role: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ role, is_active: isActive })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update user");
      toast.success("User updated successfully");
      fetchUsers(); // Refresh list
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete user");
      toast.success("User deleted permanently");
      fetchUsers(); // Refresh list
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-4 lg:p-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-text-primary">User Management</h1>
          <p className="text-text-secondary mt-2">
            View, edit roles, and manage active status of all users.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-bg-secondary border border-border-subtle rounded-xl px-4 py-2 w-full sm:w-[300px] focus-within:border-accent transition-colors">
          <Search size={18} className="text-text-secondary shrink-0" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset page on search
            }}
            className="bg-transparent border-none outline-none w-full text-white placeholder:text-text-secondary text-sm"
          />
        </div>
      </div>

      <AdminUserList 
        users={users} 
        isLoading={isLoading} 
        onUpdate={handleUpdateUser} 
        onDelete={handleDeleteUser} 
        page={page}
        setPage={setPage}
        totalCount={totalCount}
        limit={limit}
      />
    </div>
  );
}
