import React, { useState, useEffect, useRef } from "react";
import { useCreateLibraryItem, useUpdateLibraryItem, useLibraryCategories, type LibraryItem, type LibraryInput } from "../hooks/library/useLibrary";
import { useUploadMedia, useDeleteMedia } from "../hooks/media/useUploadMedia";
import { X, Save, Trash2, Video, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface LibraryFormProps {
  initialData?: LibraryItem | null;
  onClose: () => void;
}

export function LibraryForm({ initialData, onClose }: LibraryFormProps) {
  const { data: categories = [] } = useLibraryCategories();
  const [formData, setFormData] = useState<LibraryInput>({
    title: "",
    category: "",
    short_description: "",
    content_text: "",
    thumbnail_url: "",
    media_url: "",
  });

  const createMutation = useCreateLibraryItem();
  const updateMutation = useUpdateLibraryItem();
  const uploadMutation = useUploadMedia();
  const deleteMediaMutation = useDeleteMedia();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const [isThumbnailUploaded, setIsThumbnailUploaded] = useState(false);
  const [isMediaUploaded, setIsMediaUploaded] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        category: initialData.category,
        short_description: initialData.short_description,
        content_text: initialData.content_text,
        thumbnail_url: initialData.thumbnail_url,
        media_url: initialData.media_url || "",
      });
    } else if (categories.length > 0 && !formData.category) {
      setFormData(prev => ({ ...prev, category: categories[0].name }));
    }
  }, [initialData, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    uploadMutation.mutate(file, {
      onSuccess: (data) => {
        setFormData((prev) => ({ ...prev, thumbnail_url: data.url }));
        setIsThumbnailUploaded(true);
      },
    });
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadMutation.mutate(file, {
      onSuccess: (data) => {
        setFormData((prev) => ({ ...prev, media_url: data.url }));
        setIsMediaUploaded(true);
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      updateMutation.mutate({ id: initialData.id, data: formData }, {
        onSuccess: () => onClose(),
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => onClose(),
      });
    }
  };

  const handleRemoveThumbnail = () => {
    if (isThumbnailUploaded && formData.thumbnail_url) {
      deleteMediaMutation.mutate(formData.thumbnail_url);
    }
    setFormData((prev) => ({ ...prev, thumbnail_url: "" }));
    setIsThumbnailUploaded(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveMedia = () => {
    if (isMediaUploaded && formData.media_url) {
      deleteMediaMutation.mutate(formData.media_url);
    }
    setFormData((prev) => ({ ...prev, media_url: "" }));
    setIsMediaUploaded(false);
    if (mediaInputRef.current) mediaInputRef.current.value = "";
  };

  const handleCancel = () => {
    if (isThumbnailUploaded && formData.thumbnail_url && !initialData?.thumbnail_url) {
      deleteMediaMutation.mutate(formData.thumbnail_url);
    }
    if (isMediaUploaded && formData.media_url && !initialData?.media_url) {
      deleteMediaMutation.mutate(formData.media_url);
    }
    onClose();
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-primary border border-border-subtle rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border-subtle bg-bg-secondary/50">
          <h2 className="text-xl font-semibold text-text-primary">
            {initialData ? "Edit Library Item" : "Create Library Item"}
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="library-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thumbnail Upload */}
              <div className="space-y-2 md:col-span-1">
                <label className="block text-sm font-medium text-text-secondary">Thumbnail (Required)</label>
                {formData.thumbnail_url ? (
                  <div className="relative group rounded-xl overflow-hidden border border-border-subtle aspect-video bg-bg-secondary">
                    <img src={formData.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={handleRemoveThumbnail}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-border-subtle rounded-xl p-8 cursor-pointer hover:border-accent hover:bg-bg-tertiary transition-all group aspect-video"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <ImageIcon size={32} className="text-text-secondary group-hover:text-accent mb-3" />
                    <p className="text-sm text-text-secondary font-medium">Click to upload thumbnail</p>
                    <p className="text-xs text-text-secondary opacity-70 mt-1">JPEG, PNG, WEBP</p>
                  </div>
                )}
              </div>

              {/* Media Upload (Optional) */}
              <div className="space-y-2 md:col-span-1">
                <label className="block text-sm font-medium text-text-secondary">Media URL (Optional)</label>
                {formData.media_url ? (
                  <div className="relative group rounded-xl overflow-hidden border border-border-subtle aspect-video bg-bg-secondary">
                    {formData.media_url.endsWith(".mp4") || formData.media_url.endsWith(".mov") || formData.media_url.endsWith(".webm") ? (
                       <video src={formData.media_url} controls className="w-full h-full object-cover" />
                    ) : (
                       <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                         <Video size={32} className="text-accent mb-2" />
                         <span className="text-sm font-medium text-text-primary break-all">Media Uploaded</span>
                       </div>
                    )}
                    <button
                      type="button"
                      onClick={handleRemoveMedia}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => mediaInputRef.current?.click()}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-border-subtle rounded-xl p-8 cursor-pointer hover:border-accent hover:bg-bg-tertiary transition-all group aspect-video"
                  >
                    <input
                      type="file"
                      ref={mediaInputRef}
                      className="hidden"
                      accept="video/*,audio/*"
                      onChange={handleMediaUpload}
                    />
                    <Video size={32} className="text-text-secondary group-hover:text-accent mb-3" />
                    <p className="text-sm text-text-secondary font-medium">Click to upload media (audio/video)</p>
                    <p className="text-xs text-text-secondary opacity-70 mt-1">Max 200MB</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-bg-tertiary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                  placeholder="E.g. Streams of Living Water"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-bg-tertiary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors appearance-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                  {categories.length === 0 && <option value="">No categories available</option>}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-text-secondary">Short Description</label>
                <input
                  type="text"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-bg-tertiary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                  placeholder="A brief summary for the list view..."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-text-secondary">Content Text</label>
                <textarea
                  name="content_text"
                  value={formData.content_text}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full px-4 py-2.5 bg-bg-tertiary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors resize-none"
                  placeholder="The full text content of the library item..."
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-border-subtle bg-bg-secondary/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="library-form"
            disabled={isSubmitting || uploadMutation.isPending || !formData.thumbnail_url}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-accent rounded-lg hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-accent/20"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Saving...</span>
            ) : (
              <>
                <Save size={18} />
                Save Item
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
