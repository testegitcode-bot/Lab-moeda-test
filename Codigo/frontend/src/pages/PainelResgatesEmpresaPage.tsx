import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Resgate } from '../types';

export function PainelResgatesEmpresaPage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [resgates, setResgates] = useState<Resgate[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmando, setConfirmando] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<'TODOS' | 'PENDENTE' | 'CONFIRMADO'>('TODOS');

  const empresaId = usuario?.id ?? 0;

  useEffect(() => {
    if (!usuario || usuario.tipo !== 'EMPRESA') {
      navigate('/login');
      return;
    }

    api.resgatesDaEmpresa(empresaId)
      .then(data => setResgates(data as Resgate[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleConfirmar = async (resgateId: number) => {
    setConfirmando(resgateId);
    try {
      const atualizado = await api.confirmarResgate(resgateId) as Resgate;
      setResgates(prev => prev.map(r => r.id === resgateId ? atualizado : r));
    } catch {
      alert('Erro ao confirmar resgate.');
    } finally {
      setConfirmando(null);
    }
  };

  const formatData = (iso: string) =>
    new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

  const statusConfig = {
    PENDENTE: { label: 'Aguardando', cls: 'bg-yellow-100 text-yellow-800' },
    CONFIRMADO: { label: 'Confirmado', cls: 'bg-green-100 text-green-800' },
    CANCELADO: { label: 'Cancelado', cls: 'bg-red-100 text-red-800' },
  };

  const filtrados = resgates.filter(r =>
    filtro === 'TODOS' ? true : r.status === filtro
  );

  const pendentes = resgates.filter(r => r.status === 'PENDENTE').length;
  const confirmados = resgates.filter(r => r.status === 'CONFIRMADO').length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => navigate('/dashboard/empresa')} className="hover:text-primary-700 transition-colors">
            Painel da Empresa
          </button>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">Resgates de Vantagens</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total', valor: resgates.length, cor: 'text-gray-900', bg: 'bg-white' },
            { label: 'Aguardando', valor: pendentes, cor: 'text-yellow-700', bg: 'bg-yellow-50' },
            { label: 'Confirmados', valor: confirmados, cor: 'text-green-700', bg: 'bg-green-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl border border-gray-100 p-4 text-center shadow-sm`}>
              <p className={`text-3xl font-bold ${s.cor}`}>{s.valor}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-4">
          {(['TODOS', 'PENDENTE', 'CONFIRMADO'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filtro === f
                  ? 'bg-primary-700 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {f === 'TODOS' ? 'Todos' : f === 'PENDENTE' ? 'Aguardando' : 'Confirmados'}
              {f === 'PENDENTE' && pendentes > 0 && (
                <span className="ml-1.5 bg-yellow-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {pendentes}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Lista */}
        <div className="card">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Carregando resgates...</div>
          ) : filtrados.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Nenhum resgate encontrado.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtrados.map(r => {
                const cfg = statusConfig[r.status] ?? statusConfig.PENDENTE;
                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{r.vantagemNome}</p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            Aluno: <span className="font-medium">{r.alunoNome}</span>
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-sm font-bold text-primary-700">{r.custo} 🪙</span>
                          <span className={`badge text-xs ${cfg.cls}`}>{cfg.label}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{formatData(r.criadoEm)}</p>
                    </div>

                    {r.status === 'PENDENTE' && (
                      <button
                        onClick={() => handleConfirmar(r.id)}
                        disabled={confirmando === r.id}
                        className="btn-primary text-xs px-3 py-1.5 flex-shrink-0"
                      >
                        {confirmando === r.id ? '...' : 'Confirmar entrega'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}