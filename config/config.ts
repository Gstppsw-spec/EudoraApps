// config.ts
import Constants from "expo-constants";
import * as Updates from "expo-updates";

interface AppConfig {
  apiUrl: string;
  // tambahkan field lain jika perlu
}

export const getConfig = (): AppConfig => {
  // Ambil manifest dari OTA update atau binary build
  const manifest =
    (Updates.updateManifest as any) ??    // OTA update
    (Updates.manifest as any) ??          // Expo Go / legacy
    (Constants.expoConfig as any) ?? {};  // Build binary

  return {
    apiUrl: manifest?.extra?.apiUrl ?? "https://sys.eudoraclinic.com:84/app",
    // tambahkan fallback/default value jika perlu
  };
};
