import axios from "axios";
import { getApiBaseUrl } from "./api-config";

const apiBaseUrl = getApiBaseUrl();

console.log("API URL configurada:", process.env.REACT_APP_API_URL);
console.log("API URL efetiva:", apiBaseUrl);

const client = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  withCredentials: true,
});

client.interceptors.request.use(
  (config) => {
    console.log("Requisicao:", config.method?.toUpperCase(), config.url);

    if (config.data instanceof FormData) {
      console.log("Enviando FormData (multipart)");
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
    console.log("Resposta:", response.config.url, response.status);
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
        console.log("Token invalido, redirecionando para login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
      }
    }

    return Promise.reject(error);
  }
);

export default client;
