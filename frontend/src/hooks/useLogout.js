import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import { useNavigate } from "react-router";

const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // 🔥 Immediately remove auth user
      queryClient.setQueryData(["authUser"], null);

      // 🔥 Clear all cached queries
      queryClient.clear();
    },
  });

  return { logoutMutation, isPending, error };
};

export default useLogout;
