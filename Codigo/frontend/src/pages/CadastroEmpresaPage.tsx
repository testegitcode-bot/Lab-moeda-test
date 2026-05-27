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

function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits.replace(/(\d{5})(\d)/, '$1-$2');
}

function Required() {
  return <span className="text-red-500 ml-0.5">*</span>;
}

export function CadastroEmpresaPage() {
  const [form, setForm] = useState({
    nome: '', email: '', senha: '', confirmarSenha: '', cnpj: '', descricao: '',
    cep: '', logradouro: '', bairro: '', cidade: '', uf: '', numero: '', complemento: '',
  });
  const [cepLoading, setCepLoading] = useState(false);
  const [cepErro, setCepErro] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'cnpj') {
      setForm(prev => ({ ...prev, cnpj: formatCNPJ(value) }));
    } else if (name === 'cep') {
      const formatted = formatCEP(value);
      setForm(prev => ({ ...prev, cep: formatted }));
      const digits = value.replace(/\D/g, '');
      if (digits.length === 8) fetchCEP(digits);
      else if (digits.length < 8) {
        setCepErro('');
        setForm(prev => ({ ...prev, cep: formatted, logradouro: '', bairro: '', cidade: '', uf: '' }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const fetchCEP = async (digits: string) => {
    setCepLoading(true);
    setCepErro('');
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepErro('CEP não encontrado.');
        setForm(prev => ({ ...prev, logradouro: '', bairro: '', cidade: '', uf: '' }));
      } else {
        setForm(prev => ({
          ...prev,
          logradouro: data.logradouro ?? '',
          bairro: data.bairro ?? '',
          cidade: data.localidade ?? '',
          uf: data.uf ?? '',
        }));
      }
    } catch {
      setCepErro('Erro ao buscar CEP. Verifique sua conexão.');
    } finally {
      setCepLoading(false);
    }
  };

  const senhasNaoConferem = form.confirmarSenha.length > 0 && form.senha !== form.confirmarSenha;

  const buildEndereco = () => {
    const parts = [form.logradouro, form.numero, form.complemento, form.bairro, form.cidade, form.uf]
      .filter(Boolean);
    return parts.join(', ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (form.senha !== form.confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    const cnpjDigits = form.cnpj.replace(/\D/g, '');
    if (cnpjDigits.length !== 14) {
      setErro('CNPJ deve conter exatamente 14 dígitos.');
      return;
    }

    setLoading(true);
    try {
      const usuario = await api.cadastrarEmpresa({
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        cnpj: cnpjDigits,
        descricao: form.descricao,
        endereco: buildEndereco() || undefined,
      }) as Usuario;
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
              <label className="form-label">Razão Social<Required /></label>
              <input name="nome" className="form-input" placeholder="Nome oficial da empresa" value={form.nome} onChange={handleChange} required />
            </div>
            <div>
              <label className="form-label">E-mail Corporativo<Required /></label>
              <input name="email" type="email" className="form-input" placeholder="contato@empresa.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Senha<Required /></label>
                <input name="senha" type="password" className="form-input" placeholder="Mínimo 6 caracteres" value={form.senha} onChange={handleChange} required minLength={6} />
              </div>
              <div>
                <label className="form-label">Confirme sua Senha<Required /></label>
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
            </div>
            <div>
              <label className="form-label">CNPJ<Required /></label>
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
              <label className="form-label">Descrição da Empresa<Required /></label>
              <textarea
                name="descricao"
                className="form-input resize-none"
                rows={3}
                placeholder="Descreva sua empresa e os benefícios que oferece aos alunos..."
                value={form.descricao}
                onChange={handleChange}
                required
              />
            </div>

            {/* Endereço via CEP */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-medium text-gray-600 mb-3">Endereço <span className="text-gray-400 font-normal">(opcional)</span></p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">CEP</label>
                  <div className="relative">
                    <input
                      name="cep"
                      className="form-input pr-8"
                      placeholder="00000-000"
                      value={form.cep}
                      onChange={handleChange}
                      maxLength={9}
                      inputMode="numeric"
                    />
                    {cepLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg className="w-4 h-4 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  {cepErro && <p className="text-red-500 text-xs mt-1">{cepErro}</p>}
                </div>
                <div>
                  <label className="form-label">Logradouro</label>
                  <input name="logradouro" className="form-input bg-gray-50" placeholder="Preenchido automaticamente" value={form.logradouro} onChange={handleChange} readOnly={!!form.logradouro} />
                </div>
                <div>
                  <label className="form-label">Número</label>
                  <input name="numero" className="form-input" placeholder="Ex: 100" value={form.numero} onChange={handleChange} />
                </div>
                <div>
                  <label className="form-label">Complemento</label>
                  <input name="complemento" className="form-input" placeholder="Sala, andar, bloco..." value={form.complemento} onChange={handleChange} />
                </div>
                <div>
                  <label className="form-label">Bairro</label>
                  <input name="bairro" className="form-input bg-gray-50" placeholder="Preenchido automaticamente" value={form.bairro} onChange={handleChange} readOnly={!!form.bairro} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="form-label">Cidade</label>
                    <input name="cidade" className="form-input bg-gray-50" placeholder="Preenchido automaticamente" value={form.cidade} onChange={handleChange} readOnly={!!form.cidade} />
                  </div>
                  <div>
                    <label className="form-label">UF</label>
                    <input name="uf" className="form-input bg-gray-50 text-center" placeholder="—" value={form.uf} onChange={handleChange} maxLength={2} readOnly={!!form.uf} />
                  </div>
                </div>
              </div>
            </div>

            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {erro}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full py-3 text-base"
              disabled={loading || senhasNaoConferem}
            >
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
