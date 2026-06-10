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

function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits.replace(/(\d{5})(\d)/, '$1-$2');
}

function Required() {
  return <span className="text-red-500 ml-0.5">*</span>;
}

export function CadastroAlunoPage() {
  const [form, setForm] = useState({
    nome: '', email: '', senha: '', confirmarSenha: '', cpf: '', curso: '',
    instituicaoId: '',
    cep: '', logradouro: '', bairro: '', cidade: '', uf: '', numero: '', complemento: '',
  });
  const [cepLoading, setCepLoading] = useState(false);
  const [cepErro, setCepErro] = useState('');
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

    const cpfDigits = form.cpf.replace(/\D/g, '');
    if (cpfDigits.length !== 11) {
      setErro('CPF deve conter exatamente 11 dígitos.');
      return;
    }

    setLoading(true);
    try {
      const usuario = await api.cadastrarAluno({
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        cpf: cpfDigits,
        curso: form.curso,
        endereco: buildEndereco() || undefined,
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#071F2A] via-[#0B3D3A] to-[#148A6A] flex items-center justify-center p-4">
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
            {/* Dados pessoais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Nome Completo<Required /></label>
                <input name="nome" className="form-input" placeholder="Seu nome completo" value={form.nome} onChange={handleChange} required />
              </div>
              <div>
                <label className="form-label">E-mail<Required /></label>
                <input name="email" type="email" className="form-input" placeholder="seu@email.com" value={form.email} onChange={handleChange} required />
              </div>
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
                <p className="text-xs text-gray-400 mt-1">Somente números (11 dígitos)</p>
              </div>
              <div>
                <label className="form-label">Curso<Required /></label>
                <input name="curso" className="form-input" placeholder="Ex: Ciência da Computação" value={form.curso} onChange={handleChange} required />
              </div>
              <div className="sm:col-span-2">
                <label className="form-label">Instituição de Ensino<Required /></label>
                <select name="instituicaoId" className="form-input" value={form.instituicaoId} onChange={handleChange} required>
                  <option value="">Selecione sua instituição</option>
                  {instituicoes.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.nome}</option>
                  ))}
                </select>
              </div>
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
                  <input name="numero" className="form-input" placeholder="Ex: 123" value={form.numero} onChange={handleChange} />
                </div>
                <div>
                  <label className="form-label">Complemento</label>
                  <input name="complemento" className="form-input" placeholder="Apto, bloco, sala..." value={form.complemento} onChange={handleChange} />
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
              className="btn-primary w-full py-3 text-base mt-2"
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