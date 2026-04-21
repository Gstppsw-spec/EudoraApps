import useStore from "@/store/useStore";
import axios from "axios";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    indexes: null,
  },
});

apiClient.interceptors.request.use((config) => {
  const jwt_token = useStore.getState().jwt_token;
  // console.log(jwt_token);

  if (jwt_token) {
    config.headers.Authorization = `Bearer ${jwt_token}`;
  }
  return config;
});

export default apiClient;
