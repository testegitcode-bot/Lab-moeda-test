import { Header } from '../components/Header';

export function VantagensPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Catálogo de Vantagens</h1>
          <p className="text-gray-500 text-sm mb-1">Funcionalidade em desenvolvimento.</p>
          <p className="text-gray-400 text-xs">Em breve você poderá explorar e resgatar benefícios exclusivos com suas moedas.</p>
        </div>
      </main>
    </div>
  );
}
