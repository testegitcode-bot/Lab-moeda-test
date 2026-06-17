import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Instituicao } from '../types';

interface ProfessorListItem {
  id: number;
  nome: string;
  email: string;
  departamento: string;
  saldoMoedas: number;
  instituicao?: { id: number; nome: string };
}

interface FormState {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  cpf: string;
  departamento: string;
  instituicaoId: string;
}

const emptyForm: FormState = {
  nome: '', email: '', senha: '', confirmarSenha: '',
  cpf: '', departamento: '', instituicaoId: '',
};

function formatCPF(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function AdminPage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [aba, setAba] = useState<'cadastro' | 'lista'>('cadastro');
  const [form, setForm] = useState<FormState>(emptyForm);
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [professores, setProfessores] = useState<ProfessorListItem[]>([]);
  const [loadingProfessores, setLoadingProfessores] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  if (!usuario || usuario.tipo !== 'ADMIN') {
    navigate('/login');
    return null;
  }

  useEffect(() => {
    api.listarInstituicoes()
      .then(data => setInstituicoes(data as Instituicao[]))
      .catch(() => {});
  }, []);

  const carregarProfessores = () => {
    setLoadingProfessores(true);
    api.listarProfessores()
      .then(data => setProfessores(data as ProfessorListItem[]))
      .catch(() => {})
      .finally(() => setLoadingProfessores(false));
  };

  useEffect(() => {
    if (aba === 'lista') carregarProfessores();
  }, [aba]);

  const senhasNaoConferem = form.confirmarSenha.length > 0 && form.senha !== form.confirmarSenha;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'cpf') setForm(prev => ({ ...prev, cpf: formatCPF(value) }));
    else setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    if (form.senha !== form.confirmarSenha) { setErro('As senhas não coincidem.'); return; }
    const cpfDigits = form.cpf.replace(/\D/g, '');
    if (cpfDigits.length !== 11) { setErro('CPF deve conter exatamente 11 dígitos.'); return; }

    setLoading(true);
    try {
      await api.cadastrarProfessor({
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        cpf: cpfDigits,
        departamento: form.departamento,
        instituicaoId: Number(form.instituicaoId),
      });
      setSucesso(`Professor ${form.nome} cadastrado com sucesso!`);
      setForm(emptyForm);
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao cadastrar professor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie os professores cadastrados no sistema.</p>
        </div>

        {/* Abas */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
          {([
            { key: 'cadastro', label: 'Cadastrar Professor' },
            { key: 'lista', label: 'Professores Cadastrados' },
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

        {/* ABA: Cadastro */}
        {aba === 'cadastro' && (
          <div className="card max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Novo Professor</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="form-label">Nome Completo <span className="text-red-500">*</span></label>
                  <input name="nome" className="form-input" placeholder="Nome completo" value={form.nome} onChange={handleChange} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="form-label">E-mail <span className="text-red-500">*</span></label>
                  <input name="email" type="email" className="form-input" placeholder="professor@instituicao.edu.br" value={form.email} onChange={handleChange} required />
                </div>
                <div>
                  <label className="form-label">Senha <span className="text-red-500">*</span></label>
                  <input name="senha" type="password" className="form-input" placeholder="Mínimo 6 caracteres" value={form.senha} onChange={handleChange} required minLength={6} />
                </div>
                <div>
                  <label className="form-label">Confirmar Senha <span className="text-red-500">*</span></label>
                  <input
                    name="confirmarSenha" type="password"
                    className={`form-input ${senhasNaoConferem ? 'border-red-400 focus:ring-red-400' : ''}`}
                    placeholder="Repita a senha" value={form.confirmarSenha} onChange={handleChange} required
                  />
                  {senhasNaoConferem && <p className="text-red-500 text-xs mt-1">As senhas não coincidem.</p>}
                </div>
                <div>
                  <label className="form-label">CPF <span className="text-red-500">*</span></label>
                  <input name="cpf" className="form-input" placeholder="000.000.000-00" value={form.cpf} onChange={handleChange} maxLength={14} inputMode="numeric" required />
                </div>
                <div>
                  <label className="form-label">Departamento <span className="text-red-500">*</span></label>
                  <input name="departamento" className="form-input" placeholder="Ex: Computação" value={form.departamento} onChange={handleChange} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="form-label">Instituição de Ensino <span className="text-red-500">*</span></label>
                  <select name="instituicaoId" className="form-input" value={form.instituicaoId} onChange={handleChange} required>
                    <option value="">Selecione a instituição</option>
                    {instituicoes.map(i => (
                      <option key={i.id} value={i.id}>{i.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              {erro && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{erro}</div>}
              {sucesso && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{sucesso}</div>}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="btn-primary flex-1 py-2.5"
                  disabled={loading || senhasNaoConferem}
                >
                  {loading ? 'Cadastrando...' : 'Cadastrar Professor'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ABA: Lista de Professores */}
        {aba === 'lista' && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Professores cadastrados</h2>
              <button
                onClick={carregarProfessores}
                className="text-sm text-primary-700 hover:text-primary-800 font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Atualizar
              </button>
            </div>

            {loadingProfessores ? (
              <div className="text-center py-10 text-gray-400">Carregando...</div>
            ) : professores.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">Nenhum professor cadastrado ainda.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-gray-100">
                      <th className="pb-3 pr-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Professor</th>
                      <th className="pb-3 pr-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Departamento</th>
                      <th className="pb-3 pr-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Instituição</th>
                      <th className="pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wide text-right">Saldo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {professores.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 pr-4">
                          <p className="font-medium text-gray-900">{p.nome}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{p.email}</p>
                        </td>
                        <td className="py-3 pr-4 text-gray-600">{p.departamento || '—'}</td>
                        <td className="py-3 pr-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {p.instituicao?.nome || '—'}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <span className="font-semibold text-amber-700">{p.saldoMoedas ?? 0}</span>
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
