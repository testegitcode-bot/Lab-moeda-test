import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';

export function DashboardAlunoPage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  if (!usuario) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Meu Painel</h1>
          <p className="text-gray-500 text-sm mt-1">Bem-vindo de volta, {usuario.nome.split(' ')[0]}!</p>
        </div>

        {/* Top cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary-700 to-primary-900 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-200 text-sm font-medium">Saldo de Moedas</p>
                <p className="text-4xl font-bold mt-1">{usuario.saldoMoedas ?? 0}</p>
                <p className="text-primary-300 text-xs mt-1">moedas disponíveis</p>
              </div>
              <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-200" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12zm.75-9.25a.75.75 0 00-1.5 0v2.5H7a.75.75 0 000 1.5h2.25v2.5a.75.75 0 001.5 0v-2.5H13a.75.75 0 000-1.5h-2.25v-2.5z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Instituição</p>
                <p className="text-gray-900 font-semibold mt-1 text-sm leading-tight">{usuario.instituicaoNome ?? '—'}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Curso</p>
                <p className="text-gray-900 font-semibold mt-1">{usuario.curso ?? '—'}</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick actions */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Ações Disponíveis</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/vantagens')}
                className="group flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-primary-100 bg-primary-50 hover:border-primary-400 hover:bg-primary-100 transition-all duration-200 text-left"
              >
                <div className="w-12 h-12 bg-primary-700 group-hover:bg-primary-800 rounded-xl flex items-center justify-center transition-colors duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900 text-sm">Visualizar Vantagens</p>
                  <p className="text-gray-500 text-xs mt-1">Explore benefícios disponíveis</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/extrato')}
                className="group flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-teal-100 bg-teal-50 hover:border-teal-400 hover:bg-teal-100 transition-all duration-200 text-left"
              >
                <div className="w-12 h-12 bg-teal-600 group-hover:bg-teal-700 rounded-xl flex items-center justify-center transition-colors duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900 text-sm">Extrato Completo</p>
                  <p className="text-gray-500 text-xs mt-1">Veja todas as transações</p>
                </div>
              </button>
            </div>
          </div>

          {/* Timeline of recent activities */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Atividades Recentes</h2>
            <div className="relative">
              {/* Timeline vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100" aria-hidden="true" />

              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="relative z-10 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-4 ring-4 ring-white">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <p className="text-gray-500 text-sm font-medium">Nenhuma transação realizada ainda.</p>
                <p className="text-gray-400 text-xs mt-1">Suas moedas aparecerão aqui.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
