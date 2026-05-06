import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';

export function DashboardProfessorPage() {
  const { usuario } = useAuth();
  if (!usuario) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Olá, Prof. {usuario.nome.split(' ')[0]}!</h1>
              <p className="text-gray-500 text-sm">{usuario.departamento} · {usuario.instituicaoNome}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-amber-500 to-amber-700 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Saldo para Distribuir</p>
                <p className="text-4xl font-bold mt-1">{usuario.saldoMoedas ?? 0}</p>
                <p className="text-amber-200 text-xs mt-1">moedas disponíveis</p>
              </div>
              <div className="w-14 h-14 bg-amber-600 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-100" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12zm.75-9.25a.75.75 0 00-1.5 0v2.5H7a.75.75 0 000 1.5h2.25v2.5a.75.75 0 001.5 0v-2.5H13a.75.75 0 000-1.5h-2.25v-2.5z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="card flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <p className="text-gray-900 font-semibold">Instituição</p>
              <p className="text-gray-500 text-sm mt-1">{usuario.instituicaoNome ?? '—'}</p>
            </div>
          </div>
        </div>

        <div className="card border-2 border-dashed border-amber-200 bg-amber-50">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-amber-900">Modulo em Desenvolvimento</h2>
              <p className="text-amber-700 text-sm mt-1">
                As funcionalidades de distribuição de moedas, gerenciamento de alunos e histórico de transações
                estão sendo desenvolvidas e estarão disponíveis em breve.
              </p>
              <p className="text-amber-600 text-xs mt-2 font-medium">MVP · Sprint 2 — em construção</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
