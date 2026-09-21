import { Edit2, BookText } from "lucide-react";

export type CMSPageSection = {
  id: string;
  heading: string;
  content: string;
  sort_order: number;
};

export type AdminCMSPage = {
  id: string;
  slug: string;
  title: string;
  intro_text: string;
  sections: CMSPageSection[];
  created_at: string;
  updated_at: string;
};

interface AdminCMSListProps {
  pages: AdminCMSPage[];
  isLoading: boolean;
  onEdit: (page: AdminCMSPage) => void;
}

export function AdminCMSList({ pages, isLoading, onEdit }: AdminCMSListProps) {
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
          <div className="col-span-1">Icon</div>
          <div className="col-span-4">Page Title</div>
          <div className="col-span-3">Slug</div>
          <div className="col-span-2">Sections</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col">
          {pages.length === 0 ? (
            <div className="px-6 py-12 text-center text-text-secondary border-b border-border-subtle">
              No CMS pages found.
            </div>
          ) : (
            pages.map((page) => (
              <div 
                key={page.id}
                className="grid grid-cols-12 gap-4 px-6 py-5 items-center border-b border-border-subtle hover:bg-white/5 transition-colors group"
              >
                <div className="col-span-1">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <BookText size={20} />
                  </div>
                </div>
                
                <div className="col-span-4 flex flex-col justify-center">
                  <span className="font-medium text-white truncate pr-4">{page.title}</span>
                  <span className="text-sm text-text-secondary truncate pr-4 mt-1">{page.intro_text || 'No intro text'}</span>
                </div>

                <div className="col-span-3">
                  <span className="text-sm text-text-secondary font-mono">{page.slug}</span>
                </div>

                <div className="col-span-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-white/5 text-text-secondary border-border-subtle">
                    {page.sections?.length || 0} blocks
                  </span>
                </div>

                <div className="col-span-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(page)}
                    className="p-2 text-text-secondary hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 px-4"
                  >
                    <Edit2 size={16} />
                    <span>Edit</span>
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
