import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';

interface CupomInfo {
  id: number;
  codigoCupom: string;
  vantagemNome: string;
  empresaNome: string;
  alunoNome: string;
  status: 'ATIVO' | 'USADO' | 'EXPIRADO';
  dataResgate: string;
  custoPago: number;
}

export function CupomPublicoPage() {
  const { codigo } = useParams<{ codigo: string }>();
  const [cupom, setCupom] = useState<CupomInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!codigo) { setNotFound(true); setLoading(false); return; }
    (api.buscarCupomPublico(codigo) as Promise<CupomInfo>)
      .then(data => setCupom(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [codigo]);

  const handleCopiar = () => {
    if (!cupom) return;
    navigator.clipboard.writeText(cupom.codigoCupom).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const statusConfig = {
    ATIVO: { label: 'Ativo', bg: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
    USADO: { label: 'Utilizado', bg: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
    EXPIRADO: { label: 'Expirado', bg: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex flex-col items-center justify-center p-4">
      {/* Logo / Brand */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-1">
          <img src="/coin-stack.png" alt="Meritum" className="w-8 h-8 object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
          <span className="text-xl font-bold text-gray-800 tracking-tight">Meritum</span>
        </div>
        <p className="text-gray-500 text-sm">Sistema de Moeda Estudantil</p>
      </div>

      <div className="w-full max-w-sm">
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Carregando cupom...</p>
          </div>
        )}

        {!loading && notFound && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Cupom não encontrado</h2>
            <p className="text-gray-500 text-sm">Verifique o QR Code e tente novamente.</p>
          </div>
        )}

        {!loading && cupom && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 px-6 py-5 text-white text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <p className="text-blue-200 text-xs font-medium uppercase tracking-wider mb-1">Você resgatou</p>
              <h1 className="text-xl font-bold leading-tight">{cupom.vantagemNome}</h1>
              <p className="text-blue-300 text-sm mt-1">{cupom.empresaNome}</p>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status do cupom</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${statusConfig[cupom.status].bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[cupom.status].dot}`} />
                  {statusConfig[cupom.status].label}
                </span>
              </div>

              {/* Aluno */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Titular</span>
                <span className="font-medium text-gray-800">{cupom.alunoNome}</span>
              </div>

              {/* Data */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Resgatado em</span>
                <span className="font-medium text-gray-800">
                  {new Date(cupom.dataResgate).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>

              <div className="border-t border-gray-100" />

              {/* Código */}
              <div>
                <p className="text-xs text-gray-500 mb-2 text-center">Abaixo você pode ver seu código</p>
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl px-4 py-4 text-center">
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-widest font-medium">Código do Cupom</p>
                  <p className="font-mono font-bold text-gray-900 tracking-[0.2em] text-xl">{cupom.codigoCupom}</p>
                </div>

                <button
                  onClick={handleCopiar}
                  className={`mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-700 hover:bg-blue-800 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Código copiado!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copiar código
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
