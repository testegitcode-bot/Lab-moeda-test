const BASE_URL = 'http://localhost:8080/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.erro || 'Erro na requisição');
  }

  return data as T;
}

export const api = {
  // ── AUTENTICAÇÃO E CADASTRO
  login: (email: string, senha: string) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    }),

  cadastrarAluno: (payload: object) =>
    request('/cadastro/aluno', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  cadastrarEmpresa: (payload: object) =>
    request('/cadastro/empresa', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  listarInstituicoes: () =>
    request('/instituicoes'),

  // ── VANTAGENS (CATÁLOGO)
  listarTodasVantagens: () =>
    request('/vantagens'),

  listarVantagens: (empresaId: number) =>
    request(`/vantagens/empresa/${empresaId}`),

  criarVantagem: (empresaId: number, payload: object) =>
    request(`/vantagens/empresa/${empresaId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  atualizarVantagem: (id: number, payload: object) =>
    request(`/vantagens/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deletarVantagem: (id: number) =>
    request(`/vantagens/${id}`, { method: 'DELETE' }),

  // ── PERFIL
  atualizarPerfilAluno: (id: number, payload: object) =>
    request(`/perfil/aluno/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  atualizarPerfilEmpresa: (id: number, payload: object) =>
    request(`/perfil/empresa/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // ── TRANSAÇÕES (Envio de moedas do Professor)
  /** Lista alunos da mesma instituição (para o select do professor) */
  listarAlunosDaInstituicao: (instituicaoId: number) =>
    request(`/transacoes/alunos/instituicao/${instituicaoId}`),

  /** Professor envia moedas para um aluno */
  enviarMoedas: (payload: {
    professorId: number;
    alunoId: number;
    quantidade: number;
    mensagem?: string;
  }) =>
    request('/transacoes/enviar', { 
      method: 'POST', 
      body: JSON.stringify(payload) 
    }),

  cadastrarProfessor: (payload: object) =>
  request('/professores', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  listarProfessores: () =>
    request('/professores'),

  /** Extrato de envios efetuados pelo professor */
  extratoDosProfessor: (professorId: number) =>
    request(`/transacoes/professor/${professorId}`),

  /** Extrato de recebimentos do aluno */
  extratoDoAluno: (alunoId: number) =>
    request(`/transacoes/aluno/${alunoId}`),

  // ── RESGATES E CUPONS (Fluxo da Fila e Empresa)
  /** Aluno solicita o resgate de uma vantagem — envia a requisição para a Fila (RabbitMQ) */
  solicitarResgate: (alunoId: number, vantagemId: number) =>
    request('/resgates/solicitar', {
      method: 'POST',
      body: JSON.stringify({ alunoId, vantagemId }),
    }),

  /** Histórico de cupons/resgates gerados para o aluno */
  listarCuponsAluno: (alunoId: number) =>
    request(`/resgates/aluno/${alunoId}`),

  /** Alias usado pela LojaDasVantagens: enfileira resgate via POST /api/resgates (retorna 202) */
  resgatar: (alunoId: number, vantagemId: number) =>
    request('/resgates', {
      method: 'POST',
      body: JSON.stringify({ alunoId, vantagemId }),
    }),

  /** Alias usado pela LojaDasVantagens: histórico de resgates do aluno */
  resgatesDoAluno: (alunoId: number) =>
    request(`/resgates/aluno/${alunoId}`),

  /** Marca cupom como USADO ao escanear o QR Code */
  usarCupom: (resgateId: number) =>
    request(`/resgates/${resgateId}/usar`, { method: 'PUT' }),

  /** Lista de resgates pendentes/confirmados para controle da empresa parceira */
  resgatesDaEmpresa: (empresaId: number) =>
    request(`/resgates/empresa/${empresaId}`),

  /** Empresa confirma a entrega física/uso da vantagem através do código do cupom */
  confirmarResgate: (resgateId: number) =>
    request(`/resgates/${resgateId}/confirmar`, {
      method: 'PUT'
    }),
};