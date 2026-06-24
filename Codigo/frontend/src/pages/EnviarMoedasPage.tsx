import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { AlunoResumo, Transacao } from '../types';

export function EnviarMoedasPage() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();

  const [alunos, setAlunos] = useState<AlunoResumo[]>([]);
  const [extrato, setExtrato] = useState<Transacao[]>([]);
  const [form, setForm] = useState({ alunoId: '', quantidade: '', mensagem: '' });
  const [loading, setLoading] = useState(false);
  const [loadingDados, setLoadingDados] = useState(true);
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');

  const professorId = usuario?.id ?? 0;
  const saldo = usuario?.saldoMoedas ?? 0;
  const instituicaoId = usuario?.instituicaoId ?? 0;

  useEffect(() => {
    if (!usuario || usuario.tipo !== 'PROFESSOR') {
      navigate('/login');
      return;
    }

    Promise.all([
      api.listarAlunosDaInstituicao(instituicaoId) as Promise<AlunoResumo[]>,
      api.extratoDosProfessor(professorId) as Promise<Transacao[]>,
    ])
      .then(([a, e]) => {
        setAlunos(a);
        setExtrato(e);
      })
      .catch(() => setErro('Erro ao carregar dados.'))
      .finally(() => setLoadingDados(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSucesso('');
    setErro('');

    const qtd = Number(form.quantidade);
    if (qtd <= 0) { setErro('Quantidade deve ser maior que zero.'); return; }
    if (qtd > saldo) { setErro(`Saldo insuficiente. Você tem ${saldo} moedas.`); return; }

    setLoading(true);
    try {
      const transacao = await api.enviarMoedas({
        professorId,
        alunoId: Number(form.alunoId),
        quantidade: qtd,
        mensagem: form.mensagem || undefined,
      }) as Transacao;

      // Atualiza saldo na sessão
      if (usuario) {
        login({ ...usuario, saldoMoedas: saldo - qtd });
      }

      setExtrato(prev => [transacao, ...prev]);
      setSucesso(`✓ ${qtd} moeda(s) enviada(s) com sucesso para ${transacao.destinatarioNome}!`);
      setForm({ alunoId: '', quantidade: '', mensagem: '' });
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao enviar moedas.');
    } finally {
      setLoading(false);
    }
  };

  const formatData = (iso: string) =>
    new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => navigate('/dashboard/professor')} className="hover:text-primary-700 transition-colors">
            Painel do Professor
          </button>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">Enviar Moedas</span>
        </div>

        {/* Header card com saldo */}
        <div className="card mb-6 bg-gradient-to-br from-amber-600 to-amber-800 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-200 text-sm">Saldo disponível</p>
              <p className="text-4xl font-bold mt-1">{saldo}</p>
              <p className="text-amber-200 text-sm mt-1">moedas para distribuir</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Enviar moedas</h2>

              {sucesso && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  {sucesso}
                </div>
              )}
              {erro && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {erro}
                </div>
              )}

              <form onSubmit={handleEnviar} className="space-y-4">
                <div>
                  <label className="form-label">Aluno</label>
                  {loadingDados ? (
                    <div className="form-input text-gray-400">Carregando alunos...</div>
                  ) : (
                    <select
                      name="alunoId"
                      className="form-input"
                      value={form.alunoId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione um aluno</option>
                      {alunos.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.nome} {a.curso ? `— ${a.curso}` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="form-label">Quantidade de moedas</label>
                  <input
                    name="quantidade"
                    type="number"
                    min="1"
                    max={saldo}
                    className="form-input"
                    placeholder="Ex: 50"
                    value={form.quantidade}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">Máximo: {saldo} moedas</p>
                </div>

                <div>
                  <label className="form-label">
                    Mensagem <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <textarea
                    name="mensagem"
                    className="form-input resize-none"
                    rows={3}
                    placeholder="Ex: Parabéns pelo ótimo trabalho no projeto!"
                    value={form.mensagem}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center gap-2"
                  disabled={loading || saldo === 0}
                >
                  {loading ? (
                    'Enviando...'
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Enviar moedas
                    </>
                  )}
                </button>

                {saldo === 0 && (
                  <p className="text-center text-sm text-red-500">Seu saldo está zerado.</p>
                )}
              </form>
            </div>
          </div>

          {/* Extrato */}
          <div className="lg:col-span-3">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Histórico de envios</h2>

              {loadingDados ? (
                <div className="text-center py-8 text-gray-400">Carregando...</div>
              ) : extrato.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">Nenhum envio realizado ainda.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {extrato.map(t => (
                    <div key={t.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Para: {t.destinatarioNome}
                          </p>
                          <span className="text-sm font-bold text-amber-700 whitespace-nowrap">
                            -{t.quantidade} 🪙
                          </span>
                        </div>
                        {t.mensagem && (
                          <p className="text-xs text-gray-500 mt-0.5 truncate">"{t.mensagem}"</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">{formatData(t.criadoEm)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}