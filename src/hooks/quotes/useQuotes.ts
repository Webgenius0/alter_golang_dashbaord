import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type Quote = {
  id: string;
  publish_date: string;
  quote_text: string;
  reference: string;
  explanation: string;
  created_at: string;
  updated_at: string;
};

type QuoteFormData = {
  publish_date: string;
  quote_text: string;
  reference: string;
  explanation: string;
};

const getAuthHeaders = () => ({
  "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
  "Content-Type": "application/json"
});

export function useAdminQuotes() {
  return useQuery<Quote[]>({
    queryKey: ["admin_quotes"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/quotes`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch quotes");
      }
      return res.json();
    }
  });
}

export function useCreateQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: QuoteFormData) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/quotes`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create quote");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Quote created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin_quotes"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
}

export function useUpdateQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: QuoteFormData }) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/quotes/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update quote");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Quote updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin_quotes"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
}

export function useDeleteQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/quotes/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete quote");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Quote deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin_quotes"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
}
