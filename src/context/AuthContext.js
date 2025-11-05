import { createContext, useContext, useEffect, useState } from "react";
import client from "../services/client";

// ✅ CORRIGIR: Exportar como named export
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🔒 NOVA IMPLEMENTAÇÃO: Login sem localStorage
  const login = async (credentials) => {
    try {
      const response = await client.post("/login", credentials);
      const { user: userData } = response.data;

      setUser(userData);
      setIsAuthenticated(true);

      console.log("Login realizado com sucesso:", userData);
      return { success: true };
    } catch (error) {
      console.error("Erro no login:", error);
      return {
        success: false,
        message: error.response?.data?.error || "Erro no login",
      };
    }
  };

  // 🔒 NOVA IMPLEMENTAÇÃO: Logout via API
  const logout = async () => {
    try {
      await client.post("/logout");
      console.log("Logout realizado com sucesso");
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // 🔒 NOVA IMPLEMENTAÇÃO: Verificação via API
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        console.log("🍪 Verificando autenticação via /api/auth/check...");
        const response = await client.get("/auth/check"); // URL relativa

        if (response.data.authenticated) {
          setUser(response.data.user);
          setIsAuthenticated(true);
          console.log("✅ Usuário autenticado via Nginx:", response.data.user);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          console.log("❌ Usuário não autenticado");
        }
      } catch (error) {
        console.log("❌ Erro na verificação de autenticação:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

// Componente RequireAuth CORRIGIDO
export const RequireAuth = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Carregando...
      </div>
    );
  }

  // Se não autenticado, mostrar tela de login
  if (!isAuthenticated) {
    const Login = require("../components/Login").default;
    return <Login />;
  }

  // Se autenticado, mostrar o conteúdo
  return children;
};
