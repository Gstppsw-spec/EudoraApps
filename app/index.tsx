import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import useStore from "../store/useStore";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const customerId = useStore((state) => state.customerid);
  const hasPin = useStore((state) => state.hasPin);
  const hasOnboarding = useStore((state) => state.hasOnboarding);

  useEffect(() => {
    async function prepare() {
      await new Promise((r) => setTimeout(r, 500));
      if (customerId && hasPin) {
        router.replace("/authentication/verifyPin");
      } else if (customerId && !hasPin) {
        router.replace("/tabs/home");
      } else {
        if (hasOnboarding) {
          router.replace("/authentication/otpWhatsapp");
        } else {
          router.replace("/component/onBoarding");
        }
      }
      await SplashScreen.hideAsync();
    }

    prepare();
  }, [customerId, hasPin, hasOnboarding]);

  return null
}
