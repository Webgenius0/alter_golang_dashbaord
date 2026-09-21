import { Edit2, Trash2 } from "lucide-react";

export type AdminFAQ = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

interface AdminFAQListProps {
  faqs: AdminFAQ[];
  isLoading: boolean;
  onEdit: (faq: AdminFAQ) => void;
  onDelete: (id: string) => void;
}

export function AdminFAQList({ faqs, isLoading, onEdit, onDelete }: AdminFAQListProps) {
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
          <div className="col-span-1">Sort Order</div>
          <div className="col-span-5">Question</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-4 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col">
          {faqs.length === 0 ? (
            <div className="px-6 py-12 text-center text-text-secondary border-b border-border-subtle">
              No FAQs found.
            </div>
          ) : (
            faqs.map((faq) => (
              <div 
                key={faq.id}
                className="grid grid-cols-12 gap-4 px-6 py-5 items-center border-b border-border-subtle hover:bg-white/5 transition-colors group"
              >
                <div className="col-span-1 text-text-secondary font-mono">
                  {faq.sort_order}
                </div>
                
                <div className="col-span-5 flex flex-col justify-center">
                  <span className="font-medium text-white truncate pr-4">{faq.question}</span>
                  <span className="text-sm text-text-secondary truncate pr-4 mt-1">{faq.answer}</span>
                </div>

                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                    faq.is_active 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${faq.is_active ? 'bg-green-400' : 'bg-red-400'}`} />
                    {faq.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="col-span-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(faq)}
                    className="p-2 text-text-secondary hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Edit FAQ"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(faq.id)}
                    className="p-2 text-text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete FAQ"
                  >
                    <Trash2 size={18} />
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
