import { Header } from './Header';
import { useNavigate } from 'react-router-dom';

interface UnderConstructionPageProps {
  title: string;
}

export function UnderConstructionPage({ title }: UnderConstructionPageProps) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
        </div>

        <div className="flex items-center justify-center min-h-96">
          <div className="card max-w-md w-full text-center py-16">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 6h2m-4 0h2m-7-4h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2zm0 0V7a2 2 0 012-2h10a2 2 0 012 2v2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Funcionalidade em desenvolvimento
            </h2>
            <p className="text-gray-600 text-sm">
              Esta área será liberada em breve.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
