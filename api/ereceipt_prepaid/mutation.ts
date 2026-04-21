import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apiClient";

const jwtShortLive = async (customerId?: string) => {
  console.log(customerId);

  const { data } = await apiClient.post(
    `/api/Ereceipt/jwt_short_live/${customerId}`,
  );

  return data;
};

export const useJwtShortLiveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (customerId?: string) => jwtShortLive(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jwt_short_live"],
      });
    },
  });
};
