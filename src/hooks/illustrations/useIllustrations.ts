import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Illustration {
  id: string;
  contentText: string;
  reference: string;
  createdAt: string;
}

export interface PaginatedIllustrationResponse {
  data: Illustration[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface CreateIllustrationInput {
  contentText: string;
  reference: string;
}

const getAuthHeaders = () => ({
  "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
  "Content-Type": "application/json"
});

export const useIllustrations = (page: number, limit: number) => {
  return useQuery<PaginatedIllustrationResponse>({
    queryKey: ["illustrations", page, limit],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/illustrations?page=${page}&limit=${limit}`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch illustrations");
      }
      return res.json();
    },
  });
};

export const useCreateIllustration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateIllustrationInput) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/illustrations`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create illustration");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["illustrations"] });
      toast.success("Illustration created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create illustration");
    },
  });
};

export const useUpdateIllustration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CreateIllustrationInput }) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/illustrations/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update illustration");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["illustrations"] });
      toast.success("Illustration updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update illustration");
    },
  });
};

export const useDeleteIllustration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/illustrations/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete illustration");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["illustrations"] });
      toast.success("Illustration deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete illustration");
    },
  });
};
