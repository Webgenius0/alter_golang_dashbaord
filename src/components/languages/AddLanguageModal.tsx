import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Globe, UploadCloud, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useUploadMedia, useDeleteMedia } from "../../hooks/media/useUploadMedia";
import { getOptimizedImageUrl } from "../../utils/cloudinary";

interface AddLanguageModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddLanguageModal({ onClose, onSuccess }: AddLanguageModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [flagIcon, setFlagIcon] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadMedia();
  const deleteMediaMutation = useDeleteMedia();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    uploadMutation.mutate(file, {
      onSuccess: (data) => {
        setFlagIcon(data.url);
        setIsUploaded(true);
      },
    });
  };

  const handleRemoveImage = () => {
    if (isUploaded && flagIcon) {
      deleteMediaMutation.mutate(flagIcon);
    }
    setFlagIcon("");
    setIsUploaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/languages`, {
        method: "POST",
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
      if (!res.ok) throw new Error(data.message || "Failed to create language");
      
      toast.success("Language created successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-bg-secondary w-full max-w-lg rounded-2xl shadow-2xl border border-border-subtle flex flex-col overflow-hidden animate-slide-up relative max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-accent/10 rounded-xl text-accent">
              <Globe size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Add Language</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-text-secondary hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Language Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. English"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-black/40 border border-border-subtle rounded-xl px-4 py-3 text-white placeholder:text-text-secondary/50 focus:border-accent focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Language Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. en"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full bg-black/40 border border-border-subtle rounded-xl px-4 py-3 text-white placeholder:text-text-secondary/50 focus:border-accent focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Flag Icon</label>
                <div className="flex flex-col gap-3">
                  {flagIcon ? (
                    <div className="relative w-full h-32 rounded-xl border border-border-subtle overflow-hidden bg-black/40 flex items-center justify-center text-4xl group">
                      {flagIcon.startsWith('http') ? (
                        <img 
                          src={getOptimizedImageUrl(flagIcon, true)} 
                          alt="Flag" 
                          className="w-full h-full object-contain p-2" 
                        />
                      ) : (
                        <span>{flagIcon}</span>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-medium backdrop-blur-sm"
                        >
                          <Trash2 size={16} /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full h-24 border-2 border-dashed border-border-subtle hover:border-accent/50 rounded-xl bg-black/20 hover:bg-accent/5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${uploadMutation.isPending ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        {uploadMutation.isPending ? (
                          <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                        ) : (
                          <>
                            <UploadCloud size={24} className="text-text-secondary" />
                            <span className="text-sm font-medium text-text-secondary">Click to upload icon</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="h-px bg-border-subtle flex-1"></div>
                        <span className="text-xs font-semibold text-text-secondary uppercase tracking-widest">Or</span>
                        <div className="h-px bg-border-subtle flex-1"></div>
                      </div>

                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                          <ImageIcon size={18} />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Paste URL or Emoji (e.g. 🇬🇧)"
                          value={flagIcon}
                          onChange={e => setFlagIcon(e.target.value)}
                          className="w-full bg-black/40 border border-border-subtle rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-text-secondary/50 focus:border-accent focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all outline-none"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="w-5 h-5 rounded-md border-border-subtle bg-black/40 text-accent focus:ring-accent focus:ring-offset-bg-secondary"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-white select-none cursor-pointer">
                  Active (Visible to users)
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-border-subtle bg-bg-tertiary flex items-center justify-end gap-3 shrink-0">
              <button 
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-semibold text-text-primary hover:text-white hover:bg-white/5 transition-colors border border-transparent"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isLoading || uploadMutation.isPending}
                className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl font-bold shadow-lg shadow-accent/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {isLoading ? "Saving..." : "Create Language"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
