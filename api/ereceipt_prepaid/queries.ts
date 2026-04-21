import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { EreceiptPrepaidResponse } from "./types";

const fetchDataEreceiptDoing = async ({
  customerId,
}: {
  customerId?: string;
}): Promise<EreceiptPrepaidResponse[]> => {
  const { data } = await apiClient.get(`/ereceipt-doing/${customerId}`);
  return data ?? [];
};

export const useDataEreceiptDoing = (customerId?: string) =>
  useQuery({
    queryKey: ["ereceipt_doing", customerId],
    queryFn: () => fetchDataEreceiptDoing({ customerId }),
    enabled: !!customerId,
  });
