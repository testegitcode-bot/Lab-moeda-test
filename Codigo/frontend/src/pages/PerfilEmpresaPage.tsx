import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Usuario } from '../types';

export function PerfilEmpresaPage() {
  const { usuario, login, logout } = useAuth();
  const navigate = useNavigate();

  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletando, setDeletando] = useState(false);

  const [form, setForm] = useState({
    nome: usuario?.nome ?? '',
    email: usuario?.email ?? '',
    descricao: usuario?.descricao ?? '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
  });

  if (!usuario) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
        descricao: form.descricao,
      };
      if (form.novaSenha) {
        payload.senhaAtual = form.senhaAtual;
        payload.novaSenha = form.novaSenha;
      }

      const atualizado = await api.atualizarPerfilEmpresa(usuario.id, payload) as Usuario;
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
      descricao: usuario.descricao ?? '',
      senhaAtual: '',
      novaSenha: '',
      confirmarSenha: '',
    });
  };

  const handleDeletarConta = async () => {
    setDeletando(true);
    try {
      await api.deletarContaEmpresa(usuario.id);
      logout();
      navigate('/login');
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao excluir conta.');
      setShowDeleteModal(false);
    } finally {
      setDeletando(false);
    }
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
            onClick={() => navigate('/dashboard/empresa')}
            className="hover:text-emerald-700 transition-colors"
          >
            Painel da Empresa
          </button>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">Perfil da Empresa</span>
        </div>

        {/* Hero card */}
        <div className="card mb-6 bg-gradient-to-br from-emerald-700 to-emerald-900 text-white border-0 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/20" />
            <div className="absolute -bottom-12 -left-8 w-64 h-64 rounded-full bg-white/10" />
          </div>
          <div className="relative flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold text-white shadow-lg border border-white/30">
              {iniciais}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold truncate">{usuario.nome}</h1>
              <p className="text-emerald-200 text-sm mt-0.5">{usuario.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Empresa Parceira
                </span>
                {usuario.cnpj && (
                  <span className="text-emerald-200 text-xs">CNPJ: {usuario.cnpj}</span>
                )}
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
                <h2 className="text-lg font-semibold text-gray-900">Dados da Empresa</h2>
                {!editando && (
                  <button
                    onClick={() => setEditando(true)}
                    className="flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 font-medium transition-colors"
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
                <dl className="space-y-5">
                  {[
                    { label: 'Razão Social / Nome', value: usuario.nome },
                    { label: 'E-mail', value: usuario.email },
                    { label: 'CNPJ', value: usuario.cnpj ?? '—' },
                  ].map(item => (
                    <div key={item.label} className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{item.label}</dt>
                        <dd className="text-gray-900 font-medium text-sm">{item.value}</dd>
                      </div>
                    </div>
                  ))}
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Descrição / Apresentação</dt>
                    <dd className="text-gray-700 text-sm leading-relaxed">
                      {usuario.descricao || <span className="text-gray-400 italic">Nenhuma descrição cadastrada.</span>}
                    </dd>
                  </div>
                </dl>
              ) : (
                /* Modo edição */
                <form onSubmit={handleSalvar} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Razão Social / Nome</label>
                      <input name="nome" className="form-input" value={form.nome} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="form-label">E-mail</label>
                      <input name="email" type="email" className="form-input" value={form.email} onChange={handleChange} required />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">CNPJ</label>
                    <input
                      className="form-input bg-gray-50 cursor-not-allowed"
                      value={usuario.cnpj ?? ''}
                      disabled
                      title="O CNPJ não pode ser alterado"
                    />
                    <p className="text-xs text-gray-400 mt-1">O CNPJ não pode ser alterado.</p>
                  </div>

                  <div>
                    <label className="form-label">Descrição / Apresentação</label>
                    <textarea
                      name="descricao"
                      className="form-input resize-none"
                      rows={4}
                      value={form.descricao}
                      onChange={handleChange}
                      placeholder="Conte um pouco sobre sua empresa e os benefícios que oferece..."
                    />
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Alterar senha <span className="text-gray-400 font-normal">(opcional)</span>
                    </p>
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
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Informações</h3>
              <dl className="space-y-3">
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">Tipo</dt>
                  <dd><span className="badge bg-emerald-100 text-emerald-800">Empresa</span></dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">CNPJ</dt>
                  <dd className="text-gray-900 font-mono text-xs">{usuario.cnpj ?? '—'}</dd>
                </div>
              </dl>
            </div>

            <div className="card bg-blue-50 border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Dica</p>
                  <p className="text-xs text-blue-700 mt-1">Uma boa descrição ajuda os alunos a entenderem o valor das suas vantagens.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard/empresa')}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar ao Painel
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Excluir conta
            </button>
          </div>
        </div>
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Excluir conta da empresa</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Tem certeza? Todas as vantagens cadastradas e seus resgates serão removidos permanentemente. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="btn-secondary flex-1" disabled={deletando}>
                Cancelar
              </button>
              <button
                onClick={handleDeletarConta}
                className="flex-1 py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors disabled:opacity-50"
                disabled={deletando}
              >
                {deletando ? 'Excluindo...' : 'Excluir conta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}