import { useState, useEffect } from "react";
import { X, Save, Plus, Trash2 } from "lucide-react";
import type { AdminCMSPage, CMSPageSection } from "./AdminCMSList";

interface AdminCMSFormProps {
  page: AdminCMSPage | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function AdminCMSForm({ page, isOpen, onClose, onSubmit, isSubmitting }: AdminCMSFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    intro_text: "",
  });
  
  const [sections, setSections] = useState<CMSPageSection[]>([]);

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title,
        intro_text: page.intro_text,
      });
      setSections(page.sections || []);
    }
  }, [page, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      sections: sections.map((sec, idx) => ({
        heading: sec.heading,
        content: sec.content,
        sort_order: idx,
      })),
    });
  };

  const addSection = () => {
    setSections([
      ...sections,
      { id: Date.now().toString(), heading: "", content: "", sort_order: sections.length },
    ]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: keyof CMSPageSection, value: string) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setSections(newSections);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    
    setSections(newSections);
  };

  if (!isOpen || !page) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      <div className="bg-bg-secondary w-full max-w-3xl rounded-2xl shadow-2xl border border-border-subtle flex flex-col overflow-hidden animate-slide-up relative max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-subtle bg-bg-secondary/50">
          <div>
            <h2 className="text-xl font-bold text-white">Edit {page.title}</h2>
            <p className="text-sm text-text-secondary font-mono mt-1">/{page.slug}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto">
          <form id="cms-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Info */}
            <div className="space-y-6 bg-bg-tertiary p-6 rounded-xl border border-border-subtle">
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">
                  Page Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  placeholder="e.g., Privacy Policy"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">
                  Introduction Text
                </label>
                <textarea
                  rows={3}
                  value={formData.intro_text}
                  onChange={(e) => setFormData({ ...formData, intro_text: e.target.value })}
                  className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
                  placeholder="Optional brief introduction appearing at the top of the page..."
                />
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Page Sections</h3>
                <button
                  type="button"
                  onClick={addSection}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors border border-border-subtle"
                >
                  <Plus size={16} />
                  Add Section
                </button>
              </div>

              {sections.length === 0 ? (
                <div className="text-center p-8 bg-bg-tertiary border border-border-subtle rounded-xl border-dashed">
                  <p className="text-text-secondary text-sm mb-4">No sections added yet.</p>
                  <button
                    type="button"
                    onClick={addSection}
                    className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors mx-auto"
                  >
                    <Plus size={16} />
                    Add First Section
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {sections.map((section, index) => (
                    <div key={section.id} className="bg-bg-tertiary border border-border-subtle rounded-xl overflow-hidden group">
                      <div className="flex items-center gap-3 p-3 bg-bg-secondary/50 border-b border-border-subtle">
                        <div className="flex flex-col gap-1 px-2 text-text-secondary">
                          <button 
                            type="button" 
                            onClick={() => moveSection(index, 'up')}
                            disabled={index === 0}
                            className="hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            ▲
                          </button>
                          <button 
                            type="button" 
                            onClick={() => moveSection(index, 'down')}
                            disabled={index === sections.length - 1}
                            className="hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            ▼
                          </button>
                        </div>
                        <h4 className="font-medium text-white flex-1">Section {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeSection(index)}
                          className="p-2 text-text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="p-4 space-y-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-text-secondary">
                            Heading <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={section.heading}
                            onChange={(e) => updateSection(index, 'heading', e.target.value)}
                            className="w-full bg-bg-secondary border border-border-subtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                            placeholder="e.g., Data Collection"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-text-secondary">
                            Content <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            required
                            rows={4}
                            value={section.content}
                            onChange={(e) => updateSection(index, 'content', e.target.value)}
                            className="w-full bg-bg-secondary border border-border-subtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-y"
                            placeholder="Detailed explanation..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-subtle bg-bg-secondary/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            form="cms-form"
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/25"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
