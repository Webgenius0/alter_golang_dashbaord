import { useState } from "react";
import { X, Globe } from "lucide-react";
import { toast } from "sonner";
import type { AdminLanguage } from "./AdminLanguageList";

interface EditLanguageModalProps {
  language: AdminLanguage;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditLanguageModal({ language, onClose, onSuccess }: EditLanguageModalProps) {
  const [name, setName] = useState(language.name);
  const [code, setCode] = useState(language.code);
  const [flagIcon, setFlagIcon] = useState(language.flag_icon || "");
  const [isActive, setIsActive] = useState(language.is_active);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/languages/${language.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          code,
          flag_icon: flagIcon || undefined,
          is_active: isActive
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update language");
      
      toast.success("Language updated successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-bg-primary border border-border-subtle rounded-3xl w-full max-w-md overflow-hidden shadow-2xl shadow-black animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-bg-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-accent/10 rounded-xl">
              <Globe className="text-accent" size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Edit Language</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-white bg-bg-tertiary hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-secondary">Language Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. English"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-4 py-3 text-white placeholder:text-text-secondary/50 focus:border-accent focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-secondary">Language Code</label>
            <input 
              type="text" 
              required
              placeholder="e.g. en"
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-4 py-3 text-white placeholder:text-text-secondary/50 focus:border-accent focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-secondary">Flag Icon (URL or Emoji)</label>
            <input 
              type="text" 
              placeholder="e.g. 🇬🇧 or https://example.com/flag.png"
              value={flagIcon}
              onChange={e => setFlagIcon(e.target.value)}
              className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-4 py-3 text-white placeholder:text-text-secondary/50 focus:border-accent focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all outline-none"
            />
            <p className="text-xs text-text-secondary">You can paste an emoji directly or provide an image URL.</p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input 
              type="checkbox" 
              id="isActive"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              className="w-5 h-5 rounded border-border-subtle bg-bg-secondary text-accent focus:ring-accent focus:ring-offset-bg-primary"
            />
            <label htmlFor="isActive" className="text-sm font-semibold text-white select-none cursor-pointer">
              Active (Visible to users)
            </label>
          </div>

          <div className="pt-6 flex items-center justify-end gap-3 border-t border-border-subtle mt-6">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-semibold text-text-secondary hover:text-white hover:bg-bg-tertiary transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl font-bold shadow-lg shadow-accent/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {isLoading ? "Saving..." : "Update Language"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
