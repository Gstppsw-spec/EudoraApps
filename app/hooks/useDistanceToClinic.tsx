import * as Location from "expo-location";
import { useEffect, useState } from "react";

type Clinic = {
  id: number;
  latitude: number;
  longitude: number;
};

export default function useClinicDistances(clinics: Clinic[]) {
  const [distances, setDistances] = useState<{ [clinicId: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Izin lokasi ditolak");
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const userLat = location.coords.latitude;
        const userLon = location.coords.longitude;

        const calculated: { [clinicId: number]: number } = {};
        

        clinics.forEach((clinic) => {
          const distance = getDistanceFromLatLonInKm(
            userLat,
            userLon,
            clinic.latitude,
            clinic.longitude
          );
          calculated[clinic.id] = distance;
        });

        setDistances(calculated);
      } catch (err) {
        setError("Gagal mendapatkan lokasi");
      } finally {
        setLoading(false);
      }
    })();
  }, [clinics]);

  return { distances, loading, error };
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
