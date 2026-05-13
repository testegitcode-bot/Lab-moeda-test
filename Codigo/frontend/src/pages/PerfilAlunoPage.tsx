import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Usuario } from '../types';

export function PerfilAlunoPage() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();

  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');

  const [form, setForm] = useState({
    nome: usuario?.nome ?? '',
    email: usuario?.email ?? '',
    curso: usuario?.curso ?? '',
    endereco: usuario?.endereco ?? '',
    rg: usuario?.rg ?? '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
  });

  if (!usuario) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (form.novaSenha && form.novaSenha !== form.confirmarSenha) {
      setErro('As senhas não conferem.');
      return;
    }

    setLoading(true);
    try {
      const payload: Record<string, string> = {
        nome: form.nome,
        email: form.email,
        curso: form.curso,
        endereco: form.endereco,
        rg: form.rg,
      };
      if (form.novaSenha) {
        payload.senhaAtual = form.senhaAtual;
        payload.novaSenha = form.novaSenha;
      }

      const atualizado = await api.atualizarPerfilAluno(usuario.id, payload) as Usuario;
      login(atualizado);
      setSucesso('Perfil atualizado com sucesso!');
      setEditando(false);
      setForm(prev => ({ ...prev, senhaAtual: '', novaSenha: '', confirmarSenha: '' }));
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao salvar perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    setEditando(false);
    setErro('');
    setSucesso('');
    setForm({
      nome: usuario.nome,
      email: usuario.email,
      curso: usuario.curso ?? '',
      endereco: usuario.endereco ?? '',
      rg: usuario.rg ?? '',
      senhaAtual: '',
      novaSenha: '',
      confirmarSenha: '',
    });
  };

  const iniciais = usuario.nome
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button
            onClick={() => navigate('/dashboard/aluno')}
            className="hover:text-primary-700 transition-colors"
          >
            Meu Painel
          </button>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">Meu Perfil</span>
        </div>

        {/* Hero card */}
        <div className="card mb-6 bg-gradient-to-br from-primary-700 to-primary-900 text-white border-0 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/20" />
            <div className="absolute -bottom-12 -left-8 w-64 h-64 rounded-full bg-white/10" />
          </div>
          <div className="relative flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold text-white shadow-lg border border-white/30">
              {iniciais}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{usuario.nome}</h1>
              <p className="text-primary-200 text-sm mt-0.5">{usuario.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  </svg>
                  Aluno
                </span>
                {usuario.instituicaoNome && (
                  <span className="text-primary-200 text-xs">{usuario.instituicaoNome}</span>
                )}
              </div>
            </div>
            <div className="ml-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">{usuario.saldoMoedas ?? 0}</div>
                <div className="text-primary-200 text-xs">moedas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mensagens */}
        {sucesso && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {sucesso}
          </div>
        )}
        {erro && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {erro}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dados principais */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Dados Pessoais</h2>
                {!editando && (
                  <button
                    onClick={() => setEditando(true)}
                    className="flex items-center gap-2 text-sm text-primary-700 hover:text-primary-800 font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                )}
              </div>

              {!editando ? (
                /* Modo visualização */
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Nome completo', value: usuario.nome },
                    { label: 'E-mail', value: usuario.email },
                    { label: 'Curso', value: usuario.curso ?? '—' },
                    { label: 'RG', value: usuario.rg ?? '—' },
                    { label: 'Endereço', value: usuario.endereco ?? '—', full: true },
                    { label: 'Instituição', value: usuario.instituicaoNome ?? '—' },
                  ].map(item => (
                    <div key={item.label} className={`${item.full ? 'sm:col-span-2' : ''}`}>
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{item.label}</dt>
                      <dd className="text-gray-900 font-medium text-sm">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                /* Modo edição */
                <form onSubmit={handleSalvar} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Nome completo</label>
                      <input name="nome" className="form-input" value={form.nome} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="form-label">E-mail</label>
                      <input name="email" type="email" className="form-input" value={form.email} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="form-label">Curso</label>
                      <input name="curso" className="form-input" value={form.curso} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="form-label">RG</label>
                      <input name="rg" className="form-input" value={form.rg} onChange={handleChange} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="form-label">Endereço</label>
                      <input name="endereco" className="form-input" value={form.endereco} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Alterar senha <span className="text-gray-400 font-normal">(opcional)</span></p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="form-label">Senha atual</label>
                        <input name="senhaAtual" type="password" className="form-input" value={form.senhaAtual} onChange={handleChange} placeholder="••••••••" />
                      </div>
                      <div>
                        <label className="form-label">Nova senha</label>
                        <input name="novaSenha" type="password" className="form-input" value={form.novaSenha} onChange={handleChange} placeholder="••••••••" />
                      </div>
                      <div>
                        <label className="form-label">Confirmar nova senha</label>
                        <input name="confirmarSenha" type="password" className="form-input" value={form.confirmarSenha} onChange={handleChange} placeholder="••••••••" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={handleCancelar} className="btn-secondary flex-1">
                      Cancelar
                    </button>
                    <button type="submit" className="btn-primary flex-1" disabled={loading}>
                      {loading ? 'Salvando...' : 'Salvar alterações'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Resumo da conta</h3>
              <dl className="space-y-3">
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">Tipo</dt>
                  <dd><span className="badge bg-blue-100 text-blue-800">Aluno</span></dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">Saldo</dt>
                  <dd className="font-semibold text-primary-700">{usuario.saldoMoedas ?? 0} moedas</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">Instituição</dt>
                  <dd className="text-gray-900 text-right text-xs max-w-[120px]">{usuario.instituicaoNome ?? '—'}</dd>
                </div>
              </dl>
            </div>

            <div className="card bg-amber-50 border-amber-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-900">Dica</p>
                  <p className="text-xs text-amber-700 mt-1">Mantenha seu e-mail e endereço atualizados para não perder comunicados importantes.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard/aluno')}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar ao Painel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}