import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Transacao, Cupom } from '../types';

type Linha =
  | { tipo: 'recebimento'; data: string; valor: number; descricao: string; detalhe: string }
  | { tipo: 'gasto'; data: string; valor: number; descricao: string; detalhe: string };

function MetricCard({ label, value, color, icon }: {
  label: string; value: number; color: string; icon: React.ReactNode;
}) {
  return (
    <div className={`card flex items-center gap-4 ${color}`}>
      <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium opacity-80">{label}</p>
        <p className="text-3xl font-bold mt-0.5">{value}</p>
        <p className="text-xs opacity-60 mt-0.5">moedas</p>
      </div>
    </div>
  );
}

export function ExtratoPage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'todos' | 'recebimentos' | 'gastos'>('todos');

  if (!usuario) return null;

  useEffect(() => {
    Promise.all([
      api.extratoDoAluno(usuario.id) as Promise<Transacao[]>,
      api.listarCuponsAluno(usuario.id) as Promise<Cupom[]>,
    ])
      .then(([t, c]) => {
        setTransacoes(t);
        setCupons(c);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalRecebido = transacoes.reduce((s, t) => s + t.quantidade, 0);
  const totalGasto = cupons.reduce((s, c) => s + c.custoPago, 0);

  const linhas: Linha[] = [
    ...transacoes.map(t => ({
      tipo: 'recebimento' as const,
      data: t.criadoEm,
      valor: t.quantidade,
      descricao: `De ${t.remetenteNome}`,
      detalhe: t.mensagem ? `"${t.mensagem}"` : '',
    })),
    ...cupons.map(c => ({
      tipo: 'gasto' as const,
      data: c.dataResgate,
      valor: c.custoPago,
      descricao: c.vantagemNome,
      detalhe: c.empresaNome,
    })),
  ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const linhasFiltradas = filtro === 'todos' ? linhas
    : linhas.filter(l => l.tipo === (filtro === 'recebimentos' ? 'recebimento' : 'gasto'));

  const formatData = (iso: string) =>
    new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => navigate('/dashboard/aluno')} className="hover:text-primary-700 transition-colors">
            Meu Painel
          </button>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">Extrato</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Extrato de Moedas</h1>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <MetricCard
            label="Saldo atual"
            value={usuario.saldoMoedas ?? 0}
            color="bg-gradient-to-br from-primary-700 to-primary-900 text-white border-0"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <MetricCard
            label="Total recebido"
            value={totalRecebido}
            color="bg-gradient-to-br from-green-600 to-green-800 text-white border-0"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            }
          />
          <MetricCard
            label="Total gasto"
            value={totalGasto}
            color="bg-gradient-to-br from-red-600 to-red-800 text-white border-0"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            }
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-4">
          {([
            { key: 'todos', label: 'Todos' },
            { key: 'recebimentos', label: 'Recebimentos' },
            { key: 'gastos', label: 'Gastos' },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => setFiltro(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                filtro === t.key ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="card">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Carregando extrato...</div>
          ) : linhasFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Nenhuma movimentação encontrada.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {linhasFiltradas.map((l, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    l.tipo === 'recebimento' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {l.tipo === 'recebimento' ? (
                      <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{l.descricao}</p>
                        {l.detalhe && <p className="text-xs text-gray-500 mt-0.5">{l.detalhe}</p>}
                        <p className="text-xs text-gray-400 mt-1">{formatData(l.data)}</p>
                      </div>
                      <span className={`font-bold text-sm whitespace-nowrap ${
                        l.tipo === 'recebimento' ? 'text-green-700' : 'text-red-600'
                      }`}>
                        {l.tipo === 'recebimento' ? '+' : '-'}{l.valor}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
