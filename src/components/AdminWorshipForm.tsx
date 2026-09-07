import React, { useState, useEffect, useRef } from "react";
import { useCreateWorship, useUpdateWorship, type Worship, type WorshipInput } from "../hooks/worships/useWorships";
import { useUploadMedia, useDeleteMedia } from "../hooks/media/useUploadMedia";
import { X, UploadCloud, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface AdminWorshipFormProps {
  initialData?: Worship | null;
  onClose: () => void;
}

export function AdminWorshipForm({ initialData, onClose }: AdminWorshipFormProps) {
  const isEditing = !!initialData;
  const createMutation = useCreateWorship();
  const updateMutation = useUpdateWorship();
  const uploadMutation = useUploadMedia();
  const deleteMediaMutation = useDeleteMedia();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const [isThumbnailUploaded, setIsThumbnailUploaded] = useState(false);
  const [isAudioUploaded, setIsAudioUploaded] = useState(false);

  const [formData, setFormData] = useState<WorshipInput>({
    title: "",
    artist: "",
    time_of_day: "Day",
    duration: "",
    thumbnail_url: "",
    audio_url: "",
    prayer_text: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        artist: initialData.artist,
        time_of_day: initialData.time_of_day,
        duration: initialData.duration,
        thumbnail_url: initialData.thumbnail_url,
        audio_url: initialData.audio_url,
        prayer_text: initialData.prayer_text,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    if (isEditing && initialData) {
      updateMutation.mutate(
        { id: initialData.id, data: formData },
        { onSuccess: onClose }
      );
    } else {
      createMutation.mutate(formData, { onSuccess: onClose });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || uploadMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-secondary w-full max-w-2xl rounded-2xl shadow-2xl border border-border-subtle flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-border-subtle shrink-0">
          <h2 className="text-xl font-semibold text-text-primary">
            {isEditing ? "Edit Worship Track" : "Add Worship Track"}
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="worship-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Title *</label>
                <input
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                  placeholder="e.g. Oceans"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Artist *</label>
                <input
                  required
                  type="text"
                  name="artist"
                  value={formData.artist}
                  onChange={handleChange}
                  className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                  placeholder="e.g. Hillsong"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Time of Day *</label>
                <select
                  required
                  name="time_of_day"
                  value={formData.time_of_day}
                  onChange={handleChange}
                  className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                >
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Duration *</label>
                <input
                  required
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                  placeholder="e.g. 5:42"
                />
              </div>
            </div>

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
                  <div className="w-48 aspect-square rounded-xl overflow-hidden border border-border-subtle shadow-md bg-bg-tertiary relative group mt-2">
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
                  <div className="w-full rounded-xl p-4 border border-border-subtle bg-bg-tertiary relative flex items-center justify-between">
                     <audio 
                      src={formData.audio_url}
                      className="h-10 w-3/4"
                      controls
                    />
                    <button
                      type="button"
                      onClick={handleRemoveAudio}
                      className="p-2 bg-bg-primary hover:bg-red-500/20 text-red-500 rounded-full transition-colors"
                      title="Remove Audio"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Prayer Text</label>
              <textarea
                name="prayer_text"
                value={formData.prayer_text}
                onChange={handleChange}
                rows={4}
                className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors resize-none"
                placeholder="Enter devotional text or lyrics..."
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
            form="worship-form" 
            disabled={isLoading}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Track"}
          </button>
        </div>
      </div>
    </div>
  );
}
