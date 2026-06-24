import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { AlunoResumo } from '../types';

type Aba = 'painel' | 'alunos';

export function DashboardProfessorPage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [aba, setAba] = useState<Aba>('painel');
  const [alunos, setAlunos] = useState<AlunoResumo[]>([]);
  const [loadingAlunos, setLoadingAlunos] = useState(false);
  const [filtro, setFiltro] = useState('');

  if (!usuario) return null;

  useEffect(() => {
    if (aba === 'alunos' && usuario.instituicaoId) {
      setLoadingAlunos(true);
      (api.listarAlunosDaInstituicao(usuario.instituicaoId) as Promise<AlunoResumo[]>)
        .then(data => setAlunos(data))
        .catch(() => {})
        .finally(() => setLoadingAlunos(false));
    }
  }, [aba]);

  const alunosFiltrados = alunos.filter(a =>
    a.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    a.email.toLowerCase().includes(filtro.toLowerCase()) ||
    (a.curso ?? '').toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
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

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
          {([
            { key: 'painel', label: 'Painel' },
            { key: 'alunos', label: 'Alunos da Instituição' },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => setAba(t.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                aba === t.key ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ABA: Painel */}
        {aba === 'painel' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              <div className="card bg-gradient-to-br from-amber-500 to-amber-700 text-white border-0 sm:col-span-1">
                <p className="text-amber-100 text-sm font-medium">Saldo de Moedas</p>
                <p className="text-5xl font-bold mt-2">{usuario.saldoMoedas ?? 0}</p>
                <p className="text-amber-200 text-xs mt-1">moedas para distribuir</p>
              </div>

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

            <h2 className="text-base font-semibold text-gray-700 mb-3">Ações</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <p className="text-sm text-gray-500 mt-0.5">Distribua moedas para alunos da sua instituição.</p>
                    <p className="text-xs text-amber-700 font-medium mt-2">Saldo: {usuario.saldoMoedas ?? 0} moedas →</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setAba('alunos')}
                className="card text-left hover:shadow-md hover:border-blue-200 transition-all duration-200 border border-transparent group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                    <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Alunos da instituição</p>
                    <p className="text-sm text-gray-500 mt-0.5">Visualize todos os alunos cadastrados na sua instituição.</p>
                    <p className="text-xs text-blue-700 font-medium mt-2">Ver alunos →</p>
                  </div>
                </div>
              </button>
            </div>
          </>
        )}

        {/* ABA: Alunos */}
        {aba === 'alunos' && (
          <div className="card">
            <div className="flex items-center justify-between mb-4 gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Alunos — {usuario.instituicaoNome}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{alunos.length} aluno{alunos.length !== 1 ? 's' : ''} cadastrado{alunos.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar por nome, e-mail ou curso..."
                className="form-input"
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
              />
            </div>

            {loadingAlunos ? (
              <div className="text-center py-10 text-gray-400">Carregando alunos...</div>
            ) : alunosFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">{filtro ? 'Nenhum aluno encontrado para este filtro.' : 'Nenhum aluno cadastrado nesta instituição.'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-gray-100">
                      <th className="pb-3 pr-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Aluno</th>
                      <th className="pb-3 pr-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Curso</th>
                      <th className="pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wide text-right">Saldo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {alunosFiltrados.map(a => (
                      <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 pr-4">
                          <p className="font-medium text-gray-900">{a.nome}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{a.email}</p>
                        </td>
                        <td className="py-3 pr-4 text-gray-600">{a.curso || '—'}</td>
                        <td className="py-3 text-right">
                          <span className="font-semibold text-primary-700">{a.saldoMoedas}</span>
                          <span className="text-gray-400 text-xs ml-1">moedas</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
