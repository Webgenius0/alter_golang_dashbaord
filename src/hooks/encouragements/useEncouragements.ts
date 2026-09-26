import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Encouragement {
  id: string;
  contentText: string;
  reference: string;
  createdAt: string;
}

export interface PaginatedEncouragementResponse {
  data: Encouragement[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface CreateEncouragementInput {
  contentText: string;
  reference: string;
}

const getAuthHeaders = () => ({
  "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
  "Content-Type": "application/json"
});

export const useEncouragements = (page: number, limit: number) => {
  return useQuery<PaginatedEncouragementResponse>({
    queryKey: ["encouragements", page, limit],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/encouragements?page=${page}&limit=${limit}`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch encouragements");
      }
      return res.json();
    },
  });
};

export const useCreateEncouragement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateEncouragementInput) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/encouragements`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create encouragement");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["encouragements"] });
      toast.success("Encouragement created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create encouragement");
    },
  });
};

export const useUpdateEncouragement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CreateEncouragementInput }) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/encouragements/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update encouragement");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["encouragements"] });
      toast.success("Encouragement updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update encouragement");
    },
  });
};

export const useDeleteEncouragement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/encouragements/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete encouragement");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["encouragements"] });
      toast.success("Encouragement deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete encouragement");
    },
  });
};
