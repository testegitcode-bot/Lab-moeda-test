import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';

export function DashboardProfessorPage() {
  const { usuario } = useAuth();
  if (!usuario) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{usuario.nome}</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {usuario.departamento && <span>{usuario.departamento} · </span>}
              {usuario.instituicaoNome ?? '—'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="card bg-gradient-to-br from-amber-500 to-amber-700 text-white border-0 sm:col-span-1">
            <p className="text-amber-100 text-sm font-medium">Saldo de Moedas</p>
            <p className="text-5xl font-bold mt-2">{usuario.saldoMoedas ?? 0}</p>
            <p className="text-amber-200 text-xs mt-1">moedas para distribuir</p>
          </div>

          <div className="card sm:col-span-2">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Dados do Perfil</h2>
            <dl className="space-y-2">
              <div className="flex justify-between text-sm">
                <dt className="text-gray-400">E-mail</dt>
                <dd className="text-gray-800 font-medium">{usuario.email}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-400">Departamento</dt>
                <dd className="text-gray-800 font-medium">{usuario.departamento ?? '—'}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-400">Instituição</dt>
                <dd className="text-gray-800 font-medium">{usuario.instituicaoNome ?? '—'}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="card border-2 border-dashed border-amber-200 bg-amber-50">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-amber-900">Módulo em Desenvolvimento</h3>
              <p className="text-amber-700 text-sm mt-1 leading-relaxed">
                As funcionalidades de distribuição de moedas para alunos, gerenciamento de turmas e
                histórico de transações estão sendo desenvolvidas e estarão disponíveis em breve.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  disabled
                  className="px-4 py-2 bg-amber-200 text-amber-500 text-sm font-medium rounded-lg cursor-not-allowed opacity-60"
                >
                  Enviar Moedas
                </button>
                <button
                  disabled
                  className="px-4 py-2 bg-amber-200 text-amber-500 text-sm font-medium rounded-lg cursor-not-allowed opacity-60"
                >
                  Ver Histórico
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
