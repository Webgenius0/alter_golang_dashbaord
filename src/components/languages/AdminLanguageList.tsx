import { Edit2, Trash2, Globe } from "lucide-react";
import { getOptimizedImageUrl } from "../../utils/cloudinary";

export type AdminLanguage = {
  id: string;
  name: string;
  code: string;
  flag_icon: string | null;
  is_active: boolean;
  created_at: string;
};

interface AdminLanguageListProps {
  languages: AdminLanguage[];
  isLoading: boolean;
  onEdit: (language: AdminLanguage) => void;
  onDelete: (id: string) => void;
}

export function AdminLanguageList({ languages, isLoading, onEdit, onDelete }: AdminLanguageListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border-subtle bg-bg-secondary/50 text-xs font-bold text-text-secondary uppercase tracking-wider">
          <div className="col-span-1">Flag</div>
          <div className="col-span-4">Name</div>
          <div className="col-span-3">Code</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col">
          {languages.length === 0 ? (
            <div className="px-6 py-12 text-center text-text-secondary border-b border-border-subtle">
              No languages found.
            </div>
          ) : (
            languages.map((language) => (
              <div 
                key={language.id}
                className="grid grid-cols-12 gap-4 px-6 py-5 items-center border-b border-border-subtle hover:bg-white/5 transition-colors group"
              >
                <div className="col-span-1">
                  <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center border border-border-subtle overflow-hidden">
                    {language.flag_icon ? (
                      language.flag_icon.startsWith('http') ? (
                        <img src={getOptimizedImageUrl(language.flag_icon, true)} alt={language.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">{language.flag_icon}</span>
                      )
                    ) : (
                      <Globe size={18} className="text-text-secondary" />
                    )}
                  </div>
                </div>
                
                <div className="col-span-4 flex items-center">
                  <span className="font-semibold text-white">{language.name}</span>
                </div>
                
                <div className="col-span-3">
                  <span className="text-text-secondary">{language.code}</span>
                </div>
                
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                    language.is_active 
                      ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' 
                      : 'bg-red-400/10 text-red-400 border border-red-400/20'
                  }`}>
                    {language.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="col-span-2 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit(language)}
                    className="p-2 text-text-secondary hover:text-white bg-bg-tertiary hover:bg-accent/20 rounded-xl transition-all border border-border-subtle hover:border-accent/30"
                    title="Edit Language"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(language.id)}
                    className="p-2 text-text-secondary hover:text-white bg-bg-tertiary hover:bg-red-500/20 rounded-xl transition-all border border-border-subtle hover:border-red-500/30"
                    title="Delete Language"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
