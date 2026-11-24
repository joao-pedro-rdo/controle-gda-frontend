import axios from "axios";
import { getApiBaseUrl } from "./api-config";

const apiBaseUrl = getApiBaseUrl();


const client = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  withCredentials: true,
});

client.interceptors.request.use(
  (config) => {

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    console.error("Erro no interceptador de request:", error);
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(
      "Erro na resposta:",
      error.config?.url,
      error.response?.status
    );

    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;

      if (currentPath !== "/login") {
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
      }
    }

    return Promise.reject(error);
  }
);

export default client;
