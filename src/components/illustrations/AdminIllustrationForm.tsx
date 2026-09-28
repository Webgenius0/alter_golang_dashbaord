import { useState, useRef } from "react";
import { X, UploadCloud, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useUploadMedia, useDeleteMedia } from "../../hooks/media/useUploadMedia";
import { useCreateIllustration, useUpdateIllustration, type Illustration, type CreateIllustrationInput } from "../../hooks/illustrations/useIllustrations";

interface AdminIllustrationFormProps {
  initialData?: Illustration | null;
  onClose: () => void;
}

export function AdminIllustrationForm({ initialData, onClose }: AdminIllustrationFormProps) {
  const [formData, setFormData] = useState<CreateIllustrationInput>({
    contentText: initialData?.contentText || "",
    reference: initialData?.reference || "",
    audioUrl: initialData?.audioUrl || "",
  });

  const createMutation = useCreateIllustration();
  const updateMutation = useUpdateIllustration();
  const uploadMutation = useUploadMedia();
  const deleteMediaMutation = useDeleteMedia();

  const audioInputRef = useRef<HTMLInputElement>(null);
  const [isAudioUploaded, setIsAudioUploaded] = useState(!!initialData?.audioUrl);

  const isEditing = !!initialData;
  const isLoading = createMutation.isPending || updateMutation.isPending || uploadMutation.isPending;

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/") && !file.type.startsWith("video/")) {
      toast.error("Please select an audio file");
      return;
    }

    uploadMutation.mutate(file, {
      onSuccess: (data) => {
        setFormData((prev) => ({ ...prev, audioUrl: data.url }));
        setIsAudioUploaded(true);
      },
    });
  };

  const handleRemoveAudio = () => {
    if (isAudioUploaded && formData.audioUrl) {
      deleteMediaMutation.mutate(formData.audioUrl);
    }
    setFormData((prev) => ({ ...prev, audioUrl: "" }));
    setIsAudioUploaded(false);
  };

  const handleClose = () => {
    if (isAudioUploaded && formData.audioUrl && (!initialData || initialData.audioUrl !== formData.audioUrl)) {
      // Only delete if it's a newly uploaded audio that hasn't been saved
      deleteMediaMutation.mutate(formData.audioUrl);
    }
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateMutation.mutate(
        { id: initialData.id, data: formData },
        { onSuccess: onClose }
      );
    } else {
      createMutation.mutate(formData, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-secondary w-full max-w-2xl rounded-2xl shadow-2xl border border-border-subtle flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-border-subtle shrink-0">
          <h2 className="text-xl font-semibold text-text-primary">
            {isEditing ? `Edit Illustration` : `Add Illustration`}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="illustration-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Content Text
              </label>
              <textarea
                value={formData.contentText}
                onChange={(e) => setFormData({ ...formData, contentText: e.target.value })}
                className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none transition-colors min-h-[150px]"
                placeholder={`Enter illustration content here...`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Reference
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none transition-colors"
                placeholder="e.g. Psalm 23:1-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Audio File
              </label>
              
              {!formData.audioUrl ? (
                <div
                  onClick={() => audioInputRef.current?.click()}
                  className="w-full bg-bg-primary border-2 border-dashed border-border-subtle rounded-xl p-6 flex flex-col items-center justify-center text-text-secondary hover:border-accent hover:text-accent transition-colors cursor-pointer group"
                >
                  <UploadCloud size={24} className="mb-2 text-text-secondary group-hover:text-accent transition-colors" />
                  <span className="text-sm">Click to upload audio</span>
                  <span className="text-xs opacity-50 mt-1">MP3, WAV, etc.</span>
                  <input
                    type="file"
                    ref={audioInputRef}
                    className="hidden"
                    accept="audio/*,video/*"
                    onChange={handleAudioUpload}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4 bg-bg-primary border border-border-subtle rounded-xl p-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <audio controls className="w-full h-10">
                      <source src={formData.audioUrl} />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveAudio}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                    title="Remove Audio"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-border-subtle shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 text-text-secondary hover:text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="illustration-form"
            disabled={isLoading}
            className="px-6 py-2.5 bg-accent text-white font-medium rounded-xl hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isLoading ? "Saving..." : isEditing ? "Save Changes" : `Add Illustration`}
          </button>
        </div>
      </div>
    </div>
  );
}
