// Dados mock para demonstração
import { Pedido, Entregador } from './types';

export const entregadorMock: Entregador = {
  id: '1',
  nome: 'Você (Entregador)',
  status: 'online',
  entregasHoje: 8,
  valorArrecadado: 340.50,
  localizacaoAtual: { lat: -23.5505, lng: -46.6333 },
  ultimaAtualizacao: new Date()
};

export const pedidosMock: Pedido[] = [
  {
    id: '1',
    empresa: 'Loja ABC',
    cliente: 'João Silva',
    endereco: 'Rua das Flores, 123 - Centro',
    telefone: '(11) 98765-4321',
    valor: 45.00,
    status: 'em_rota',
    dataColeta: new Date('2024-01-15'),
    localizacao: { lat: -23.5505, lng: -46.6333 }
  },
  {
    id: '2',
    empresa: 'Mercado XYZ',
    cliente: 'Maria Santos',
    endereco: 'Av. Paulista, 1000 - Bela Vista',
    telefone: '(11) 91234-5678',
    valor: 78.50,
    status: 'entregue',
    dataColeta: new Date('2024-01-14'),
    dataEntrega: new Date('2024-01-14'),
    localizacao: { lat: -23.5613, lng: -46.6565 }
  },
  {
    id: '3',
    empresa: 'Farmácia Saúde',
    cliente: 'Pedro Costa',
    endereco: 'Rua Augusta, 500 - Consolação',
    telefone: '(11) 99876-5432',
    valor: 32.00,
    status: 'pendente',
    dataColeta: new Date('2024-01-16'),
    localizacao: { lat: -23.5558, lng: -46.6619 }
  },
  {
    id: '4',
    empresa: 'Restaurante Bom Sabor',
    cliente: 'Ana Paula',
    endereco: 'Rua Oscar Freire, 200 - Jardins',
    telefone: '(11) 97654-3210',
    valor: 95.00,
    status: 'em_rota',
    dataColeta: new Date('2024-01-15'),
    localizacao: { lat: -23.5629, lng: -46.6707 }
  },
  {
    id: '5',
    empresa: 'Pet Shop Amigo',
    cliente: 'Carlos Mendes',
    endereco: 'Av. Faria Lima, 1500 - Pinheiros',
    telefone: '(11) 96543-2109',
    valor: 120.00,
    status: 'entregue',
    dataColeta: new Date('2024-01-13'),
    dataEntrega: new Date('2024-01-13'),
    localizacao: { lat: -23.5745, lng: -46.6889 }
  },
  {
    id: '6',
    empresa: 'Eletrônicos Tech',
    cliente: 'Fernanda Lima',
    endereco: 'Rua Haddock Lobo, 300 - Cerqueira César',
    telefone: '(11) 95432-1098',
    valor: 250.00,
    status: 'pendente',
    dataColeta: new Date('2024-01-16'),
    localizacao: { lat: -23.5650, lng: -46.6550 }
  },
  {
    id: '7',
    empresa: 'Padaria Pão Quente',
    cliente: 'Roberto Alves',
    endereco: 'Rua da Consolação, 800 - Consolação',
    telefone: '(11) 94321-0987',
    valor: 28.00,
    status: 'pendente',
    dataColeta: new Date('2024-01-16'),
    localizacao: { lat: -23.5540, lng: -46.6600 }
  }
];
