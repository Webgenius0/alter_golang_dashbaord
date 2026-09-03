import { useMutation } from "@tanstack/react-query";
import { apiPrivate } from "../../lib/api-client";
import { getApiErrorMessage } from "../../utils/api-error";
import { toast } from "sonner";

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiPrivate.put("/users/me/password", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
