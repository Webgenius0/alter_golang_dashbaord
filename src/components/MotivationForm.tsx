import React, { useState, useEffect, useRef } from "react";
import { useCreateMotivation, useUpdateMotivation, type Motivation, type MotivationInput } from "../hooks/motivations/useMotivations";
import { useUploadMedia, useDeleteMedia } from "../hooks/media/useUploadMedia";
import { UploadCloud, X, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface MotivationFormProps {
  initialData?: Motivation | null;
  onClose: () => void;
}

export function MotivationForm({ initialData, onClose }: MotivationFormProps) {
  const [formData, setFormData] = useState<MotivationInput>({
    title: "",
    speaker_name: "",
    description: "",
    video_url: "",
    thumbnail_url: "",
    duration: "",
  });

  const createMutation = useCreateMotivation();
  const updateMutation = useUpdateMotivation();
  const uploadMutation = useUploadMedia();
  const deleteMediaMutation = useDeleteMedia();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [isThumbnailUploaded, setIsThumbnailUploaded] = useState(false);
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        speaker_name: initialData.speaker_name,
        description: initialData.description,
        video_url: initialData.video_url,
        thumbnail_url: initialData.thumbnail_url,
        duration: initialData.duration,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    uploadMutation.mutate(file, {
      onSuccess: (data) => {
        setFormData((prev) => ({ ...prev, video_url: data.url }));
        setIsVideoUploaded(true);
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
    setFormData(prev => ({ ...prev, thumbnail_url: "" }));
    setIsThumbnailUploaded(false);
  };

  const handleRemoveVideo = () => {
    if (isVideoUploaded && formData.video_url) {
      deleteMediaMutation.mutate(formData.video_url);
    }
    setFormData(prev => ({ ...prev, video_url: "" }));
    setIsVideoUploaded(false);
  };

  const handleCancel = () => {
    // Clean up orphaned media if the form is cancelled
    if (isThumbnailUploaded && formData.thumbnail_url) {
      deleteMediaMutation.mutate(formData.thumbnail_url);
    }
    if (isVideoUploaded && formData.video_url) {
      deleteMediaMutation.mutate(formData.video_url);
    }
    onClose();
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-bg-secondary border border-border-subtle rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 animate-fade-in shadow-2xl">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-border-subtle">
          <h2 className="text-xl font-semibold text-text-primary">
            {initialData ? "Edit Motivation" : "Add New Motivation"}
          </h2>
          <button 
            onClick={handleCancel} 
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-bg-primary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Speaker Name</label>
              <input
                name="speaker_name"
                value={formData.speaker_name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-bg-primary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Thumbnail Image</label>
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
                      className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary hover:bg-white/10 text-text-primary font-medium rounded-lg transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadMutation.isPending}
                    >
                      <UploadCloud size={18} />
                      {uploadMutation.isPending ? "Uploading..." : "Upload Image"}
                    </button>
                  </div>
                  <div className="mt-3">
                    <input
                      name="thumbnail_url"
                      value={formData.thumbnail_url}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-bg-primary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                      placeholder="Or paste URL here..."
                      required
                    />
                  </div>
                </>
              )}
              
              {formData.thumbnail_url && (
                <div className="w-full max-w-sm aspect-video rounded-xl overflow-hidden border border-border-subtle shadow-md bg-bg-tertiary relative group mt-2">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Video File or URL</label>
              <div className="flex flex-col gap-3 mb-3">
                {!formData.video_url && (
                  <>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="video/*"
                        ref={videoInputRef}
                        className="hidden"
                        onChange={handleVideoUpload}
                      />
                      <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary hover:bg-white/10 text-text-primary font-medium rounded-lg transition-colors"
                        onClick={() => videoInputRef.current?.click()}
                        disabled={uploadMutation.isPending}
                      >
                        <UploadCloud size={18} />
                        Upload Video
                      </button>
                    </div>
                    <input
                      name="video_url"
                      type="text"
                      value={formData.video_url}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-bg-primary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                      placeholder="Or paste video URL here..."
                      required
                    />
                  </>
                )}
                {formData.video_url && (
                  <div className="w-full aspect-video rounded-xl overflow-hidden border border-border-subtle shadow-md bg-black mt-2 relative group">
                    <video 
                      src={formData.video_url}
                      className="w-full h-full object-contain"
                      controls
                      muted
                    />
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-red-500 text-white rounded-full transition-colors z-10"
                      title="Remove Video"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Duration (e.g. 18:24)</label>
              <input
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-bg-primary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-text-secondary/50"
                placeholder="MM:SS"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-bg-primary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors resize-y"
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button 
              type="button" 
              onClick={handleCancel} 
              className="px-6 py-2 border border-border-subtle text-text-primary font-medium rounded-lg hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending || uploadMutation.isPending}
              className="flex items-center gap-2 px-6 py-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              {isPending ? "Saving..." : "Save Motivation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
