import { useMutation } from "@tanstack/react-query";
import { apiPrivate } from "../../lib/api-client";
import { getApiErrorMessage } from "../../utils/api-error";
import { toast } from "sonner";

export type UploadMediaResponse = {
  url: string;
  public_id: string;
};

export function useUploadMedia() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await apiPrivate.post<UploadMediaResponse>("/upload?folder=zick/motivations", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
