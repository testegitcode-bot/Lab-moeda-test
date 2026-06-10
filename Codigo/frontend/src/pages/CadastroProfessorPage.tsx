import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Instituicao } from '../types';
import GreenDots from '../components/GreenDots';

function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function Required() {
  return <span className="text-red-500 ml-0.5">*</span>;
}

export function CadastroProfessorPage() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cpf: '',
    departamento: '',
    instituicaoId: '',
  });
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.listarInstituicoes()
      .then(data => setInstituicoes(data as Instituicao[]))
      .catch(() => {});
  }, []);

  const senhasNaoConferem =
    form.confirmarSenha.length > 0 && form.senha !== form.confirmarSenha;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'cpf') {
      setForm(prev => ({ ...prev, cpf: formatCPF(value) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (form.senha !== form.confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    const cpfDigits = form.cpf.replace(/\D/g, '');
    if (cpfDigits.length !== 11) {
      setErro('CPF deve conter exatamente 11 dígitos.');
      return;
    }

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
      setForm({
        nome: '', email: '', senha: '', confirmarSenha: '',
        cpf: '', departamento: '', instituicaoId: '',
      });
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao cadastrar professor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#071F2A] via-[#0B3D3A] to-[#148A6A] flex items-center justify-center p-4">
      <GreenDots />
      <div className="relative w-full max-w-xl">

        {/* Cabeçalho */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#4ADE80] rounded-2xl mb-3 shadow-lg">
            <svg className="w-8 h-8 text-blue-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Cadastro de Professor</h1>
          <p className="text-primary-300 text-sm mt-1">Preencha os dados do novo professor</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="form-label">Nome Completo<Required /></label>
                <input
                  name="nome"
                  className="form-input"
                  placeholder="Nome completo do professor"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="form-label">E-mail<Required /></label>
                <input
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="professor@instituicao.edu.br"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label">Senha<Required /></label>
                <input
                  name="senha"
                  type="password"
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  value={form.senha}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="form-label">Confirmar Senha<Required /></label>
                <input
                  name="confirmarSenha"
                  type="password"
                  className={`form-input ${senhasNaoConferem ? 'border-red-400 focus:ring-red-400' : ''}`}
                  placeholder="Repita a senha"
                  value={form.confirmarSenha}
                  onChange={handleChange}
                  required
                />
                {senhasNaoConferem && (
                  <p className="text-red-500 text-xs mt-1">As senhas não coincidem.</p>
                )}
              </div>

              <div>
                <label className="form-label">CPF<Required /></label>
                <input
                  name="cpf"
                  className="form-input"
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={handleChange}
                  maxLength={14}
                  inputMode="numeric"
                  required
                />
              </div>

              <div>
                <label className="form-label">Departamento<Required /></label>
                <input
                  name="departamento"
                  className="form-input"
                  placeholder="Ex: Computação"
                  value={form.departamento}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="form-label">Instituição de Ensino<Required /></label>
                <select
                  name="instituicaoId"
                  className="form-input"
                  value={form.instituicaoId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione a instituição</option>
                  {instituicoes.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {erro}
              </div>
            )}

            {sucesso && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {sucesso}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full py-3 text-base mt-2"
              disabled={loading || senhasNaoConferem}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Professor'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            <Link to="/dashboard" className="text-primary-700 font-medium hover:text-primary-800">
              ← Voltar ao painel
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
