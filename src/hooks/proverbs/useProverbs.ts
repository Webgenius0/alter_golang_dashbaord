import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPrivate } from "../../lib/api-client";
import { toast } from "sonner";

export interface Proverb {
  id: string;
  title: string;
  category: string;
  duration: string;
  thumbnail_url: string;
  audio_url: string;
  scripture_reference: string;
  main_text: string;
  explanation: string;
  publish_date: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedProverbs {
  data: Proverb[];
  total_items: number;
  total_pages: number;
  page: number;
  limit: number;
}

export interface ProverbInput {
  title: string;
  category: string;
  duration: string;
  thumbnail_url: string;
  audio_url: string;
  scripture_reference: string;
  main_text: string;
  explanation: string;
  publish_date: string; // ISO format string
}

export const useProverbs = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["proverbs", page, limit],
    queryFn: async () => {
      const response = await apiPrivate.get<PaginatedProverbs>(
        `/proverbs?page=${page}&limit=${limit}`
      );
      return response.data;
    },
  });
};

export const useCreateProverb = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ProverbInput) => {
      const response = await apiPrivate.post<Proverb>("/admin/proverbs", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Proverb created successfully!");
      queryClient.invalidateQueries({ queryKey: ["proverbs"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create proverb";
      toast.error(message);
    },
  });
};

export const useUpdateProverb = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProverbInput }) => {
      const response = await apiPrivate.put<Proverb>(`/admin/proverbs/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Proverb updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["proverbs"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update proverb";
      toast.error(message);
    },
  });
};

export const useDeleteProverb = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiPrivate.delete(`/admin/proverbs/${id}`);
    },
    onSuccess: () => {
      toast.success("Proverb deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["proverbs"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete proverb";
      toast.error(message);
    },
  });
};
