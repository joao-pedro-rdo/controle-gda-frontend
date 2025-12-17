import { useEffect } from "react";
import Login from "./components/Login";
import { AuthProvider, RequireAuth } from "./context/AuthContext";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./routes/Dashboard";
import { ChakraProvider } from "@chakra-ui/react";
import CarCreate from "./routes/CarCreate";
import FrontControl from "./routes/FrontControl";
import Visitors from "./routes/Visitors";
import ListVehicles from "./routes/ListVehicles";
import Report from "./routes/Report";
import Users from "./routes/Users";
import Drivers from "./routes/Drivers";
import Viaturas from "./routes/Viaturas";
import Missions from "./routes/Missions";
import MissionsReport from "./routes/MissionsReport";
import ChangePassword from "./routes/ChangePassword";
import Permissionarios from "./routes/Permissionarios";
import ListPermissionarios from "./routes/ListPermissionarios";
import ScheduleVisitor from "./routes/ScheduleVisitor"; // Nova importação
import ScheduledVisitors from "./routes/ScheduledVisitors"; // Nova importação
import { PessoasNaoAutorizadas } from "./routes/PessoasNaoAutorizadas";
import Settings from "./routes/Settings";

const App = () => {
  useEffect(() => {
    // Aplicar título e favicon salvos ao carregar a aplicação
    const savedTitle = localStorage.getItem('systemPageTitle');
    const savedLogo = localStorage.getItem('systemLogo');
    
    if (savedTitle) {
      document.title = savedTitle;
    }
    
    if (savedLogo) {
      // Atualizar favicon
      const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
      existingFavicons.forEach(icon => icon.remove());
      
      const link = document.createElement('link');
      link.rel = 'shortcut icon';
      link.type = 'image/x-icon';
      link.href = savedLogo;
      document.head.appendChild(link);
    }
  }, []);
  return (
    <ChakraProvider>
      <AuthProvider>
        <Routes>
          {/* TODOS - OK */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          {/* TODOS - OK */}
          <Route
            path="/mudarSenha"
            element={
              <RequireAuth>
                <ChangePassword />
              </RequireAuth>
            }
          />
          {/* S2 - OK */}
          <Route
            path="/veiculos"
            element={
              <RequireAuth>
                <CarCreate />
              </RequireAuth>
            }
          />
          {/* S2 - OK */}
          <Route
            path="/veiculos/:id"
            element={
              <RequireAuth>
                <CarCreate />
              </RequireAuth>
            }
          />
          {/* GUARDA - OK */}
          <Route
            path="/guarda"
            element={
              <RequireAuth>
                <FrontControl />
              </RequireAuth>
            }
          />
          {/* S2 - OK */}
          <Route
            path="/lista-veiculos"
            element={
              <RequireAuth>
                <ListVehicles />
              </RequireAuth>
            }
          />
          {/* GUARDA - OK */}
          <Route
            path="/visitante"
            element={
              <RequireAuth>
                <Visitors />
              </RequireAuth>
            }
          />
          {/* S2 - SCMT - OK */}
          <Route
            path="/relatorio"
            element={
              <RequireAuth>
                <Report />
              </RequireAuth>
            }
          />
          {/* S2 - OK */}
          <Route
            path="/usuarios"
            element={
              <RequireAuth>
                <Users />
              </RequireAuth>
            }
          />
          {/* STA - OK */}
          <Route
            path="/motoristas"
            element={
              <RequireAuth>
                <Drivers />
              </RequireAuth>
            }
          />
          {/* STA - OK */}
          <Route
            path="/viaturas"
            element={
              <RequireAuth>
                <Viaturas />
              </RequireAuth>
            }
          />
          {/* STA - OK */}
          <Route
            path="/missoes"
            element={
              <RequireAuth>
                <Missions />
              </RequireAuth>
            }
          />
          {/* STA - FISCAL - SCMT - OK */}
          <Route
            path="/arquivo"
            element={
              <RequireAuth>
                <MissionsReport />
              </RequireAuth>
            }
          />
          {/* S2 - OK */}
          <Route
            path="/permissionarios"
            element={
              <RequireAuth>
                <Permissionarios />
              </RequireAuth>
            }
          />
          {/* S2 - OK */}
          <Route
            path="/lista-permissionarios"
            element={
              <RequireAuth>
                <ListPermissionarios />
              </RequireAuth>
            }
          />
          {/* S2 - NOVA ROTA */}
          <Route
            path="/agendar-visitante"
            element={
              <RequireAuth>
                <ScheduleVisitor />
              </RequireAuth>
            }
          />
          {/* Nova rota para agendamentos */}
          <Route
            path="/agendamentos"
            element={
              <RequireAuth>
                <ScheduledVisitors />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/pessoas-nao-autorizadas"
            element={
              <RequireAuth>
                <PessoasNaoAutorizadas />
              </RequireAuth>
            }
          />
          {/* S2 - OK */}
          <Route
            path="/configuracoes"
            element={
              <RequireAuth>
                <Settings />
              </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;
