import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPublic, apiPrivate } from "../../lib/api-client";
import { getApiErrorMessage } from "../../utils/api-error";
import { toast } from "sonner";

export interface Worship {
  id: string;
  title: string;
  artist: string;
  time_of_day: string;
  duration: string;
  thumbnail_url: string;
  audio_url: string;
  prayer_text: string;
  created_at: string;
  updated_at: string;
}

export interface WorshipInput {
  title: string;
  artist: string;
  time_of_day: string;
  duration: string;
  thumbnail_url: string;
  audio_url: string;
  prayer_text: string;
}

export interface PaginatedWorshipResponse {
  data: Worship[];
  total_items: number;
  total_pages: number;
  page: number;
  limit: number;
}

export function useWorships(timeOfDay?: string) {
  return useQuery({
    queryKey: ["worships", timeOfDay],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (timeOfDay && timeOfDay !== "All") {
        params.append("time_of_day", timeOfDay);
      }
      const res = await apiPublic.get<PaginatedWorshipResponse>(`/worships?${params.toString()}`);
      return res.data;
    },
  });
}

export function useCreateWorship() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: WorshipInput) => {
      const res = await apiPrivate.post<Worship>("/admin/worships", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Worship track created successfully");
      queryClient.invalidateQueries({ queryKey: ["worships"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateWorship() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: WorshipInput }) => {
      const res = await apiPrivate.put<Worship>(`/admin/worships/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Worship track updated successfully");
      queryClient.invalidateQueries({ queryKey: ["worships"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeleteWorship() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiPrivate.delete(`/admin/worships/${id}`);
    },
    onSuccess: () => {
      toast.success("Worship track deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["worships"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
