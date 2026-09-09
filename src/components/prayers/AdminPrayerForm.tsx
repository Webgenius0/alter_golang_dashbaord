import React, { useState, useEffect, useRef } from "react";
import { useCreatePrayer, useUpdatePrayer, type Prayer, type PrayerInput } from "../../hooks/prayers/usePrayers";
import { useCategories } from "../../hooks/prayers/useCategories";
import { useSubCategories } from "../../hooks/prayers/useSubCategories";
import { useUploadMedia, useDeleteMedia } from "../../hooks/media/useUploadMedia";
import { X, UploadCloud, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface AdminPrayerFormProps {
  initialData?: Prayer | null;
  onClose: () => void;
}

export function AdminPrayerForm({ initialData, onClose }: AdminPrayerFormProps) {
  const isEditing = !!initialData;
  const createMutation = useCreatePrayer();
  const updateMutation = useUpdatePrayer();
  const uploadMutation = useUploadMedia();
  const deleteMediaMutation = useDeleteMedia();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const [isThumbnailUploaded, setIsThumbnailUploaded] = useState(false);
  const [isMediaUploaded, setIsMediaUploaded] = useState(false);

  const [targetAudience, setTargetAudience] = useState<string>("General");

  const [formData, setFormData] = useState<PrayerInput>({
    title: "",
    categoryId: "",
    subCategoryId: "",
    ageGroup: "",
    mediaType: "Audio",
    duration: "",
    thumbnailUrl: "",
    mediaUrl: "",
    contentText: "",
  });

  const { data: categories } = useCategories();
  const { data: subCategories } = useSubCategories(formData.categoryId);

  useEffect(() => {
    if (initialData) {
      if (initialData.category?.targetAudience) {
        setTargetAudience(initialData.category.targetAudience);
      }
      setFormData({
        title: initialData.title,
        categoryId: initialData.categoryId,
        subCategoryId: initialData.subCategoryId || "",
        ageGroup: initialData.ageGroup || "",
        mediaType: initialData.mediaType,
        duration: initialData.duration,
        thumbnailUrl: initialData.thumbnailUrl,
        mediaUrl: initialData.mediaUrl,
        contentText: initialData.contentText,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAudienceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const aud = e.target.value;
    setTargetAudience(aud);
    setFormData({
      ...formData,
      categoryId: "", // Reset category when audience changes
      subCategoryId: "",
      ageGroup: aud === "General" ? "" : formData.ageGroup, // reset age if general
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      categoryId: e.target.value,
      subCategoryId: "", // Reset subcategory when category changes
    });
  };

  const filteredCategories = categories?.filter(c => c.targetAudience === targetAudience) || [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    uploadMutation.mutate(file, {
      onSuccess: (data) => {
        setFormData((prev) => ({ ...prev, thumbnailUrl: data.url }));
        setIsThumbnailUploaded(true);
      },
    });
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check type based on selected media type
    if (formData.mediaType === "Audio" && !file.type.startsWith("audio/")) {
      toast.error("Please select an audio file");
      return;
    }
    if (formData.mediaType === "Video" && !file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    uploadMutation.mutate(file, {
      onSuccess: (data) => {
        setFormData((prev) => ({ ...prev, mediaUrl: data.url }));
        setIsMediaUploaded(true);
      },
    });
  };

  const handleRemoveThumbnail = () => {
    if (isThumbnailUploaded && formData.thumbnailUrl) {
      deleteMediaMutation.mutate(formData.thumbnailUrl);
    }
    setFormData(prev => ({ ...prev, thumbnailUrl: "" }));
    setIsThumbnailUploaded(false);
  };

  const handleRemoveMedia = () => {
    if (isMediaUploaded && formData.mediaUrl) {
      deleteMediaMutation.mutate(formData.mediaUrl);
    }
    setFormData(prev => ({ ...prev, mediaUrl: "" }));
    setIsMediaUploaded(false);
  };

  const handleCancel = () => {
    if (isThumbnailUploaded && formData.thumbnailUrl) {
      deleteMediaMutation.mutate(formData.thumbnailUrl);
    }
    if (isMediaUploaded && formData.mediaUrl) {
      deleteMediaMutation.mutate(formData.mediaUrl);
    }
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      subCategoryId: formData.subCategoryId || undefined,
      ageGroup: formData.ageGroup || undefined,
    };

    if (isEditing && initialData) {
      updateMutation.mutate(
        { id: initialData.id, data: payload },
        { onSuccess: onClose }
      );
    } else {
      createMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || uploadMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-secondary w-full max-w-4xl rounded-2xl shadow-2xl border border-border-subtle flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-border-subtle shrink-0">
          <h2 className="text-xl font-semibold text-text-primary">
            {isEditing ? "Edit Prayer" : "Add Prayer"}
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="prayer-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Title *</label>
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                placeholder="e.g. Morning Gratitude"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Target Audience *</label>
                <select
                  value={targetAudience}
                  onChange={handleAudienceChange}
                  className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors appearance-none"
                >
                  <option value="General">General</option>
                  <option value="Kids">Kids</option>
                  <option value="Teens">Teens</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Category *</label>
                <select
                  required
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleCategoryChange}
                  className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors appearance-none"
                  disabled={filteredCategories.length === 0}
                >
                  {filteredCategories.length === 0 ? (
                    <option value="" disabled>No categories for {targetAudience}</option>
                  ) : (
                    <option value="" disabled>Select a category</option>
                  )}
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Subcategory (Optional)</label>
                <select
                  name="subCategoryId"
                  value={formData.subCategoryId || ""}
                  onChange={handleChange}
                  className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors appearance-none"
                  disabled={!formData.categoryId || !subCategories || subCategories.length === 0}
                >
                  {(!formData.categoryId) ? (
                    <option value="">Select category first</option>
                  ) : (!subCategories || subCategories.length === 0) ? (
                    <option value="">No subcategories available</option>
                  ) : (
                    <option value="">None (Optional)</option>
                  )}
                  {subCategories?.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {targetAudience !== "General" && (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-sm font-medium text-text-primary">Age Group *</label>
                  <select
                    required
                    name="ageGroup"
                    value={formData.ageGroup}
                    onChange={handleChange}
                    className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors appearance-none"
                  >
                    <option value="" disabled>Select age group</option>
                    {targetAudience === "Kids" && (
                      <>
                        <option value="Age 0-5">Age 0-5</option>
                        <option value="Age 6-13">Age 6-13</option>
                      </>
                    )}
                    {targetAudience === "Teens" && (
                      <>
                        <option value="Age 13-15">Age 13-15</option>
                        <option value="Age 15-18">Age 15-18</option>
                      </>
                    )}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Media Type *</label>
                <select
                  required
                  name="mediaType"
                  value={formData.mediaType}
                  onChange={handleChange}
                  className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors appearance-none"
                >
                  <option value="Audio">Audio</option>
                  <option value="Video">Video</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Duration (Optional)</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                  placeholder="e.g. 3 min"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Thumbnail Image (Optional)</label>
                <div className="flex flex-col gap-3">
                  {!formData.thumbnailUrl && (
                    <>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        <button
                          type="button"
                          className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary border border-border-subtle hover:bg-white/10 text-text-primary font-medium rounded-lg transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadMutation.isPending}
                        >
                          <UploadCloud size={18} />
                          {uploadMutation.isPending ? "Uploading..." : "Upload Image"}
                        </button>
                      </div>
                      <input
                        type="url"
                        name="thumbnailUrl"
                        value={formData.thumbnailUrl}
                        onChange={handleChange}
                        className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                        placeholder="Or paste URL here..."
                      />
                    </>
                  )}

                  {formData.thumbnailUrl && (
                    <div className="w-full aspect-video rounded-xl overflow-hidden border border-border-subtle shadow-md bg-bg-tertiary relative group mt-2">
                      <img 
                        src={formData.thumbnailUrl} 
                        alt="Thumbnail Preview" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveThumbnail}
                        className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-red-500 text-white rounded-full transition-colors z-10"
                        title="Remove Image"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">
                  {formData.mediaType} File (Optional)
                </label>
                <div className="flex flex-col gap-3">
                  {!formData.mediaUrl && (
                    <>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          accept={formData.mediaType === "Audio" ? "audio/*" : "video/*"}
                          ref={mediaInputRef}
                          className="hidden"
                          onChange={handleMediaUpload}
                        />
                        <button
                          type="button"
                          className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary border border-border-subtle hover:bg-white/10 text-text-primary font-medium rounded-lg transition-colors"
                          onClick={() => mediaInputRef.current?.click()}
                          disabled={uploadMutation.isPending}
                        >
                          <UploadCloud size={18} />
                          {uploadMutation.isPending ? "Uploading..." : `Upload ${formData.mediaType}`}
                        </button>
                      </div>
                      <input
                        type="url"
                        name="mediaUrl"
                        value={formData.mediaUrl}
                        onChange={handleChange}
                        className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                        placeholder={`Or paste ${formData.mediaType} URL here...`}
                      />
                    </>
                  )}
                  
                  {formData.mediaUrl && (
                    <div className="w-full rounded-xl p-4 border border-border-subtle bg-bg-tertiary relative flex flex-col gap-2 mt-2">
                      {formData.mediaType === "Audio" ? (
                        <audio 
                          src={formData.mediaUrl}
                          className="w-full h-10"
                          controls
                        />
                      ) : (
                        <video 
                          src={formData.mediaUrl}
                          className="w-full max-h-40 rounded-lg"
                          controls
                        />
                      )}
                      <button
                        type="button"
                        onClick={handleRemoveMedia}
                        className="self-end text-sm flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} /> Remove Media
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Content Text</label>
              <textarea
                name="contentText"
                value={formData.contentText}
                onChange={handleChange}
                rows={5}
                className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors resize-y"
                placeholder="Prayer text, lyrics, or notes..."
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-border-subtle flex justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={handleCancel} 
            disabled={isLoading}
            className="px-4 py-2 border border-border-subtle text-text-primary rounded-lg hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="prayer-form" 
            disabled={isLoading}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Prayer"}
          </button>
        </div>
      </div>
    </div>
  );
}
