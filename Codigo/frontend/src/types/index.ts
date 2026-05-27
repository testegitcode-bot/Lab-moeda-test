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
  custo: number;
  quantidadeCupons: number | null;
  cuponsResgatados: number;
  dataValidade: string | null;
  empresaId: number;
  empresaNome: string;
}

export interface Cupom {
  id: number;
  vantagemId: number;
  vantagemNome: string;
  empresaNome: string;
  custoPago: number;
  codigoCupom: string;
  dataResgate: string;
  status: 'ATIVO' | 'USADO' | 'EXPIRADO';
}
