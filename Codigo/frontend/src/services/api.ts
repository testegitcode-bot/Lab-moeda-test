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
};
