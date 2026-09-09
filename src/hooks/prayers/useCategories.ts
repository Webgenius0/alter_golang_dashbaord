import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPrivate } from "../../lib/api-client";
import { toast } from "sonner";

export interface Category {
  id: string;
  name: string;
  targetAudience: "General" | "Kids" | "Teens";
  createdAt: string;
  updatedAt: string;
}

export interface CategoryInput {
  name: string;
  targetAudience: "General" | "Kids" | "Teens";
}

export const useCategories = () => {
  return useQuery({
    queryKey: ["prayer-categories"],
    queryFn: async () => {
      const response = await apiPrivate.get<Category[]>("/admin/categories");
      return response.data;
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CategoryInput) => {
      const response = await apiPrivate.post<Category>("/admin/categories", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["prayer-categories"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create category";
      toast.error(message);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoryInput }) => {
      const response = await apiPrivate.put<Category>(`/admin/categories/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Category updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["prayer-categories"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update category";
      toast.error(message);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiPrivate.delete(`/admin/categories/${id}`);
    },
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["prayer-categories"] });
      queryClient.invalidateQueries({ queryKey: ["prayer-subcategories"] });
      queryClient.invalidateQueries({ queryKey: ["prayers"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete category";
      toast.error(message);
    },
  });
};
