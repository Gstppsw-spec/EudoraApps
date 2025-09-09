export default ({ config }) => ({
  ...config,
  expo: {
    ...config.expo,
    name: "Eudora Aesthetic",
    slug: "DashboardCustomerEudora",
    owner: "gstp_psw15",
    version: "1.0.6",
    orientation: "portrait",
    scheme: "dashboardcustomereudora",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      runtimeVersion: {
        policy: "appVersion",
      },
      bundleIdentifier: "com.anonymous.EudoraAesthetic",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSLocationWhenInUseUsageDescription:
          "We use your location to help you find the nearest clinic and provide location-based promotions.",
        NSCameraUsageDescription:
          "We use your camera to let you take photos for your profile picture or to share images in the chat feature.",
        NSPhotoLibraryUsageDescription:
          "We use your photo library to let you select images for your profile picture or to share in the chat feature.",
      },
      icon: {
        dark: "./assets/icons/ios-dark.png",
        light: "./assets/icons/ios-light.png",
        tinted: "./assets/icons/ios-tinted.png",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icons/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.anonymous.EudoraAesthetic",
      permissions: ["NOTIFICATIONS", "ACCESS_FINE_LOCATION"],
      runtimeVersion: {
        policy: "appVersion",
      },
      googleServicesFile: "./config/firebase/google-services.json",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/icons/splash-icon-dark.png",
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            image: "./assets/icons/splash-icon-light.png",
            backgroundColor: "#000000",
          },
          imageWidth: 200,
        },
      ],
      ["expo-notifications"],
      "expo-web-browser",
      "expo-updates"
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "984b7594-fc42-4a01-9042-c76436228bf1",
      },
        apiUrl: process.env.API_URL || "https://sys.eudoraclinic.com:84/app",
        apiKey: process.env.API_KEY || "AIzaSyCUQu4oNuj856ndXkBxpmb71zwE4bPHE9I",
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/984b7594-fc42-4a01-9042-c76436228bf1",
    },
  },
});
