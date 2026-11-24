import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FormEvent, useState } from "react";
import { DEFAULT_LOGO, useBranding } from "../../config/branding";

const Login: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from: string =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/";
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { logo, background, primaryColor, secondaryColor } = useBranding();

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
        navigate(from === "/login" ? "/" : from, { replace: true });
      } else {
      }
    } catch (error) {
      console.error("Erro no submit do login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Overlay escuro para melhorar legibilidade */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 m-4"
        style={{ borderColor: primaryColor, borderWidth: '2px' }}
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 mb-4 flex items-center justify-center">
            <img
              src={logo}
              alt="Logo do Sistema"
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                if (!e.currentTarget.src.endsWith(DEFAULT_LOGO)) {
                  e.currentTarget.src = DEFAULT_LOGO; // Fallback
                }
              }}
            />
          </div>
          <h2 className="text-2xl font-bold mb-1" style={{ color: secondaryColor }}>Bem-vindo</h2>
          <p className="text-sm" style={{ color: primaryColor }}>
            Acesse sua conta para continuar
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="user"
              className="block text-sm font-semibold mb-1"
              style={{ color: secondaryColor }}
            >
              Usuário
            </label>
            <input
              type="text"
              id="user"
              name="user"
              required
              autoComplete="username"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ 
                borderColor: `${primaryColor}60`,
                backgroundColor: `${primaryColor}10`
              }}
              onFocus={(e) => e.target.style.borderColor = primaryColor}
              onBlur={(e) => e.target.style.borderColor = `${primaryColor}60`}
              placeholder="Digite seu usuário"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-1"
              style={{ color: secondaryColor }}
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ 
                borderColor: `${primaryColor}60`,
                backgroundColor: `${primaryColor}10`
              }}
              onFocus={(e) => e.target.style.borderColor = primaryColor}
              onBlur={(e) => e.target.style.borderColor = `${primaryColor}60`}
              placeholder="Digite sua senha"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 mt-2 rounded-lg text-white font-bold shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
            onMouseEnter={(e) => e.currentTarget.style.background = `linear-gradient(to right, ${secondaryColor}, ${primaryColor})`}
            onMouseLeave={(e) => e.currentTarget.style.background = `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`}
          >
            {isLoading ? "Bom serviço!" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
