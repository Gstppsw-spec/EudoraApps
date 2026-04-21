import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apiClient";

const validationPrepaid = async (customerId?: string) => {
  const { data } = await apiClient.post(
    `/bulkValidateTreatmentByCS/${customerId}`,
  );

  return data;
};

export const useValidationPrepaidMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (customerId?: string) => validationPrepaid(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["prepaid_validation"],
      });
    },
  });
};
