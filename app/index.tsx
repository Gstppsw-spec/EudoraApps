import { router } from "expo-router";
import { useEffect } from "react";
import useStore from "../store/useStore";

export default function Index() {
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const hasPin = useStore((state: { hasPin: any }) => state.hasPin);

  useEffect(() => {
    if (customerId && hasPin) {
      const timeout = setTimeout(() => {
        router.push("/authentication/verifyPin");
      }, 100);
      return () => clearTimeout(timeout);
    } else if (customerId && !hasPin) {
      const timeout = setTimeout(() => {
        router.push("/tabs/home");
      }, 100);
      return () => clearTimeout(timeout);
    } else if (!customerId && !hasPin) {
      const timeout = setTimeout(() => {
        router.push("/authentication/otpWhatsapp");
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, []);

  return null;
}
