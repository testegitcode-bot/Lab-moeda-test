import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';

export function DashboardAlunoPage() {
  const { usuario } = useAuth();
  if (!usuario) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Meu Painel</h1>
          <p className="text-gray-500 text-sm mt-1">Bem-vindo de volta, {usuario.nome.split(' ')[0]}!</p>
        </div>

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
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Meus Dados</h2>
            <dl className="space-y-3">
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Nome</dt>
                <dd className="text-gray-900 font-medium">{usuario.nome}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">E-mail</dt>
                <dd className="text-gray-900 font-medium">{usuario.email}</dd>
              </div>
              {usuario.rg && (
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">RG</dt>
                  <dd className="text-gray-900 font-medium">{usuario.rg}</dd>
                </div>
              )}
              {usuario.endereco && (
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">Endereço</dt>
                  <dd className="text-gray-900 font-medium text-right max-w-xs">{usuario.endereco}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h2>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Nenhuma transação realizada ainda.</p>
              <p className="text-gray-400 text-xs mt-1">Suas moedas aparecerão aqui.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
