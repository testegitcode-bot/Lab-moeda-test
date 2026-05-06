export type TipoUsuario = 'ALUNO' | 'PROFESSOR' | 'EMPRESA';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  saldoMoedas?: number;
  curso?: string;
  rg?: string;
  endereco?: string;
  departamento?: string;
  cnpj?: string;
  descricao?: string;
  instituicaoId?: number;
  instituicaoNome?: string;
}

export interface Instituicao {
  id: number;
  nome: string;
}

export interface Vantagem {
  id: number;
  nome: string;
  descricao: string;
  fotoUrl?: string;
  custo: number;
  empresaId: number;
  empresaNome: string;
}
