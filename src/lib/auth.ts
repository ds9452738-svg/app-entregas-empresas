// Sistema de autenticação e controle de acesso

import { UsuarioLogado, NivelAcesso } from './types';

// Chave para armazenar usuário no localStorage
const USER_STORAGE_KEY = 'delivery_user';

export const authService = {
  // Fazer login
  login: (usuario: string, senha: string, empresas: any[], adminUser: any): UsuarioLogado | null => {
    // Verificar se é admin
    if (usuario === adminUser.usuario && senha === adminUser.senha) {
      const user: UsuarioLogado = {
        id: adminUser.id,
        nome: adminUser.nome,
        nivelAcesso: 'admin'
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      return user;
    }

    // Verificar se é empresa
    const empresa = empresas.find(e => e.usuario === usuario && e.senha === senha && e.ativa);
    if (empresa) {
      const user: UsuarioLogado = {
        id: empresa.id,
        nome: empresa.nome,
        nivelAcesso: 'empresa',
        empresaId: empresa.id,
        permissoes: empresa.permissoes
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      return user;
    }

    return null;
  },

  // Fazer logout
  logout: () => {
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  // Obter usuário logado
  getUsuarioLogado: (): UsuarioLogado | null => {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Verificar se está logado
  isLogado: (): boolean => {
    return authService.getUsuarioLogado() !== null;
  },

  // Verificar se é admin
  isAdmin: (): boolean => {
    const user = authService.getUsuarioLogado();
    return user?.nivelAcesso === 'admin';
  },

  // Verificar se é empresa
  isEmpresa: (): boolean => {
    const user = authService.getUsuarioLogado();
    return user?.nivelAcesso === 'empresa';
  },

  // Verificar permissão específica
  temPermissao: (permissao: keyof typeof import('./types').PermissoesEmpresa): boolean => {
    const user = authService.getUsuarioLogado();
    
    // Admin tem todas as permissões
    if (user?.nivelAcesso === 'admin') return true;
    
    // Empresa verifica suas permissões
    if (user?.nivelAcesso === 'empresa' && user.permissoes) {
      return user.permissoes[permissao] || false;
    }

    return false;
  }
};
