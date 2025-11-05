import axios from "axios";

const client = axios.create({
  baseURL: "/api", // 🔧 Usar caminho relativo via Nginx
  timeout: 10000,
  withCredentials: true, // 🔒 ESSENCIAL para cookies
});

// Debug para ambiente Nginx
client.interceptors.request.use(
  (config) => {
    console.log("🚀 Requisição:", config.method?.toUpperCase(), config.url);

    // 🔧 Log específico para multipart
    if (config.data instanceof FormData) {
      console.log("📦 Enviando FormData (multipart)");
      // Não definir Content-Type manualmente para FormData
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
    console.log("✅ Resposta via Nginx:", response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error(
      "❌ Erro na resposta:",
      error.config?.url,
      error.response?.status
    );

    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;

      if (currentPath !== "/login") {
        console.log("Token inválido, redirecionando para login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
      }
    }

    return Promise.reject(error);
  }
);

export default client;
