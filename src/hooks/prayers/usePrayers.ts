import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPrivate } from "../../lib/api-client";
import { toast } from "sonner";
import type { Category } from "./useCategories";
import type { SubCategory } from "./useSubCategories";

export interface Prayer {
  id: string;
  title: string;
  categoryId: string;
  subCategoryId?: string;
  ageGroup?: string;
  mediaType: "Audio" | "Video";
  duration: string;
  thumbnailUrl: string;
  mediaUrl: string;
  contentText: string;
  createdAt: string;
  updatedAt: string;
  
  category?: Category;
  subCategory?: SubCategory;
}

export interface PaginatedPrayers {
  data: Prayer[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface PrayerInput {
  title: string;
  categoryId: string;
  subCategoryId?: string;
  ageGroup?: string;
  mediaType: "Audio" | "Video";
  duration: string;
  thumbnailUrl: string;
  mediaUrl: string;
  contentText: string;
}

export interface PrayerFilters {
  targetAudience?: string;
  categoryId?: string;
  ageGroup?: string;
  mediaType?: string;
}

export const usePrayers = (page = 1, limit = 10, filters: PrayerFilters = {}) => {
  return useQuery({
    queryKey: ["prayers", page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (filters.targetAudience) params.append("targetAudience", filters.targetAudience);
      if (filters.categoryId) params.append("categoryId", filters.categoryId);
      if (filters.ageGroup) params.append("ageGroup", filters.ageGroup);
      if (filters.mediaType) params.append("mediaType", filters.mediaType);

      const response = await apiPrivate.get<PaginatedPrayers>(`/admin/prayers?${params.toString()}`);
      return response.data;
    },
  });
};

export const useCreatePrayer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PrayerInput) => {
      const response = await apiPrivate.post<Prayer>("/admin/prayers", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Prayer created successfully!");
      queryClient.invalidateQueries({ queryKey: ["prayers"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create prayer";
      toast.error(message);
    },
  });
};

export const useUpdatePrayer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PrayerInput }) => {
      const response = await apiPrivate.put<Prayer>(`/admin/prayers/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Prayer updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["prayers"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update prayer";
      toast.error(message);
    },
  });
};

export const useDeletePrayer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiPrivate.delete(`/admin/prayers/${id}`);
    },
    onSuccess: () => {
      toast.success("Prayer deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["prayers"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete prayer";
      toast.error(message);
    },
  });
};
