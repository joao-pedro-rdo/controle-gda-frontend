import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
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
  FaCog,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { useColors } from "../../hooks/useColors";
import { useMediaQuery } from "@chakra-ui/react";

export const NavButtons = ({ auth, handleLogout, onMilitaryOpen }) => {
  const { primaryColor, secondaryColor } = useColors();
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  
  // Converter hex para nome de cor ou usar customizado
  const getColorScheme = () => {
    const colors = {
      '#dc2626': 'red',
      '#2563eb': 'blue', 
      '#16a34a': 'green',
      '#9333ea': 'purple',
      '#ea580c': 'orange',
      '#ec4899': 'pink',
      '#4f46e5': 'indigo',
      '#475569': 'gray'
    };
    return colors[primaryColor] || 'red';
  };
  
  const colorScheme = getColorScheme();
  
  // Tamanho dos botões e ícones baseado no contexto
  const buttonSize = isMobile ? "md" : "sm";
  const iconSize = isMobile ? "18px" : "14px";
  const buttonWidth = isMobile ? "100%" : "auto";
  
  return (
    <>
      {/* Home - sempre visível */}
      <Link to="/" style={{ width: buttonWidth }}>
        <Button
          leftIcon={<Icon as={FaHome} boxSize={iconSize} />}
          variant="outline"
          colorScheme={colorScheme}
          size={buttonSize}
          width={buttonWidth}
        >
          Home
        </Button>
      </Link>

      {/* Menu de Usuários - apenas S2 */}
      {auth.user.role === "S2" && (
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<Icon as={FaChevronDown} boxSize={iconSize} />}
            variant="outline"
            colorScheme={colorScheme}
            size={buttonSize}
            leftIcon={<Icon as={FaUsers} boxSize={iconSize} />}
            width={buttonWidth}
          >
            Usuários
          </MenuButton>
          <MenuList>
            <MenuItem as={Link} to="/usuarios">
              <Icon as={FaUsers} mr={2} boxSize="16px" />
              Gerenciar Usuários
            </MenuItem>
            <MenuItem as={Link} to="/mudarSenha">
              <Icon as={FaKey} mr={2} boxSize="16px" />
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
            rightIcon={<Icon as={FaChevronDown} boxSize={iconSize} />}
            variant="outline"
            colorScheme={colorScheme}
            size={buttonSize}
            leftIcon={<Icon as={FaCar} boxSize={iconSize} />}
            width={buttonWidth}
          >
            Veículos
          </MenuButton>
          <MenuList>
            <MenuItem as={Link} to="/veiculos">
              <Icon as={FaCar} mr={2} boxSize="16px" />
              Cadastrar Veículo
            </MenuItem>
            <MenuItem as={Link} to="/lista-veiculos">
              <Icon as={FaClipboardList} mr={2} boxSize="16px" />
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
            rightIcon={<Icon as={FaChevronDown} boxSize={iconSize} />}
            variant="outline"
            colorScheme={colorScheme}
            size={buttonSize}
            leftIcon={<Icon as={FaUserShield} boxSize={iconSize} />}
            width={buttonWidth}
          >
            Permissionários
          </MenuButton>
          <MenuList>
            {auth.user.role === "S2" && (
              <>
                <MenuItem as={Link} to="/permissionarios">
                  <Icon as={FaUsers} mr={2} boxSize="16px" />
                  Cadastrar Permissionário
                </MenuItem>
                <MenuItem as={Link} to="/lista-permissionarios">
                  <Icon as={FaClipboardList} mr={2} boxSize="16px" />
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
            rightIcon={<Icon as={FaChevronDown} boxSize={iconSize} />}
            variant="outline"
            colorScheme="blue"
            size={buttonSize}
            leftIcon={<Icon as={FaCalendarAlt} boxSize={iconSize} />}
            width={buttonWidth}
          >
            Agendamentos
          </MenuButton>
          <MenuList>
            {(auth.user.role === "S2" || auth.user.role === "SFPC") && (
              <MenuItem as={Link} to="/agendar-visitante">
                <Icon as={FaCalendarAlt} mr={2} boxSize="16px" />
                Agendar Visitante
              </MenuItem>
            )}
            <MenuItem as={Link} to="/agendamentos">
              <Icon as={FaClipboardList} mr={2} boxSize="16px" />
              Ver Agendamentos
            </MenuItem>

          </MenuList>
        </Menu>
      )}

      {/* Menu de Operações STA */}
      {auth.user.role === "Sta" && (
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<Icon as={FaChevronDown} boxSize={iconSize} />}
            variant="outline"
            colorScheme={colorScheme}
            size={buttonSize}
            leftIcon={<Icon as={FaClipboardList} boxSize={iconSize} />}
            width={buttonWidth}
          >
            Operações
          </MenuButton>
          <MenuList>
            <MenuItem as={Link} to="/motoristas">
              <Icon as={FaUsers} mr={2} boxSize="16px" />
              Motoristas
            </MenuItem>
            <MenuItem as={Link} to="/viaturas">
              <Icon as={FaCar} mr={2} boxSize="16px" />
              Viaturas
            </MenuItem>
            <MenuItem as={Link} to="/missoes">
              <Icon as={FaClipboardList} mr={2} boxSize="16px" />
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
            rightIcon={<Icon as={FaChevronDown} boxSize={iconSize} />}
            variant="outline"
            colorScheme={colorScheme}
            size={buttonSize}
            leftIcon={<Icon as={FaFileAlt} boxSize={iconSize} />}
            width={buttonWidth}
          >
            Relatórios
          </MenuButton>
          <MenuList>
            <MenuItem as={Link} to="/relatorio">
              <Icon as={FaFileAlt} mr={2} boxSize="16px" />
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
            rightIcon={<Icon as={FaChevronDown} boxSize={iconSize} />}
            variant="outline"
            colorScheme="orange"
            size={buttonSize}
            leftIcon={<Icon as={FaUserShield} boxSize={iconSize} />}
            width={buttonWidth}
          >
            Segurança
          </MenuButton>
          <MenuList>
            <MenuItem as={Link} to="/pessoas-nao-autorizadas">
              <Icon as={FaUserShield} mr={2} boxSize="16px" />
              Pessoas Não Autorizadas
            </MenuItem>
          </MenuList>
        </Menu>
      )}

      {/* Botão específico para Guarda */}
      {auth.user.role === "Guarda" && (
        <Link to="/guarda" style={{ width: buttonWidth }}>
          <Button
            variant="outline"
            colorScheme="green"
            size={buttonSize}
            leftIcon={<Icon as={FaUserShield} boxSize={iconSize} />}
            width={buttonWidth}
          >
            Controle
          </Button>
        </Link>
      )}

      {/* Botão de Configurações - apenas S2 */}
      {auth.user.role === "S2" && (
        <Link to="/configuracoes" style={{ width: buttonWidth }}>
          <Button
            variant="outline"
            colorScheme="purple"
            size={buttonSize}
            leftIcon={<Icon as={FaCog} boxSize={iconSize} />}
            width={buttonWidth}
          >
            Configurações
          </Button>
        </Link>
      )}

      {/* Botão de Mudar Senha para não-Guarda */}
      {auth.user.role !== "Guarda" && auth.user.role !== "S2" && (
        <Link to="/mudarSenha" style={{ width: buttonWidth }}>
          <Button
            variant="outline"
            colorScheme={colorScheme}
            size={buttonSize}
            leftIcon={<Icon as={FaKey} boxSize={iconSize} />}
            width={buttonWidth}
          >
            Mudar Senha
          </Button>
        </Link>
      )}

      {/* Botão de Logout */}
      <Button
        colorScheme={colorScheme}
        size={buttonSize}
        onClick={handleLogout}
        leftIcon={<Icon as={FaSignOutAlt} boxSize={iconSize} />}
        width={buttonWidth}
      >
        Sair
      </Button>

      {/* Botão para Militares na OM - apenas Guarda */}
      {auth.user?.role === "Guarda" && (
        <Button
          colorScheme="blue"
          variant="outline"
          size={buttonSize}
          onClick={onMilitaryOpen}
          leftIcon={<span style={{ fontSize: iconSize }}>👥</span>}
          width={buttonWidth}
        >
          Militares na OM
        </Button>
      )}
    </>
  );
};
