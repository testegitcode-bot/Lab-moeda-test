import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Instituicao, Usuario } from '../types';
import GreenDots from '../components/GreenDots';

function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function formatRG(value: string): string {
  // Keep alphanumeric and dots/dashes, max 20 chars
  return value.replace(/[^a-zA-Z0-9.\-]/g, '').slice(0, 20);
}

export function CadastroAlunoPage() {
  const [form, setForm] = useState({
    nome: '', email: '', senha: '', cpf: '', rg: '',
    endereco: '', curso: '', instituicaoId: '',
  });
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.listarInstituicoes().then(data => setInstituicoes(data as Instituicao[])).catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'cpf') {
      setForm(prev => ({ ...prev, cpf: formatCPF(value) }));
    } else if (name === 'rg') {
      setForm(prev => ({ ...prev, rg: formatRG(value) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    const cpfDigits = form.cpf.replace(/\D/g, '');
    if (cpfDigits.length !== 11) {
      setErro('CPF deve conter exatamente 11 dígitos.');
      return;
    }

    setLoading(true);
    try {
      const usuario = await api.cadastrarAluno({
        ...form,
        cpf: cpfDigits,
        instituicaoId: Number(form.instituicaoId),
      }) as Usuario;
      login(usuario);
      navigate('/dashboard/aluno');
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden  bg-gradient-to-br from-[#071F2A] via-[#0B3D3A] to-[#148A6A] flex items-center justify-center p-4">
      <GreenDots />
      <div className="relative w-full max-w-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#4ADE80] rounded-2xl mb-3 shadow-lg">
           <svg className="w-8 h-8 text-blue-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Cadastro de Aluno</h1>
          <p className="text-primary-300 text-sm mt-1">Crie sua conta para começar</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Nome Completo</label>
                <input name="nome" className="form-input" placeholder="Seu nome completo" value={form.nome} onChange={handleChange} required />
              </div>
              <div>
                <label className="form-label">E-mail</label>
                <input name="email" type="email" className="form-input" placeholder="seu@email.com" value={form.email} onChange={handleChange} required />
              </div>
              <div>
                <label className="form-label">Senha</label>
                <input name="senha" type="password" className="form-input" placeholder="Mínimo 6 caracteres" value={form.senha} onChange={handleChange} required minLength={6} />
              </div>
              <div>
                <label className="form-label">CPF</label>
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
                <p className="text-xs text-gray-400 mt-1">Somente números (11 dígitos)</p>
              </div>
              <div>
                <label className="form-label">RG</label>
                <input
                  name="rg"
                  className="form-input"
                  placeholder="00.000.000-0"
                  value={form.rg}
                  onChange={handleChange}
                  maxLength={20}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Máximo 20 caracteres</p>
              </div>
              <div>
                <label className="form-label">Curso</label>
                <input name="curso" className="form-input" placeholder="Ex: Ciência da Computação" value={form.curso} onChange={handleChange} required />
              </div>
              <div className="sm:col-span-2">
                <label className="form-label">Endereço</label>
                <input name="endereco" className="form-input" placeholder="Rua, número, bairro, cidade" value={form.endereco} onChange={handleChange} required />
              </div>
              <div className="sm:col-span-2">
                <label className="form-label">Instituição de Ensino</label>
                <select name="instituicaoId" className="form-input" value={form.instituicaoId} onChange={handleChange} required>
                  <option value="">Selecione sua instituição</option>
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

            <button type="submit" className="btn-primary w-full py-3 text-base mt-2" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Criar Conta'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem conta?{' '}
            <Link to="/login" className="text-primary-700 font-medium hover:text-primary-800">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
