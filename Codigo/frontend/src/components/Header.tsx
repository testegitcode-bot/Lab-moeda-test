import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { TipoUsuario } from '../types';

const perfilRota: Partial<Record<TipoUsuario, string>> = {
  ALUNO: '/perfil/aluno',
  EMPRESA: '/perfil/empresa',
};

const dashboardRota: Record<TipoUsuario, string> = {
  ALUNO: '/dashboard/aluno',
  PROFESSOR: '/dashboard/professor',
  EMPRESA: '/dashboard/empresa',
};

const alunoNavLinks = [
  {
    path: '/vantagens',
    label: 'Vantagens',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
  },
  {
    path: '/extrato',
    label: 'Extrato',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

const tipoLabel: Record<TipoUsuario, string> = {
  ALUNO: 'Aluno',
  PROFESSOR: 'Professor',
  EMPRESA: 'Empresa Parceira',
};

const tipoColor: Record<TipoUsuario, string> = {
  ALUNO: 'bg-blue-100 text-blue-800',
  PROFESSOR: 'bg-amber-100 text-amber-800',
  EMPRESA: 'bg-emerald-100 text-emerald-800',
};

export function Header() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!usuario) return null;

  const homePath = dashboardRota[usuario.tipo];
  const isOnDashboard = location.pathname === homePath;

  return (
    <header className="bg-primary-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-400 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-900" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12zm.75-9.25a.75.75 0 00-1.5 0v2.5H7a.75.75 0 000 1.5h2.25v2.5a.75.75 0 001.5 0v-2.5H13a.75.75 0 000-1.5h-2.25v-2.5z"/>
              </svg>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">Moeda Estudantil</span>
          </div>

          <div className="flex items-center gap-2">
            {!isOnDashboard && (
              <button
                onClick={() => navigate(homePath)}
                title="Voltar ao Painel"
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden sm:inline">Painel</span>
              </button>
            )}

            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-white font-medium text-sm leading-tight">{usuario.nome}</span>
              <span className="text-[#4ADE80] font-medium text-sm leading-tight">{usuario.tipo.charAt(0).toUpperCase() + usuario.tipo.slice(1).toLowerCase()}</span>
            </div>

            {usuario.tipo === 'ALUNO' && alunoNavLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                title={link.label}
                className="flex items-center gap-2 bg-primary-700 hover:bg-primary-600 text-white text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                {link.icon}
                <span className="hidden sm:inline">{link.label}</span>
              </button>
            ))}

            {perfilRota[usuario.tipo] && (
              <button
                onClick={() => navigate(perfilRota[usuario.tipo]!)}
                title="Meu Perfil"
                className="flex items-center gap-2 bg-primary-700 hover:bg-primary-600 text-white text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">Perfil</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-primary-700 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}