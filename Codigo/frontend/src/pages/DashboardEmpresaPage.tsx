import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Vantagem } from '../types';

interface VantagemFormData {
  nome: string;
  descricao: string;
  custo: string;
  quantidadeTipo: 'ilimitado' | 'definida';
  quantidadeCupons: string;
  prazTipo: 'indeterminado' | 'prazo';
  dataValidade: string;
  isResgateUnico: boolean;
}

const emptyForm: VantagemFormData = {
  nome: '', descricao: '', custo: '',
  quantidadeTipo: 'ilimitado', quantidadeCupons: '',
  prazTipo: 'indeterminado', dataValidade: '',
  isResgateUnico: true,
};

function MetricCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className={`rounded-xl p-4 flex flex-col gap-1 ${color}`}>
      <span className="text-xs font-medium opacity-70">{label}</span>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}

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

  const totalCuponsResgatados = vantagens.reduce((acc, v) => acc + (v.cuponsResgatados ?? 0), 0);
  const totalMoedasAcumuladas = vantagens.reduce(
    (acc, v) => acc + v.custo * (v.cuponsResgatados ?? 0), 0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const abrirCriar = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErro('');
    setShowModal(true);
  };

  const abrirEditar = (v: Vantagem) => {
    setEditingId(v.id);
    setForm({
      nome: v.nome,
      descricao: v.descricao,
      custo: String(v.custo),
      quantidadeTipo: v.quantidadeCupons == null ? 'ilimitado' : 'definida',
      quantidadeCupons: v.quantidadeCupons != null ? String(v.quantidadeCupons) : '',
      prazTipo: v.dataValidade == null ? 'indeterminado' : 'prazo',
      dataValidade: v.dataValidade ?? '',
      isResgateUnico: v.isResgateUnico,
    });
    setErro('');
    setShowModal(true);
  };

  const buildPayload = () => ({
    nome: form.nome,
    descricao: form.descricao,
    custo: Number(form.custo),
    quantidadeCupons: form.quantidadeTipo === 'definida' && form.quantidadeCupons
      ? Number(form.quantidadeCupons)
      : null,
    dataValidade: form.prazTipo === 'prazo' && form.dataValidade
      ? form.dataValidade
      : null,
    isResgateUnico: form.prazTipo === 'prazo' ? true : form.isResgateUnico,
  });

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      if (editingId) {
        await api.atualizarVantagem(editingId, buildPayload());
      } else {
        await api.criarVantagem(usuario.id, buildPayload());
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

  const disponivel = (v: Vantagem) =>
    v.quantidadeCupons == null ? null : v.quantidadeCupons - v.cuponsResgatados;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <MetricCard label="Benefícios Ativos" value={vantagens.length} color="bg-emerald-50 text-emerald-800" />
          <MetricCard label="Cupons Resgatados" value={totalCuponsResgatados} color="bg-blue-50 text-blue-800" />
          <MetricCard label="Moedas Acumuladas" value={totalMoedasAcumuladas} color="bg-amber-50 text-amber-800" />
        </div>

        {/* Vantagens grid */}
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
              {vantagens.map(v => {
                const disp = disponivel(v);
                const esgotado = disp !== null && disp <= 0;
                return (
                  <div key={v.id} className="card shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 leading-tight">{v.nome}</h3>
                      <span className="badge bg-primary-100 text-primary-800 whitespace-nowrap shrink-0">
                        {v.custo} moedas
                      </span>
                    </div>
                    {v.descricao && (
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2 flex-1">{v.descricao}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-4 text-xs">
                      <span className={`badge ${esgotado ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                        {disp === null ? 'Ilimitado' : esgotado ? 'Esgotado' : `${disp} disponíveis`}
                      </span>
                      {v.dataValidade
                        ? <span className="badge bg-orange-100 text-orange-700">Válido até {new Date(v.dataValidade).toLocaleDateString('pt-BR')}</span>
                        : <span className="badge bg-gray-100 text-gray-500">Sem prazo</span>
                      }
                      <span className={`badge ${v.isResgateUnico ? 'bg-amber-100 text-amber-700' : 'bg-teal-100 text-teal-700'}`}>
                        {v.isResgateUnico ? 'Resgate único' : 'Múltiplos resgates'}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button onClick={() => abrirEditar(v)} className="btn-secondary flex-1 text-sm py-2">Editar</button>
                      <button onClick={() => handleDeletar(v.id)} className="btn-danger flex-1 text-sm py-2">Remover</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
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
                <textarea name="descricao" className="form-input resize-none" rows={3} placeholder="Descreva o benefício para os alunos..." value={form.descricao} onChange={handleChange} required />
              </div>
              <div>
                <label className="form-label">Custo em Moedas</label>
                <input name="custo" type="number" min="1" className="form-input" placeholder="100" value={form.custo} onChange={handleChange} required />
              </div>

              <div>
                <label className="form-label">Quantidade de Cupons</label>
                <div className="flex gap-4 mb-2">
                  {(['ilimitado', 'definida'] as const).map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="quantidadeTipo" value={opt} checked={form.quantidadeTipo === opt} onChange={handleChange} />
                      <span className="text-sm text-gray-700">{opt === 'ilimitado' ? 'Ilimitado' : 'Quantidade Definida'}</span>
                    </label>
                  ))}
                </div>
                {form.quantidadeTipo === 'definida' && (
                  <input name="quantidadeCupons" type="number" min="1" className="form-input" placeholder="Ex: 50 cupons" value={form.quantidadeCupons} onChange={handleChange} required />
                )}
              </div>

              <div>
                <label className="form-label">Período de Duração</label>
                <div className="flex gap-4 mb-2">
                  {(['indeterminado', 'prazo'] as const).map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="prazTipo" value={opt} checked={form.prazTipo === opt} onChange={handleChange} />
                      <span className="text-sm text-gray-700">{opt === 'indeterminado' ? 'Tempo Indeterminado' : 'Definir Prazo'}</span>
                    </label>
                  ))}
                </div>
                {form.prazTipo === 'prazo' && (
                  <input name="dataValidade" type="date" className="form-input" min={new Date().toISOString().split('T')[0]} value={form.dataValidade} onChange={handleChange} required />
                )}
              </div>

              <div>
                <label className="form-label">Tipo de Resgate</label>
                {form.prazTipo === 'prazo' ? (
                  <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                    Resgate único obrigatório para vantagens com prazo definido.
                  </p>
                ) : (
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="isResgateUnico"
                        value="true"
                        checked={form.isResgateUnico === true}
                        onChange={() => setForm(prev => ({ ...prev, isResgateUnico: true }))}
                      />
                      <span className="text-sm text-gray-700">Resgate Único</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="isResgateUnico"
                        value="false"
                        checked={form.isResgateUnico === false}
                        onChange={() => setForm(prev => ({ ...prev, isResgateUnico: false }))}
                      />
                      <span className="text-sm text-gray-700">Múltiplos Resgates</span>
                    </label>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {form.isResgateUnico
                    ? 'Cada aluno poderá resgatar esta vantagem apenas uma vez.'
                    : 'Alunos poderão resgatar múltiplas vezes, cada resgate gera um novo cupom.'}
                </p>
              </div>

              {erro && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{erro}</div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
                <button type="submit" className="btn-primary flex-1" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
