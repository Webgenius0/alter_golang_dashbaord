import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPrivate } from "../../lib/api-client";
import { toast } from "sonner";

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategoryInput {
  categoryId: string;
  name: string;
}

export const useSubCategories = (categoryId?: string) => {
  return useQuery({
    queryKey: ["prayer-subcategories", categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const response = await apiPrivate.get<SubCategory[]>(`/admin/subcategories?categoryId=${categoryId}`);
      return response.data;
    },
    enabled: !!categoryId,
  });
};

export const useCreateSubCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: SubCategoryInput) => {
      const response = await apiPrivate.post<SubCategory>("/admin/subcategories", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("SubCategory created successfully!");
      queryClient.invalidateQueries({ queryKey: ["prayer-subcategories"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create subcategory";
      toast.error(message);
    },
  });
};

export const useUpdateSubCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SubCategoryInput }) => {
      const response = await apiPrivate.put<SubCategory>(`/admin/subcategories/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("SubCategory updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["prayer-subcategories"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update subcategory";
      toast.error(message);
    },
  });
};

export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiPrivate.delete(`/admin/subcategories/${id}`);
    },
    onSuccess: () => {
      toast.success("SubCategory deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["prayer-subcategories"] });
      queryClient.invalidateQueries({ queryKey: ["prayers"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete subcategory";
      toast.error(message);
    },
  });
};
