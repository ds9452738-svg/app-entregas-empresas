import { Empresa, ConfiguracaoValor } from './types';

export const empresasMock: Empresa[] = [
  {
    id: '1',
    nome: 'Restaurante Sabor & Cia',
    cnpj: '12.345.678/0001-90',
    telefone: '(11) 98765-4321',
    email: 'contato@saborecia.com.br',
    endereco: 'Rua das Flores, 123 - Centro',
    valorPadraoEntrega: 8.50,
    ativa: true,
    dataCadastro: new Date('2024-01-15'),
    observacoes: 'Entregas de segunda a sábado',
    usuario: 'saborecia',
    senha: '123456',
    nivelAcesso: 'empresa',
    permissoes: {
      criarPedidos: true,
      visualizarPedidos: true,
      cancelarPedidos: true,
      visualizarRelatorios: true,
      editarPerfil: true
    }
  },
  {
    id: '2',
    nome: 'Farmácia Vida Saudável',
    cnpj: '98.765.432/0001-10',
    telefone: '(11) 91234-5678',
    email: 'entregas@vidasaudavel.com.br',
    endereco: 'Av. Principal, 456 - Jardim',
    valorPadraoEntrega: 12.00,
    ativa: true,
    dataCadastro: new Date('2024-02-01'),
    observacoes: 'Prioridade para medicamentos',
    usuario: 'vidasaudavel',
    senha: '123456',
    nivelAcesso: 'empresa',
    permissoes: {
      criarPedidos: true,
      visualizarPedidos: true,
      cancelarPedidos: false,
      visualizarRelatorios: true,
      editarPerfil: true
    }
  },
  {
    id: '3',
    nome: 'Mercado Bom Preço',
    cnpj: '11.222.333/0001-44',
    telefone: '(11) 99876-5432',
    email: 'logistica@bompreco.com.br',
    endereco: 'Rua do Comércio, 789 - Vila Nova',
    valorPadraoEntrega: 10.00,
    ativa: true,
    dataCadastro: new Date('2024-01-20'),
    usuario: 'bompreco',
    senha: '123456',
    nivelAcesso: 'empresa',
    permissoes: {
      criarPedidos: true,
      visualizarPedidos: true,
      cancelarPedidos: true,
      visualizarRelatorios: false,
      editarPerfil: false
    }
  }
];

export const configuracoesValoresMock: ConfiguracaoValor[] = [
  {
    id: '1',
    empresaId: '1',
    tipoEntrega: 'padrao',
    valor: 8.50,
    descricao: 'Entrega padrão até 60 minutos'
  },
  {
    id: '2',
    empresaId: '1',
    tipoEntrega: 'expressa',
    valor: 15.00,
    descricao: 'Entrega expressa até 30 minutos'
  },
  {
    id: '3',
    empresaId: '2',
    tipoEntrega: 'padrao',
    valor: 12.00,
    descricao: 'Entrega padrão de medicamentos'
  },
  {
    id: '4',
    empresaId: '2',
    tipoEntrega: 'noturna',
    valor: 18.00,
    descricao: 'Entrega noturna (após 20h)'
  },
  {
    id: '5',
    empresaId: '3',
    tipoEntrega: 'padrao',
    valor: 10.00,
    descricao: 'Entrega padrão de compras'
  }
];

// Usuário administrador padrão
export const adminUser = {
  id: 'admin',
  usuario: 'admin',
  senha: 'admin123',
  nome: 'Administrador',
  nivelAcesso: 'admin' as const
};
