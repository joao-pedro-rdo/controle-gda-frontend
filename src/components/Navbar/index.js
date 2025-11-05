import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaUsers,
  FaCar,
  FaClipboardList,
  FaUserShield,
  FaCalendarAlt,
  FaFileAlt,
  FaHome,
  FaKey,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import styled from "styled-components";
import MilitaryPopup from "./MilitaryPopup";

const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const {
    isOpen: isMilitaryOpen,
    onOpen: onMilitaryOpen,
    onClose: onMilitaryClose,
  } = useDisclosure();

  const handleLogout = () => {
    auth.logout(() => navigate("/"));
  };

  return (
    <>
      <NavBar>
        <Flex gap={3} alignItems={"center"}>
          <img src="/img/logo.png" alt="logo" width="35px" />
          <Text fontSize="sm" display={{ base: "none", md: "block" }}>
            Bem vindo - Perfil: <strong>{auth.user.role}</strong>
          </Text>
        </Flex>

        <Flex alignItems="center" gap={2} flexWrap="wrap">
          {/* Home - sempre visível */}
          <Link to="/">
            <Button
              leftIcon={<Icon as={FaHome} />}
              variant="outline"
              colorScheme="red"
              size="sm"
            >
              Home
            </Button>
          </Link>

          {/* Menu de Usuários - apenas S2 */}
          {auth.user.role === "S2" && (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<Icon as={FaChevronDown} />}
                variant="outline"
                colorScheme="red"
                size="sm"
                leftIcon={<Icon as={FaUsers} />}
              >
                Usuários
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} to="/usuarios">
                  <Icon as={FaUsers} mr={2} />
                  Gerenciar Usuários
                </MenuItem>
                <MenuItem as={Link} to="/mudarSenha">
                  <Icon as={FaKey} mr={2} />
                  Mudar Senha
                </MenuItem>
              </MenuList>
            </Menu>
          )}

          {/* Menu de Veículos */}
          {auth.user.role === "S2" && (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<Icon as={FaChevronDown} />}
                variant="outline"
                colorScheme="red"
                size="sm"
                leftIcon={<Icon as={FaCar} />}
              >
                Veículos
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} to="/veiculos">
                  <Icon as={FaCar} mr={2} />
                  Cadastrar Veículo
                </MenuItem>
                <MenuItem as={Link} to="/lista-veiculos">
                  <Icon as={FaClipboardList} mr={2} />
                  Listar Veículos
                </MenuItem>
              </MenuList>
            </Menu>
          )}

          {/* Menu de Permissionários */}
          {(auth.user.role === "S2" || auth.user.role === "SFPC") && (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<Icon as={FaChevronDown} />}
                variant="outline"
                colorScheme="red"
                size="sm"
                leftIcon={<Icon as={FaUserShield} />}
              >
                Permissionários
              </MenuButton>
              <MenuList>
                {auth.user.role === "S2" && (
                  <>
                    <MenuItem as={Link} to="/permissionarios">
                      <Icon as={FaUsers} mr={2} />
                      Cadastrar Permissionário
                    </MenuItem>
                    <MenuItem as={Link} to="/lista-permissionarios">
                      <Icon as={FaClipboardList} mr={2} />
                      Listar Permissionários
                    </MenuItem>
                  </>
                )}
              </MenuList>
            </Menu>
          )}

          {/* Menu de Agendamentos/Visitantes */}
          {(auth.user.role === "Guarda" ||
            auth.user.role === "SFPC" ||
            auth.user.role === "S2") && (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<Icon as={FaChevronDown} />}
                variant="outline"
                colorScheme="blue"
                size="sm"
                leftIcon={<Icon as={FaCalendarAlt} />}
              >
                Agendamentos
              </MenuButton>
              <MenuList>
                {(auth.user.role === "S2" || auth.user.role === "SFPC") && (
                  <MenuItem as={Link} to="/agendar-visitante">
                    <Icon as={FaCalendarAlt} mr={2} />
                    Agendar Visitante
                  </MenuItem>
                )}
                <MenuItem as={Link} to="/agendamentos">
                  <Icon as={FaClipboardList} mr={2} />
                  Ver Agendamentos
                </MenuItem>
                <MenuItem as={Link} to="/visitantes-agendados">
                  <Icon as={FaUsers} mr={2} />
                  Visitantes Agendados
                </MenuItem>
              </MenuList>
            </Menu>
          )}

          {/* Menu de Operações STA */}
          {auth.user.role === "Sta" && (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<Icon as={FaChevronDown} />}
                variant="outline"
                colorScheme="red"
                size="sm"
                leftIcon={<Icon as={FaClipboardList} />}
              >
                Operações
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} to="/motoristas">
                  <Icon as={FaUsers} mr={2} />
                  Motoristas
                </MenuItem>
                <MenuItem as={Link} to="/viaturas">
                  <Icon as={FaCar} mr={2} />
                  Viaturas
                </MenuItem>
                <MenuItem as={Link} to="/missoes">
                  <Icon as={FaClipboardList} mr={2} />
                  Missões
                </MenuItem>
              </MenuList>
            </Menu>
          )}

          {/* Menu de Relatórios */}
          {(auth.user.role === "S2" ||
            auth.user.role === "Scmt" ||
            auth.user.role === "Ofdia") && (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<Icon as={FaChevronDown} />}
                variant="outline"
                colorScheme="red"
                size="sm"
                leftIcon={<Icon as={FaFileAlt} />}
              >
                Relatórios
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} to="/relatorio">
                  <Icon as={FaFileAlt} mr={2} />
                  Relatório Entrada e Saída
                </MenuItem>
              </MenuList>
            </Menu>
          )}

          {/* Menu de Segurança */}
          {(auth.user.role === "S2" || auth.user.role === "Guarda") && (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<Icon as={FaChevronDown} />}
                variant="outline"
                colorScheme="orange"
                size="sm"
                leftIcon={<Icon as={FaUserShield} />}
              >
                Segurança
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} to="/pessoas-nao-autorizadas">
                  <Icon as={FaUserShield} mr={2} />
                  Pessoas Não Autorizadas
                </MenuItem>
              </MenuList>
            </Menu>
          )}

          {/* Botão específico para Guarda */}
          {auth.user.role === "Guarda" && (
            <Link to="/guarda">
              <Button
                variant="outline"
                colorScheme="green"
                size="sm"
                leftIcon={<Icon as={FaUserShield} />}
              >
                Controle
              </Button>
            </Link>
          )}

          {/* Botão de Mudar Senha para não-Guarda */}
          {auth.user.role !== "Guarda" && auth.user.role !== "S2" && (
            <Link to="/mudarSenha">
              <Button
                variant="outline"
                colorScheme="red"
                size="sm"
                leftIcon={<Icon as={FaKey} />}
              >
                Mudar Senha
              </Button>
            </Link>
          )}

          {/* Botão de Logout */}
          <Button
            colorScheme="red"
            size="sm"
            onClick={handleLogout}
            leftIcon={<Icon as={FaSignOutAlt} />}
          >
            Sair
          </Button>

          {/* Botão para Militares na OM - apenas Guarda */}
          {auth.user?.role === "Guarda" && (
            <Button
              colorScheme="blue"
              variant="outline"
              size="sm"
              onClick={onMilitaryOpen}
              leftIcon={<span>👥</span>}
            >
              Militares na OM
            </Button>
          )}
        </Flex>
      </NavBar>
      <Box pt={[0, 0, "6rem"]} />

      {/* Modal para Militares na OM */}
      <MilitaryPopup isOpen={isMilitaryOpen} onClose={onMilitaryClose} />
    </>
  );
};

const NavBar = styled.nav`
  display: flex;
  align-items: center;
  padding: 0.8rem;
  justify-content: space-between;
  background-color: aliceblue;
  font-size: 1rem;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (min-width: 500px) {
    width: 100%;
    height: 5rem;
    position: fixed;
    top: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    height: auto;
    padding: 0.5rem;
  }

  @media print {
    display: none;
  }
`;

export default Navbar;
