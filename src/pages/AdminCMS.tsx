import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AdminCMSList } from "../components/cms/AdminCMSList";
import type { AdminCMSPage } from "../components/cms/AdminCMSList";
import { AdminCMSForm } from "../components/cms/AdminCMSForm";

export function AdminCMS() {
  const [pages, setPages] = useState<AdminCMSPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<AdminCMSPage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/cms/pages`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch CMS pages");
      
      setPages(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleFormSubmit = async (formData: any) => {
    if (!editingPage) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const url = `${import.meta.env.VITE_API_URL}/admin/cms/pages/${editingPage.slug}`;
        
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save CMS page");
      
      toast.success("Page updated successfully");
      setIsFormOpen(false);
      fetchPages();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Pages</h1>
          <p className="text-text-secondary mt-1">Manage static legal and informational pages</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-bg-secondary border border-border-subtle rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-black/20">
        <div className="flex-1 overflow-y-auto">
          <AdminCMSList 
            pages={pages} 
            isLoading={isLoading} 
            onEdit={(page) => {
              setEditingPage(page);
              setIsFormOpen(true);
            }}
          />
        </div>
      </div>

      <AdminCMSForm 
        page={editingPage}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
