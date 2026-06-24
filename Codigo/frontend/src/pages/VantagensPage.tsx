import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Vantagem, Cupom } from '../types';

type Aba = 'catalogo' | 'meus-cupons';
type CupomAba = 'codigo' | 'qrcode';

function DisponibilidadeBadge({ v }: { v: Vantagem }) {
  if (v.quantidadeCupons == null) {
    return <span className="badge bg-emerald-100 text-emerald-700">Ilimitado</span>;
  }
  const disp = v.quantidadeCupons - v.cuponsResgatados;
  if (disp <= 0) return <span className="badge bg-red-100 text-red-700">Esgotado</span>;
  return <span className="badge bg-blue-100 text-blue-700">{disp} disponíveis</span>;
}

function ValidadeBadge({ v }: { v: Vantagem }) {
  if (!v.dataValidade) return <span className="badge bg-gray-100 text-gray-500">Sem prazo</span>;
  const expired = new Date(v.dataValidade) < new Date();
  return (
    <span className={`badge ${expired ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
      {expired ? 'Expirado' : `Válido até ${new Date(v.dataValidade).toLocaleDateString('pt-BR')}`}
    </span>
  );
}

function StatusBadge({ status }: { status: Cupom['status'] }) {
  const map = {
    ATIVO: 'bg-emerald-100 text-emerald-700',
    USADO: 'bg-gray-100 text-gray-500',
    EXPIRADO: 'bg-red-100 text-red-700',
  };
  const label = { ATIVO: 'Ativo', USADO: 'Usado', EXPIRADO: 'Expirado' };
  return <span className={`badge ${map[status]}`}>{label[status]}</span>;
}

function CupomCard({ c }: { c: Cupom }) {
  const [aba, setAba] = useState<CupomAba>('codigo');

  return (
    <div className="card shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 truncate">{c.vantagemNome}</h3>
          <StatusBadge status={c.status} />
        </div>
        <p className="text-gray-500 text-sm">{c.empresaNome} · {c.custoPago} moedas</p>
        <p className="text-gray-400 text-xs mt-1">
          Resgatado em {new Date(c.dataResgate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
      </div>

      <div className="shrink-0 w-full sm:w-auto">
        {/* Tabs do cupom */}
        <div className="flex gap-1 bg-gray-100 p-0.5 rounded-lg mb-2">
          <button
            onClick={() => setAba('codigo')}
            className={`flex-1 text-xs px-3 py-1 rounded-md font-medium transition-all ${aba === 'codigo' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
          >
            Código
          </button>
          <button
            onClick={() => setAba('qrcode')}
            className={`flex-1 text-xs px-3 py-1 rounded-md font-medium transition-all ${aba === 'qrcode' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
          >
            QR Code
          </button>
        </div>

        {aba === 'codigo' ? (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg px-4 py-3 text-center">
            <p className="text-xs text-gray-400 mb-0.5">Código do Cupom</p>
            <p className="font-mono font-bold text-gray-800 tracking-widest text-sm">{c.codigoCupom}</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col items-center gap-1">
            <QRCodeSVG
              value={`${window.location.origin}/cupom/${c.codigoCupom}`}
              size={96}
              level="M"
              includeMargin={false}
            />
            <p className="text-xs text-gray-400">Escaneie para ver o cupom</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function VantagensPage() {
  const { usuario } = useAuth();
  const [aba, setAba] = useState<Aba>('catalogo');
  const [vantagens, setVantagens] = useState<Vantagem[]>([]);
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [loadingVantagens, setLoadingVantagens] = useState(true);
  const [loadingCupons, setLoadingCupons] = useState(false);
  const [resgateEmAndamento, setResgateEmAndamento] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  if (!usuario) return null;

  const saldo = usuario.saldoMoedas ?? 0;

  const carregarCupons = () => {
    setLoadingCupons(true);
    api.listarCuponsAluno(usuario.id)
      .then(data => setCupons(data as Cupom[]))
      .catch(() => {})
      .finally(() => setLoadingCupons(false));
  };

  useEffect(() => {
    api.listarTodasVantagens()
      .then(data => setVantagens(data as Vantagem[]))
      .catch(() => {})
      .finally(() => setLoadingVantagens(false));
    // Pre-load coupons so button states are accurate from the start
    api.listarCuponsAluno(usuario.id)
      .then(data => setCupons(data as Cupom[]))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (aba === 'meus-cupons') {
      carregarCupons();
    }
  }, [aba]);

  const handleResgatar = async (v: Vantagem) => {
    setMensagem(null);
    setResgateEmAndamento(v.id);
    try {
      await api.solicitarResgate(usuario.id, v.id);
      setMensagem({ tipo: 'sucesso', texto: `Resgate de "${v.nome}" enfileirado! Seu cupom estará disponível em instantes.` });
      api.listarTodasVantagens().then(data => setVantagens(data as Vantagem[])).catch(() => {});
      // Poll until the new coupon appears (up to 5s)
      let tentativas = 0;
      const poll = () => {
        tentativas++;
        api.listarCuponsAluno(usuario.id)
          .then(data => {
            const lista = data as Cupom[];
            setCupons(lista);
            const apareceu = lista.some(c => c.vantagemId === v.id);
            if (!apareceu && tentativas < 5) setTimeout(poll, 1000);
          })
          .catch(() => {});
      };
      setTimeout(poll, 800);
    } catch (err: unknown) {
      setMensagem({ tipo: 'erro', texto: err instanceof Error ? err.message : 'Erro ao solicitar resgate.' });
    } finally {
      setResgateEmAndamento(null);
    }
  };

  const jaResgatouVantagem = (vantagemId: number) =>
    cupons.some(c => c.vantagemId === vantagemId);

  const podeResgatar = (v: Vantagem) => {
    if (saldo < v.custo) return false;
    if (v.dataValidade && new Date(v.dataValidade) < new Date()) return false;
    if (v.quantidadeCupons != null && (v.quantidadeCupons - v.cuponsResgatados) <= 0) return false;
    if (v.isResgateUnico && jaResgatouVantagem(v.id)) return false;
    return true;
  };

  const motivoBloqueio = (v: Vantagem): string | null => {
    if (v.dataValidade && new Date(v.dataValidade) < new Date()) return 'Vantagem expirada';
    if (v.quantidadeCupons != null && (v.quantidadeCupons - v.cuponsResgatados) <= 0) return 'Cupons esgotados';
    if (saldo < v.custo) return `Saldo insuficiente (${saldo} moedas)`;
    if (v.isResgateUnico && jaResgatouVantagem(v.id)) return 'Cupom já resgatado';
    return null;
  };

  const labelBotao = (v: Vantagem, emAndamento: boolean): string => {
    if (emAndamento) return 'Solicitando...';
    if (v.isResgateUnico && jaResgatouVantagem(v.id)) return 'Cupom já resgatado';
    const bloqueio = motivoBloqueio(v);
    if (bloqueio) return bloqueio;
    if (!v.isResgateUnico && jaResgatouVantagem(v.id)) return 'Resgatar novamente';
    return 'Resgatar';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vantagens</h1>
            <p className="text-gray-500 text-sm mt-1">Seu saldo atual: <span className="font-semibold text-primary-700">{saldo} moedas</span></p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
          <button
            onClick={() => setAba('catalogo')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${aba === 'catalogo' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Vantagens Disponíveis
          </button>
          <button
            onClick={() => setAba('meus-cupons')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${aba === 'meus-cupons' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Meus Cupons Resgatados
          </button>
        </div>

        {/* Toast feedback */}
        {mensagem && (
          <div className={`mb-6 px-4 py-3 rounded-lg text-sm border ${mensagem.tipo === 'sucesso' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {mensagem.texto}
          </div>
        )}

        {/* Catálogo */}
        {aba === 'catalogo' && (
          <>
            {loadingVantagens ? (
              <div className="flex justify-center py-16">
                <svg className="w-8 h-8 text-gray-300 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              </div>
            ) : vantagens.length === 0 ? (
              <div className="card flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">Nenhuma vantagem disponível no momento.</p>
                <p className="text-gray-400 text-sm mt-1">As empresas parceiras ainda não cadastraram benefícios.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {vantagens.map(v => {
                  const jaResgatou = jaResgatouVantagem(v.id);
                  const pode = podeResgatar(v);
                  const emAndamento = resgateEmAndamento === v.id;
                  const bloqueio = motivoBloqueio(v);
                  const isDisabled = (!pode && !(v.isResgateUnico === false && jaResgatou)) || emAndamento || (v.isResgateUnico && jaResgatou);
                  return (
                    <div key={v.id} className="card shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{v.empresaNome}</span>
                        <span className="badge bg-primary-100 text-primary-800 whitespace-nowrap shrink-0 text-xs">{v.custo} moedas</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{v.nome}</h3>
                      {v.descricao && (
                        <p className="text-gray-500 text-sm mb-3 flex-1 line-clamp-3">{v.descricao}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <DisponibilidadeBadge v={v} />
                        <ValidadeBadge v={v} />
                        {!v.isResgateUnico && (
                          <span className="badge bg-teal-100 text-teal-700">Múltiplos resgates</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleResgatar(v)}
                        disabled={isDisabled}
                        title={bloqueio ?? undefined}
                        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          isDisabled
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-primary-700 hover:bg-primary-800 text-white focus:ring-primary-500'
                        }`}
                      >
                        {labelBotao(v, emAndamento)}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Meus cupons */}
        {aba === 'meus-cupons' && (
          <>
            {loadingCupons ? (
              <div className="flex justify-center py-16">
                <svg className="w-8 h-8 text-gray-300 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              </div>
            ) : cupons.length === 0 ? (
              <div className="card flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">Nenhum cupom resgatado ainda.</p>
                <p className="text-gray-400 text-sm mt-1">Explore as vantagens disponíveis e resgate a sua!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cupons.map(c => (
                  <CupomCard key={c.id} c={c} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
