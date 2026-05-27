import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Vantagem } from '../types';

interface VantagemFormData {
  nome: string;
  descricao: string;
  fotoUrl: string;
  custo: string;
}

const emptyForm: VantagemFormData = { nome: '', descricao: '', fotoUrl: '', custo: '' };

export function DashboardEmpresaPage() {
  const { usuario } = useAuth();
  const [vantagens, setVantagens] = useState<Vantagem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<VantagemFormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  if (!usuario) return null;

  const carregar = () => {
    api.listarVantagens(usuario.id)
      .then(data => setVantagens(data as Vantagem[]))
      .catch(() => {});
  };

  useEffect(() => { carregar(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const abrirCriar = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErro('');
    setShowModal(true);
  };

  const abrirEditar = (v: Vantagem) => {
    setEditingId(v.id);
    setForm({ nome: v.nome, descricao: v.descricao, fotoUrl: v.fotoUrl ?? '', custo: String(v.custo) });
    setErro('');
    setShowModal(true);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    const payload = { ...form, custo: Number(form.custo) };
    try {
      if (editingId) {
        await api.atualizarVantagem(editingId, payload);
      } else {
        await api.criarVantagem(usuario.id, payload);
      }
      setShowModal(false);
      carregar();
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (id: number) => {
    if (!window.confirm('Deseja remover esta vantagem?')) return;
    try {
      await api.deletarVantagem(id);
      carregar();
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Painel da Empresa</h1>
            <p className="text-gray-500 text-sm mt-1">{usuario.nome} · {usuario.cnpj}</p>
          </div>
          <button onClick={abrirCriar} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            Nova Vantagem
          </button>
        </div>

        {usuario.descricao && (
          <div className="card mb-6 bg-emerald-50 border-emerald-100">
            <p className="text-gray-600 text-sm">{usuario.descricao}</p>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Minhas Vantagens
            <span className="ml-2 text-sm font-normal text-gray-500">({vantagens.length} cadastradas)</span>
          </h2>

          {vantagens.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Nenhuma vantagem cadastrada</p>
              <p className="text-gray-400 text-sm mt-1">Crie sua primeira vantagem para atrair alunos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vantagens.map(v => (
                <div key={v.id} className="card hover:shadow-md transition-shadow duration-200">
                  {v.fotoUrl && (
                    <img
                      src={v.fotoUrl}
                      alt={v.nome}
                      className="w-full h-40 object-cover rounded-lg mb-4 bg-gray-100"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 leading-tight">{v.nome}</h3>
                    <span className="badge bg-primary-100 text-primary-800 whitespace-nowrap">
                      {v.custo} moedas
                    </span>
                  </div>
                  {v.descricao && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{v.descricao}</p>
                  )}
                  <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
                    <button
                      onClick={() => abrirEditar(v)}
                      className="btn-secondary flex-1 text-sm py-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeletar(v.id)}
                      className="btn-danger flex-1 text-sm py-2"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Editar Vantagem' : 'Nova Vantagem'}
              </h3>
            </div>
            <form onSubmit={handleSalvar} className="p-6 space-y-4">
              <div>
                <label className="form-label">Nome da Vantagem</label>
                <input name="nome" className="form-input" placeholder="Ex: Desconto na Academia" value={form.nome} onChange={handleChange} required />
              </div>
              <div>
                <label className="form-label">Descrição</label>
                <textarea name="descricao" className="form-input resize-none" rows={3} placeholder="Descreva o benefício..." value={form.descricao} onChange={handleChange} required />
              </div>
              <div>
                <label className="form-label">URL da Foto (opcional)</label>
                <input name="fotoUrl" className="form-input" placeholder="https://..." value={form.fotoUrl} onChange={handleChange} />
              </div>
              <div>
                <label className="form-label">Custo em Moedas</label>
                <input name="custo" type="number" min="1" className="form-input" placeholder="100" value={form.custo} onChange={handleChange} required />
              </div>

              {erro && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {erro}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
