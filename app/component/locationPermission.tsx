import * as Location from "expo-location";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

export default function useCurrentLocation() {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "info",
          text2: "Jarak tidak di ketahui, ijinkan akses lokasi dulu.",
          position: "top",
          visibilityTime: 2000,
        });
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return { location, errorMsg };
}
