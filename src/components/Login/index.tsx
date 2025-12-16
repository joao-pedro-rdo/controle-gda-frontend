import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FormEvent, useState } from "react";

const Login: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      login: formData.get("user") as string,
      password: formData.get("password") as string,
    };

    try {
      const result = await auth.login(data);

      if (result.success) {
        console.log("Login bem-sucedido, redirecionando...");
        setTimeout(() => {
          navigate("/");
        }, 100);
      } else {
        console.log("Login falhou:", result.message);
      }
    } catch (error) {
      console.error("Erro no submit do login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-300">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-red-200">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 mb-2 rounded-full bg-red-200 flex items-center justify-center shadow-md">
            <svg
              className="w-8 h-8 text-red-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 2c-2.67 0-8 1.337-8 4v2a1 1 0 001 1h14a1 1 0 001-1v-2c0-2.663-5.33-4-8-4z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-900 mb-1">Bem-vindo</h2>
          <p className="text-red-600 text-sm">
            Acesse sua conta para continuar
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="user"
              className="block text-sm font-semibold text-red-900 mb-1"
            >
              Usuário
            </label>
            <input
              type="text"
              id="user"
              name="user"
              required
              autoComplete="username"
              className="w-full px-4 py-2 border border-red-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-red-50 text-red-900 placeholder-red-400 transition"
              placeholder="Digite seu usuário"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-red-900 mb-1"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-2 border border-red-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-red-50 text-red-900 placeholder-red-400 transition"
              placeholder="Digite sua senha"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 mt-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-bold shadow-md hover:from-red-600 hover:to-red-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Bom serviço!" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
