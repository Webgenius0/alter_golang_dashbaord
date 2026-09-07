import React, { useState, useEffect } from "react";
import { useCreateWorship, useUpdateWorship, type Worship, type WorshipInput } from "../hooks/worships/useWorships";
import { X, Upload } from "lucide-react";
import { Button } from "./ui/button";

interface AdminWorshipFormProps {
  initialData?: Worship | null;
  onClose: () => void;
}

export function AdminWorshipForm({ initialData, onClose }: AdminWorshipFormProps) {
  const isEditing = !!initialData;
  const createMutation = useCreateWorship();
  const updateMutation = useUpdateWorship();

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

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-secondary w-full max-w-2xl rounded-2xl shadow-2xl border border-border-subtle flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-border-subtle">
          <h2 className="text-xl font-semibold text-text-primary">
            {isEditing ? "Edit Worship Track" : "Add Worship Track"}
          </h2>
          <button
            onClick={onClose}
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
              <label className="text-sm font-medium text-text-primary">Thumbnail URL *</label>
              <input
                required
                type="url"
                name="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={handleChange}
                className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                placeholder="https://res.cloudinary.com/..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Audio URL *</label>
              <input
                required
                type="url"
                name="audio_url"
                value={formData.audio_url}
                onChange={handleChange}
                className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                placeholder="https://res.cloudinary.com/..."
              />
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

        <div className="p-6 border-t border-border-subtle flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" form="worship-form" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Track"}
          </Button>
        </div>
      </div>
    </div>
  );
}
