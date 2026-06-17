import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { TipoUsuario } from '../types';

const perfilRota: Partial<Record<TipoUsuario, string>> = {
  ALUNO: '/perfil/aluno',
  EMPRESA: '/perfil/empresa',
};

const painelRota: Record<TipoUsuario, string> = {
  ALUNO: '/dashboard/aluno',
  PROFESSOR: '/dashboard/professor',
  EMPRESA: '/dashboard/empresa',
};

const acoesNav: Partial<Record<TipoUsuario, { label: string; rota: string; icon: React.ReactNode }[]>> = {
  ALUNO: [
    {
      label: 'Vantagens',
      rota: '/vantagens',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
    },
    {
      label: 'Extrato',
      rota: '/extrato',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ],
  PROFESSOR: [
    {
      label: 'Enviar Moedas',
      rota: '/professor/enviar-moedas',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
    },
  ],
  EMPRESA: [
    {
      label: 'Resgates',
      rota: '/empresa/resgates',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
  ],
};

const tipoLabel: Record<TipoUsuario, string> = {
  ALUNO: 'Aluno',
  PROFESSOR: 'Professor',
  EMPRESA: 'Empresa',
};

export function Header() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Resgatado do Code 1 para rastrear a URL atual

  if (!usuario) return null;

  const homePath = painelRota[usuario.tipo];
  // Verifica se o usuário já está no seu respectivo dashboard
  const isOnDashboard = location.pathname === homePath;

  const acoes = acoesNav[usuario.tipo] ?? [];
  const primeiroNome = usuario.nome.split(' ')[0];
  const sobrenome = usuario.nome.split(' ').slice(1).join(' ');
  const inicial = usuario.nome.charAt(0).toUpperCase();

  return (
    <header className="bg-primary-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo — clica e volta ao painel */}
          <button
            onClick={() => navigate(homePath)}
            className="flex items-center gap-2.5 flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-primary-400">
              <img
                src="/coin-stack.png"
                alt="Meritum logo"
                className="w-8 h-8 object-contain"
                onError={e => {
                  const img = e.currentTarget;
                  img.style.display = 'none';
                  const parent = img.parentElement!;
                  parent.innerHTML = `<svg class="w-5 h-5 text-primary-900" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12zm.75-9.25a.75.75 0 00-1.5 0v2.5H7a.75.75 0 000 1.5h2.25v2.5a.75.75 0 001.5 0v-2.5H13a.75.75 0 000-1.5h-2.25v-2.5z"/></svg>`;
                }}
              />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight hidden sm:block">Meritum</span>
          </button>

          {/* Lado direito de navegação */}
          <div className="flex items-center gap-2">

            {/* Botão Dinâmico "Painel": Só renderiza se o usuário estiver fora do dashboard dele (Do Code 1) */}
            {!isOnDashboard && (
              <button
                onClick={() => navigate(homePath)}
                title="Voltar ao Painel"
                className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden sm:inline">Painel</span>
              </button>
            )}

            {/* Botões de ação rápida baseados no perfil (Vantagens, Extrato, Enviar moedas...) */}
            {acoes.map(a => (
              <button
                key={a.rota}
                onClick={() => navigate(a.rota)}
                className="flex items-center gap-1.5 bg-primary-700 hover:bg-primary-600 text-white text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200"
              >
                {a.icon}
                <span className="hidden sm:inline">{a.label}</span>
              </button>
            ))}

            {acoes.length > 0 && (
              <div className="w-px h-6 bg-primary-700 mx-1 hidden sm:block" />
            )}

            {/* Chip de identidade visual (Perfil e nome abreviado) */}
            {perfilRota[usuario.tipo] ? (
              <button
                onClick={() => navigate(perfilRota[usuario.tipo]!)}
                title="Meu Perfil"
                className="flex items-center gap-2 bg-primary-800 hover:bg-primary-700 border border-primary-700 hover:border-primary-500 pl-1.5 pr-3 py-1.5 rounded-lg transition-all duration-200 group"
              >
                <div className="w-7 h-7 rounded-full bg-primary-500 group-hover:bg-primary-400 flex items-center justify-center flex-shrink-0 transition-colors">
                  <span className="text-white text-xs font-bold leading-none">{inicial}</span>
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-white text-sm font-semibold leading-tight">
                    {primeiroNome}{sobrenome ? ` ${sobrenome.charAt(0)}.` : ''}
                  </span>
                  <span className="text-primary-300 text-xs leading-tight">{tipoLabel[usuario.tipo]}</span>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-primary-800 border border-primary-700 pl-1.5 pr-3 py-1.5 rounded-lg">
                <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold leading-none">{inicial}</span>
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-white text-sm font-semibold leading-tight">
                    {primeiroNome}{sobrenome ? ` ${sobrenome.charAt(0)}.` : ''}
                  </span>
                  <span className="text-primary-300 text-xs leading-tight">{tipoLabel[usuario.tipo]}</span>
                </div>
              </div>
            )}

            {/* Sair do Sistema */}
            <button
              onClick={() => { logout(); navigate('/login'); }}
              title="Sair"
              className="flex items-center gap-1.5 bg-primary-700 hover:bg-red-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Sair</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}