// hooks/useAuthGuard.js
import { useRouter } from "expo-router";
import { useEffect } from "react";
import useStore from "../../store/useStore";

export default function useAuthGuard() {
  const customerId = useStore((state) => state.customerid);
  const router = useRouter();

  useEffect(() => {
    if (!customerId) {
      router.replace("/authentication/otpWhatsapp");
    }
  }, [customerId]);
}
