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
      console.log("Tentativa de login:", data.login);
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
    <div className="flex flex-col w-full md:w-[30%] mx-auto mt-[10%] border border-[#050a30] p-6 rounded-[0.8rem] bg-[#caf0f8]">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="user"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Usuário
            </label>
            <input
              type="text"
              id="user"
              name="user"
              required
              className="w-full px-3 py-2 bg-white border border-[#050a30] rounded-md focus:outline-none focus:ring-2 focus:ring-[#050a30] focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-3 py-2 bg-white border border-[#050a30] rounded-md focus:outline-none focus:ring-2 focus:ring-[#050a30] focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-1/2 mx-auto mt-4 px-4 py-2 border border-[#050a30] text-red-600 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors block"
          >
            {isLoading ? "Bom serviço!" : "Logar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
