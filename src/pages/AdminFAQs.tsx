import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { AdminFAQList } from "../components/faqs/AdminFAQList";
import type { AdminFAQ } from "../components/faqs/AdminFAQList";
import { AdminFAQForm } from "../components/faqs/AdminFAQForm";

export function AdminFAQs() {
  const [faqs, setFaqs] = useState<AdminFAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<AdminFAQ | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/faqs`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch FAQs");
      
      setFaqs(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this FAQ? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/faqs/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete FAQ");
      
      toast.success("FAQ deleted successfully");
      fetchFaqs();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const isEditing = !!editingFaq;
      const url = isEditing 
        ? `${import.meta.env.VITE_API_URL}/admin/faqs/${editingFaq.id}`
        : `${import.meta.env.VITE_API_URL}/admin/faqs`;
        
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save FAQ");
      
      toast.success(isEditing ? "FAQ updated successfully" : "FAQ created successfully");
      setIsFormOpen(false);
      fetchFaqs();
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
          <h1 className="text-3xl font-bold text-white tracking-tight">Help & Support</h1>
          <p className="text-text-secondary mt-1">Manage Frequently Asked Questions for the mobile app</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setEditingFaq(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl font-medium transition-colors shadow-lg shadow-accent/25"
          >
            <Plus size={20} />
            <span>Add FAQ</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-bg-secondary border border-border-subtle rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-black/20">
        <div className="flex-1 overflow-y-auto">
          <AdminFAQList 
            faqs={faqs} 
            isLoading={isLoading} 
            onEdit={(faq) => {
              setEditingFaq(faq);
              setIsFormOpen(true);
            }}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <AdminFAQForm 
        faq={editingFaq}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
