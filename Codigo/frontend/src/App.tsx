import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { CadastroAlunoPage } from './pages/CadastroAlunoPage';
import { CadastroEmpresaPage } from './pages/CadastroEmpresaPage';
import { DashboardAlunoPage } from './pages/DashboardAlunoPage';
import { DashboardProfessorPage } from './pages/DashboardProfessorPage';
import { DashboardEmpresaPage } from './pages/DashboardEmpresaPage';
import { PerfilAlunoPage } from './pages/PerfilAlunoPage';
import { PerfilEmpresaPage } from './pages/PerfilEmpresaPage';
import { ExtratoPage } from './pages/ExtratoPage';
import { VantagensAlunoPage } from './pages/VantagensAlunoPage';
import { RelatoriosEmpresaPage } from './pages/RelatoriosEmpresaPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro/aluno" element={<CadastroAlunoPage />} />
          <Route path="/cadastro/empresa" element={<CadastroEmpresaPage />} />
          <Route
            path="/dashboard/aluno"
            element={<ProtectedRoute><DashboardAlunoPage /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/professor"
            element={<ProtectedRoute><DashboardProfessorPage /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/empresa"
            element={<ProtectedRoute><DashboardEmpresaPage /></ProtectedRoute>}
          />
          <Route
            path="/perfil/aluno"
            element={<ProtectedRoute><PerfilAlunoPage /></ProtectedRoute>}
          />
          <Route
            path="/perfil/empresa"
            element={<ProtectedRoute><PerfilEmpresaPage /></ProtectedRoute>}
          />
          <Route
            path="/extrato"
            element={<ProtectedRoute><ExtratoPage /></ProtectedRoute>}
          />
          <Route
            path="/vantagens"
            element={<ProtectedRoute><VantagensAlunoPage /></ProtectedRoute>}
          />
          <Route
            path="/relatorios"
            element={<ProtectedRoute><RelatoriosEmpresaPage /></ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}