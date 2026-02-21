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
      queryClient.clear(); // 🔥 remove all cached data
      navigate("/login"); // 🔥 redirect
    },
  });

  return { logoutMutation, isPending, error };
};

export default useLogout;
