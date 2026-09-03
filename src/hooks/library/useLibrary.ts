import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPublic, apiPrivate } from "../../lib/api-client";
import { getApiErrorMessage } from "../../utils/api-error";
import { toast } from "sonner";

export interface LibraryItem {
  id: string;
  title: string;
  category: string;
  short_description: string;
  content_text: string;
  thumbnail_url: string;
  media_url?: string;
  created_at: string;
  updated_at: string;
}

export interface LibraryCategory {
  id: string;
  name: string;
}

export interface LibraryInput {
  title: string;
  category: string;
  short_description: string;
  content_text: string;
  thumbnail_url: string;
  media_url?: string;
}

export interface PaginatedLibraryResponse {
  data: LibraryItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export function useLibraryItems(category?: string, search?: string) {
  return useQuery({
    queryKey: ["library", category, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category && category !== "All") params.append("category", category);
      if (search) params.append("search", search);
      
      const res = await apiPublic.get<PaginatedLibraryResponse>(`/library?${params.toString()}`);
      return res.data;
    },
  });
}

export function useCreateLibraryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: LibraryInput) => {
      const res = await apiPrivate.post<LibraryItem>("/admin/library", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Library item created successfully");
      queryClient.invalidateQueries({ queryKey: ["library"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateLibraryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LibraryInput }) => {
      const res = await apiPrivate.put<LibraryItem>(`/admin/library/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Library item updated successfully");
      queryClient.invalidateQueries({ queryKey: ["library"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeleteLibraryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiPrivate.delete(`/admin/library/${id}`);
    },
    onSuccess: () => {
      toast.success("Library item deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["library"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useLibraryCategories() {
  return useQuery({
    queryKey: ["library-categories"],
    queryFn: async () => {
      const res = await apiPublic.get<LibraryCategory[]>("/library-categories");
      return res.data;
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const res = await apiPrivate.post<LibraryCategory>("/admin/library-categories", { name });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["library-categories"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await apiPrivate.put<LibraryCategory>(`/admin/library-categories/${id}`, { name });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["library-categories"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiPrivate.delete(`/admin/library-categories/${id}`);
    },
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["library-categories"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
