import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPublic } from "../../lib/api-client";
import { getApiErrorMessage } from "../../utils/api-error";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type LoginPayload = {
  email: string;
  password: string;
};

type AuthResponse = {
  access_token: string;
  refresh_token: string;
};

export function useAdminLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await apiPublic.post<AuthResponse>("/auth/admin/login", payload);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.access_token);
      toast.success("Welcome back, Admin!");
      queryClient.clear(); // Clear any old data
      navigate("/");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
