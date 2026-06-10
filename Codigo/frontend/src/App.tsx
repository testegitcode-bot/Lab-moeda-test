import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { CadastroAlunoPage } from "./pages/CadastroAlunoPage";
import { CadastroEmpresaPage } from "./pages/CadastroEmpresaPage";
import { DashboardAlunoPage } from "./pages/DashboardAlunoPage";
import { DashboardProfessorPage } from "./pages/DashboardProfessorPage";
import { DashboardEmpresaPage } from "./pages/DashboardEmpresaPage";
import { PerfilAlunoPage } from "./pages/PerfilAlunoPage";
import { PerfilEmpresaPage } from "./pages/PerfilEmpresaPage";
import { VantagensPage } from "./pages/VantagensPage";
import { ExtratoPage } from "./pages/ExtratoPage";
import { EnviarMoedasPage } from "./pages/EnviarMoedasPage";
import { LojaDasVantagensPage } from "./pages/LojaDasVantagensPage";
import { PainelResgatesEmpresaPage } from "./pages/PainelResgatesEmpresaPage";
import { CadastroProfessorPage } from "./pages/CadastroProfessorPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro/aluno" element={<CadastroAlunoPage />} />
          <Route path="/cadastro/empresa" element={<CadastroEmpresaPage />} />

          {/* Dashboards */}
          <Route
            path="/dashboard/aluno"
            element={
              <ProtectedRoute>
                <DashboardAlunoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/professor"
            element={
              <ProtectedRoute>
                <DashboardProfessorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/empresa"
            element={
              <ProtectedRoute>
                <DashboardEmpresaPage />
              </ProtectedRoute>
            }
          />

          {/* Perfis */}
          <Route
            path="/perfil/aluno"
            element={
              <ProtectedRoute>
                <PerfilAlunoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil/empresa"
            element={
              <ProtectedRoute>
                <PerfilEmpresaPage />
              </ProtectedRoute>
            }
          />

          {/* Rotas do upstream */}
          <Route
            path="/vantagens"
            element={
              <ProtectedRoute>
                <VantagensPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/extrato"
            element={
              <ProtectedRoute>
                <ExtratoPage />
              </ProtectedRoute>
            }
          />

          {/* Sistema de moedas */}
          <Route
            path="/professor/enviar-moedas"
            element={
              <ProtectedRoute>
                <EnviarMoedasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/aluno/vantagens"
            element={
              <ProtectedRoute>
                <LojaDasVantagensPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/empresa/resgates"
            element={
              <ProtectedRoute>
                <PainelResgatesEmpresaPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route
            path="/cadastro/professor"
            element={<CadastroProfessorPage />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
