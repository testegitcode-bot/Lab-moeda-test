import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Usuario } from '../types';
import GreenDots from '../components/GreenDots';

function formatCNPJ(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

export function CadastroEmpresaPage() {
  const [form, setForm] = useState({
    nome: '', email: '', senha: '', cnpj: '', descricao: '',
  });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'cnpj') {
      setForm(prev => ({ ...prev, cnpj: formatCNPJ(value) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    const cnpjDigits = form.cnpj.replace(/\D/g, '');
    if (cnpjDigits.length !== 14) {
      setErro('CNPJ deve conter exatamente 14 dígitos.');
      return;
    }

    setLoading(true);
    try {
      const usuario = await api.cadastrarEmpresa({ ...form, cnpj: cnpjDigits }) as Usuario;
      login(usuario);
      navigate('/dashboard/empresa');
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#071F2A] via-[#0B3D3A] to-[#148A6A] flex items-center justify-center p-4">
        <GreenDots />
      <div className="relative w-full max-w-xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-400 rounded-2xl mb-3 shadow-lg">
            <svg className="w-8 h-8 text-emerald-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Cadastro de Empresa</h1>
          <p className="text-primary-300 text-sm mt-1">Torne-se uma empresa parceira</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Razão Social</label>
              <input name="nome" className="form-input" placeholder="Nome da empresa" value={form.nome} onChange={handleChange} required />
            </div>
            <div>
              <label className="form-label">E-mail Corporativo</label>
              <input name="email" type="email" className="form-input" placeholder="contato@empresa.com" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label className="form-label">Senha</label>
              <input name="senha" type="password" className="form-input" placeholder="Mínimo 6 caracteres" value={form.senha} onChange={handleChange} required minLength={6} />
            </div>
            <div>
              <label className="form-label">CNPJ</label>
              <input
                name="cnpj"
                className="form-input"
                placeholder="00.000.000/0000-00"
                value={form.cnpj}
                onChange={handleChange}
                maxLength={18}
                inputMode="numeric"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Somente números (14 dígitos)</p>
            </div>
            <div>
              <label className="form-label">Descrição da Empresa</label>
              <textarea
                name="descricao"
                className="form-input resize-none"
                rows={3}
                placeholder="Descreva sua empresa e os benefícios que oferece..."
                value={form.descricao}
                onChange={handleChange}
                required
              />
            </div>

            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {erro}
              </div>
            )}

            <button type="submit" className="btn-primary w-full py-3 text-base" disabled={loading}>
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
