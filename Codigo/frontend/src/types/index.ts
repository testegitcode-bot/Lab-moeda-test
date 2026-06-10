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
  quantidadeCupons: number | null; // Controle de estoque total disponível
  cuponsResgatados: number;        // Quantidade de itens já processados na fila
  dataValidade: string | null;     // Data limite para resgatar o benefício
  empresaId: number;
  empresaNome: string;
}

export interface AlunoResumo {
  id: number;
  nome: string;
  email: string;
  curso: string;
  saldoMoedas: number;
}

export interface Transacao {
  id: number;
  remetenteId: number;
  remetenteNome: string;
  destinatarioId: number;
  destinatarioNome: string;
  quantidade: number;
  mensagem?: string;
  criadoEm: string;
}

export interface Resgate {
  id: number;
  alunoId: number;
  alunoNome: string;
  vantagemId: number;
  vantagemNome: string;
  empresaNome: string;
  custo: number;
  status: 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO';
  criadoEm: string;
}

export interface Cupom {
  id: number;
  vantagemId: number;
  vantagemNome: string;
  empresaNome: string;
  custoPago: number;
  codigoCupom: string; // Token único criptografado/gerado para validação
  dataResgate: string;
  status: 'ATIVO' | 'USADO' | 'EXPIRADO';
}