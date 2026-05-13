import { Navigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { SidebarAluno } from '../components/SidebarAluno';
import { useAuth } from '../context/AuthContext';

export function VantagensAlunoPage() {
  const { usuario } = useAuth();
  if (!usuario) return null;
  if (usuario.tipo !== 'ALUNO') return <Navigate to="/dashboard/aluno" replace />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <SidebarAluno />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Vantagens</h1>
            <p className="text-gray-500 text-sm mt-1">Benefícios disponíveis para resgatar com suas moedas</p>
          </div>

          <div className="max-w-lg mx-auto mt-16">
            <div className="card flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Em Construção</h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Funcionalidade em desenvolvimento. Esta área será liberada em breve.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
