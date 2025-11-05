import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

import { FormControl, FormLabel } from "@chakra-ui/react";
import * as S from "./styles.js";

const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const data = {
      login: event.target.user.value,
      password: event.target.password.value,
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
    <S.Wrapper>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel htmlFor="user">Usuário</FormLabel>
          <S.StyledInput type="text" id="user" name="user" />
          <FormLabel htmlFor="user">Senha</FormLabel>
          <S.StyledInput type="password" id="password" name="password" />
          <S.StyledButton
            isLoading={isLoading}
            type="submit"
            loadingText="Bom serviço!"
            colorScheme="red"
            variant="outline"
          >
            Logar
          </S.StyledButton>
        </FormControl>
      </form>
    </S.Wrapper>
  );
};

export default Login;
