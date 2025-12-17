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
  useMediaQuery,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
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
  FaCog, // 🔧 Ícone de Configurações
} from "react-icons/fa";
import styled from "styled-components";
import MilitaryPopup from "./MilitaryPopup";
import { NavButtons } from "./navButtons";

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

  const [isMd] = useMediaQuery("(min-width: 800px)");
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <nav
        className="flex w-auto justify-between p-2 shadow-md"
        style={{ backgroundColor: "aliceblue" }}
      >
        <article className="flex w-60 gap-1 items-center">
          <img src="/img/logo.png" alt="logo" width="50px" height="40px" />
          <Text fontSize="sm">
            Bem vindo - Perfil: <strong>{auth.user.role}</strong>
          </Text>
        </article>

        {isMd ? (
          <Flex alignItems="center" gap={2} flexWrap="wrap">
            <NavButtons
              auth={auth}
              handleLogout={handleLogout}
              onMilitaryOpen={onMilitaryOpen}
            />
          </Flex>
        ) : (
          <>
            <button variant="ghost" onClick={onOpen}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#36454F"
              >
                <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
              </svg>
            </button>
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerBody>
                  <Flex direction="column" gap={3} mt={10}>
                    <NavButtons
                      auth={auth}
                      handleLogout={handleLogout}
                      onMilitaryOpen={onMilitaryOpen}
                    />
                  </Flex>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </>
        )}
      </nav>
      <Box pt={[0, 0, "6rem"]} />

      {/* Modal para Militares na OM */}
      <MilitaryPopup isOpen={isMilitaryOpen} onClose={onMilitaryClose} />
    </>
  );
};

// const NavBar = styled.nav`
//   display: flex;
//   align-items: center;
//   padding: 0.8rem;
//   justify-content: space-between;
//   background-color: aliceblue;
//   font-size: 1rem;
//   z-index: 1000;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

//   @media (min-width: 500px) {
//     width: 100%;
//     height: 5rem;
//     position: fixed;
//     top: 0;
//   }

//   @media (max-width: 768px) {
//     flex-direction: column;
//     gap: 0.5rem;
//     height: auto;
//     padding: 0.5rem;
//   }

//   @media print {
//     display: none;
//   }
// `;

export default Navbar;