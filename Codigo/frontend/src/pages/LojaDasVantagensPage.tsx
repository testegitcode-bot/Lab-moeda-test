import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Vantagem, Resgate, Transacao } from '../types';

export function LojaDasVantagensPage() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();

  const [vantagens, setVantagens] = useState<Vantagem[]>([]);
  const [resgates, setResgates] = useState<Resgate[]>([]);
  const [extrato, setExtrato] = useState<Transacao[]>([]);
  const [loadingDados, setLoadingDados] = useState(true);
  const [resgatando, setResgatando] = useState<number | null>(null);
  const [vantagensResgatadas, setVantagensResgatadas] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState('');
  const [erro, setErro] = useState('');
  const [aba, setAba] = useState<'loja' | 'extrato' | 'historico'>('loja');

  const alunoId = usuario?.id ?? 0;
  const saldo = usuario?.saldoMoedas ?? 0;

  const carregarResgates = () =>
    (api.resgatesDoAluno(alunoId) as Promise<Resgate[]>).then(lista => {
      setResgates(lista);
      setVantagensResgatadas(new Set(lista.map(r => r.vantagemId)));
    }).catch(() => {});

  useEffect(() => {
    if (!usuario || usuario.tipo !== 'ALUNO') {
      navigate('/login');
      return;
    }

    Promise.all([
      api.listarTodasVantagens() as Promise<Vantagem[]>,
      api.resgatesDoAluno(alunoId) as Promise<Resgate[]>,
      api.extratoDoAluno(alunoId) as Promise<Transacao[]>,
    ])
      .then(([v, r, e]) => {
        setVantagens(v);
        setResgates(r);
        setVantagensResgatadas(new Set(r.map(res => res.vantagemId)));
        setExtrato(e);
      })
      .catch(() => setErro('Erro ao carregar dados.'))
      .finally(() => setLoadingDados(false));
  }, []);

  const handleResgatar = async (vantagem: Vantagem) => {
    setToast('');
    setErro('');
    if (saldo < vantagem.custo) {
      setErro(`Saldo insuficiente. Você tem ${saldo} moedas e esta vantagem custa ${vantagem.custo}.`);
      return;
    }

    setResgatando(vantagem.id);
    try {
      await api.resgatar(alunoId, vantagem.id);

      // Atualiza o saldo local otimisticamente
      if (usuario) login({ ...usuario, saldoMoedas: saldo - vantagem.custo });

      // Bloqueia o botão imediatamente no estado local (antes do consumer processar)
      setVantagensResgatadas(prev => new Set(prev).add(vantagem.id));

      // Exibe toast de processamento assíncrono
      setToast(`Seu resgate de "${vantagem.nome}" está sendo processado!`);
      setTimeout(() => setToast(''), 5000);

      // Recarrega os cupons após curto intervalo (consumer é quase instantâneo)
      setTimeout(() => carregarResgates(), 800);
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao resgatar.');
    } finally {
      setResgatando(null);
    }
  };

  const formatData = (iso: string) =>
    new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

  const statusConfig: Record<string, { label: string; cls: string }> = {
    ATIVO: { label: 'Ativo', cls: 'bg-green-100 text-green-800' },
    USADO: { label: 'Usado', cls: 'bg-gray-100 text-gray-600' },
    EXPIRADO: { label: 'Expirado', cls: 'bg-red-100 text-red-800' },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Toast de processamento */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-green-700 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {toast}
        </div>
      )}

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => navigate('/dashboard/aluno')} className="hover:text-primary-700 transition-colors">
            Painel do Aluno
          </button>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">Loja de Vantagens</span>
        </div>

        {/* Saldo card */}
        <div className="card mb-6 bg-gradient-to-br from-blue-700 to-blue-900 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Seu saldo atual</p>
              <p className="text-4xl font-bold mt-1">{saldo}</p>
              <p className="text-blue-200 text-sm mt-1">moedas disponíveis</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Erro */}
        {erro && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {erro}
          </div>
        )}

        {/* Abas */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 w-fit">
          {[
            { key: 'loja', label: 'Loja' },
            { key: 'extrato', label: 'Extrato de moedas' },
            { key: 'historico', label: 'Meus resgates' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setAba(tab.key as typeof aba)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                aba === tab.key
                  ? 'bg-primary-700 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ABA: Loja */}
        {aba === 'loja' && (
          <>
            {loadingDados ? (
              <div className="text-center py-12 text-gray-400">Carregando vantagens...</div>
            ) : vantagens.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-500">Nenhuma vantagem disponível no momento.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {vantagens.map(v => {
                  const jaResgatou = vantagensResgatadas.has(v.id);
                  const podeResgatar = !jaResgatou && saldo >= v.custo;
                  return (
                    <div
                      key={v.id}
                      className={`card flex flex-col gap-3 transition-all duration-200 ${
                        podeResgatar ? 'hover:shadow-md' : 'opacity-70'
                      }`}
                    >
                      {(v as Vantagem & { fotoUrl?: string }).fotoUrl ? (
                        <img
                          src={(v as Vantagem & { fotoUrl?: string }).fotoUrl}
                          alt={v.nome}
                          className="w-full h-36 object-cover rounded-lg"
                          onError={e => (e.currentTarget.style.display = 'none')}
                        />
                      ) : (
                        <div className="w-full h-36 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                          <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                          </svg>
                        </div>
                      )}

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{v.nome}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{v.empresaNome}</p>
                        {v.descricao && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{v.descricao}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold text-primary-700">{v.custo}</span>
                          <span className="text-sm text-gray-500">moedas</span>
                        </div>
                        <button
                          onClick={() => handleResgatar(v)}
                          disabled={!podeResgatar || resgatando === v.id || jaResgatou}
                          className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-all duration-200 ${
                            jaResgatou
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : podeResgatar
                              ? 'bg-primary-700 hover:bg-primary-800 text-white'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {resgatando === v.id
                            ? 'Processando...'
                            : jaResgatou
                            ? 'Essa vantagem já foi resgatada'
                            : podeResgatar
                            ? 'Resgatar Vantagem'
                            : 'Saldo insuficiente'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ABA: Extrato */}
        {aba === 'extrato' && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Moedas recebidas</h2>
            {loadingDados ? (
              <div className="text-center py-8 text-gray-400">Carregando...</div>
            ) : extrato.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-sm">Você ainda não recebeu nenhuma moeda.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {extrato.map(t => (
                  <div key={t.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900">De: {t.remetenteNome}</p>
                        <span className="text-sm font-bold text-green-700">+{t.quantidade}</span>
                      </div>
                      {t.mensagem && (
                        <p className="text-xs text-gray-500 mt-0.5">"{t.mensagem}"</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">{formatData(t.criadoEm)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABA: Histórico de resgates */}
        {aba === 'historico' && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Meus resgates</h2>
              <button
                onClick={carregarResgates}
                className="text-sm text-primary-700 hover:text-primary-800 font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Atualizar
              </button>
            </div>
            {loadingDados ? (
              <div className="text-center py-8 text-gray-400">Carregando...</div>
            ) : resgates.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-sm">Você ainda não resgatou nenhuma vantagem.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {resgates.map(r => {
                  const cfg = statusConfig[r.status] ?? { label: r.status, cls: 'bg-gray-100 text-gray-600' };
                  return (
                    <div key={r.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{r.vantagemNome}</p>
                            <p className="text-xs text-gray-500">{r.empresaNome}</p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">#{r.codigoCupom}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-sm font-bold text-red-600">-{r.custoPago}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.cls}`}>{cfg.label}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{formatData(r.dataResgate)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
