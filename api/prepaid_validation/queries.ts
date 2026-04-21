import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { TreatmentResponse } from "./types";

const fetchDataPrepaidToValidation = async ({
  customerId,
}: {
  customerId?: string;
}): Promise<TreatmentResponse[]> => {
  const { data } = await apiClient.get(
    `/getDataPrepaidNotVerifiedCustomer/${customerId}`,
  );
  return data?.data ?? [];
};

export const useDataPrepaidToValidation = (customerId?: string) =>
  useQuery({
    queryKey: ["prepaid_validation", customerId],
    queryFn: () => fetchDataPrepaidToValidation({ customerId }),
    enabled: !!customerId,
  });
