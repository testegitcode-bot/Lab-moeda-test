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
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}