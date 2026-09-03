import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPrivate } from "../../lib/api-client";
import { getApiErrorMessage } from "../../utils/api-error";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const res = await apiPrivate.post("/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/login");
    },
    onError: (error) => {
      // Even if API fails, we want to log them out locally
      localStorage.removeItem("accessToken");
      queryClient.clear();
      navigate("/login");
      toast.error(getApiErrorMessage(error));
    },
  });
}
