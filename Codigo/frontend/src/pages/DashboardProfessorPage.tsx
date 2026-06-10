import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';

export function DashboardProfessorPage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  // Bloqueia a renderização caso o contexto de autenticação ainda não tenha carregado o usuário
  if (!usuario) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Componente de cabeçalho global atualizado */}
      <Header />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* Identificação do Professor */}
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

        {/* Cards de Resumo Visual */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {/* Card de Destaque: Saldo do Professor */}
          <div className="card bg-gradient-to-br from-amber-500 to-amber-700 text-white border-0 sm:col-span-1">
            <p className="text-amber-100 text-sm font-medium">Saldo de Moedas</p>
            <p className="text-5xl font-bold mt-2">{usuario.saldoMoedas ?? 0}</p>
            <p className="text-amber-200 text-xs mt-1">moedas para distribuir</p>
          </div>

          {/* Card de Dados de Perfil Cadastrais */}
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

        {/* Seção Interativa de Ações Reais do Sistema */}
        <h2 className="text-base font-semibold text-gray-700 mb-3">Ações</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Ação 1: Enviar moedas para Aluno */}
          <button
            onClick={() => navigate('/professor/enviar-moedas')}
            className="card text-left hover:shadow-md hover:border-amber-200 transition-all duration-200 border border-transparent group"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-amber-100 group-hover:bg-amber-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Enviar moedas</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Distribua moedas para alunos da sua instituição como reconhecimento.
                </p>
                <p className="text-xs text-amber-700 font-medium mt-2">
                  Saldo disponível: {usuario.saldoMoedas ?? 0} moedas →
                </p>
              </div>
            </div>
          </button>

          {/* Ação 2: Visualizar Extrato de Transferências */}
          <button
            onClick={() => navigate('/professor/enviar-moedas')} // Alinhado conforme rotas mapeadas pelo Code 2
            className="card text-left hover:shadow-md hover:border-blue-200 transition-all duration-200 border border-transparent group"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Histórico de envios</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Veja todas as moedas que você distribuiu e para quais alunos.
                </p>
                <p className="text-xs text-blue-700 font-medium mt-2">Ver extrato →</p>
              </div>
            </div>
          </button>
          
        </div>
      </main>
    </div>
  );
}