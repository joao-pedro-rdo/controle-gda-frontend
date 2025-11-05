import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthStatus = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  if (!auth.user) {
    return <p>Você não está logado</p>;
  }

  return (
    <p>
      Bem vindo {auth.user.login}!
      <button
        onClick={() => {
          auth.logout(() => navigate("/"));
        }}
      >
        Sair
      </button>
    </p>
  );
};

export default AuthStatus;
