import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { TipoUsuario } from '../types';

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!usuario) return null;

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

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-white font-medium text-sm leading-tight">{usuario.nome}</span>
              <span className={`badge mt-0.5 ${tipoColor[usuario.tipo]}`}>
                {tipoLabel[usuario.tipo]}
              </span>
            </div>

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
