import { useRouter } from "expo-router";
import { useEffect } from "react";
import useStore from "../../store/useStore";

export default function useAuthGuard() {
  const customerId = useStore((state) => state.customerid);
  const customerDetails = useStore((state) => state.customerDetails);
  const router = useRouter();
  const clearCustomerId = useStore((state) => state.setCustomerId);
  const setHasPin = useStore((state) => state.setHasPin);
  const setCustomerId = useStore((state) => state.setCustomerId);

  useEffect(() => {
    if (!customerId && !customerDetails?.token) {
      router.replace("/authentication/otpWhatsapp");
      clearCustomerId();
      setHasPin(false)
      setCustomerId(null)
    }
  }, [customerId, customerDetails]);
}
