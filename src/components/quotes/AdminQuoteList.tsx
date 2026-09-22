import { Edit2, Trash2, Calendar, Quote as QuoteIcon } from "lucide-react";
import type { Quote } from "../../hooks/quotes/useQuotes";

interface AdminQuoteListProps {
  quotes: Quote[];
  isLoading: boolean;
  onEdit: (quote: Quote) => void;
  onDelete: (id: string) => void;
}

export function AdminQuoteList({ quotes, isLoading, onEdit, onDelete }: AdminQuoteListProps) {
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
          <div className="col-span-2 flex items-center gap-2"><Calendar size={14} /> Publish Date</div>
          <div className="col-span-2">Reference</div>
          <div className="col-span-6 flex items-center gap-2"><QuoteIcon size={14} /> Quote Excerpt</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col">
          {quotes.length === 0 ? (
            <div className="px-6 py-12 text-center text-text-secondary border-b border-border-subtle">
              No quotes found. Click "Add Quote" to create one.
            </div>
          ) : (
            quotes.map((quote) => (
              <div 
                key={quote.id}
                className="grid grid-cols-12 gap-4 px-6 py-5 items-center border-b border-border-subtle hover:bg-white/5 transition-colors group"
              >
                <div className="col-span-2">
                  <span className="font-medium text-white">{quote.publish_date}</span>
                </div>

                <div className="col-span-2">
                  <span className="text-sm font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-md border border-accent/20 truncate max-w-full block w-fit">
                    {quote.reference || "N/A"}
                  </span>
                </div>
                
                <div className="col-span-6 flex flex-col justify-center pr-4">
                  <span className="text-sm text-text-secondary italic line-clamp-2 leading-relaxed">
                    "{quote.quote_text}"
                  </span>
                </div>

                <div className="col-span-2 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(quote)}
                    className="p-2 text-text-secondary hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this quote?")) {
                        onDelete(quote.id);
                      }
                    }}
                    className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
                    title="Delete"
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
