import useStore from "@/store/useStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Constants from "expo-constants";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import Toast from "react-native-toast-message";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

export const useXenditPayment = () => {
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const customerDetails = useStore((state) => state.customerDetails);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      amount,
      location_id,
      customer_id,
      detail,
      consultant_id,
    }) => {
      const response = await axios.post(
        `${apiUrl}/api/payment/create_invoice`,
        {
          amount,
          location_id,
          customer_id,
          detail,
          consultant_id,
        },
        {
          headers: {
            auth_token_customer: customerDetails?.token,
            customerid: customerId,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onMutate: () => {
      Toast.show({ type: "info", text1: "Membuat invoice..." });
    },
    onSuccess: async (data) => {

      if (data.invoice_url) {
        const result = await WebBrowser.openBrowserAsync(data.invoice_url, {
          enableBarCollapsing: true,
          showTitle: true,
        });
        queryClient.invalidateQueries(["getCustomerCart", customerId]);
        router.replace("/transaction");
      } else {
        Toast.show({ type: "error", text1: "Gagal membuka invoice" });
      }
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Payment Error",
        text2: error?.message || "Terjadi kesalahan",
      });
    },
  });
};
