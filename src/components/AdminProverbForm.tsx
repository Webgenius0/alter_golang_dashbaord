import React, { useState, useEffect, useRef } from "react";
import { useCreateProverb, useUpdateProverb, type Proverb, type ProverbInput } from "../hooks/proverbs/useProverbs";
import { useUploadMedia, useDeleteMedia } from "../hooks/media/useUploadMedia";
import { X, UploadCloud, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";

interface AdminProverbFormProps {
  initialData?: Proverb | null;
  onClose: () => void;
}

export function AdminProverbForm({ initialData, onClose }: AdminProverbFormProps) {
  const isEditing = !!initialData;
  const createMutation = useCreateProverb();
  const updateMutation = useUpdateProverb();
  const uploadMutation = useUploadMedia();
  const deleteMediaMutation = useDeleteMedia();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const [isThumbnailUploaded, setIsThumbnailUploaded] = useState(false);
  const [isAudioUploaded, setIsAudioUploaded] = useState(false);

  const predefinedCategories = ["Kids Prayer", "Daily Devotional", "Wisdom", "Faith", "Hope"];
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  // Helper to format date for input[type="date"]
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState<ProverbInput>({
    title: "",
    category: "",
    duration: "",
    thumbnail_url: "",
    audio_url: "",
    scripture_reference: "",
    main_text: "",
    explanation: "",
    publish_date: formatDateForInput(new Date().toISOString()),
  });

  useEffect(() => {
    if (initialData) {
      if (initialData.category && !predefinedCategories.includes(initialData.category)) {
        setIsCustomCategory(true);
      }
      setFormData({
        title: initialData.title,
        category: initialData.category,
        duration: initialData.duration,
        thumbnail_url: initialData.thumbnail_url,
        audio_url: initialData.audio_url,
        scripture_reference: initialData.scripture_reference,
        main_text: initialData.main_text,
        explanation: initialData.explanation,
        publish_date: formatDateForInput(initialData.publish_date),
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "custom") {
      setIsCustomCategory(true);
      setFormData({ ...formData, category: "" });
    } else {
      setIsCustomCategory(false);
      setFormData({ ...formData, category: e.target.value });
    }
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

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/") && !file.type.startsWith("video/")) {
      toast.error("Please select an audio file");
      return;
    }

    uploadMutation.mutate(file, {
      onSuccess: (data) => {
        setFormData((prev) => ({ ...prev, audio_url: data.url }));
        setIsAudioUploaded(true);
      },
    });
  };

  const handleRemoveThumbnail = () => {
    if (isThumbnailUploaded && formData.thumbnail_url) {
      deleteMediaMutation.mutate(formData.thumbnail_url);
    }
    setFormData(prev => ({ ...prev, thumbnail_url: "" }));
    setIsThumbnailUploaded(false);
  };

  const handleRemoveAudio = () => {
    if (isAudioUploaded && formData.audio_url) {
      deleteMediaMutation.mutate(formData.audio_url);
    }
    setFormData(prev => ({ ...prev, audio_url: "" }));
    setIsAudioUploaded(false);
  };

  const handleCancel = () => {
    if (isThumbnailUploaded && formData.thumbnail_url) {
      deleteMediaMutation.mutate(formData.thumbnail_url);
    }
    if (isAudioUploaded && formData.audio_url) {
      deleteMediaMutation.mutate(formData.audio_url);
    }
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert local date string back to ISO for backend
    const payload = {
      ...formData,
      publish_date: new Date(formData.publish_date).toISOString(),
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
            {isEditing ? "Edit Proverb" : "Add Proverb"}
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="proverb-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Title *</label>
                <input
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                  placeholder="e.g. Daily Proverbs"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Category *</label>
                {isCustomCategory ? (
                  <div className="flex gap-2">
                    <input
                      required
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                      placeholder="Enter custom category"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(false);
                        setFormData({ ...formData, category: "" });
                      }}
                      className="px-3 bg-bg-tertiary border border-border-subtle text-text-secondary hover:text-text-primary rounded-lg transition-colors"
                      title="Back to predefined categories"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <select
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleCategorySelect}
                    className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors appearance-none"
                  >
                    <option value="" disabled>Select a category</option>
                    {predefinedCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="custom">Other (Custom)</option>
                  </select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Duration *</label>
                <input
                  required
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                  placeholder="e.g. 3 min"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Scripture Reference *</label>
                <input
                  required
                  type="text"
                  name="scripture_reference"
                  value={formData.scripture_reference}
                  onChange={handleChange}
                  className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                  placeholder="e.g. Proverbs 3:5-6"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Publish Date *</label>
                <div className="relative">
                  <input
                    required
                    type="date"
                    name="publish_date"
                    value={formData.publish_date}
                    onChange={handleChange}
                    className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-10 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={18} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Thumbnail Image *</label>
                <div className="flex flex-col gap-3">
                  {!formData.thumbnail_url && (
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
                        required
                        type="url"
                        name="thumbnail_url"
                        value={formData.thumbnail_url}
                        onChange={handleChange}
                        className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                        placeholder="Or paste URL here..."
                      />
                    </>
                  )}

                  {formData.thumbnail_url && (
                    <div className="w-full aspect-video rounded-xl overflow-hidden border border-border-subtle shadow-md bg-bg-tertiary relative group mt-2">
                      <img 
                        src={formData.thumbnail_url} 
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
                <label className="text-sm font-medium text-text-primary">Audio File *</label>
                <div className="flex flex-col gap-3">
                  {!formData.audio_url && (
                    <>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          accept="audio/*,video/*"
                          ref={audioInputRef}
                          className="hidden"
                          onChange={handleAudioUpload}
                        />
                        <button
                          type="button"
                          className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary border border-border-subtle hover:bg-white/10 text-text-primary font-medium rounded-lg transition-colors"
                          onClick={() => audioInputRef.current?.click()}
                          disabled={uploadMutation.isPending}
                        >
                          <UploadCloud size={18} />
                          {uploadMutation.isPending ? "Uploading..." : "Upload Audio"}
                        </button>
                      </div>
                      <input
                        required
                        type="url"
                        name="audio_url"
                        value={formData.audio_url}
                        onChange={handleChange}
                        className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                        placeholder="Or paste Audio URL here..."
                      />
                    </>
                  )}
                  
                  {formData.audio_url && (
                    <div className="w-full rounded-xl p-4 border border-border-subtle bg-bg-tertiary relative flex flex-col gap-2">
                       <audio 
                        src={formData.audio_url}
                        className="w-full h-10"
                        controls
                      />
                      <button
                        type="button"
                        onClick={handleRemoveAudio}
                        className="self-end text-sm flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} /> Remove Audio
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Main Text (Scripture Quote) *</label>
              <textarea
                required
                name="main_text"
                value={formData.main_text}
                onChange={handleChange}
                rows={3}
                className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors resize-y"
                placeholder='"Trust in the Lord with all your heart..."'
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Explanation / Devotional *</label>
              <textarea
                required
                name="explanation"
                value={formData.explanation}
                onChange={handleChange}
                rows={5}
                className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors resize-y"
                placeholder="This proverb calls us to a posture of complete surrender..."
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
            form="proverb-form" 
            disabled={isLoading}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Proverb"}
          </button>
        </div>
      </div>
    </div>
  );
}
