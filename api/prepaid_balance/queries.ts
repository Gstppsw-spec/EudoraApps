import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { PrepaidResponse } from "./types";

const fetchPrepaidBalanceInvoiceTreatment = async ({
  customerId,
}: {
  customerId?: string;
}): Promise<PrepaidResponse[]> => {
  const { data } = await apiClient.get(
    `/getDetailTransactionTreatment/${customerId}`,
  );
  return data;
};

const fetchPrepaidBalanceInvoicePackages = async ({
  customerId,
}: {
  customerId?: string;
}): Promise<PrepaidResponse[]> => {
  const { data } = await apiClient.get(
    `/getDetailTransactionMembership/${customerId}`,
  );
  return data;
};

export const usePrepaidBalanceInvoiceTreatment = (customerId?: string) =>
  useQuery({
    queryKey: ["treatment", customerId],
    queryFn: () => fetchPrepaidBalanceInvoiceTreatment({ customerId }),
    enabled: !!customerId,
  });

export const usePrepaidBalanceInvoicePackages = (customerId?: string) =>
  useQuery({
    queryKey: ["package", customerId],
    queryFn: () => fetchPrepaidBalanceInvoicePackages({ customerId }),
    enabled: !!customerId,
  });
