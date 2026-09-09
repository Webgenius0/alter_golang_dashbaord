import { useState } from "react";
import { usePrayers, useDeletePrayer, type Prayer, type PrayerFilters } from "../../hooks/prayers/usePrayers";
import { useCategories } from "../../hooks/prayers/useCategories";
import { Edit2, Trash2, LayoutGrid, Clock, Filter, X } from "lucide-react";

interface AdminPrayerListProps {
  onEdit: (prayer: Prayer) => void;
}

export function AdminPrayerList({ onEdit }: AdminPrayerListProps) {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const [filters, setFilters] = useState<PrayerFilters>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { data, isLoading, isError } = usePrayers(page, limit, filters);
  const { data: categories } = useCategories();
  const deleteMutation = useDeletePrayer();

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleFilterChange = (key: keyof PrayerFilters, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      if (!value) delete newFilters[key];
      // Reset page when filter changes
      setPage(1);
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({});
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/20 text-center">
        Failed to load prayers. Please try again later.
      </div>
    );
  }

  const prayers = data?.data || [];

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
            isFilterOpen || Object.keys(filters).length > 0 
              ? 'bg-accent/10 border-accent/20 text-accent' 
              : 'bg-bg-secondary border-border-subtle text-text-secondary hover:text-white'
          }`}
        >
          <Filter size={16} />
          Filters {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
        </button>
      </div>

      {isFilterOpen && (
        <div className="bg-bg-secondary border border-border-subtle p-4 rounded-xl flex flex-wrap gap-4 items-end mb-4">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-text-secondary mb-1">Target Audience</label>
            <select
              value={filters.targetAudience || ""}
              onChange={(e) => handleFilterChange("targetAudience", e.target.value)}
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
            >
              <option value="">All</option>
              <option value="General">General</option>
              <option value="Kids">Kids</option>
              <option value="Teens">Teens</option>
            </select>
          </div>
          
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-text-secondary mb-1">Category</label>
            <select
              value={filters.categoryId || ""}
              onChange={(e) => handleFilterChange("categoryId", e.target.value)}
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories?.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name} ({cat.targetAudience})</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-text-secondary mb-1">Age Group</label>
            <select
              value={filters.ageGroup || ""}
              onChange={(e) => handleFilterChange("ageGroup", e.target.value)}
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
            >
              <option value="">All Ages</option>
              <option value="Age 0-5">Age 0-5</option>
              <option value="Age 6-13">Age 6-13</option>
              <option value="Age 13-15">Age 13-15</option>
              <option value="Age 15-18">Age 15-18</option>
            </select>
          </div>
          
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-text-secondary mb-1">Media Type</label>
            <select
              value={filters.mediaType || ""}
              onChange={(e) => handleFilterChange("mediaType", e.target.value)}
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="Audio">Audio</option>
              <option value="Video">Video</option>
            </select>
          </div>

          {Object.keys(filters).length > 0 && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-text-secondary hover:text-white flex items-center gap-1"
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>
      )}

      <div className="bg-bg-secondary border border-border-subtle rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-tertiary border-b border-border-subtle text-text-secondary text-sm">
                <th className="py-4 px-6 font-medium">Prayer Details</th>
                <th className="py-4 px-6 font-medium">Category</th>
                <th className="py-4 px-6 font-medium">Media</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {prayers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-text-secondary">
                    No prayers found.
                  </td>
                </tr>
              ) : (
                prayers.map((prayer) => (
                  <tr key={prayer.id} className="hover:bg-bg-tertiary/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg bg-bg-primary border border-border-subtle overflow-hidden shrink-0">
                          <img 
                            src={prayer.thumbnailUrl} 
                            alt={prayer.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://placehold.co/400x225/1A1D24/FFFFFF?text=No+Image";
                            }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-text-primary group-hover:text-accent transition-colors line-clamp-1">
                            {prayer.title}
                          </span>
                          <span className="text-xs text-text-secondary mt-1 px-2 py-0.5 bg-white/5 rounded-md inline-block w-max">
                            {prayer.category?.targetAudience} {prayer.ageGroup ? `• ${prayer.ageGroup}` : ""}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 text-text-secondary text-xs font-medium rounded-full border border-border-subtle w-max">
                          <LayoutGrid size={12} />
                          {prayer.category?.name}
                        </span>
                        {prayer.subCategory && (
                          <span className="text-xs text-text-secondary ml-2">
                            └ {prayer.subCategory.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-text-secondary text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-white">{prayer.mediaType}</span>
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock size={12} className="text-accent" />
                          {prayer.duration || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(prayer)}
                          className="p-2 text-text-secondary hover:text-accent bg-bg-primary hover:bg-white/10 rounded-lg transition-colors border border-border-subtle"
                          title="Edit Prayer"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(prayer.id, prayer.title)}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-text-secondary hover:text-red-500 bg-bg-primary hover:bg-red-500/10 rounded-lg transition-colors border border-border-subtle"
                          title="Delete Prayer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="p-4 border-t border-border-subtle flex items-center justify-between bg-bg-tertiary">
            <span className="text-sm text-text-secondary">
              Showing <span className="text-text-primary font-medium">{prayers.length}</span> of <span className="text-text-primary font-medium">{data.totalItems}</span> items
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-border-subtle rounded-lg text-sm disabled:opacity-50 hover:bg-white/5 transition-colors text-text-primary"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: data.totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPage(idx + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                      page === idx + 1 
                        ? 'bg-accent text-white border-transparent' 
                        : 'border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-white/5'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="px-3 py-1.5 border border-border-subtle rounded-lg text-sm disabled:opacity-50 hover:bg-white/5 transition-colors text-text-primary"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
