import * as Notifications from "expo-notifications";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import Toast from "react-native-toast-message";
import useStore from "../../store/useStore";


export default function NotificationListener() {
  const router = useRouter();
  const pathname = usePathname();
  const pendingRoute = useStore((state) => state.pendingRoute);

  const pathnameRef = useRef(pathname);
  
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);
  
  

  useEffect(() => {
    const receiveSub = Notifications.addNotificationReceivedListener(
      (notification) => {
        const data = notification.request.content.data;
        if (data?.type === "chat" && pathnameRef.current != "/tabs/consultation") {
          Toast.show({
            type: "success",
            text1: "📩 Pesan Baru!!",
            text2:
              notification.request.content.body || "Kamu menerima pesan baru",
            position: "top",
            visibilityTime: 4000,
          });
        }
      }
    );

    const responseSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        if (data?.route) {
          useStore.getState().setPendingRoute(data.route); // simpan dulu route tujuan
          router.push("/authentication/verifyPin");
        }
      }
    );

    Notifications.getLastNotificationResponseAsync().then((response) => {
      const data = response?.notification?.request?.content?.data;
      if (data?.route) {
        useStore.getState().setPendingRoute(data.route);
        router.push("/authentication/verifyPin");
      }
    });

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        useStore.getState().setPendingRoute(null);
      }
    };

    const appStateSub = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      receiveSub.remove();
      responseSub.remove();
      appStateSub.remove();
    };
  }, []);

  return null;
}
