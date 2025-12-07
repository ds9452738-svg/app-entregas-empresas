// Tipos do sistema de entregas

export type StatusEntrega = 'pendente' | 'em_rota' | 'entregue' | 'cancelado';
export type StatusEntregador = 'online' | 'offline' | 'em_pausa';
export type TipoEntrega = 'padrao' | 'expressa' | 'agendada' | 'noturna';
export type NivelAcesso = 'admin' | 'empresa' | 'entregador';

export interface Pedido {
  id: string;
  empresa: string;
  empresaId?: string;
  cliente: string;
  endereco: string;
  valor: number;
  status: StatusEntrega;
  dataColeta: Date;
  dataEntrega?: Date;
  localizacao?: {
    lat: number;
    lng: number;
  };
  observacoes?: string;
  telefone?: string;
  tipoEntrega?: TipoEntrega;
}

export interface Entregador {
  id: string;
  nome: string;
  status: StatusEntregador;
  foto?: string;
  entregasHoje: number;
  valorArrecadado: number;
  localizacaoAtual?: {
    lat: number;
    lng: number;
  };
  ultimaAtualizacao: Date;
}

export interface ResumoFinanceiro {
  totalMes: number;
  totalEntregue: number;
  totalPendente: number;
  quantidadeEntregas: number;
}

export interface Empresa {
  id: string;
  nome: string;
  cnpj?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  valorPadraoEntrega: number;
  ativa: boolean;
  dataCadastro: Date;
  observacoes?: string;
  // Controle de acesso
  usuario?: string;
  senha?: string;
  nivelAcesso: NivelAcesso;
  permissoes: PermissoesEmpresa;
}

export interface PermissoesEmpresa {
  criarPedidos: boolean;
  visualizarPedidos: boolean;
  cancelarPedidos: boolean;
  visualizarRelatorios: boolean;
  editarPerfil: boolean;
}

export interface ConfiguracaoValor {
  id: string;
  empresaId: string;
  tipoEntrega: TipoEntrega;
  valor: number;
  descricao?: string;
}

export interface UsuarioLogado {
  id: string;
  nome: string;
  nivelAcesso: NivelAcesso;
  empresaId?: string;
  permissoes?: PermissoesEmpresa;
}
