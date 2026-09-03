import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPublic, apiPrivate } from "../../lib/api-client";
import { getApiErrorMessage } from "../../utils/api-error";
import { toast } from "sonner";

export interface Motivation {
  id: string;
  title: string;
  speaker_name: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: string;
  created_at: string;
  updated_at: string;
}

export interface MotivationInput {
  title: string;
  speaker_name: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: string;
}

export interface PaginatedMotivationResponse {
  data: Motivation[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export function useMotivations() {
  return useQuery({
    queryKey: ["motivations"],
    queryFn: async () => {
      const res = await apiPublic.get<PaginatedMotivationResponse>("/motivations");
      return res.data;
    },
  });
}

export function useCreateMotivation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: MotivationInput) => {
      const res = await apiPrivate.post<Motivation>("/admin/motivations", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Motivation created successfully");
      queryClient.invalidateQueries({ queryKey: ["motivations"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateMotivation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MotivationInput }) => {
      const res = await apiPrivate.put<Motivation>(`/admin/motivations/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Motivation updated successfully");
      queryClient.invalidateQueries({ queryKey: ["motivations"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeleteMotivation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiPrivate.delete(`/admin/motivations/${id}`);
    },
    onSuccess: () => {
      toast.success("Motivation deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["motivations"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
