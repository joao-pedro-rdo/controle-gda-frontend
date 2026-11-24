import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
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
  // onDone: callback opcional executado após limpar a sessão (ex.: redirecionar)
  const logout = async (onDone) => {
    try {
      await client.post("/logout");
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      if (typeof onDone === "function") onDone();
    }
  };

  // 🔒 NOVA IMPLEMENTAÇÃO: Verificação via API
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await client.get("/auth/check"); // URL relativa

        if (response.data.authenticated) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
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
  const location = useLocation();

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

  // Se não autenticado, redirecionar para /login lembrando a rota de origem
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Se autenticado, mostrar o conteúdo
  return children;
};
